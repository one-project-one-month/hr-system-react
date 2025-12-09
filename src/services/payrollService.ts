import { useDataStore } from "@/stores/useDataStore";
import type { PayrollFilter } from "@/types/payrollFilter";

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
    }
}