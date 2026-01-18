import { Link, useLocation } from "react-router-dom";
import { ChevronUp } from "lucide-react";
import type { MenuConfig } from "@/types/role-menu-permission";

type Props = {
  item: MenuConfig;
  openMenus: Record<string, boolean>;
  toggleMenu: (key: string) => void;
  menuPermissions?: {
    menuGroupCode: string;
    isChecked: boolean;
  }[];
  onClose: () => void;
};

export function SidebarMenuItem({
  item,
  openMenus,
  toggleMenu,
  menuPermissions,
  onClose,
}: Props) {
  const location = useLocation();

  const hasPermission = () => {
    if (!item.menuGroupCode) return true; // default allowed

    const group = menuPermissions?.find(g => g.menuGroupCode === item.menuGroupCode);
    if (!group) return false; // no permission → hide

    // If this menu has children
    if (item.children?.length) {
      // Only show if at least one child is checked
      return item.children.some(child =>
        group.childMenus?.some(c => c.menuItemCode === child.menuItemCode && c.isChecked)
      );
    }

    // Leaf menu (single item)
    if (item.menuItemCode) {
      // Only show if this specific menu item is checked
      return group.childMenus?.some(c => c.menuItemCode === item.menuItemCode && c.isChecked);
    }

    // Menu group without children and without menuItemCode
    return group.isChecked;
  };

  if (!hasPermission()) return null;

  const isActive =
    item.path && location.pathname === item.path;
  if (item.children) {
    return (
      <div className="w-full">
        <div
          className="sidebar-btn flex w-full justify-between"
          onClick={() => toggleMenu(item.label)}
        >
          <span className="flex gap-1">
            {item.icon} {item.label}
          </span>
          <ChevronUp
            size={14}
            className={`mt-2 transition-transform ${openMenus[item.label] ? "rotate-180" : ""
              }`}
          />
        </div>

        {openMenus[item.label] && (
          <div className="flex flex-col gap-1 w-full ms-2 p-1">
            {item.children.map((child) => (
              <SidebarMenuItem
                key={child.label}
                item={child}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                menuPermissions={menuPermissions}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.path!}
      onClick={onClose}
      className={`sidebar-btn ${isActive ? "bg-primary-500 text-natural-50" : ""
        }`}
    >
      {item.icon} {item.label}
    </Link>
  );
}