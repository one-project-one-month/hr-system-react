import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, parse } from "date-fns";

type PayrollRow = {
    id?: number;
    name?: string;
    payrollDate?: string;
    status?: string;
    totalHours?: number;
    leaveHours?: number;
    grossPay?: number | string;
    netPay?: number | string;
    employeeCode?: string;
    totalWorkingHour?: number;
    actualWorkingHour?: number;
    basicSalary?: number;
    allowance?: number;
    bonus?: number;
    deduction?: number;
    tax?: string;
};

export default function PayrollDetail() {
    const navigate = useNavigate();
    useParams();
    const location = useLocation();
    const row: PayrollRow | undefined = location.state as PayrollRow | undefined;

    const initialDate: Date | undefined = useMemo(() => {
        if (!row?.payrollDate) return new Date();
        const dateStr = row.payrollDate.includes(" ") ? row.payrollDate : `${row.payrollDate} 08:30`;
        const parsed = parse(dateStr, "yyyy-MM-dd HH:mm", new Date());
        return isNaN(parsed.getTime()) ? new Date() : parsed;
    }, [row]);

    // Calculate values based on passed row data
    const calculatedGrossPay = typeof row?.grossPay === 'number' ? row.grossPay : (typeof row?.grossPay === 'string' ? parseFloat(row.grossPay) : 0);
    const calculatedNetPay = typeof row?.netPay === 'number' ? row.netPay : (typeof row?.netPay === 'string' ? parseFloat(row.netPay) : 0);
    const calculatedBasicSalary = calculatedGrossPay * 0.5;
    const calculatedAllowance = calculatedGrossPay * 0.05;
    const calculatedBonus = calculatedGrossPay * 0.05;
    const calculatedDeduction = calculatedGrossPay - calculatedNetPay - (calculatedGrossPay * 0.1);

    const [selectedDate] = useState<Date | undefined>(initialDate);
    const [formData] = useState({
        employeeCode: row?.employeeCode ?? `EMP${String(row?.id ?? 0).padStart(5, '0')}`,
        employeeName: row?.name ?? "",
        payrollDate: format(initialDate ?? new Date(), "yyyy-MM-dd HH:mm"),
        status: row?.status ?? "Pending",
        totalWorkingHour: (row?.totalHours ?? row?.totalWorkingHour ?? 0).toString(),
        actualWorkingHour: (row?.actualWorkingHour ?? (row?.totalHours ? row.totalHours - (row?.leaveHours ?? 0) : 0)).toString(),
        leaveHour: (row?.leaveHours ?? 0).toString(),
        basicSalary: Math.round(calculatedBasicSalary).toLocaleString(),
        allowance: Math.round(calculatedAllowance).toLocaleString(),
        bonus: Math.round(calculatedBonus).toLocaleString(),
        grossPay: calculatedGrossPay.toLocaleString(),
        deduction: Math.round(Math.abs(calculatedDeduction)).toLocaleString(),
        tax: row?.tax ?? "10%",
        netPay: calculatedNetPay.toLocaleString(),
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate]);

    const handleBack = () => {
        navigate("/payroll");
    };

    const Field = ({ label, value }: { label: string; value?: string }) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <Input
                value={value ?? "-"}
                readOnly
                className="bg-natural-400 border-natural-500 text-gray-700 h-10"
            />
        </div>
    );

    return (
        <div className="p-6 md:p-8 w-full flex-1 bg-gray-50">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Payroll Detail</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-48">
                {/* Left Column */}
                <div className="space-y-6">
                    <Field label="Employee Code" value={formData.employeeCode} />
                    <Field label="Payroll Date" value={formData.payrollDate} />
                    <Field label="Total Working Hour" value={formData.totalWorkingHour} />
                    <Field label="Actual Working Hour" value={formData.actualWorkingHour} />
                    <Field label="Allowance" value={formData.allowance} />
                    <Field label="Gross Pay" value={formData.grossPay} />
                    <Field label="Tax" value={formData.tax} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Field label="Employee Name" value={formData.employeeName} />
                    <Field label="Status" value={formData.status} />
                    <Field label="Leave Hour" value={formData.leaveHour} />
                    <Field label="Basic Salary" value={formData.basicSalary} />
                    <Field label="Bonus" value={formData.bonus} />
                    <Field label="Deduction" value={formData.deduction} />
                    <Field label="Net Pay" value={formData.netPay} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-12">
                <Button
                    variant="default"
                    onClick={handleBack}
                    className="px-8 py-2 bg-primary-500 hover:bg-primary-600 text-white h-10"
                >
                    BACK
                </Button>
            </div>
        </div>
    );
}


