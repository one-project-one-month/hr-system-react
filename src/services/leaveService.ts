import { useDataStore } from "@/stores/useDataStore";
import type { CreateLeaveInputs } from "@/schema/leave";
import type { LeaveList } from "@/types/leave";

const formatAndWrapPayload = (data: CreateLeaveInputs) => {
  const formattedData = {
    ...data,
    fromDate: new Date(data.fromDate).toISOString().split("T")[0],
    toDate: new Date(data.toDate).toISOString().split("T")[0],
  };

  return formattedData;
};

export const leaveService = {
  getLeaves: async (LeaveFilter: LeaveList) => {
    return await useDataStore.getState().fetchData({
      endPoint: `/Leave/list?Query=${LeaveFilter.Query}&LeaveType=${LeaveFilter.LeaveType}&PageNo=${LeaveFilter.PageNo}&PageSize=${LeaveFilter.PageSize}`,
    });
  },

  getEmployeeLeaves: async () => {
    return await useDataStore
      .getState()
      .fetchData({ endPoint: `/Leave/list-for-employee` });
  },

  createLeave: async (data: CreateLeaveInputs) => {
    const payload = formatAndWrapPayload(data);
    return await useDataStore.getState().fetchData({
      endPoint: `/Leave/create`,
      method: "POST",
      body: payload,
    });
  },

  checkLeaveAvailability: async (leaveType: string) => {
    return await useDataStore.getState().fetchData({
      endPoint: `/Leave/check-leave-available`,
      method: "POST",
      body: { leaveType },
    });
  },

  approveLeave: async (leaveCode: string) => {
    return await useDataStore.getState().fetchData({
      endPoint: `/Leave/approve-leave`,
      method: "POST",
      body: { leaveCode },
    });
  },

  rejectLeave: async (leaveCode: string) => {
    return await useDataStore.getState().fetchData({
      endPoint: `/Leave/reject-leave`,
      method: "POST",
      body: { leaveCode },
    });
  },

  updateLeave: async (leaveCode: string, data: CreateLeaveInputs) => {
    const payload = formatAndWrapPayload(data);
    return await useDataStore.getState().fetchData({
      endPoint: `/Leave/update/${leaveCode}`,
      method: "PUT",
      body: payload,
    });
  },

  deleteLeave: async (leaveCode: string) => {
    return await useDataStore.getState().fetchData({
      endPoint: `/Leave/delete/${leaveCode}`,
      method: "DELETE",
    });
  },

  getLeaveByCode: async (leaveCode: string) => {
    return await useDataStore.getState().fetchData({
      endPoint: `/Leave/edit/${leaveCode}`,
    });
  },

  getLeaveBalance: async (year: number) => {
      return await useDataStore.getState().fetchData({
        endPoint: `/Leave/leave-balance/${year}`
      })
  }
};
