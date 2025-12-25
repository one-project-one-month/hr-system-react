import { useDataStore } from "@/stores/useDataStore";
import type { CreateLeaveInputs } from "@/schema/leave";

export const leaveService = {
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
};
