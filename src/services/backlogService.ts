import { useDataStore } from "@/stores/useDataStore";
import type { ListFilter } from "@/types/backlog";

export const backlogService = {
  fetchTasks: async (name: string = "", pageNo: number, pageSize: number) => {
    const params = new URLSearchParams({
      pageNo: pageNo.toString(),
      PageSize: pageSize.toString(),
    });

    if (name) {
      params.append("TaskName", name);
    }

    await useDataStore.getState().fetchData({
      endPoint: `/Task/list?${params.toString()}`,
    });
    return useDataStore.getState().data ?? {};
  },
  fetchByEmpCode: async (empCode:string, listFilter: ListFilter) => {
    const params = new URLSearchParams({
      pageNo: listFilter.pageNo.toString(),
      PageSize: listFilter.pageSize.toString(),
    });

    if (listFilter.name) {
      params.append("TaskName", listFilter.name);
    }

    await useDataStore.getState().fetchData({
      endPoint: `/Task/list/${empCode}?${params.toString()}`,
    });
    return useDataStore.getState().data ?? {};
  },

  deleteTask: async (taskId: number) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Task/delete?taskId=${taskId}`,
      method: "DELETE",
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

  updateTask: async (payload: any) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Task/update`,
      method: "PUT",
      body: payload,
    });
    return useDataStore.getState().data ?? { isSuccess: false };
  },
};
