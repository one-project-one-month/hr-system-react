import { useDataStore } from "@/stores/useDataStore";

export const backlogService = {
  fetchTasks: async (pageNo: number = 1, pageSize: number = 10) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Task/list?pageNo=${pageNo}&pageSize=${pageSize}`,
    });
    return useDataStore.getState().data?.data ?? { tasks: [] };
  },

  deleteTask: async (taskId: number) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Task/delete?taskId=${taskId}`,
      method: "POST",
    });
    return useDataStore.getState().data ?? { isSuccess: false };
  },

  fetchTaskById: async (taskId: string | number) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Task/edit?taskId=${taskId}`,
    });
    return useDataStore.getState().data ?? { isSuccess: false, data: null };
  },
  fetchEmployees: async (pageNo = 1, pageSize = 100) => {
  await useDataStore.getState().fetchData({
    endPoint: `/Employee/list?pageNo=${pageNo}&pageSize=${pageSize}`,
  });
  const storeData = useDataStore.getState().data;
  
  // If data is directly in store.data (not store.data.data)
  return storeData ?? { items: [] };
},

  fetchProjects: async (pageNo = 1, pageSize = 100) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/list?pageNo=${pageNo}&pageSize=${pageSize}`,
    });
    return useDataStore.getState().data?.data ?? { items: [] };
  },

  createTask: async (payload: any) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Task/create`,
      method: "POST",
      body: payload,
    });
    return useDataStore.getState().data ?? { isSuccess: false };
  },
};
