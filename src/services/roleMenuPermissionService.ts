import { useDataStore } from "@/stores/useDataStore";

export const roleMenuPermissionService = {

  fetchRoleMenuPermission: async (roleCode:string) => {
    await  useDataStore.getState().fetchData({
      endPoint: `/role-menu-permission/menu-tree?RoleCode=${roleCode}`,
    });
     return useDataStore.getState().data?.data.menuTree ?? [];
  },
  
  fetchRoles: async () => {
        await useDataStore.getState().fetchData({
            endPoint: `/Role/list`
        })
        return useDataStore.getState().data?.data ?? {}
    },
  fetchPermissions : async () => {
    await useDataStore.getState().fetchData({
      endPoint: '/role-menu-permission/permissions/list'
    })
    return useDataStore.getState().data?.data ?? {}
  },

  savePermissions: async (payload: {}) => {
    await useDataStore.getState().fetchData({
      endPoint: '/role-menu-permission/create',
      body: payload,
      method: 'POST'
    })
  }

};
