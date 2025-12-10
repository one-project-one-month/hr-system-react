export interface PayrollFilter {
    MonthYear: string;
    PageNo: number;
    PageSize: number;
}

export interface PayrollDetailFilter {
    PayrollSummaryCode: string
    EmployeeName: string;
    PageNo: number;
    PageSize: number;
}

export interface PayrollSummary {
    payrollSummaryId: string;
    payrollSummaryCode: string;
    payrollMonth: string;
    totalWorkingDays: number;
    employeeCount: number;
    totalWorkingHours: number;
    totalLeaveHours: number;
    totalActualWorkingHours: number;
    totalBaseSalary: number;
    totalNetPay: number
}

export interface PayrollDetail {
    payrollId : string;
    payrollCode : string;
    employeeCode: string;
    employeeName: string;
    payrollDate: string;
    status: string;
    totalWorkingHour: number;
    totalLeaveHour: number;
    actualWorkingHour: number;
    baseSalary: number;
    allowance: number;
    deduction: number;
    grossPay: number;
    tax: number;
    bonus: number;
    netPay: number;
}