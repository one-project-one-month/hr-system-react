import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, CircleUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ProfileService } from "@/services/profileService";
import { profileSchema } from "@/schema/profile";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SuccessDialog } from "@/components/ui/custom/success-dialogue";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const { open, description, onConfirm, closeDialog, openDialog } =
    useSuccessDialogStore();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profileImage: undefined,
      employeeCode: "",
      username: "",
      name: "",
      email: "",
      phoneNo: "",
      gender: ""
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
          name: employeeData.name ?? "",
          email: employeeData.email ?? "",
          phoneNo: employeeData.phoneNo ?? "",
          gender: employeeData.gender ?? ""
        });
        if (employeeData.profileImage) {
          setProfileImageFile(employeeData.profileImage);
          const BASE_URL = import.meta.env.VITE_API_URL;
          const imageUrl = employeeData.profileImage
      ? `${BASE_URL}${employeeData.profileImage.replaceAll("\\", "/")}`
      : "";

    setProfileImagePreview(imageUrl);

          setProfileImageFile(null);

        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployeeData();
  }, [user?.employeeCode]);

  // ✅ Submit handler
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const formData = new FormData();

      formData.append("employeeCode", values.employeeCode);
      formData.append("username", values.username);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phoneNo", values.phoneNo);
      if (values.gender) formData.append("gender", values.gender);

      // append the file only if selected
      if (profileImageFile) {
        formData.append("ProfileImage", profileImageFile);
      }
      await ProfileService.updateEmployee(formData);
      openDialog("Update Profile successful!", onConfirm);

    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  // ✅ Handle image change (preview)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setProfileImagePreview(reader.result as string);;
    reader.readAsDataURL(file);
  };

  // ✅ Cancel button handler
  const handleCancel = () => navigate("/employee");

  const handleSuccessConfirm = () => {
    if (onConfirm) onConfirm();
    closeDialog();
  };

  return (
    <div className="min-h-screen w-full bg-[#ced6d2] flex items-center justify-center px-5 py-5">
      <div className="bg-[#E8EDEB] rounded-2xl shadow-lg p-8 md:px-20 md:py-10 w-full h-full">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center md:items-start mb-8">
          <div className="relative">
            <div className="size-[150px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
              {profileImagePreview ? (<img
                src={profileImagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />) :
                (<CircleUser className="w-20 h-20" />)
              }
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ""}
                    onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
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
            <Button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="primary-btn"
            >
              Save changes
            </Button>
          </div>
        </form>
      </div>
      <SuccessDialog
        open={open}
        onOpenChange={closeDialog}
        onConfirm={handleSuccessConfirm}
        description={description}
      />
    </div>
  );
}
