import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { projectService } from "@/services/projectService";
import type { ApiEnvelope, ListData, Row } from "@/types/project";
import { ExportDateDialog } from "@/components/ui/custom/export-date-dialog";
import type { exportType } from "@/types/excelExport";
import { downloadFile, toLocalISOString } from "@/lib/utils";
import { exportReport } from "@/services/reportService";


const isApiEnvelope = <T,>(x: unknown): x is ApiEnvelope<T> =>
  typeof x === "object" && x !== null && "data" in x;

const toIsoStart = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
};
const toIsoEnd = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x.toISOString();
};

export default function ProjectListing() {
  const navigate = useNavigate();
  const { user } = useAuthStore()
  const menuGroup = user?.menuTree?.menuTree
    .find(mg => mg.menuGroupCode === "BACKLOG")?.childMenus
    .find(mg => mg.menuItemCode === "PROJECT")

  const CANUPDATE = menuGroup && menuGroup?.permissions.includes("UPDATE")
  const CANDELETE = menuGroup && menuGroup?.permissions.includes("DELETE")

  const ADMIN_HR = (user?.roleName && user?.roleName.toLocaleLowerCase() === 'admin' 
    || user?.roleName.toLocaleLowerCase() === "administrator")
    || user?.roleName.toLocaleLowerCase().includes('hr')
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

    // data state
  const [rows, setRows] = useState<Row[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false)
  const [open, setOpen] = useState(false);
  // delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // derived paging
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const startRow = totalCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalCount);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // memo’d params object (prevents unnecessary fetches)
  const listParams = useMemo(
    () => ({
      pageNo: currentPage,
      pageSize: rowsPerPage,
      search: debouncedSearch || undefined,
    }),
    [currentPage, rowsPerPage, debouncedSearch]
  );

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (user?.roleName !== 'Administrator'
        && !user?.roleName.toLocaleLowerCase().includes('hr')) {
        res = await projectService.fetchProjectsByCode(user?.employeeCode, listParams)
      }
      else {
        res = await projectService.fetchProjects(listParams);
      }

      // unwrap flexible envelope or raw payload
      const payload: ListData | undefined = isApiEnvelope<ListData>(res)
        ? (res.data as ListData | undefined)
        : (res as unknown as ListData | undefined);

      if (!payload) throw new Error("Failed to load projects");

      const mapped: Row[] = (payload.items ?? []).map((p) => ({
        id: p.projectCode,
        name: p.projectName,
        status: p.projectStatus,
        startDate: p.startDate
          ? format(new Date(p.startDate), "yyyy-MM-dd")
          : "",
        endDate: p.endDate ? format(new Date(p.endDate), "yyyy-MM-dd") : "",
      }));

      setRows(mapped);
      setTotalCount(payload.totalCount ?? 0);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [listParams]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // pagination handlers
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  // delete handlers
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteError(null);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const delRes = await projectService.deleteProject(deleteId);
      if (isApiEnvelope<boolean>(delRes) && delRes.isSuccess === false) {
        throw new Error(delRes.message || "Delete failed");
      }

      // optimistic local update
      setRows((prev) => prev.filter((r) => r.id !== deleteId));
      setTotalCount((c) => Math.max(0, c - 1));

      setDeleteOpen(false);
      setDeleting(false);
      setDeleteId(null);

      const pageNowWouldBeEmpty = rows.length === 1 && currentPage > 1;
      if (pageNowWouldBeEmpty) {
        setCurrentPage((p) => Math.max(1, p - 1));
      } else {
        fetchList();
      }
    } catch (e: any) {
      setDeleteError(e?.message ?? "Failed to delete");
      setDeleting(false);
    }
  };

  const handleExport = async (exportType: exportType) => {
    user?.roleName && user?.roleName.toLocaleLowerCase().includes("admin")
      || user.roleName.toLowerCase().includes("hr")
      ? exportType.type = "admin"
      : exportType.type = "employee"

    if (!exportType.from || !exportType.to) return;

    const requestPayload = {
      format: exportType.format,
      reportType: exportType.type,
      reportName: exportType.name,
      reportRequest: {
        pageNo: 0,
        pageSize: 0,
        reportType: exportType.name,
        fromDate: toLocalISOString(exportType.from),
        toDate: toLocalISOString(exportType.to),
        item: "",
        isExport: true,
      },
    };

    try {
      setExporting(true)
      const { blob, contentDisposition } = await exportReport(requestPayload);
      downloadFile(blob, contentDisposition);
      setExporting(false)
    } catch (err) {
      setError(err.message)
      setExporting(false)
    }
  };

  return (
    <div className="p-6 w-full flex-1">
      {/* Header row */}
      {(ADMIN_HR) && (<div className="flex justify-between flex-col md:flex-row gap-2 mb-4">
          <p className="page-title">Project Listing</p>
          <div className="relative w-full md:w-[500px] text-primary-800 flex items-center justify-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="focus-visible:ring-[1px] focus-visible:ring-ring focus-visible:ring-offset-0 pl-9"
            />
          </div>

          <Button
            className="primary-btn cursor-pointer w-full md:w-auto"
            onClick={() => setOpen(true)}
          >
            Export
          </Button>

          <Link to="/projects/new" className="w-full md:w-auto">
            <Button
              className="primary-btn cursor-pointer w-full"
            >
              <Plus />
              New
            </Button>
          </Link>

          {/**Add Employee */}
          <Link to="/projects/add-employee" className="w-full md:w-auto">
            <Button className="primary-btn w-full">
              <Plus />
              Add Employee
            </Button>
          </Link>
          <Link to="/projects/remove-employee" className="w-full md:w-auto">
            <Button className="primary-btn w-full">
              <Plus />
              Remove Employee
            </Button>
          </Link>
        </div>)}

      {/* Table */}
      <Table className="w-full overflow-auto shadow-sm rounded-md">
        <TableHeader className="bg-primary-300">
          <TableRow className="border-none">
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead className="min-w-[200px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            {(CANDELETE || CANUPDATE) && (<TableHead className="text-right pr-6">Action</TableHead>)}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Loading...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-red-500 py-6">
                {error}
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No data
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, idx) => (
              <TableRow
                key={row.id}
                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none cursor-pointer"
                onClick={() => navigate(`/projects/${row.id}`)}
              >
                <TableCell className="font-medium">
                  {(currentPage - 1) * rowsPerPage + idx + 1}.
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.endDate}</TableCell>
                { (CANUPDATE || CANDELETE) && (<TableCell>
                  <div className="flex items-center justify-end gap-3">
                    { CANUPDATE && (<button
                      className="p-1 hover:bg-primary-300/50 rounded cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${row.id}/edit`);
                      }}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-primary-500" />
                    </button>)}
                    { CANDELETE && (<button
                      className="p-1 hover:bg-primary-300/50 rounded cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(row.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-error-400" />
                    </button>
                    )}
                  </div>
                </TableCell>)}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          {startRow}–{endRow} of {totalCount}
        </div>

        <div className="flex space-x-1">
          <button
            onClick={goToFirst}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            aria-label="First page"
          >
            <ChevronsLeft />
          </button>
          <button
            onClick={goPrev}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                Math.abs(p - currentPage) <= 2 || p === 1 || p === totalPages
            )
            .map((p, i, arr) => {
              const prev = arr[i - 1];
              const showDots = prev && p - prev > 1;
              return (
                <span key={p} className="flex">
                  {showDots && <span className="px-2">…</span>}
                  <button
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 rounded ${p === currentPage
                      ? "bg-primary-500 text-white"
                      : "bg-white hover:bg-gray-200"
                      }`}
                  >
                    {p}
                  </button>
                </span>
              );
            })}

          <button
            onClick={goNext}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
          <button
            onClick={goToLast}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            aria-label="Last page"
          >
            <ChevronsRight />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows/page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 text-sm p-3"
          >
            {[10, 20, 30, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delete confirm dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError ? (
                <span className="text-red-600">{deleteError}</span>
              ) : (
                <>This action cannot be undone.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="primary-btn"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ExportDateDialog
        open={open}
        onOpenChange={setOpen}
        title="Export Project"
        loading={exporting}
        error={error}
        onConfirm={({ range, format }) => {
          handleExport({
            from: range.from!,
            to: range.to!,
            format,
            type: "admin",
            name: "Project"
          });
        }}
      />
    </div>
  );
}
