import { useDataStore } from "@/stores/useDataStore";
import type { CreateLeaveInputs } from "@/schema/leave";
import type { LeaveList } from "@/types/leave";

export const leaveService = {
  getLeaves: async (LeaveFilter: LeaveList) => {
    await useDataStore
      .getState()
      .fetchData({
        endPoint: `/Leave/list?Query=${LeaveFilter.Query}&LeaveType=${LeaveFilter.LeaveType}&PageNo=${LeaveFilter.PageNo}&PageSize=${LeaveFilter.PageSize}`,
      });
    return useDataStore.getState().data;
  },

  createLeave: async (data: CreateLeaveInputs) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Leave/create`,
      method: "POST",
      body: data,
    });
    return useDataStore.getState().data;
  },

  checkLeaveAvailability: async (leaveType: string) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Leave/check-leave-available`,
      method: "POST",
      body: { leaveType },
    });
    return useDataStore.getState().data;
  },

  approveLeave: async (leaveCode: string) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Leave/approve-leave`,
      method: "POST",
      body: { leaveCode },
    });
    return useDataStore.getState().data;
  },

  rejectLeave: async (leaveCode: string) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Leave/reject-leave`,
      method: "POST",
      body: { leaveCode },
    });
    return useDataStore.getState().data;
  },
};
