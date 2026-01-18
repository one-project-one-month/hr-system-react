import { FullDonutChart } from "@/components/ui/donutchart";
import PieChartWithPercentage from "@/components/ui/piechartwithpercentage";
import { UsersRound } from "lucide-react";
import { hrAttendanceReportService } from "@/services/hrAttendanceReportService";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCheckInStore } from "@/stores/useCheckInStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* eslint-disable react-refresh/only-export-components */
export default function () {
    const [dataView, setDataView] = useState<number>(0); // 0: Today, 1: weekly, 2: monthly, 3: yearly
    const [empCount, setEmpCount] = useState<number>(0);
    const [donutKeys, setDonutKeys] = useState<string[]>([
        "Present",
        "Late",
        "Absent",
    ]);
    const [donutValues, setDonutValues] = useState<number[]>([0, 0, 0]);
    const [donutColors] = useState<string[]>(["#02B16C", "#FFDF20", "#E7000B"]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const svc = hrAttendanceReportService;

    useEffect(() => {
        let mounted = true;
        (async () => {
            setReportsLoading(true);
            try {
                const today = new Date().toISOString().split("T")[0];
                const res: any = await svc.fetchHRAttendanceReport(today, dataView);
                if (!mounted) return;

                setEmpCount(res.empCount ?? 0);

                if ("present" in res || "late" in res || "absent" in res) {
                    setDonutKeys(["Present", "Late", "Absent"]);
                    setDonutValues([
                        Number(res.present ?? 0),
                        Number(res.late ?? 0),
                        Number(res.absent ?? 0),
                    ]);
                    return;
                }
            } catch (err) {
                console.error("fetchAttendanceReports failed", err);
            } finally {
                if (mounted) setReportsLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [dataView]);

    function CheckInOutCard() {
        const authUser = useAuthStore((s) => s.user);
        const data = useCheckInStore((s) => s.data);
        const loadCheckInData = useCheckInStore((s) => s.loadData);

        const [currentDateLabel] = useState(() => {
            const d = new Date();
            return d.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        });

        useEffect(() => {
            loadCheckInData(authUser?.employeeCode ?? "");
        }, []);

        const loading = useCheckInStore((s) => s.loading);
        const handleCheckInOut = useCheckInStore((s) => s.handleCheckInOut);

        return (
            <Card className="w-full rounded-[20px] border border-natural-200 bg-background shadow-sm gap-0 py-5 px-2.5">
                <CardHeader className="pb-2 px-0">
                    <CardTitle className="text-2xl font-semibold text-slate-900">
                        Check In/Out
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-4 pb-0 pt-0">
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            type="button"
                            onClick={handleCheckInOut}
                            disabled={loading}
                            className={cn(
                                "flex h-[131px] w-[133px] flex-col items-center justify-center rounded-full",
                                "text-natural-50 font-bold text-xl leading-7 tracking-normal shadow-lg",
                                "bg-[linear-gradient(180deg,#55CB9D_0%,#83D9B7_50%,#3B9E77_100%)]",
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            )}
                        >
                            {loading ? (
                                <span>Loading...</span>
                            ) : data?.isCheckIn ? (
                                <span>Check Out</span>
                            ) : (
                                <span>Check In</span>
                            )}
                        </Button>
                        <p className="text-text">
                            <span>{currentDateLabel}</span>
                        </p>
                    </div>

                    <div className="flex w-full items-center justify-center gap-6 text-text font-semibold">
                        <span>
                            Check In:{" "}
                            <span>
                                {!data?.checkInTime || data?.checkInTime === ""
                                    ? "--------"
                                    : data?.checkInTime}
                            </span>
                        </span>
                        <span className="h-3 w-px bg-border" />
                        <span>
                            Check Out:{" "}
                            <span>
                                {!data?.checkOutTime ||
                                    data?.checkOutTime === ""
                                    ? "--------"
                                    : data?.checkOutTime}
                            </span>
                        </span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-2 p-3 w-full mx-auto md:mx-4">
                <div className="w-full flex flex-col md:flex-row gap-2">
                    <div className="w-full md:w-1/2">
                        <CheckInOutCard />
                    </div>
                    <div className="w-full md:w-1/2">
                        <PieChartWithPercentage />
                    </div>
                </div>
                <div className="bg-natural-50 rounded p-3">
                    <div className="flex justify-between items-center">
                        <p className="text-xl font-medium">
                            Attendance Overview
                        </p>

                        <div className="relative me-4">
                            <select
                                className="
                                    p-2 pr-8 bg-primary-50 text-primary-600 rounded 
                                    focus:outline-none focus:ring-2 focus:ring-primary-300
                                    appearance-none cursor-pointer
                                "
                                onChange={(e) =>
                                    setDataView(Number(e.target.value))
                                }
                            >
                                <option value="0">Today</option>
                                <option value="1">Weekly</option>
                                <option value="2">Monthly</option>
                                <option value="3">Yearly</option>
                            </select>

                            {/* Down arrow */}
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-primary-600">
                                ▼
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full text-primary-700 flex-col md:flex-row">
                        <div className="bg-primary-100 p-2 rounded flex flex-col w-full md:w-[40%] mt-2">
                            <div className="flex justify-between w-full ">
                                <p className="font-bold ">Total Employee</p>
                                <UsersRound />
                            </div>
                            <div className="font-bold text-4xl pt-5">
                                <p>{empCount}</p>
                            </div>
                        </div>
                        <div className="w-full">
                            <FullDonutChart
                                keys={donutKeys}
                                values={donutValues}
                                colors={donutColors}
                                size={120}
                                strokeWidth={10}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
