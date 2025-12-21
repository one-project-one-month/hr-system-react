import { useDataStore } from "@/stores/useDataStore";
import type { fetchData } from "@/types/employee";

export const EmployeeService = {
  fetchEmployees: async (fetchData: fetchData) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Employee/list?EmployeeName=${fetchData.name}&PageNo=${fetchData.pageNo}&PageSize=${fetchData.pageSize}&RoleName=${fetchData.roleName}`,
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

  addEmployeeToProjects: async (projectCode: string, payload: {}) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/add-employee/${projectCode}`,
      method: "POST",
      body: payload,
    })
  },

  getAssignedEmployees: async (projectCode: string, pageNo: number, pageSize: number) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/{projectCode}/assigned-employees`,
      method: "GET",
    })

  },

  getUnassignedEmployees: async (projectCode: string, pageNo: number, pageSize: number) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/{projectCode}/unassigned-employees`,
      method: "GET",
    })
  },

  removeEmployeesFromProjects: async (projectCode: string, payload: {}) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Project/remove-employee/${projectCode}`,
      method: "POST",
      body: payload,
    })
  }
};
