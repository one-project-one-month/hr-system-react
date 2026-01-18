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
  const hasPermission =
    !item.menuGroupCode ||
    menuPermissions?.some(
      (m) => m.menuGroupCode === item.menuGroupCode && m.isChecked
    );
  console.log ('menu Permissions', menuPermissions)
  console.log ('item', item)
  if (!hasPermission) return null;

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
            className={`mt-2 transition-transform ${
              openMenus[item.label] ? "rotate-180" : ""
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
      className={`sidebar-btn ${
        isActive ? "bg-primary-500 text-natural-50" : ""
      }`}
    >
      {item.icon} {item.label}
    </Link>
  );
}