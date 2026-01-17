type LeaveProgressProps = {
    total: number;
    used: number;
};

export function LeaveProgressBar({ total, used }: LeaveProgressProps) {
    const percentage = Math.min((used / total) * 100, 100);

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span>Leave Balance</span>
                <span>{used} / {total} days</span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <p className="text-xs text-gray-500">
                Remaining: {total - used} days
            </p>
        </div>
    );
}
