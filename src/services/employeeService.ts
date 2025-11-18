import { useDataStore } from "@/stores/useDataStore";
interface fetchData {
  name: string;
  pageNo: number;
  pageSize: number;
}
export const EmployeeService = {
  fetchEmployees: async (fetchData: fetchData) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Employee/list?EmployeeName=${fetchData.name}&PageNo=${fetchData.pageNo}&PageSize=${fetchData.pageSize}`,
    });
    return useDataStore.getState().data ?? {};
  },

  fetchRoles: async () => {
    await useDataStore.getState().fetchData({
      endPoint: `/Role/list`,
    });
    return useDataStore.getState().data ?? {};
  },

  createEmployee: async (payload: {}) => {
    await useDataStore.getState().fetchData({
      endPoint: "/Employee/create",
      method: "POST",
      body: payload,
    });
  },
  fetchEmployee: async (employeeCode: string) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Employee/edit/${employeeCode}`,
      method: "GET",
    });
    return useDataStore.getState().data ?? {};
  },
  updateEmployee: async (employeeCode: string, payload: {}) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Employee/update/${employeeCode}`,
      method: "PUT",
      body: payload,
    });
    return useDataStore.getState().data ?? {};
  },
  deleteEmployee: async (employeeCode: string) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Employee/delete/${employeeCode}`,
      method: "DELETE",
    });
    return useDataStore.getState().data ?? {};
  },
};
