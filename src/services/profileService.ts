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
    method: "POST", // or "PUT"
    body: payload,   // FormData with all fields + file
    headers: {
      // Authorization header if needed
      "Authorization": `Bearer ${token}`
      // Do NOT set 'Content-Type'; the browser sets it automatically for FormData
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return await response.json();
}

};
