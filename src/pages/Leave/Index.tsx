import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Check,
  X,
  Plus,
  Search,
  CircleX,
} from "lucide-react";
import { leaveService } from "@/services/leaveService";
import { SpinnerCustom } from "@/components/ui/spinner";
import type { Leave, LeaveList, leaveType } from "@/types/leave";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LeaveList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState({ totalCount: 0 });
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectLeave, setSelectLeaveType] = useState("")
  const [status, setStatus] = useState("")
  const [debouncedFilters, setDebouncedFilters] = useState({
      LeaveType: "",
      Query: "",
      PageNo: 0,
      PageSize: 0,
    });
  const loadData = async () => {
    setLoading(true);
    try {
      const leaveData = await leaveService.getLeaves(debouncedFilters);
      setData(leaveData.data);
      setLeaves(leaveData.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedFilters]);

  const handleApprove = async (leaveCode: string) => {
    try {
      await leaveService.approveLeave(leaveCode);
      useSuccessDialogStore.getState().openDialog("Leave approved successfully.", () => {
        loadData();
      });
    } catch (error) {
      console.error("Failed to approve leave", error);
    }
  };

  const handleReject = async (leaveCode: string) => {
    try {
      await leaveService.rejectLeave(leaveCode);
      useSuccessDialogStore.getState().openDialog("Leave rejected successfully.", () => {
        loadData();
      });
    } catch (error) {
      console.error("Failed to reject leave", error);
    }
  };

    // Debounce effect
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedFilters({
          Query: searchQuery,
          PageNo: currentPage,
          PageSize: rowsPerPage,
          LeaveType: selectLeave
        });
      }, 400); // 700ms delay
  
      return () => clearTimeout(handler);
    }, [searchQuery, selectLeave, currentPage, rowsPerPage]);
  

  const totalRows = data?.totalCount || 0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const leaveType: leaveType[] = [
    {
      type: "MedicalLeave",
      label: "Medical Leave",
      id: 1,
    },
    {
      type: "CasualLeave",
      label: "Casual Leave",
      id: 2,
    },
    {
      type: "LeaveWithoutPay",
      label: "Leave Without Pay",
      id: 3
    },
    {
      type: "EarnLeave",
      label: "Earn Leave",
      id: 4
    }
  ]

  return (
    <div className="p-6 w-full flex-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-5">
        <p className="font-bold text-black">Leave</p>
        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-auto text-primary-800">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 h-4 w-4" />
            <Input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onInput={(e) => setSearchQuery(e.target.value)}
              className="border-primary-700 bg-natural-50 focus-visible:ring-[1px] focus-visible:ring-ring focus-visible:ring-offset-0 pl-9 text-primary-400"
            />
            {searchQuery ? (
              <CircleX
                onClick={() => setSearchQuery("")}
                className="cursor-pointer absolute absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
              />
            ) : (
              ""
            )}
          </div>

          <div className="flex text-primary-700 bg-natural-50 w-full">
            <Select onValueChange={(value) => setSelectLeaveType(value)}>
              <SelectTrigger className="text-primary-400 w-full">
                <SelectValue placeholder="Leave Type" className="font-semibold" />
              </SelectTrigger>
              <SelectContent className="bg-natural-50 text-primary-700">
                <SelectGroup>
                  {leaveType.map(l => (
                    <SelectItem
                      id={l.id.toString()}
                      value={l.type}
                      key={l.id}
                    >
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Table className="w-full overflow-auto shadow-sm rounded-md">
        <TableHeader className="bg-primary-400 text-center">
          <TableRow key="header">
            <TableHead className="px-4 py-2 font-semibold">#</TableHead>
            <TableHead className="px-4 py-2 font-semibold">
              Employee Name
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold">
              Employee Code
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold">
              Leave Type
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold">Reason</TableHead>
            <TableHead className="px-4 py-2 font-semibold">
              From Date
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold">To Date</TableHead>
            <TableHead className="px-4 py-2 font-semibold">
              Total Hours
            </TableHead>
            <TableHead className="px-4 py-2 font-semibold">Status</TableHead>
            <TableHead className="px-4 py-2 font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow key="loading">
              <TableCell colSpan={9} className="h-24 text-center">
                <div className="flex items-center justify-center text-primary-500">
                  <SpinnerCustom />
                </div>
              </TableCell>
            </TableRow>
          ) : leaves.length ? (
            leaves.map((leave, index) => (
              <TableRow
                key={leave.leaveId}
                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3"
              >
                <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{leave.employeeName}</TableCell>
                <TableCell>{leave.employeeCode}</TableCell>
                <TableCell>{leave.leaveType}</TableCell>
                <TableCell>{leave.reason}</TableCell>
                <TableCell>{new Date(leave.fromDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(leave.toDate).toLocaleDateString()}</TableCell>
                <TableCell>{leave.totalHours}</TableCell>
                <TableCell>{leave.status}</TableCell>
                <TableCell className="flex gap-4 justify-center">
                  { leave.status === "Pending" ? (<><Check
                    className="h-4 w-4 text-green-500 cursor-pointer hover:text-green-700"
                    onClick={() => handleApprove(leave.leaveCode!)}
                  />
                  <X
                    className="h-4 w-4 text-error-400 cursor-pointer hover:text-red-500"
                    onClick={() => handleReject(leave.leaveCode!)}
                  /></>): (<></>)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow key="no-data">
              <TableCell colSpan={9} className="h-24 text-center">
                <div className="flex items-center justify-center text-primary-500">
                  No Data.
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col md:flex-row items-center gap-2">
        <div className="w-full flex items-center justify-center md:justify-around p-4 border-t flex-col md:flex-row gap-3 ">
          <div className="text-sm text-muted-foreground">
            {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, totalRows)} of {totalRows}
          </div>
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
              {[10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
