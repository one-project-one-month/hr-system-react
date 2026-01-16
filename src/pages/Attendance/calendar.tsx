const statusStyles: Record<string, string> = {
    PRESENT: "bg-green-500 text-white",
    LEAVE: "bg-blue-500 text-white",
    ABSENT: "bg-red-500 text-white",
    HALF_DAY: "bg-yellow-400 text-black",
    HOLIDAY: "bg-gray-300 text-black",
};
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
} from "date-fns";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { attendanceService } from "@/services/attendanceService";
import type { dateFilter } from "@/schema/attendance";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";


export function AttendanceList() {
    const [attendanceList, setAttendanceList] = useState([]);
    const [debouncedFilters, setDebouncedFilters] = useState({
        name: "",
        date: {},
        pageNo: 0,
        pageSize: 0,
    });
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [date, setDate] = useState<dateFilter>({ from: undefined, to: undefined });
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const monthStart = startOfMonth(date.from || new Date());
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const monthDays = eachDayOfInterval({
        start: monthStart,
        end: monthEnd,
    });
    const cellBaseClass =
        "w-8 h-8 text-center text-xs font-medium rounded-md";

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

    const attendanceByEmployee = attendanceList.reduce((acc, item) => {
        const emp = item.employeeName;
        const dayKey = format(new Date(item.attendanceDate), "yyyy-MM-dd");

        if (!acc[emp]) acc[emp] = {};
        acc[emp][dayKey] = item;

        return acc;
    }, {} as Record<string, Record<string, any>>);

    return (
        <Table className="w-full">
            <TableHeader className="bg-primary-300">
                <TableRow>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                        <TableHead key={d} className="text-center">
                            {d}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                <Table className="w-full border text-sm">
                    <TableHeader className="bg-primary-300">
                        <TableRow>
                            <TableHead className="min-w-[160px]">Employee</TableHead>

                            {monthDays.map((day) => (
                                <TableHead
                                    key={day.toString()}
                                    className="text-center w-8 px-1"
                                >
                                    {format(day, "d")}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {Object.entries(attendanceByEmployee).map(
                            ([employee, records]) => (
                                <TableRow key={employee}>
                                    {/* Employee Name */}
                                    <TableCell className="font-medium whitespace-nowrap">
                                        {employee}
                                    </TableCell>

                                    {/* Daily Status */}
                                    {monthDays.map((day) => {
                                        const key = format(day, "yyyy-MM-dd");
                                        const record = records[key];
                                        console.log (attendanceByEmployee)
                                        const statusClass = record
                                            ? statusStyles[record.status]
                                            : "bg-gray-100";

                                        return (
                                            <TableCell key={key} className="px-1 py-1">
                                                <div
                                                    className={cn(
                                                        cellBaseClass,
                                                        statusClass,
                                                        "mx-auto cursor-pointer"
                                                    )}
                                                    onClick={() =>
                                                        record &&
                                                        navigate(
                                                            `/attendance/${record.attendanceCode}/detail?status=${record.status}`
                                                        )
                                                    }
                                                >
                                                    {record ? record.status[0] : ""}
                                                </div>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>

            </TableBody>
        </Table>

    )
}
