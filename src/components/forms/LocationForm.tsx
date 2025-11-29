import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LocationFormProps } from "@/types/location";
import { formSchema } from "@/schema/location";


export function LocationForm({
  mode,
  locationData,
  onSubmit: handleSubmit,
  onCancel,
  onBack,
  error,
}: LocationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
      radius: "",
    },
  });

  // Reset form when locationData changes
  useEffect(() => {
    if (locationData) {
      form.reset({
        name: locationData.name || "",
        latitude: locationData.latitude || "",
        longitude: locationData.longitude || "",
        radius: locationData.radius || "",
      });
    }
  }, [locationData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleSubmit?.(values);
  };

  const isReadOnly = mode === "detail";
  const title =
    mode === "add"
      ? "Add New Location"
      : mode === "edit"
        ? "Edit Location"
        : "Location Detail";

  return (
    <div className="bg-[#f0f3f1] w-full">
      <div className="w-full mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {error && (
          <div className="text-red-500 mb-4">
            {error || "Name Already exist"}
          </div>
        )}

        {isReadOnly ? (
          // Read-only view
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-30">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Name</label>
              <div className="px-3 py-3  bg-[#ced6d2] rounded-md text-gray-700">
                {locationData?.name}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Latitude</label>
              <div className="px-3 py-3  bg-[#ced6d2] rounded-md text-gray-700">
                {locationData?.latitude}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Longitude</label>
              <div className="px-3 py-3  bg-[#ced6d2] rounded-md text-gray-700">
                {locationData?.longitude}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Radius</label>
              <div className="px-3 py-3  bg-[#ced6d2] rounded-md text-gray-700">
                {locationData?.radius}
              </div>
            </div>
          </div>
        ) : (
          // Editable form
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-30">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          className="py-6 bg-[#fafafa] border-none"
                          placeholder={
                            mode === "add" ? "Enter Location Name" : ""
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="py-6 bg-[#fafafa] border-none"
                          placeholder={
                            mode === "add"
                              ? "Enter latitude (e.g. 16.9661)"
                              : ""
                          }
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="py-6 bg-[#fafafa] border-none"
                          placeholder={
                            mode === "add"
                              ? "Enter longitude (e.g. 96.1951)"
                              : ""
                          }
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="radius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Radius</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          className="py-6 bg-[#fafafa] border-none"
                          placeholder={
                            mode === "add"
                              ? "Enter radius in kilometers (eg.3.5)"
                              : ""
                          }
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  className="outline-btn"
                  onClick={onCancel}
                >
                  CANCEL
                </Button>
                <Button type="submit" className="outline-btn">
                  {mode === "add" ? "CREATE" : "UPDATE"}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Back button for detail view */}
        {isReadOnly && (
          <div className="flex justify-end mt-6">
            <Button type="button" className="outline-btn" onClick={onBack}>
              BACK
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
