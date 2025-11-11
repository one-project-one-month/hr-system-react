import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { capitalizeCamelCase } from "@/lib/utils";
import {
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  ChevronsRight,
  ChevronLeft,
  ChevronsLeft,
  Search,
  Calendar1Icon,
  FileUp,
  Divide,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { SuccessDialog } from "@/components/ui/SuccessDialog";
import { useDataStore } from "@/stores/useDataStore";
import { SpinnerCustom } from "@/components/ui/spinner";

export function AttendanceList() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL;
  const { data, loading, error, fetchData } = useDataStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const attendanceList = data?.data?.attendanceList;
  const totalPages = attendanceList
    ? Math.ceil(attendanceList.length / rowsPerPage)
    : 0;
  const startIndex = attendanceList ? (currentPage - 1) * rowsPerPage : 0;
  const currentData = attendanceList
    ? attendanceList.slice(startIndex, startIndex + rowsPerPage)
    : [];
  const totalRows = attendanceList ? attendanceList.length : 0;
  const startRow = attendanceList ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const endRow = attendanceList
    ? Math.min(currentPage * rowsPerPage, totalRows)
    : 0;

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchData({
          endPoint: `/Attendance/AttendanceList`,
        });
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [fetchData]);

  if (loading) return;

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const goToCreatForm = () => {
    navigate("/attendance/create");
  };

  const updateAttendance = (code: string) => {
    navigate(`/attendance/${code}/update`);
  };

  const deleteAttendance = (code: string) => {};
  const handleSuccessConfirm = () => {
    setSuccessDialogOpen(false);
    navigate("/attendance");
  };
  return (
    <div className="p-6 w-full flex-1">
      <div className="flex justify-between flex-col md:flex-row gap-2 mb-4">
        <p className="text-3xl font-semibold">Attendance</p>
        {/* date picker */}
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "justify-between text-left font-normal w-[250px] outline-btn font-semibold",
                  !date && "text-muted-foreground"
                )}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")}/
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
                <Calendar1Icon className="mr-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-natural-50" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={(dateRange) =>
                  setDate({ from: dateRange?.from, to: dateRange?.to })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* search */}
        <div className="relative w-full md:w-[20%] text-primary-800">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primay-800 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="focus-visible:ring-[1px] focus-visible:ring-ring focus-visible:ring-offset-0 pl-9" // Add left padding so text doesn’t overlap the icon
          />
        </div>
        {/* buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-btn border border-primary-600 focus:outline-none py-1 px-2 rounded-md flex gap-2">
            <FileUp />
            Export
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-20 bg-natural-50 w-24 p-4 rounded-md">
            <DropdownMenuSeparator />
            <DropdownMenuItem> PDF</DropdownMenuItem>
            <DropdownMenuItem>Excel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="outline-btn" onClick={goToCreatForm}>
          <Plus />
          Add new
        </Button>
      </div>
      <>
        {!loading ? (
          !attendanceList ? (
            <div>No data to show</div>
          ) : (
            <>
              <Table className="w-full overflow-auto">
                <TableHeader className="bg-primary-300">
                  <TableRow className="border-none">
                    {/* {attendanceList ? Object.keys(attendanceList[0]).map((columnName) => (
                      <TableHead key={columnName}>
                        {capitalizeCamelCase(columnName)}
                      </TableHead>
                    )): ''} */}
                    <TableHead className="w-[60px]">No.</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Check In Time</TableHead>
                    <TableHead className="text-center">
                      Check Out Time
                    </TableHead>
                    <TableHead className="text-center">Working Hour</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData?.map((user, index) => {
                    // Format date/time display
                    const formatDateTime = (datetime: string) =>
                      datetime
                        ? format(new Date(datetime), "yyyy-MM-dd HH:mm")
                        : "-";

                    return (
                      <TableRow
                        key={index}
                        className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3 text-center"
                      >
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          {formatDateTime(user.attendanceDate)}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(user.checkInTime)}
                        </TableCell>
                        <TableCell>
                          {formatDateTime(user.checkOutTime)}
                        </TableCell>
                        <TableCell>{user.workingHour?.toFixed(2)}</TableCell>
                        <TableCell>{user.status}</TableCell>

                        <TableCell className="flex justify-center gap-2">
                          <Edit
                            className="text-primary-500 cursor-pointer"
                            onClick={() => updateAttendance(user.code)}
                          />
                          <Trash2
                            className="text-error-400 cursor-pointer"
                            onClick={() => deleteAttendance(user.code)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
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
                      )
                    )}
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
                    <span className="text-sm text-muted-foreground">
                      Rows/page:
                    </span>
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
            </>
          )
        ) : (
          <div className="flex items-center justify-center">
            <SpinnerCustom /> Loading ...{" "}
          </div>
        )}
      </>

      <SuccessDialog
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onConfirm={handleSuccessConfirm}
      />
    </div>
  );
}
