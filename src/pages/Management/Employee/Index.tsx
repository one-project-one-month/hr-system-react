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
import { Link } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
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
import { useNavigate } from "react-router-dom";
import { EmployeeService } from "@/services/employeeService";
import { SpinnerCustom } from "@/components/ui/spinner";
import { SuccessDialog } from "@/components/ui/SuccessDialog";

export default function EmployeeList({ onSort, sortConfig }) {
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState({});
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [employees, setEmployees] = useState([]);
  const { open, description, onConfirm, closeDialog, openDialog } =
    useSuccessDialogStore();
  const [loading, setLoading] = useState(false);
  let [roles, setRoles] = useState([]);
  const [debouncedFilters, setDebouncedFilters] = useState({
    name: "",
    role: "",
    pageNo: 0,
    pageSize: 0,
  });

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({
        name: searchName,
        role: searchRole,
        pageNo: currentPage,
        pageSize: rowsPerPage,
      });
    }, 400); // 700ms delay

    return () => clearTimeout(handler);
  }, [searchName, searchRole, currentPage, rowsPerPage]);

  // ✅ Fetch employee list from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setEmployees([]);
        fetchEmployees();
        const fetchRoles = await EmployeeService.fetchRoles();
        setRoles(fetchRoles.data);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, [debouncedFilters]);

  const fetchEmployees = async () => {
    const fetchEmployees = await EmployeeService.fetchEmployees({
      name: searchName,
      pageNo: currentPage,
      pageSize: rowsPerPage,
    });
    setRowsPerPage(fetchEmployees.pageSize);
    setCurrentPage(fetchEmployees.pageNo);
    setData(fetchEmployees);
    setEmployees(fetchEmployees?.items || []);
  };
  // ✅ Flatten API data

  const totalRows = data?.totalCount || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const fetchRoles = roles?.items || [];
  // ✅ Client-side pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const startRow = startIndex + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  const handleSort = (column: string) => {
    let direction = "asc";
    if (sortConfig?.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    onSort({ key: column, direction });
  };

  const handleEdit = async (employeeCode: string) => {
    event?.stopPropagation();
    const employee = await EmployeeService.fetchEmployee(employeeCode);
    if (employee) {
      navigate(`/employee/edit/${employeeCode}`, { state: { employee } });
    }
    console.log(employee);
  };

  const handleDelete = (e: React.MouseEvent, employeeCode: string) => {
    e.stopPropagation();
    setEmployeeToDelete(employeeCode);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await EmployeeService.deleteEmployee(employeeToDelete);
      await fetchEmployees();
      openDialog("Delete Employee successful!", onConfirm);
    } catch (error) {
      console.log(error);
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
        <p className="font-bold text-primary-400">Employee</p>

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
            {searchName ? (
              <CircleX
                onClick={() => setSearchName("")}
                className="cursor-pointer absolute absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
              />
            ) : (
              ""
            )}
          </div>

          <div className="flex gap-2 text-primary-700 bg-natural-50">
            <Select>
              <SelectTrigger className="text-primary-400">
                <SelectValue placeholder="Role" className="font-semibold" />
              </SelectTrigger>
              <SelectContent className="bg-natural-50 text-primary-700">
                <SelectGroup>
                  {fetchRoles.map((role) => (
                    <SelectItem
                      id={role.roleId}
                      value={role.roleName}
                      key={role.roleId}
                    >
                      {role.roleName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Link to="/employee/new">
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
          <TableRow key="header">
            <TableHead className="px-4 py-2 font-semibold">#</TableHead>
            <TableHead className="px-4 py-2 font-semibold">
              Employee Code
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold">Username</TableHead>
            <TableHead className="px-4 py-2 font-semibold">
              <Button
                variant="ghost"
                className="hover:text-white hover:bg-primary-500 p-0 flex items-center gap-1"
                onClick={() => handleSort("name")}
              >
                Name
                <ArrowUpDown
                  className={`h-4 w-4 transition-transform ${
                    sortConfig?.key === "name"
                      ? sortConfig.direction === "asc"
                        ? "rotate-180"
                        : ""
                      : "opacity-50"
                  }`}
                />
              </Button>
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold">Role</TableHead>
            <TableHead className="px-4 py-2 font-semibold">Email</TableHead>
            <TableHead className="px-4 py-2 font-semibold">Phone No.</TableHead>
            <TableHead className="px-4 py-2 font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow key="loading">
              <TableCell colSpan={8} className="h-24 text-center">
                <div className="flex items-center justify-center text-primary-500">
                  <SpinnerCustom />
                </div>
              </TableCell>
            </TableRow>
          ) : employees.length ? (
            employees.map((user, index) => (
              <TableRow
                key={user.employeeCode || startIndex + index + 1}
                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3"
                onClick={() =>
                  navigate(`/employee/detail/${user.employeeCode}`, {
                    state: { employee: user },
                  })
                }
              >
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{user.employeeCode}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.roleName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNo}</TableCell>
                <TableCell className="flex gap-4 justify-center">
                  <Edit
                    className="h-4 w-4 text-primary-500 cursor-pointer hover:text-primary-500"
                    onClick={() => handleEdit(user.employeeCode)}
                  />
                  <Trash2
                    className="h-4 w-4 text-error-400 cursor-pointer hover:text-red-500"
                    onClick={(e) => handleDelete(e, user.employeeCode)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key="no-data">
              <TableCell colSpan={8} className="h-24 text-center">
                <div className="flex items-center justify-center text-primary-500">
                  No Data Matched.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      {/* <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          {startRow}–{endRow} of {totalRows}
        </div>

        <div className="flex space-x-1">
          <button onClick={goToFirst} disabled={currentPage === 1}>
            <ChevronsLeft />
          </button>
          <button onClick={goPrev} disabled={currentPage === 1}>
            <ChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
                setEmployees([]);
              }}
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-primary-500 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => {
              goNext();
            }}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </button>
          <button onClick={goToLast} disabled={currentPage === totalPages}>
            <ChevronsRight />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <select
            value={debouncedFilters.pageSize}
            onChange={(e) => {
              const newRows = Number(e.target.value);
              setRowsPerPage(newRows);
              setCurrentPage(1);
              setEmployees([]);
              setDebouncedFilters((prev) => ({
                ...prev,
                pageNo: newRows,
                pageSize: currentPage,
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
      </div> */}
      <div className="flex flex-col md:flex-row items-center gap-2">
        {/* Paginations */}
        <div className="w-full flex items-center justify-center md:justify-around p-4 border-t flex-col md:flex-row gap-3 ">
          {/* Left: Showing rows */}
          <div className="text-sm text-muted-foreground">
            {startRow}–{endRow} of {totalRows}
          </div>
          {/* Middle: Page buttons */}
          <div className="flex space-x-1">
            <button
              onClick={goToFirst}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            >
              <ChevronsLeft />
            </button>
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage
                    ? "bg-primary-500 text-natural-50"
                    : "bg-natural-50 text-black hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            >
              <ChevronRight />
            </button>
            <button
              onClick={goToLast}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded pagination-btn disabled:opacity-50"
            >
              <ChevronsRight />
            </button>
          </div>
          {/* Right: Rows per page */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Rows/page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1); // reset page
              }}
              className="border rounded px-2 py-1 text-sm p-3"
            >
              {[10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-secondary-50">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex gap-3">
                <Trash2 className="h-6 w-6 text-gray-600" />
                Are you sure you want to delete this record?
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
      <SuccessDialog
        open={open}
        onOpenChange={closeDialog}
        onConfirm={handleSuccessConfirm}
        description={description}
      />
    </div>
  );
}
