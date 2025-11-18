import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";
import { MenuItemService } from "@/services/menuItemService";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function MenuItemForm() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const { onConfirm, openDialog } = useSuccessDialogStore();
  const { code } = useParams<{ code: string }>();
  const [errorMessage, setErrorMessage] = useState("");
  // ZOD SCHEMA
  const menuItemSchema = z.object({
    menuGroupCode: z.string().min(1, "Menu Group is required"),
    menuCode: z.string().min(1, "Menu Code is required"),
    menuName: z.string().min(2, "Menu Name is required"),
    url: z.string().min(1, "URL is required"),
    icon: z.string().min(1, "Icon is required"),
    sortOrder: z.number().min(0, "Sort Order must be 0 or greater"),
  });

  const form = useForm<z.infer<typeof menuItemSchema>>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      menuCode: "",
      menuGroupCode: "",
      menuName: "",
      url: "",
      icon: "",
      sortOrder: 0,
    },
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!code) return;

      try {
        const menuItem = await MenuItemService.fetchMenuItem(code, token);
        // Reset the form with fetched values
        form.reset({
          menuGroupCode: menuItem.data.menuGroupCode ?? "",
          menuCode: code ?? "",
          menuName: menuItem.data.menuName ?? "",
          url: menuItem.data.url ?? "",
          icon: menuItem.data.icon ?? "",
          sortOrder: menuItem.data.sortOrder ?? 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchEmployeeData();
  }, [code, form]);

  const handleCancel = () => navigate("/management/admin/menu-item");

  const handleFormSubmit = async (values: z.infer<typeof menuItemSchema>) => {
    try {
      if (!token || !code) return;

      await MenuItemService.updateMenuItem({
        menuCode: code,
        token,
        payload: {
          menuGroupCode: values.menuGroupCode,
          menuName: values.menuName,
          icon: values.icon,
          url: values.url,
          sortOrder: values.sortOrder,
        },
      });

      openDialog("Menu Item updated successfully!", onConfirm);
      navigate("/management/admin/menu-item");
    } catch (error: any) {
      console.error("Error updating menu item:", error.message);
      setErrorMessage(
        error?.response?.data?.message || error.message || "Update failed"
      );
    }
  };

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div className="flex-1 p-6 bg-natural-100">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left text-primary-500">
        Menu Item Edit
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          onReset={onReset}
          className="space-y-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* MENU GROUP CODE */}
            <FormField
              control={form.control}
              name="menuGroupCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Group Code</FormLabel>
                  <FormControl>
                    <Input
                      className="border-natural-500 rounded-sm py-5"
                      placeholder="Enter menu group code"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* MENU NAME */}
            <FormField
              control={form.control}
              name="menuName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-natural-500 rounded-sm py-5"
                      placeholder="Enter menu name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      className="border-natural-500 rounded-sm py-5"
                      placeholder="Enter URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ICON */}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input
                      className="border-natural-500 rounded-sm py-5"
                      placeholder="Enter icon"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SORT ORDER */}
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input
                      className="border-natural-500 rounded-sm py-5"
                      type="number"
                      placeholder="Enter sort order"
                      {...field}
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
          )}

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <Button
              type="reset"
              variant="outline"
              className="w-full sm:w-auto text-primary-500"
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button type="submit" className="outline-btn">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
