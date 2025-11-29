import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { MenuItemService } from "@/services/menuItemService";
import { useEffect, useState } from "react";

export default function MenuItemForm() {
  const navigate = useNavigate();
  const { code } = useParams();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);

  interface MenuItem {
    menuCode: string;
    menuGroupCode: string;
    menuName: string;
    url: string;
    icon: string;
  }
  useEffect(() => {
    const fetchMenuItemData = async () => {
      if (!code) return;
      try {
        const menuItem = await MenuItemService.fetchMenuItem(code);
        setMenuItem({
          menuCode: menuItem.data.menuCode ?? "",
          menuGroupCode: menuItem.data.menuGroupCode ?? "",
          menuName: menuItem.data.menuName ?? "",
          url: menuItem.data.url ?? "",
          icon: menuItem.data.icon ?? "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchMenuItemData();
  }, [code]);

  if (!menuItem) {
    return (
      <p className="p-6 text-center text-gray-500">
        No Menu Item data available.
      </p>
    );
  }

  const handleBack = () => navigate("/management/admin/menu-item");

  return (
    <div className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center sm:text-left text-primary-500">
        Menu Item Detail
      </h2>

      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Employee Code */}
          <div>
            <label className="block mb-1 font-medium text-sm">Menu Code</label>
            <Input
              className="border-natural-500 rounded-sm py-5"
              value={menuItem.menuCode}
              disabled
              readOnly
            />
          </div>

          {/* Username */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Menu Group Code
            </label>
            <Input
              className="border-natural-500 rounded-sm py-5"
              value={menuItem.menuGroupCode}
              disabled
              readOnly
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block mb-1 font-medium text-sm">Menu Name</label>
            <Input
              className="border-natural-500 rounded-sm py-5"
              value={menuItem.menuName}
              disabled
              readOnly
            />
          </div>
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-sm">URL</label>
            <Input
              className="border-natural-500 rounded-sm py-5"
              value={menuItem.url}
              disabled
              readOnly
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 font-medium text-sm">Icon</label>
            <Input
              className="border-natural-500 rounded-sm py-5"
              value={menuItem.icon}
              disabled
              readOnly
            />
          </div>
        </div>
        {/* Back button */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto text-white bg-primary-500"
            onClick={handleBack}
            type="button"
          >
            Back
          </Button>
        </div>
      </form>
    </div>
  );
}
