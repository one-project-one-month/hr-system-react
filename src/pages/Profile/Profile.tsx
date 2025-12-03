import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ProfileService } from "@/services/profileService";
import { profileSchema } from "@/schema/profile";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [profileImage, setProfileImage] = useState<string>(
    "./public/image/profile-img.jpg"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profileImage: "",
      employeeCode: "",
      username: "",
      name: "",
      roleName: "",
      email: "",
      phoneNo: "",
    },
  });

  // ✅ Fetch employee data from service
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user?.employeeCode) return;
      try {
        const result = await ProfileService.fetchEmployee(user?.employeeCode);
        const employeeData = Array.isArray(result) ? result[0] : result;
        if (!employeeData) return;
        // populate form values using react-hook-form and update preview image
        reset({
          profileImage: employeeData.profileImage ?? "",
          employeeCode: employeeData.employeeCode ?? "",
          username: employeeData.username ?? "",
          roleName: employeeData.roleName ?? "",
          name: employeeData.name ?? "",
          email: employeeData.email ?? "",
          phoneNo: employeeData.phoneNo ?? "",
        });
        // if (employeeData.profileImage) {
        //   setProfileImage(employeeData.profileImage);
        // }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployeeData();
  }, [user?.employeeCode]);

  // ✅ Submit handler
  const onSubmit = async () => {
    try {
      // await ProfileService.updateProfile(data); // You can define this method in your service
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("❌ Failed to update profile. Please try again.");
    }
  };

  // ✅ Handle image change (preview)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Cancel button handler
  const handleCancel = () => navigate("/employee");

  return (
    <div className="min-h-screen w-full bg-[#ced6d2] flex items-center justify-center px-5 py-5">
      <div className="bg-[#E8EDEB] rounded-2xl shadow-lg p-8 md:px-20 md:py-10 w-full h-full">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center md:items-start mb-8">
          <div className="relative">
            <div className="size-[150px] rounded-full overflow-hidden bg-yellow-500">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label
              htmlFor="photo-upload"
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50"
            >
              <Camera className="w-5 h-5 text-gray-700" />
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ✅ Form Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-6">
            {/* Employee Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee Code
              </label>
              <Input
                {...register("employeeCode")}
                type="text"
                disabled
                readOnly
                className={`w-full px-4 py-2 border rounded-md bg-[#FAFBFB] ${errors.employeeCode ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.employeeCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.employeeCode.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <Input
                {...register("username")}
                type="text"
                className={`w-full px-4 py-2 border rounded-md bg-[#FAFBFB] ${errors.username ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Role Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name
              </label>
              <Input
                {...register("roleName")}
                type="text"
                disabled
                readOnly
                className={`w-full px-4 py-2 border rounded-md bg-[#FAFBFB] ${errors.roleName ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.roleName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.roleName.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <Input
                {...register("name")}
                type="text"
                className={`w-full px-4 py-2 border rounded-md bg-[#FAFBFB] ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-2 border rounded-md bg-[#FAFBFB] ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <Input
                {...register("phoneNo")}
                type="tel"
                className={`w-full px-4 py-2 border rounded-md bg-[#FAFBFB] ${errors.phoneNo ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.phoneNo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNo.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="outline-btn px-6 py-2 rounded-lg border-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 pagination-btn rounded-lg"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
