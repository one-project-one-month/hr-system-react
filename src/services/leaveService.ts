import { useDataStore } from "@/stores/useDataStore";
import type { CreateLeaveInputs } from "@/schema/leave";

export const leaveService = {
  getLeaves: async (pageNo: number, pageSize: number) => {
    await useDataStore
      .getState()
      .fetchData({
        endPoint: `/Leave/list?PageNo=${pageNo}&PageSize=${pageSize}`,
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
