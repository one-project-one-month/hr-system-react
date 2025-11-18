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
  EyeIcon,
  CircleX,
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
import { SpinnerCustom } from "@/components/ui/spinner";
import { attendanceService } from "@/services/attendanceService";
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
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";

interface dateFilter {
  from?: Date;
  to?: Date;
}

export function AttendanceList() {
  const navigate = useNavigate()
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
    const [debouncedFilters, setDebouncedFilters] = useState({
    name: "",
    date: {},
    pageNo: 0,
    pageSize: 0,
  });

  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [date, setDate] = useState<dateFilter>({ from: undefined, to: undefined });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState("");
  const { open, description, onConfirm, closeDialog, openDialog } =
      useSuccessDialogStore();
  const formatDateTime = (datetime: string) => datetime ? format(new Date(datetime), "yyyy-MM-dd HH:mm"): "-";
  const formatDate = (dateStr: string) => dateStr ? format(new Date(dateStr), "yyyy-MM-dd"): "-";
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
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await attendanceService.fetchAttendanceRecords(
          searchName,
          date,
          currentPage,
          rowsPerPage
        );
        setAttendanceList(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [debouncedFilters]);

    // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters({
        name: searchName,
        date: date,
        pageNo: currentPage,
        pageSize: rowsPerPage,
      });
    }, 400); // 700ms delay

    return () => clearTimeout(handler);
  }, [searchName, date, currentPage, rowsPerPage]);

  if (loading) return;

  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToLast = () => setCurrentPage(totalPages);
  const goToFirst = () => setCurrentPage(1);

  const handleSuccessConfirm = () => {
    if (onConfirm) onConfirm();
    closeDialog();
  };

  const goToCreatForm = () => {
    navigate("/attendance/create");
  };

  const updateAttendance = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    navigate(`/attendance/${code}/update`);
  };

  const handleRowClick = (code: string) => {
    navigate(`/attendance/${code}/detail`);
  }

  const handleDelete = (e: React.MouseEvent, attendanceCode: string) => {
    e.stopPropagation();
    setAttendanceToDelete(attendanceCode);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
      try {
        setLoading(true);
        await attendanceService.deleteAttendanceRecord(attendanceToDelete);
        // Refresh list with current paging
        const data = await attendanceService.fetchAttendanceRecords(searchName, date, currentPage, rowsPerPage);
        setAttendanceList(data);
        openDialog("Delete Attendance successful!", onConfirm);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setAttendanceToDelete("");
      }
    };
  
    const cancelDelete = () => {
      setDeleteDialogOpen(false);
      setAttendanceToDelete("");
    };
  return (
    <div className="p-6 w-full flex-1">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-5">
        <p className="text-3xl font-semibold">Attendance</p>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
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
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
              />
            ) : (
              ""
            )}
        </div>
        {/* buttons */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-btn border border-primary-700 focus:outline-none py-1 px-2 rounded-md flex gap-2">
            <FileUp />
            Export
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-20 border border-primary-700 bg-natural-50 w-24 p-4 rounded-md">
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
                    <TableHead className="w-[60px]">No.</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Check In Time</TableHead>
                    <TableHead className="text-center">Check Out Time</TableHead>
                    <TableHead className="text-center">Working Hour</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
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
                  ) : attendanceList.length? (
                     currentData?.map((user, index) => (
                      <TableRow
                        key={index}
                        className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3 text-center"
                        onClick={() => handleRowClick(user.attendanceCode)}
                      >
                        <TableCell>{startIndex + index + 1}</TableCell>
                        <TableCell>{user.employeeName}</TableCell>
                        <TableCell>
                          {formatDate(user.attendanceDate)}
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
                            onClick={(e) => updateAttendance(e, user.attendanceCode)}
                          />
                          <Trash2
                            className="text-error-400 cursor-pointer"
                            onClick={(e) => handleDelete(e, user.attendanceCode)}
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
        open={successDialogOpen}
        onOpenChange={setSuccessDialogOpen}
        onConfirm={handleSuccessConfirm}
        description={description}
      />
    </div>
  );
}
