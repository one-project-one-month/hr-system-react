import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  FolderUp,
  Plus,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
  Search,
  CircleX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { DeleteDialog } from "@/components/ui/custom/delete-dialogue";
import { useDataStore } from "@/stores/useDataStore";
import { LocationService } from "@/services/LocationService ";
import type { Location } from "@/types/location";
import { ExportDateDialog } from "@/components/ui/custom/export-date-dialog";
import type { exportType } from "@/types/excelExport";
import { downloadFile, toLocalISOString } from "@/lib/utils";
import { exportReport } from "@/services/reportService";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Location() {
  const navigate = useNavigate();
  const { data, loading, error } = useDataStore();
  const { user } = useAuthStore()
  const menuGroup = user?.menuTree?.menuTree
    .find(mg => mg.menuGroupCode === "LOCATION")?.childMenus
    .find(mg => mg.menuItemCode === "LOCATION")

  const CANUPDATE = menuGroup && menuGroup?.permissions.includes("UPDATE")
  const CANCREATE = menuGroup && menuGroup?.permissions.includes("CREATE")
  const CANDELETE = menuGroup && menuGroup?.permissions.includes("DELETE")

  const ADMIN_HR = user?.roleName.toLocaleLowerCase() === 'Administrator'.toLocaleLowerCase()
    || user?.roleName.toLocaleLowerCase().includes('hr')

  // Search state
  const [exporting, setExporting] = useState(false)
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Load locations with pagination and search
  useEffect(() => {
    loadLocations();
  }, [currentPage, rowsPerPage, searchInput]);

  const loadLocations = async () => {
    try {
      await LocationService.fetchLocations(searchInput, currentPage, rowsPerPage);
      console.log(data)
    } catch (error) {
      throw error
    }
  };

  // Handle search
  const handleSearch = () => {
    setSearchInput(searchInput);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setCurrentPage(1);
  };

  // Get data from API response
  const locations: Location[] = data?.data?.items || [];
  const totalRows = data?.data?.totalCount || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Calculate row numbers for display
  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  // Pagination handlers
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  // Navigation handlers
  const goToCreateForm = () => navigate("/location/create");
  const goToEditForm = (locationCode: string) => {
    navigate(`/location/edit/${locationCode}`);
  };
  const goToDetailView = (locationCode: string) =>
    navigate(`/location/detail/${locationCode}`);

  const openDeleteDialog = (locationCode: string) => {
    setSelectedLocationId(locationCode);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedLocationId) {
      await LocationService.deleteLocation(selectedLocationId);
      loadLocations();
      setDeleteDialogOpen(false);
      setSelectedLocationId(null);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxPagesToShow;
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
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
      setExporting(false)
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  return (
    <div className="p-6 w-full flex-1 bg-[#f0f3f1]">
      <div className="flex justify-between flex-col md:flex-row mb-4">
        <p className="page-title">Location</p>

        <div className="flex gap-2 flex-col md:flex-row items-center">
          {/* search */}
          <div className="relative w-full md:w-[300px] text-primary-800">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-800 h-4 w-4" />
            <Input
              type="text"
              className="ps-9"
              placeholder="Search by location name..."
              value={searchInput}
              onInput={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }} />
            {searchInput ? (
              <CircleX
                onClick={() => setSearchInput("")}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
              />
            ) : (
              ""
            )}
          </div>

          {/* buttons */}
          {ADMIN_HR && (<Button className="primary-btn" onClick={() => setOpen(true)}>
            <FolderUp />
            Export
          </Button>)}
          {CANCREATE && (<Button className="primary-btn" onClick={goToCreateForm}>
            <Plus />
            New
          </Button>)}
        </div>
      </div>

      <Table className="w-full overflow-auto shadow-sm rounded-md text-center">
        <TableHeader className="bg-primary-300">
          <TableRow className="border-none ">
            <TableHead className="text-center">No</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Latitude</TableHead>
            <TableHead className="text-center">Longitude</TableHead>
            <TableHead className="text-center">Radius</TableHead>
            {(CANUPDATE || CANDELETE) && (<TableHead className="text-center">Action</TableHead>)}
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableBody>
            <TableRow key="loading">
              <TableCell colSpan={6} className="text-center py-10">
                Loading...
              </TableCell>
            </TableRow>
          </TableBody>
        ) : locations.length === 0 ? (
          <TableBody>
            <TableRow key="no-location">
              <TableCell colSpan={6} className="text-center py-10">
                {searchInput
                  ? `No locations found for "${searchInput}"`
                  : "No locations found"}
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {locations.map((location, index) => (
              <TableRow
                key={location.locationCode}
                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3 cursor-pointer"
                onClick={() => goToDetailView(location.locationCode)}
              >
                <TableCell>{startRow + index}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.latitude}</TableCell>
                <TableCell>{location.longitude}</TableCell>
                <TableCell>{location.radius}</TableCell>

                {(CANUPDATE || CANDELETE) && (<TableCell className="flex justify-center">
                  {CANUPDATE && (
                    <Edit
                      className="text-emerald-500 cursor-pointer hover:text-emerald-700 mr-4"
                      size={22}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToEditForm(location.locationCode);
                      }}
                    />)}
                  {CANDELETE &&
                    (<Trash2
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      size={22}
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog(location.locationCode);
                      }}
                    />)
                  }
                </TableCell>)}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>

      {/* Paginations */}
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row items-center justify-between p-4 border-t ">
        {/* Left: Showing rows */}
        <div className="text-sm text-muted-foreground">
          {startRow}–{endRow} of {totalRows}
        </div>

        {/* Middle: Page buttons */}
        <div className="flex space-x-1">
          <button
            onClick={goToFirst}
            disabled={currentPage === 1 || loading}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft />
          </button>
          <button
            onClick={goPrev}
            disabled={currentPage === 1 || loading}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              disabled={loading}
              className={`px-3 py-1 rounded ${page === currentPage
                ? "bg-primary-500 text-natural-50"
                : "bg-natural-50 text-black hover:bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={goNext}
            disabled={currentPage === totalPages || loading}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
          <button
            onClick={goToLast}
            disabled={currentPage === totalPages || loading}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight />
          </button>
        </div>

        {/* Right: Rows per page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows/page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            disabled={loading}
            className="border rounded px-2 py-1 text-sm p-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
      <ExportDateDialog
        open={open}
        onOpenChange={setOpen}
        title="Export Location"
        loading={exporting}
        error={error}
        onConfirm={({ range, format }) => {
          handleExport({
            from: range.from!,
            to: range.to!,
            format,
            type: "admin",
            name: "Location"
          });
        }}
      />
    </div>
  );
}
