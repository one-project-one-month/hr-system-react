import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { capitalizeCamelCase } from "@/lib/utils";
import {
  Edit,
  Trash2,
  FolderUp,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
  Search,
  BadgeDollarSign,
} from "lucide-react";
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
import { PayrollService } from "@/services/payrollService";
import MonthYearPicker from "@/components/ui/month-year-picker";

export default function PayrollList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [monthYear, setMonthYear] = useState<Date | null>(null)

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);
  const totalRows = data.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const handleRowClick = (userId: number) => {
    const payroll = data.find((p) => p.id === userId);
    navigate(`/payroll/${userId}`, { state: payroll });
  };

  const processPayroll = async () => {
    try {
      await PayrollService.processPayroll({ payrollMonth: cleanMonthYear(monthYear) })
    } catch (error) {
      console.log(error)
    }
  }

  const cleanMonthYear = (date: Date | null) => {
    if (!date) return ""
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  useEffect(() => {
    (async () => {
      console.log()

      const payrollSummary = await PayrollService.fetchPayrollSummary(
        {
          MonthYear: cleanMonthYear(monthYear) ?? "",
          PageNo: currentPage,
          PageSize: rowsPerPage
        }
      )
      setData(payrollSummary?.data?.items ?? [])
    })()

  }, [monthYear])

  return (
    <div className="p-6 w-full flex-1">
      <div className="flex justify-between flex-col md:flex-row gap-2 mb-4">
        <p>Payroll</p>
        {/* search */}
        <div className="relative w-full md:w-[20%] text-primary-800">
          <MonthYearPicker
            value={monthYear}
            onChange={(d) => setMonthYear(d)}
            startYear={2000}
            endYear={2035}
          />
        </div>
        {/* buttons */}
        <Button className="primary-btn">
          <FolderUp />
          Export
        </Button>
        <Button className="primary-btn" onClick={processPayroll}><BadgeDollarSign />Process Payroll</Button>
      </div>
      <Table className="w-full overflow-auto shadow-sm rounded-md">
        <TableHeader className="bg-primary-300">
          <TableRow className="border-none">
            <TableHead >
              No
            </TableHead>
            <TableHead >
              Payroll Month
            </TableHead>
            <TableHead >
              Total Working Days
            </TableHead>
            <TableHead >
              Total Employees
            </TableHead>
            <TableHead >
              total Working Hours
            </TableHead>
            <TableHead >
              Total Leave Hours
            </TableHead>
            <TableHead >
              Total Actual Working Hours
            </TableHead>
            <TableHead >
              Total Base Salary
            </TableHead>
            <TableHead >
              Total Net Pay
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length ?
            currentData.map((payroll, index) => (
              <TableRow
                key={index}
                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3"
                onClick={() => handleRowClick(payroll.payrollSummaryId)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{payroll.payrollMonth}</TableCell>
                <TableCell>{payroll.totalWorkingDays}</TableCell>
                <TableCell>{payroll.employeeCount}</TableCell>
                <TableCell>{payroll.totalWorkingHours}</TableCell>
                <TableCell>{payroll.totalLeaveHours}</TableCell>
                <TableCell>{payroll.totalActualWorkingHours}</TableCell>
                <TableCell>{payroll.totalBaseSalary}</TableCell>
                <TableCell>{payroll.totalNetPay}</TableCell>
              </TableRow>
            )) : (
              <TableRow key="no-data">
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex items-center justify-center text-primary-500">
                    No Data.
                  </div>
                </TableCell>
              </TableRow>
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
    </div>
  );
}