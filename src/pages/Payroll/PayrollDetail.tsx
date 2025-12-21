import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PayrollDetail } from "@/types/payroll";

export default function PayrollDetail() {
    const navigate = useNavigate();
    const { code } = useParams();
    const location = useLocation();
    const row: PayrollDetail | undefined = location.state as PayrollDetail | undefined;

    const handleBack = () => {
        navigate("/payroll");
    };

    const Field = ({ label, value }: { label: string; value?: string | number}) => (
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
                <span className="page-title">Payroll</span>
            </div>

            {row ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-48">
                {/* Left Column */}
                <div className="space-y-6">
                    <Field label="Employee Code" value={row.employeeCode} />
                    <Field label="Payroll Date" value={row.payrollDate} />
                    <Field label="Total Working Hour" value={row.totalWorkingHour} />
                    <Field label="Actual Working Hour" value={row.actualWorkingHour} />
                    <Field label="Allowance" value={row.allowance} />
                    <Field label="Gross Pay" value={row.grossPay} />
                    <Field label="Tax" value={row.tax} />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Field label="Employee Name" value={row.employeeName} />
                    <Field label="Status" value={row.status} />
                    <Field label="Leave Hour" value={row.totalLeaveHour} />
                    <Field label="Basic Salary" value={row.baseSalary} />
                    <Field label="Bonus" value={row.bonus} />
                    <Field label="Deduction" value={row.deduction} />
                    <Field label="Net Pay" value={row.netPay} />
                </div>
            </div>)
            : <div>No Payroll Data.</div>}

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

