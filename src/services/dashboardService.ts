import { useDataStore } from "@/stores/useDataStore";
import type { AttendanceTypes, DashboardStats } from "@/types/dashboardService";
import type { ApiEnvelope } from "@/types/project";

const asApi = <T = unknown>(x: unknown): ApiEnvelope<T> => x as ApiEnvelope<T>;

export const dashboardService = {
  fetchStatsCards: async (
    headers?: Record<string, string>
  ): Promise<ApiEnvelope<DashboardStats>> => {
    await useDataStore.getState().fetchData({
      endPoint: `/AdminDashboard/stats-cards`,
      headers,
    });

    const raw = useDataStore.getState().data as unknown;

    return asApi<DashboardStats>(raw);
  },

  fetchAttendanceLists: async (): Promise<ApiEnvelope<AttendanceTypes>> => {
    await useDataStore.getState().fetchData({
      endPoint: `/AdminDashboard/attendances-histogram/weekly`,
    });

    const raw = useDataStore.getState().data as unknown;

    return asApi<AttendanceTypes>(raw);
  },
};
