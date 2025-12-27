import { useDataStore } from "@/stores/useDataStore";

interface ReportRequest {
    format: string;
    reportType: string;
    reportName: string;
    reportRequest: {
        pageNo: number;
        pageSize: number;
        reportType: string;
        fromDate: string;
        toDate: string;
        item: string;
        isExport: boolean;
    };
}

export const exportReport = async (request: ReportRequest) => {
    return await useDataStore.getState().fetchData({
        method: "POST",
        endPoint: "/Report/export",
        body: request, // important for files
        responseType: "blob",
    });
};
