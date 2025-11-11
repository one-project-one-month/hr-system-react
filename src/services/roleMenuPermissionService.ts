import { useDataStore } from "@/stores/useDataStore";

export const roleMenuPermissionService = {

  fetchRoles: async () => {
    await  useDataStore.getState().fetchData({
      endPoint: `/Role/list`,
    });
     return useDataStore.getState().data?.data ?? [];
  },

  fetchMenus: async () => {
    await useDataStore.getState().fetchData({
      endPoint: `/Menu/list`,
    });
    console.log (useDataStore.getState().data)
    return useDataStore.getState().data?.data ?? [];
  },
};
