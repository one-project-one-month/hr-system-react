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
    FilePenLine,
    Plus,
    Trash2,
} from "lucide-react";
import { leaveService } from "@/services/leaveService";
import { SpinnerCustom } from "@/components/ui/spinner";
import type {
    EmployeeLeave,
    EmployeeLeaveResponseData,
    leaveType,
} from "@/types/leave";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import type { ApiResponse } from "@/types/api";
import { DeleteDialog } from "@/components/ui/custom/delete-dialogue";
import { DatePicker } from "@/components/ui/custom/date-picker";
import { formatDate } from "@/lib/utils";

export default function EmployeeLeaveList() {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [allLeaves, setAllLeaves] = useState<EmployeeLeave[]>([]);
    const [filteredLeaves, setFilteredLeaves] = useState<EmployeeLeave[]>([]);
    const [displayedLeaves, setDisplayedLeaves] = useState<EmployeeLeave[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectLeave, setSelectLeaveType] = useState("all");
    const [fromDate, setFromDate] = useState<Date | undefined>();
    const [toDate, setToDate] = useState<Date | undefined>();
    const navigate = useNavigate();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedLeaveCode, setSelectedLeaveCode] = useState<string | null>(
        null
    );

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response =
                (await leaveService.getEmployeeLeaves()) as ApiResponse<EmployeeLeaveResponseData>;
            if (response && response.isSuccess) {
                setAllLeaves(response.data.items);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    useEffect(() => {
        let filtered = allLeaves;

        if (selectLeave && selectLeave !== "all") {
            filtered = filtered.filter(
                (leave) => leave.leaveType === selectLeave
            );
        }

        if (fromDate) {
            filtered = filtered.filter(
                (leave) => new Date(leave.fromDate) >= fromDate
            );
        }

        if (toDate) {
            filtered = filtered.filter(
                (leave) => new Date(leave.toDate) <= toDate
            );
        }

        setFilteredLeaves(filtered);
        setCurrentPage(1);
    }, [allLeaves, selectLeave, fromDate, toDate]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setDisplayedLeaves(filteredLeaves.slice(startIndex, endIndex));
    }, [filteredLeaves, currentPage, rowsPerPage]);

    const totalRows = filteredLeaves.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = Math.min(currentPage * rowsPerPage, totalRows);

    const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
    const goNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
    const goToLast = () => setCurrentPage(totalPages);
    const goToFirst = () => setCurrentPage(1);

    const handleDelete = async () => {
        if (selectedLeaveCode) {
            try {
                const response = await leaveService.deleteLeave(
                    selectedLeaveCode
                );
                if (response && response.isSuccess) {
                    fetchLeaves();
                    setIsDeleteDialogOpen(false);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

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
            id: 3,
        },
        {
            type: "EarnLeave",
            label: "Earn Leave",
            id: 4,
        },
        {
            type: "MaternityLeave",
            label: "Maternity Leave",
            id: 5,
        }
    ];

    return (
        <div className="p-6 w-full flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-5">
                <p className="font-bold text-black">My Leaves</p>
                <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                    <div className="flex flex-row items-center gap-2">
                        <DatePicker
                            date={fromDate}
                            setDate={setFromDate}
                            placeholder="From Date"
                        />
                        <DatePicker
                            date={toDate}
                            setDate={setToDate}
                            placeholder="To Date"
                        />
                    </div>
                    <div className="flex text-primary-700 bg-natural-50 w-full">
                        <Select
                            value={selectLeave}
                            onValueChange={(value) => setSelectLeaveType(value)}
                        >
                            <SelectTrigger className="text-primary-400 w-full">
                                <SelectValue
                                    placeholder="Leave Type"
                                    className="font-semibold"
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-natural-50 text-primary-700">
                                <SelectGroup>
                                    <SelectItem value="all">All</SelectItem>
                                    {leaveType.map((l) => (
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
                    <Link to="/leave/create">
                        <Button className="primary-btn">
                            <Plus className="h-4 w-4" />
                            Apply for leave
                        </Button>
                    </Link>
                </div>
            </div>
            <Table className="w-full overflow-auto shadow-sm rounded-md">
                <TableHeader className="bg-primary-400 text-center">
                    <TableRow key="header">
                        <TableHead className="px-4 py-2 font-semibold">
                            #
                        </TableHead>
                        <TableHead className="px-4 py-2 font-semibold">
                            Leave Code
                        </TableHead>
                        <TableHead className="px-4 py-2 font-semibold">
                            Leave Type
                        </TableHead>
                        <TableHead className="px-4 py-2 font-semibold">
                            From
                        </TableHead>
                        <TableHead className="px-4 py-2 font-semibold">
                            To
                        </TableHead>
                        <TableHead className="px-4 py-2 font-semibold">
                            Total Hours
                        </TableHead>
                        <TableHead className="px-4 py-2 font-semibold">
                            Status
                        </TableHead>
                        <TableHead className="px-4 py-2 font-semibold">
                            Actions
                        </TableHead>
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
                    ) : displayedLeaves.length ? (
                        displayedLeaves.map((leave, index) => (
                            <TableRow
                                key={leave.leaveCode}
                                className="odd:bg-primary-100 even:bg-primary-50 hover:bg-primary-200 transition-colors border-none py-3"
                            >
                                <TableCell>
                                    {(currentPage - 1) * rowsPerPage +
                                        index +
                                        1}
                                </TableCell>
                                <TableCell>{leave.leaveCode}</TableCell>
                                <TableCell>{leave.leaveType}</TableCell>
                                <TableCell>{formatDate(leave.fromDate)}</TableCell>
                                                <TableCell>{formatDate(leave.toDate)}</TableCell>
                                <TableCell>{leave.totalHours}</TableCell>
                                <TableCell>{leave.status}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                navigate(
                                                    `/leave/edit/${leave.leaveCode}`
                                                );
                                            }}
                                        >
                                            <FilePenLine className="h-5 w-5 text-blue-500" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSelectedLeaveCode(
                                                    leave.leaveCode
                                                );
                                                setIsDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
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
            {isDeleteDialogOpen && (
                <DeleteDialog
                    open={isDeleteDialogOpen}
                    onOpenChange={(isOpen) => setIsDeleteDialogOpen(isOpen)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
