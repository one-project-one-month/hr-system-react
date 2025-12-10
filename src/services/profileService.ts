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
  console.log (token)
  const response = await fetch(`/api/Employee/EditProfile`, {
    method: "POST", 
    body: payload,
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return await response.json();
}

};
