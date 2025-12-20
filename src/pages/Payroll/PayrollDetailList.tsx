import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Search,
  CircleX,
} from "lucide-react";
import { PayrollService } from "@/services/payrollService";
import type { PayrollDetail } from "@/types/payroll";
import { Input } from "@/components/ui/input";

export default function PayrollList() {
  const navigate = useNavigate();
  const { code } = useParams()
  const [data, setData] = useState<PayrollDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [monthYear, setMonthYear] = useState<Date | null>(null)
  const [searchName, setSearchName] = useState("")
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
  console.log (code)

  const handleRowClick = (payrollCode: string) => {
    const payroll = data.find((p) => p.payrollCode === payrollCode);
    navigate(`/payrollDetail/${payrollCode}`, { state: payroll });
  };
  useEffect(() => {
    (async () => {
      const monthDetailList = await PayrollService.monthDetailList(
        {
          PayrollSummaryCode: code ?? "",
          EmployeeName: searchName,
          PageNo: currentPage,
          PageSize: rowsPerPage
        }
      )
      setData(monthDetailList as PayrollDetail[] ?? [])
    })()

  }, [monthYear])

  return (
    <div className="p-6 w-full flex-1">
      <div className="flex justify-between flex-col md:flex-row gap-2 mb-4">
        <p className="page-title">Payroll Detail</p>
        {/* search */}
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
        {/* buttons */}
        <Button className="primary-btn">
          <FolderUp />
          Export
        </Button>
      </div>
      <Table className="w-full overflow-auto shadow-sm rounded-md">
        <TableHeader className="bg-primary-300">
          <TableRow className="border-none">
            <TableHead >
              No
            </TableHead>
            <TableHead >
              Employee Code
            </TableHead>
            <TableHead >
              Employee Name 
            </TableHead>
            <TableHead >
              Payroll Date 
            </TableHead>
            <TableHead >
              Status 
            </TableHead>
            <TableHead >
              Total Working Hours 
            </TableHead>
            <TableHead >
              NetPay   
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length ?
            currentData.map((payroll, index) => (
              <TableRow
                key={index}
                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3"
                onClick={() => handleRowClick(payroll.payrollCode)}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{payroll.employeeCode}</TableCell>
                <TableCell>{payroll.employeeName}</TableCell>
                <TableCell>{payroll.payrollDate ? new Date(payroll.payrollDate).toLocaleDateString(): ""}</TableCell>
                <TableCell>{payroll.status}</TableCell>
                <TableCell>{payroll.totalWorkingHour}</TableCell>
                <TableCell>{payroll.netPay}</TableCell>
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
      <div className="flex flex-col gap-2 md:flex-row items-center justify-between p-4 border-t">
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