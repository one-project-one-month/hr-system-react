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
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  menuGroupService,
  type MenuGroupItem,
} from "@/services/menuGroupService";
import { useDataStore } from "@/stores/useDataStore";
import { useAuthStore } from "@/stores/useAuthStore";

export default function MenuGroupList() {
  const [data, setData] = useState<MenuGroupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = useAuthStore((s) => s.token);
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupCodeToDelete, setGroupCodeToDelete] = useState<string | null>(
    null
  );

  const listParams = useMemo(
    () => ({
      pageNo: currentPage,
      pageSize: rowsPerPage,
    }),
    [currentPage, rowsPerPage]
  );

  useEffect(() => {
    const fetchMenuGroups = async () => {
      try {
        setLoading(true);
        setError(null);

        const resp = await menuGroupService.fetchMenuGroups(listParams, authHeaders);

        if (!resp?.isSuccess) {
          setError(resp?.message || "Failed to load menu groups");
          return;
        }

        if (resp.data) {
          if (Array.isArray(resp.data)) {
            setData(resp.data);
            setTotalRows(resp.data.length);
          } else {
            setData(resp.data.items);
            setTotalRows(resp.data.totalCount);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching menu groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuGroups();
  }, [listParams]);

  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startRow = (currentPage - 1) * rowsPerPage;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);
  const paginatedData = data;

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // === Delete handlers ===
  const handleDelete = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    setGroupCodeToDelete(code);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!groupCodeToDelete) return;

    try {
      setLoading(true);
      setError(null);

      const resp = await menuGroupService.deleteMenuGroup(groupCodeToDelete);

      const latestErr = useDataStore.getState().error;
      const ok =
        !latestErr &&
        (resp?.isSuccess === undefined || resp?.isSuccess === true);

      if (!ok) {
        setError(resp?.message || "Delete failed");
        return;
      }

      // Optimistically update list for current page
      setData((prev) =>
        prev.filter((x) => x.menuGroupCode !== groupCodeToDelete)
      );
      setTotalRows((prev) => Math.max(0, prev - 1));

      // If current page is now beyond last page, pull it back
      const newTotalPages = Math.max(
        1,
        Math.ceil((totalRows - 1) / rowsPerPage)
      );
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while deleting.");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setGroupCodeToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setGroupCodeToDelete(null);
  };

  return (
    <>
      <div className="p-6 w-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between gap-2 mb-4 w-full">
          <p className="text-xl font-bold w-full">
            Menu Group
          </p>

          <div className="flex flex-col md:flex-row w-full gap-3 items-center justify-end">
            <div className="relative w-full md:w-[35%] lg:w-[50%] border-primary-500 border rounded-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-600" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-9 placeholder:text-primary-600 focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-0 focus-visible:border-primary-500 border-0 shadow-sm rounded-md"
              // TODO: wire search to API or client filter
              />
            </div>

            <Button asChild className="bg-primary-500 text-white w-full md:w-auto">
              <Link to="/menu-group/create">
                <Plus /> New
              </Link>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div>
          <Table className="w-full">
            <TableHeader className="bg-primary-400 text-center">
              <TableRow key="header-row">
                <TableHead className="w-[80px] text-center py-4">No.</TableHead>
                <TableHead className="text-center py-4">
                  Menu Group Name
                </TableHead>
                <TableHead className="text-center py-4">Url</TableHead>
                <TableHead className="text-center py-4">Icon</TableHead>
                <TableHead className="text-center py-4">Sort Order</TableHead>
                <TableHead className="text-center py-4">
                  Has Menu Item
                </TableHead>
                <TableHead className="text-center py-4">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {error && !loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-red-600"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No menu groups found.
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                !error &&
                paginatedData.map((item, index) => (
                  <TableRow
                    key={item.menuGroupId}
                    className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3"
                  >
                    {/* No. */}
                    <TableCell className="text-center">
                      {startRow + index + 1}
                    </TableCell>

                    {/* Menu Group Name */}
                    <TableCell className="text-center">
                      {item.menuGroupName}
                    </TableCell>

                    {/* Url */}
                    <TableCell className="text-center">{item.url}</TableCell>

                    {/* Icon */}
                    <TableCell className="text-center">{item.icon}</TableCell>

                    {/* Sort Order */}
                    <TableCell className="text-center">
                      {item.sortOrder}
                    </TableCell>

                    {/* Has Menu Item (checkbox) */}
                    <TableCell className="text-center">
                      <Checkbox
                        checked={item.hasMenuItem}
                        disabled
                        className="pointer-events-none"
                      />
                    </TableCell>

                    {/* Action */}
                    <TableCell className="flex justify-center gap-2">
                      <Button
                        asChild
                        className="text-primary-500 cursor-pointer"
                      >
                        <Link
                          to={`/menu-group/edit/${item.menuGroupCode}`}
                          state={{ item }}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        className="text-error-400 cursor-pointer"
                        onClick={(e) => handleDelete(e, item.menuGroupCode)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <div>
            {totalRows === 0
              ? "0-0 of 0"
              : `${startRow + 1}-${endRow} of ${totalRows}`}
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${page === currentPage
                  ? "bg-primary-500 text-natural-50"
                  : "bg-natural-50 text-black hover:bg-gray-200"
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goNext}
              disabled={currentPage === totalPages || totalRows === 0}
              className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalRows === 0}
              className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            >
              »
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span>Row/Page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                const value = Number(e.target.value);
                setRowsPerPage(value);
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              {[7, 10, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-secondary-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-md">
              <div className="flex gap-3">
                <Trash2 className="h-6 w-6 text-gray-600" /> Are you sure you
                want to delete this record?
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
