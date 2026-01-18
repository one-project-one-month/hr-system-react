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
import {
  FolderUp,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
  BadgeDollarSign,
  AlertCircle,
} from "lucide-react";
import { PayrollService } from "@/services/payrollService";
import MonthYearPicker from "@/components/ui/month-year-picker";
import type { PayrollSummary } from "@/types/payroll";
import { exportReport } from "@/services/reportService";
import { ExportDateDialog } from "@/components/ui/custom/export-date-dialog";
import { downloadFile, toLocalISOString } from "@/lib/utils";
import type { exportType } from "@/types/excelExport";
import { useAuthStore } from "@/stores/useAuthStore";

export default function PayrollList() {
  const navigate = useNavigate();
  const {user} = useAuthStore()
  const [data, setData] = useState<PayrollSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [monthYear, setMonthYear] = useState<Date | null>(null)
  const [error, setError] = useState("")
  const [exporting, setExporting] = useState(false)
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);
  const totalRows = data.length;
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);
  const [open, setOpen] = useState(false);
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const handleRowClick = (payrollSummaryCode: string) => {
    const payroll = data.find((p) => p.payrollSummaryCode === payrollSummaryCode);
    navigate(`/payrollDetailList/${payrollSummaryCode}`, { state: payroll });
  };

  const processPayroll = async () => {
    try {
      if (!monthYear) {
        setError("Please select month and year first!");
        return;
      }
      setError("")
      const resp = await PayrollService.processPayroll({ payrollMonth: cleanMonthYear(monthYear) })
      if(!resp.isSuccess)
        setError(resp.message)
    } catch (error) {
      console.log(error)
      console.log (error.message)
      setError("Failed to process payroll");
    }
  }

  const cleanMonthYear = (date: Date | null) => {
    if (!date) return ""
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  const handleExport = async (exportType: exportType) => {
    user?.roleName && user?.roleName.toLocaleLowerCase().includes("admin") 
        || user.roleName.toLowerCase().includes("hr") 
          ? exportType.type = "admin"
          :exportType.type = "employee"
  
    
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

  useEffect(() => {
    (async () => {
      try {
        const payrollSummary = await PayrollService.fetchPayrollSummary(
          {
            MonthYear: cleanMonthYear(monthYear) ?? "",
            PageNo: currentPage,
            PageSize: rowsPerPage
          }
        )
        setData(payrollSummary?.data?.items as PayrollSummary[] ?? [])
      } catch (err) {
        console.log(err)
        setError("Failed to fetch payroll summary")
      }

    })()

  }, [monthYear])

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col md:flex-row gap-2 mb-4 w-full">
        <p className="page-title">Payroll Summary</p>
        {/* search */}
        <div className="w-full md:w-auto text-primary-800">
          <MonthYearPicker
            value={monthYear}
            onChange={(d) => setMonthYear(d)}
            startYear={2000}
            endYear={2035}
          />
          {error && (
            <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-300 text-red-700 p-3 rounded-md text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
        {/* buttons */}
        <Button className="primary-btn w-full md:w-auto" onClick={() => setOpen(true)}>
          <FolderUp />
          Export
        </Button>
        <Button className="primary-btn w-full md:w-auto" onClick={processPayroll}><BadgeDollarSign />Process Payroll</Button>
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
              Total Working Hours
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
                onClick={() => handleRowClick(payroll.payrollSummaryCode)}
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
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between p-4 border-t">
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
      <ExportDateDialog
        open={open}
        onOpenChange={setOpen}
        title="Export Payroll"
        loading={exporting}
        error={error}
        onConfirm={({ range, format }) => {
          handleExport({
            from: range.from!,
            to: range.to!,
            format,
            type : "admin",
            name : "Payroll"
          });
        }}
      />
    </div>
  );
}