import { useDataStore } from "@/stores/useDataStore";
import type { listParams } from "@/types/role";

export const RoleService = {

    fetchRoles: async (
        params: listParams
    ) => {
        await useDataStore.getState().fetchData({
            endPoint: `/Role/list?RoleName=${params.roleName}&PageNo=${params.pageNo}&PageSize=${params.pageSize}`
        })
        return useDataStore.getState().data;
    },

    createRole: async (payload: {}) => {
        await useDataStore.getState().fetchData({
            endPoint: "/Role/create",
            method: "POST",
            body: payload,
        });
    },
    fetchRole: async (roleCode: string) => {
        await useDataStore.getState().fetchData({
            endPoint: `/Role/edit/${roleCode}`,
            method: "GET",
        });
        return useDataStore.getState().data ?? {};
    },
    updateRole: async (roleCode: string, payload: {}) => {
        await useDataStore.getState().fetchData({
            endPoint: `/Role/update/${roleCode}`,
            method: "PUT",
            body: payload,
        });
        return useDataStore.getState().data ?? {};
    },
    deleteRole: async (roleCode: string) => {
        await useDataStore.getState().fetchData({
            endPoint: `/Role/delete/${roleCode}`,
            method: "DELETE",
        });
        return useDataStore.getState().data ?? {};
    },

}