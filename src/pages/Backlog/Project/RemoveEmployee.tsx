import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Employee } from "@/types/employee";
import { EmployeeService } from "@/services/employeeService";
import { SuccessDialog } from "@/components/ui/custom/success-dialogue";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";


export function RemoveEmployee() {
  const location = useLocation();
  const navigate = useNavigate();

  const { project, employees } = location.state || {
    project: "",
    employees: EmployeeData,
  };
  const [employeeList, setEmployeeList] = useState<Employee[]>(
    employees.length ? employees : EmployeeData
  );
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(employeeList.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = employeeList.slice(startIndex, startIndex + rowsPerPage);
  const totalRows = employeeList.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);
  const { open, description, onConfirm, closeDialog, openDialog } =
    useSuccessDialogStore();
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const toggleEmployee = (employeeCode: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employeeCode]);
    } else {
      setSelectedEmployees((prev) => prev.filter((empId) => empId !== em));
    }
  };

  const isAllSelected = currentData.every((emp) =>
    selectedEmployees.includes(emp.employeeCode)
  );
  const isSomeSelected = currentData.some((emp) =>
    selectedEmployees.includes(emp.employeeCode)
  );

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked) {
      const idsToAdd = currentData
        .map((emp) => emp.employeeCode)
        .filter((id) => !selectedEmployees.includes(id));
      setSelectedEmployees((prev) => [...prev, ...idsToAdd]);
    } else {
      const idsToRemove = currentData.map((emp) => emp.employeeCode);
      setSelectedEmployees((prev) =>
        prev.filter((employeeCode) => !idsToRemove.includes(employeeCode))
      );
    }
  };

  const handleRemoveSelected = () => {
    if (selectedEmployees.length === 0) return;
    setEmployeeList((prev) =>
      prev.filter((emp) => !selectedEmployees.includes(emp.employeeCode))
    );
    setSelectedEmployees([]);
  };

  const handleSuccessConfirm = () => {
    if (onConfirm) onConfirm();
    closeDialog();
  };

  useEffect(() => {
    (async () => {
      const EmployeeData = await EmployeeService.fetchEmployees({
        name: "",
        pageNo: currentPage,
        pageSize: rowsPerPage,
        roleName: "",
      })
      setEmployeeList(EmployeeData.items as Employee[] ?? [])
    })()
  }, [])

  return (
    <div className="p-6 w-full flex flex-col">
      <div className="flex justify-between gap-2 items-center mb-4">
        <h2 className="text-xl font-semibold mb-4 text-black">
          <span className="text-primary-600">{project}</span>
        </h2>
      </div>
      <div>
        {employeeList.length === 0 ? (
          <p className="text-muted-foreground">No employees selected.</p>
        ) : (
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-primary-300">
                <TableHead>
                  <Checkbox.Root
                    checked={
                      isAllSelected
                        ? true
                        : isSomeSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={handleSelectAll}
                    className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center"
                  >
                    <Checkbox.Indicator>
                      {isSomeSelected ? (
                        <div className="w-2.5 h-0.5 bg-black" />
                      ) : (
                        <Check className="w-4 h-4 text-black" />
                      )}
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((emp) => (
                <TableRow
                  key={emp.employeeCode}
                  className="odd:bg-primary-100 even:bg-primary-50"
                >
                  <TableCell>
                    <Checkbox.Root
                      checked={selectedEmployees.includes(emp.employeeCode)}
                      onCheckedChange={(checked) =>
                        toggleEmployee(emp.employeeCode, Boolean(checked))
                      }
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
              ))}
            </TableBody>
          </Table>
        )}
      </div>

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
        <Button
          className="cancel-btn"
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
        <Button
          className="primary-btn"
          disabled={selectedEmployees.length === 0}
          onClick={handleRemoveSelected}
        >
          Remove
        </Button>
      </div>
      <SuccessDialog
        open={open}
        onOpenChange={closeDialog}
        onConfirm={handleSuccessConfirm}
        description={description}
      />
    </div>
  );
}
