import { useDataStore } from "@/stores/useDataStore";

export type ApiEnvelope<T = unknown> = {
  isSuccess: boolean;
  isError: boolean;
  isValidationError: boolean;
  isSystemError: boolean;
  isDataError: boolean;
  isDuplicateRecord: boolean;
  isInvalidData: boolean;
  isNotFound: boolean;
  message: string | null;
  data: T | null;
};

export type DashboardStats = {
  todayAbsence: number;
  totalEmployee: number;
  totalProject: number;
};

export type AttendanceTypes = {
  label: string;
  present: number;
  absent: number;
  halfDayAbsent: number;
};

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
