import { useCallback, useEffect, useState } from "react";
import { Book, Briefcase, Calendar, Clock, DollarSign, LayoutDashboardIcon, LayoutTemplate, ListCheck, LogOut, Map, Menu, PanelTopOpen, UserRound, UsersRound } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { RoleService } from "@/services/roleService";
import { SidebarMenuItem } from "./sidebar-menuitems";
import type { MenuConfig } from "@/types/role-menu-permission";
export default function Sidebar({ onClose }: { onClose: () => void }) {
    const authStore = useAuthStore();
    const menuPermissions = authStore.user?.menuTree?.menuTree;
    const dashboardRoutes = {
        Administrator: "/admin/dashboard",
        admin: "/admin/dashboard",
        Admin: "/admin/dashboard",
        "HR Specialist": "/hr/dashboard",
        "HR": "/hr/dashboard",
        Employee: "/employee/dashboard",
    } as const;

    const leaveRoutes = {
        Employee: "/leave/employee",
        admin: "/leave/hr",
        Admin: "/leave/hr",
        Administrator: "/leave/hr",
        HR: "/leave/hr",
        "HR Specialist": "/leave/hr",
    };

    const payrollRoutes = {
        Employee: "/payroll",
        Administrator: "/payrollSummary",
        admin: "/payrollSummary",
        Admin: "/payrollSummary",
        "HR Specialist": "/payrollSummary",
        "HR": "/payrollSummary",
        "HR Manager": "/payrollSummary"
    }


    const rawRole = authStore.user?.roleName;
    const dashboardRoute = rawRole
        && dashboardRoutes[rawRole as keyof typeof dashboardRoutes]
        ? dashboardRoutes[rawRole as keyof typeof dashboardRoutes]
        : "/employee/dashboard";

    const payrollRoute = rawRole
        && payrollRoutes[rawRole as keyof typeof payrollRoutes]
        ? payrollRoutes[rawRole as keyof typeof payrollRoutes]
        : "/payroll"

    const leaveRoute = rawRole && leaveRoutes[rawRole as keyof typeof leaveRoutes]
        ? leaveRoutes[rawRole as keyof typeof leaveRoutes]
        : "/leave/employee";

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const menuConfig: MenuConfig[] =
        [{
            label: "Dashboard", icon: <LayoutDashboardIcon />,
            menuGroupCode: "DASHBOARD", path: dashboardRoute,
        },
        { label: "Role", icon: <UserRound />, menuGroupCode: "ROLE", path: "/role", },
        {
            label: "Menu", icon: <LayoutDashboardIcon />, menuGroupCode: "MENU",
            children: [
                { label: "Menu Group", icon: <Menu />, path: "/menu-group", menuGroupCode: "MENU", },
                { label: "Menu Item", icon: <PanelTopOpen />, path: "/menu-item", menuGroupCode: "MENU", }],
        },
        { label: "Role & Menu Permission", icon: <UserRound />, menuGroupCode: "ROLE_MENU_PERMISSION", path: "/role-menu-permission", },
        { label: "Company Rules", icon: <Book />, menuGroupCode: "COMPANY_RULES", path: "/company-rules", },
        { label: "Employee", icon: <UsersRound />, menuGroupCode: "EMPLOYEE", path: "/employee", },
        {
            label: "Backlog Module", icon: <LayoutTemplate />, menuGroupCode: "BACKLOG",
            children: [
                { label: "Backlog", icon: <ListCheck />, path: "/backlog", menuGroupCode: "BACKLOG", },
                { label: "Project", icon: <Briefcase />, path: "/project", menuGroupCode: "BACKLOG", }
            ],
        }, {
            label: "Attendance Module", icon: <Clock />, menuGroupCode: "ATTENDANCE",
            children: [
                { label: "Location", icon: <Map />, path: "/location", menuGroupCode: "ATTENDANCE" },
                { label: "Attendance", icon: <Clock />, path: "/attendance", menuGroupCode: "ATTENDANCE", }],
        },
        { label: "Payroll", icon: <DollarSign />, menuGroupCode: "PAYROLL", path: payrollRoute },
        { label: "Leave", icon: <Calendar />, menuGroupCode: "LEAVE", path: leaveRoute, }];

        
    const toggleMenu = useCallback((key: string) => {
        setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const logOut = useCallback(() => {
        authStore.logout();
    }, [authStore]);

    useEffect(() => {
        (async () => {
            const roles = await RoleService.fetchRoles({
                pageNo: 1,
                pageSize: 100,
                roleName: "",
            });
        })();
    }, []);

    return (
        <div className="flex flex-col items-center gap-1">
            {menuConfig.map((item) => (
                <SidebarMenuItem
                    key={item.label}
                    item={item}
                    openMenus={openMenus}
                    toggleMenu={toggleMenu}
                    menuPermissions={menuPermissions}
                    onClose={onClose}
                />
            ))}

            <button onClick={logOut} className="sidebar-btn">
                <LogOut /> Logout
            </button>
        </div>
    );
}