import {
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmployeeService } from "@/services/employeeService";
import type { Role } from "@/types/role-menu-permission";
import type { Employee } from "@/types/employee";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { roleMenuPermissionService } from "@/services/roleMenuPermissionService";
import type { Project } from "@/types/project";
import { projectService } from "@/services/projectService";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";

export function AddEmployee() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("");
  const [EmployeeData, setEmployeeData] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredData, setFilteredData] = useState<Employee[]>(EmployeeData.filter((emp) => {
    if (!emp.name || !emp.email || !emp.phoneNo || !emp.roleName) {
      return EmployeeData;
    }
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.includes(searchTerm.toLowerCase()) ||
      emp.phoneNo.includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter ? emp.roleName === roleFilter : true;

    return matchesSearch && matchesRole;
  }))
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(EmployeeData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  const totalRows = filteredData.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { onConfirm, openDialog } = useSuccessDialogStore();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const allCurrentPageIds = currentData.map((emp) => emp.employeeCode);
  const isAllSelected =
    allCurrentPageIds.length > 0 &&
    allCurrentPageIds.every((employeeCode) => selectedEmployees.includes(employeeCode));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [
        ...new Set([...prev, ...allCurrentPageIds]),
      ]);
    } else {
      setSelectedEmployees((prev) =>
        prev.filter((id) => !allCurrentPageIds.includes(id))
      );
    }
  };

  const handleAddEmployees = async () => {
    if (selectedEmployees.length === 0) {
      setAlertMessage("Please select at least one employee");
      setAlertDialogOpen(true);
      return;
    }
    if (!selectedProject) {
      setAlertMessage("Please select a project before adding employees");
      setAlertDialogOpen(true);
      return;
    }
    const selectedData = EmployeeData.filter((emp) =>
      selectedEmployees.includes(emp.employeeCode)).map(e => (e.employeeCode));
    try {
      await EmployeeService.addEmployeeToProjects(selectedProject, {
        employeeCodes: selectedData
      });
      openDialog(
        "Employees added to the project successfully!",
        () => navigate("/projects/add-employee", { state: { refetch: true } }) // ✅ navigate on confirm
      );
      setSelectedEmployees([])
    } catch (error) {
      setAlertMessage("Failed to add employees to the project. Please try again.");
      setAlertDialogOpen(true);
      return;
    }

  };

  useEffect(() => {
    (async () => {
      const EmployeeData = await EmployeeService.fetchEmployees({
        name: "",
        pageNo: currentPage,
        pageSize: rowsPerPage,
        roleName: roleFilter,
      })
      const rolesData = await roleMenuPermissionService.fetchRoles();
      const projectsData = await projectService.fetchProjects({
        pageNo: 1,
        pageSize: 10,
        search: "",
      });
      setProjects(projectsData?.data?.items as Project[] ?? [])
      if (projectsData?.data?.items.length) {
        setSelectedProject(projectsData?.data?.items[0].projectCode)
      }
      setEmployeeData(EmployeeData?.items as Employee[] ?? [])
      setRoles(rolesData.items as Role[] ?? [])
    })()
  }, [])

  const location = useLocation();

  useEffect(() => {
    (async () => {
      const assignedEmp = await EmployeeService.getUnassignedEmployees(selectedProject, currentPage, rowsPerPage)
      const filtered = EmployeeData.filter(emp => assignedEmp.some(asemp => asemp.employeeCode === emp.employeeCode))
      setFilteredData(filtered)
    })()
  }, [location.state])

  useEffect(() => {
    (async () => {
      const assignedEmp = await EmployeeService.getUnassignedEmployees(selectedProject, currentPage, rowsPerPage)
      const filtered = EmployeeData.filter(emp => assignedEmp.some(asemp => asemp.employeeCode === emp.employeeCode))
      setFilteredData(filtered)
    })()
  }, [selectedProject])

  return (
    <div className="p-6 w-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start justify-between gap-2 md:items-center mb-4 w-full">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="bg-white bordertext-black">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent className="bg-white border text-black">
            {projects.map((p) => (<SelectItem
              className="bg-white text-black hover:bg-gray-100"
              value={p.projectCode} key={p.projectCode}
            >
              {p.projectName}
            </SelectItem>))}
          </SelectContent>
        </Select>

        <div className="flex gap-3 items-center">
          <div className="relative w-[250px] md:w-[350px] lg:w-[450px] ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 " />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 text-black focus-visible:ring-[1px] focus-visible:ring-ring focus-visible:ring-offset-0 rounded-md shadow-sm border-0"
            />
          </div>
        </div>

        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="bg-white border text-black w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-white border text-black">
            {roles.map((role) => (
              <SelectItem
                key={role.roleId}
                value={role.roleName}
                className="bg-white text-black hover:bg-gray-100"
              >
                {role.roleName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Table */}
      <Table className="w-full border-collapse ">
        <TableHeader>
          <TableRow className="  bg-primary-300 py-18 border-0">
            <TableHead className="flex items-center gap-2">
              <span>Checkbox</span>
              <Checkbox.Root
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                className="hidden"
              >
                <Checkbox.Indicator />
              </Checkbox.Root>
            </TableHead>

            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No employees to add.
              </TableCell>
            </TableRow>
          ) : (
            currentData.map((emp) => (
              <TableRow
                key={emp.employeeCode}
                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200"
              >
                <TableCell>
                  <Checkbox.Root
                    checked={selectedEmployees.includes(emp.employeeCode)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedEmployees((prev) => [...prev, emp.employeeCode]);
                      } else {
                        setSelectedEmployees((prev) =>
                          prev.filter((employeeCode) => employeeCode !== emp.employeeCode)
                        );
                      }
                    }}
                    className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center"
                  >
                    <Checkbox.Indicator>
                      <Check className="w-4 h-4 text-black" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </TableCell>
                <TableCell className="text-black">{emp.name}</TableCell>
                <TableCell className="text-black">{emp.email}</TableCell>
                <TableCell className="text-black">{emp.phoneNo}</TableCell>
                <TableCell className="text-black">{emp.roleName}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Paginations */}
      <div className="flex items-center justify-between p-4 border-t">
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

      {/* Footer buttons */}
      <div className="flex justify-end mt-6 gap-3">
        <Button asChild className="cancel-btn">
          <Link to="/project">Cancel</Link>
        </Button>

        <Button onClick={handleAddEmployees} className="primary-btn">
          Add {selectedEmployees.length > 0 && `(${selectedEmployees.length})`}
        </Button>
      </div>
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="bg-secondary-50 text-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-md">
              <div className="flex gap-3 items-center">
                <AlertTriangle className="h-6 w-6 text-secondary-500" />
                Alert!
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertDialogOpen(false)}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
