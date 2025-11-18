import { useDataStore } from "@/stores/useDataStore";
interface fetchData {
  token: string | null;
  name: string;
  pageNo: number;
  pageSize: number;
}

interface updateMenu {
  token: string | null;
  menuCode: string;
  payload: {
    menuGroupCode: string;
    menuName: string;
    url: string;
    icon: string;
    sortOrder: number;
  };
}

interface createMenu {
  payload: {
    menuGroupCode: string;
    menuName: string;
    url: string;
    icon: string;
    sortOrder: number;
  };
  token: string | null;
}
export const MenuItemService = {
  fetchMenuItems: async (data: fetchData) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Menu/list?MenuName=${data.name}&PageNo=${data.pageNo}&PageSize=${data.pageSize}`,
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    return useDataStore.getState().data ?? {};
  },

  fetchRoles: async () => {
    await useDataStore.getState().fetchData({
      endPoint: `/Role/list`,
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    return useDataStore.getState().data ?? {};
  },

  createMenuItem: async (data: createMenu) => {
    await useDataStore.getState().fetchData({
      endPoint: "/Menu/create",
      method: "POST",
      body: data.payload,
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
  },
  fetchMenuItem: async (menuCode: string, token: string | null) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Menu/edit/${menuCode}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return useDataStore.getState().data ?? {};
  },
  updateMenuItem: async (data: updateMenu) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Menu/update/${data.menuCode}`,
      method: "PUT",
      body: data.payload,
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });
    return useDataStore.getState().data ?? {};
  },
  deleteMenuItem: async (menuCode: string, token: string | null) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Menu/delete/${menuCode}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return useDataStore.getState().data ?? {};
  },
};
