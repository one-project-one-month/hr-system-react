import type { dateFilter } from "@/schema/attendance";
import { useDataStore } from "@/stores/useDataStore";


export const attendanceService = {

  fetchAttendanceRecords: async (name: string = "", date: dateFilter, pageNo: number = 1, pageSize: number = 100) => {
    const param = new URLSearchParams({
      "EmpName": name,
      "pageNo": pageNo.toString(),
      "pageSize": pageSize.toString()
    })

    if (date.from && date.to) {
      param.append("startDate", date.from.toDateString())
      param.append("endDate", date.to.toDateString())
    }

    await useDataStore.getState().fetchData({
      endPoint: `/Attendance/AttendanceList?${param.toString()}`,
    });
    return useDataStore.getState().data?.data?.attendanceList ?? [];
  },

  fetchByCode: async (empCode: string = "", date: dateFilter, pageNo: number = 1, pageSize: number = 100) => {
    const param = new URLSearchParams({
      "pageNo": pageNo.toString(),
      "pageSize": pageSize.toString()
    })

    if (date.from && date.to) {
      param.append("startDate", date.from.toDateString())
      param.append("endDate", date.to.toDateString())
    }

    await useDataStore.getState().fetchData({
      endPoint: `/Attendance/AttendanceList/${empCode}?${param.toString()}`,
    });
    return useDataStore.getState().data?.data?.attendanceList ?? [];
  },

  createAttendanceRecord: async (data: any) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Attendance/AttendanceCreate`,
      method: "POST",
      body: data,
    });
    return useDataStore.getState().data?.data ?? [];
  },

  updateAttendanceRecord: async (data: any) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Attendance/AttendanceUpdate`,
      method: "PUT",
      body: data,
    });
  },

  editAttendanceRecord: async (code: string) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Attendance/edit/${code}`,
      method: "GET",
    });
    return useDataStore.getState().data?.data ?? [];
  },

  deleteAttendanceRecord: async (code: string) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Attendance/delete/${code}`,
      method: "DELETE",
      body: { attendanceCode: code },
    });
    return useDataStore.getState().data?.data ?? [];
  },
};