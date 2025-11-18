import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";
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
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleX,
  Edit,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { MenuItemService } from "@/services/menuItemService";
import { SpinnerCustom } from "@/components/ui/spinner";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { useAuthStore } from "@/stores/useAuthStore";

export default function MenuItemList({ onSort, sortConfig }) {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [searchName, setSearchName] = useState("");

  const [menuItems, setMenuItems] = useState([]);
  const { open, description, onConfirm, closeDialog, openDialog } =
    useSuccessDialogStore();
  const [loading, setLoading] = useState(false);

  const [debouncedFilters, setDebouncedFilters] = useState({
    name: "",
    pageNo: 1,
    pageSize: 10,
  });

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({
        name: searchName,
        pageNo: currentPage || 1,
        pageSize: rowsPerPage || 10,
      });
    }, 400);
    return () => clearTimeout(handler);
  }, [searchName, currentPage, rowsPerPage]);

  // Fetch menu items
  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setMenuItems([]);
        fetchMenus();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [debouncedFilters]);

  // ✅ Safe pagination calculations
  const safeCurrentPage = Number(currentPage) || 1;
  const safeRowsPerPage = Number(rowsPerPage) || 10;
  const safeTotalRows = Number(data?.totalCount) || 0;

  const totalPages = Math.max(1, Math.ceil(safeTotalRows / safeRowsPerPage));
  const startIndex = (safeCurrentPage - 1) * safeRowsPerPage;

  const startRow = menuItems.length > 0 ? startIndex + 1 : 0;
  const endRow = menuItems.length > 0 ? startIndex + menuItems.length : 0;

  // const handleSort = (column: string) => {
  //   let direction = "asc";
  //   if (sortConfig?.key === column && sortConfig.direction === "asc") {
  //     direction = "desc";
  //   }
  //   onSort({ key: column, direction });
  // };

  const fetchMenus = async () => {
    const response = await MenuItemService.fetchMenuItems({
      name: debouncedFilters.name || "",
      pageNo: debouncedFilters.pageNo || 1,
      pageSize: debouncedFilters.pageSize || 10,
      token: token,
    });
    setData(response);
    setMenuItems(response?.data || []);
  };

  const handleEdit = async (menuCode: string) => {
    const menuItem = await MenuItemService.fetchMenuItem(menuCode, token);
    if (menuItem) {
      navigate(`/management/admin/menu-item/edit/${menuCode}`, {
        state: { menuItem },
      });
    }
  };

  const handleDelete = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    setEmployeeToDelete(code);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (!token) return;
      await MenuItemService.deleteMenuItem(employeeToDelete, token);
      await fetchMenus();
      openDialog("Delete Menu Item successful!", onConfirm);
    } catch (error) {
      console.error(error);
    }
    setDeleteDialogOpen(false);
    setEmployeeToDelete("");
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete("");
  };

  const handleSuccessConfirm = () => {
    if (onConfirm) onConfirm();
    closeDialog();
  };

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  return (
    <div className="p-6 w-full flex-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-5">
        <p className="font-bold text-primary-400">Menu Item</p>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-[200px] text-primary-800">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 h-4 w-4" />
            <Input
              type="text"
              value={searchName}
              placeholder="Search..."
              onInput={(e) => setSearchName(e.target.value)}
              className="border-primary-700 bg-natural-50 focus-visible:ring-[1px] focus-visible:ring-ring focus-visible:ring-offset-0 pl-9 text-primary-400"
            />
            {searchName && (
              <CircleX
                onClick={() => setSearchName("")}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
              />
            )}
          </div>

          <div className="flex gap-2 text-primary-700 bg-natural-50">
            <Link to="/management/admin/menu-item/create">
              <Button className="outline-btn">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table className="w-full overflow-auto shadow-sm rounded-md">
        <TableHeader className="bg-primary-400 text-center">
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Menu Code</TableHead>
            <TableHead>Menu Group Code</TableHead>
            <TableHead>Menu Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <SpinnerCustom />
              </TableCell>
            </TableRow>
          ) : menuItems.length ? (
            menuItems.map((item, index) => (
              <TableRow
                key={startIndex + index + 1}
                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none"
                onClick={() =>
                  navigate(
                    `/management/admin/menu-item/detail/${item.menuCode}`,
                    {
                      state: { menuItem: item },
                    }
                  )
                }
              >
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{item.menuCode}</TableCell>
                <TableCell>{item.menuGroupCode}</TableCell>
                <TableCell>{item.menuName}</TableCell>
                <TableCell>{item.url}</TableCell>
                <TableCell>{item.icon}</TableCell>
                <TableCell className="flex gap-4 justify-center">
                  <Edit
                    className="h-4 w-4 text-primary-500 cursor-pointer"
                    onClick={() => handleEdit(item.menuCode)}
                  />
                  <Trash2
                    className="h-4 w-4 text-error-400 cursor-pointer"
                    onClick={(e) => handleDelete(e, item.menuCode)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No Data Matched.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          {startRow}–{endRow} of {safeTotalRows}
        </div>

        <div className="flex space-x-1">
          <button
            onClick={goToFirst}
            disabled={safeCurrentPage === 1}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
          >
            <ChevronsLeft />
          </button>
          <button
            onClick={goPrev}
            disabled={safeCurrentPage === 1}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
          >
            <ChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                setMenuItems([]);
              }}
              className={`px-3 py-1 rounded ${
                page === safeCurrentPage
                  ? "bg-primary-500 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={goNext}
            disabled={safeCurrentPage === totalPages}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
          >
            <ChevronRight />
          </button>
          <button
            onClick={goToLast}
            disabled={safeCurrentPage === totalPages}
            className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
          >
            <ChevronsRight />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              const newRows = Number(e.target.value) || 10;
              setRowsPerPage(newRows);
              setCurrentPage(1);
              setDebouncedFilters((prev) => ({
                ...prev,
                pageNo: 1,
                pageSize: newRows,
              }));
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-secondary-50">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex gap-3">
              <Trash2 className="h-6 w-6 text-gray-600" />
              Are you sure you want to delete this record?
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

      <SuccessDialog
        open={open}
        onOpenChange={closeDialog}
        onConfirm={handleSuccessConfirm}
        description={description}
      />
    </div>
  );
}
