import { Link, useLocation } from "react-router-dom";
import {
  UsersRound,
  UserRound,
  LogOut,
  DollarSign,
  LayoutTemplate,
  Clock,
  ChevronUp,
  Map,
  ListCheck,
  Briefcase,
  Menu,
  LayoutDashboardIcon,
  PanelTopOpen,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import type { MenuConfig } from "@/types/role-menu-permission";

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const location = useLocation();
  const authStore = useAuthStore();
  const menuPermissions = authStore.user?.menuTree?.menuTree;

  const dashboardRoutes = {
    Administrator: "/admin/dashboard",
    "HR Specialist": "/hr/dashboard",
    Employee: "/employee/dashboard",
  } as const;

  const rawRole = authStore.user?.roleName;
  const dashboardRoute =
    rawRole && dashboardRoutes[rawRole as keyof typeof dashboardRoutes]
      ? dashboardRoutes[rawRole as keyof typeof dashboardRoutes]
      : "/employee/dashboard";

  const logOut = () => authStore.logout();

  // Track open/close state of all submenus
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuConfig: MenuConfig[] = [
    { label: "Dashboard", icon: <LayoutDashboardIcon />, menuGroupCode: "DASHBOARD", path: dashboardRoute },
    { label: "Role", icon: <UserRound />, menuGroupCode: "ROLE", path: "/role" },
    {
      label: "Menu",
      icon: <LayoutDashboardIcon />,
      menuGroupCode: "MENU",
      children: [
        { label: "Menu Group", icon: <Menu />, path: "/menu-group", menuGroupCode: "MENU" },
        { label: "Menu Item", icon: <PanelTopOpen />, path: "/menu-item", menuGroupCode: "MENU" },
      ],
    },
    { label: "Role & Menu Permission", icon: <UserRound />, menuGroupCode: "ROLE_MENU_PERMISSION", path: "/role-menu-permission" },
    { label: "Company Rules", icon: <UserRound />, menuGroupCode: "COMPANY_RULES", path: "/company-rules" },
    { label: "Employee", icon: <UsersRound />, menuGroupCode: "EMPLOYEE", path: "/employee" },
    {
      label: "Backlog Module",
      icon: <LayoutTemplate />,
      menuGroupCode: "BACKLOG",
      children: [
        { label: "Backlog", icon: <ListCheck />, path: "/backlog", menuGroupCode: "BACKLOG" },
        { label: "Project", icon: <Briefcase />, path: "/project", menuGroupCode: "BACKLOG" },
      ],
    },
    {
      label: "Attendance Module",
      icon: <Clock />,
      menuGroupCode: "ATTENDANCE",
      children: [
        { label: "Location", icon: <Map />, path: "/location", menuGroupCode: "ATTENDANCE" },
        { label: "Attendance", icon: <Clock />, path: "/attendance", menuGroupCode: "ATTENDANCE" },
      ],
    },
    { label: "Payroll", icon: <DollarSign />, menuGroupCode: "PAYROLL", path: "/payrollSummary" },
  ];

  // Recursive MenuItem component
  const MenuItem = ({ item }: { item: MenuConfig }) => {
    const hasPermission =
      !item.menuGroupCode ||
      menuPermissions?.some((m) => m.menuGroupCode === item.menuGroupCode && m.isChecked);

    if (!hasPermission) return null;

    if (item.children) {
      return (
        <div key={item.label} className="w-full">
          <div
            className="sidebar-btn flex w-full justify-between"
            onClick={() => toggleMenu(item.label)}
          >
            <span className="flex gap-1">
              {item.icon} {item.label}
            </span>
            <ChevronUp
              className={`mt-2 text-sm transition-transform ${openMenus[item.label] ? "rotate-180" : "rotate-0"
                }`}
              size={14}
            />
          </div>
          {openMenus[item.label] && (
            <div className="w-full ms-2 p-1!">
              {item.children.map((child) => (
                <MenuItem key={child.label} item={child} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.path!}
        onClick={onClose}
        className={`sidebar-btn ${location.pathname === item.path ? "bg-primary-500 text-natural-50" : ""}`}
      >
        {item.icon} {item.label}
      </Link>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {menuConfig.map((item) => (
        <MenuItem key={item.label} item={item} />
      ))}
      <button onClick={logOut} className="sidebar-btn">
        <LogOut /> Logout
      </button>
    </div>
  );
}
