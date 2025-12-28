import { useDataStore } from "@/stores/useDataStore";

export const hrAttendanceReportService = {
  fetchHRAttendanceReport: async (date: string, dataView: number) => {
    const param = new URLSearchParams({
      date: date,
      dataView: dataView.toString()
    });
    await useDataStore.getState().fetchData({
      endPoint: `/hr-dashboard/attendance-overview?${param.toString()}`,
    });

    return useDataStore.getState().data ?? [];
  },
};
