import { leaveService } from "@/services/leaveService";
import { useEffect, useState } from "react";

type LeaveProgressProps = {
    total: number;
    used: number;
};
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function LeaveProgressBar() {
    const yearOptions = [2025, 2026];
    const currentYear = new Date().getFullYear();
    const [leaves, setLeaves] = useState([])

    const [year, setYear] = useState(yearOptions.includes(currentYear) ? currentYear : yearOptions[0])

    useEffect(() => {
        (async () => {
            const data = await leaveService.getLeaveBalance(year)
            setLeaves(data.data.leaves)
        })()
    }, [year])
    return (
        <div className="rounded-[20px] border border-natural-200 bg-background shadow-sm gap-0 py-5 px-4">
            <div className="flex justify-end mb-4">
                <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-natural-50">
                        {yearOptions.map((y) => (
                            <SelectItem key={y} value={y.toString()}>
                                {y}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {leaves.map((leave) => {
                const total = leave.taken + leave.remaining;
                const percent = total === 0 ? 0 : (leave.taken / total) * 100;

                return (
                    <div key={leave.leaveType} className="space-y-2 mb-4">
                        {/* Header */}
                        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                            <span>{leave.leaveType}</span>
                            <span className="text-gray-600">
                                {leave.taken} / {total} days
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${Math.min(percent, 100)}%` }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Remaining: {leave.remaining} days</span>
                            <span>{Math.round(percent)}%</span>
                        </div>
                    </div>
                );
            })}

        </div>
    );
}
