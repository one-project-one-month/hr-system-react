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
import { useNavigate } from "react-router-dom";
import { useSuccessDialogStore } from "@/stores/useSuccessDialogStore";
import { MenuItemService } from "@/services/menuItemService";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function MenuItemForm() {
  const navigate = useNavigate();
  const { onConfirm, openDialog } = useSuccessDialogStore();
  const token = useAuthStore((state) => state.token);
  const [menuGroups, setMenuItem] = useState([]);
  const fetchGroups = menuGroups || [];

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
      menuGroupCode: "",
      menuCode: "",
      menuName: "",
      url: "",
      icon: "",
      sortOrder: 0,
    },
  });

  // useEffect(() => {
  //   (async () => {
  //     const res = await MenuItemService.createMenuItem();
  //     setMenuItem(res.data.itmes || []);
  //   })();
  // }, []);

  const handleCancel = () => navigate("/management/admin/menu-item");

  const handleFormSubmit = async (values: z.infer<typeof menuItemSchema>) => {
    try {
      await MenuItemService.createMenuItem({ token, payload: values });
      openDialog("Menu Item created successfully!", onConfirm);
      navigate("/management/admin/menu-item");
    } catch (error) {
      console.error("Error creating menu item:", error);
    }
  };

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <div className="flex-1 p-6 bg-natural-100">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left text-primary-500">
        Menu Item Create
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* MENU CODE */}
            <FormField
              control={form.control}
              name="menuCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Code</FormLabel>
                  <FormControl>
                    <Input
                      className="border-natural-500 rounded-sm py-5"
                      placeholder="Enter menu code"
                      {...field}
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
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
