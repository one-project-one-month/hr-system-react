import { useDataStore } from "@/stores/useDataStore";
import type { PayrollFilter, PayrollDetailFilter } from "@/types/payroll";

export const PayrollService = {
    fetchPayrollSummary: async (payrollFilter: PayrollFilter) => {
        await useDataStore.getState().fetchData({
            endPoint: `/Payroll/summary-list?MonthYear=${payrollFilter.MonthYear}&PageNo=${payrollFilter.PageNo}&PageSize=${payrollFilter.PageSize}`,
            method: "GET",
        });
        return useDataStore.getState().data ?? {};
    },
    processPayroll: async (payload: {}) => {
        await useDataStore.getState().fetchData({
            endPoint: `/Payroll/process`,
            method: "POST",
            body: payload
        });
        return useDataStore.getState().data ?? {};
    },
    monthDetailList: async (payrollDetailFilter: PayrollDetailFilter) => {
        await useDataStore.getState().fetchData({
            endPoint: `/Payroll/month-detail-list?PayrollSummaryCode=${payrollDetailFilter.PayrollSummaryCode}&EmployeeCode=${payrollDetailFilter.EmployeeName}&PageNo=${payrollDetailFilter.PageNo}&PageSize=${payrollDetailFilter.PageSize}`,
            method: "GET",
        })
        return useDataStore.getState().data.data.items ?? []
    },
    fetchPayrollListEmployee : async (payrollFilter: PayrollFilter) =>  {
        await useDataStore.getState().fetchData({
            endPoint: `/Payroll/list/employee?MonthYear=${payrollFilter.MonthYear}&PageNo=${payrollFilter.PageNo}&PageSize=${payrollFilter.PageSize}`,
            method:"GET"
        })
        return useDataStore.getState().data.data.items ?? []
    }

}