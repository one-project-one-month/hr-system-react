export interface PayrollFilter {
    MonthYear: string;
    PageNo: number;
    PageSize: number;
}

export interface PayrollDetailFilter {
    PayrollSummaryCode: string
    EmployeeCode: string;
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

export interface PayrollSummaryEmployee {
    payrollMonth: string;
    payrollDate: string;
    actualWorkingHour: number;
    allowance: number;
    baseSalary: number;
    bonus: number;
    deduction: number;
    grossPay: number;
    leaveHour: number;
    netPay: number;
    payrollCode: string;
    status: string;
    tax: number;
    totalWorkingHour: number;
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