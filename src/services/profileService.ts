import { useDataStore } from "@/stores/useDataStore";
import { useAuthStore } from "@/stores/useAuthStore";

const { token } = useAuthStore.getState(); // or use the hook inside a component

export const ProfileService = {
  fetchEmployee: async (employeeCode: string) => {
    await useDataStore.getState().fetchData({
      endPoint: `/Employee/profile/${employeeCode}`,
      method: "GET",
    });
    return useDataStore.getState().data ?? {};
  },
 updateEmployee: async (payload: FormData) => {
  const response = await useDataStore.getState().fetchData({
    endPoint: `/Employee/EditProfile`,
    method: "POST", 
    body: payload
    // headers: {
    //   "Authorization": `Bearer ${token}`
    // },
  });
  return response
}

};
