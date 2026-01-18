import { useCallback, useEffect, useState } from "react";
import { Book, Briefcase, Calendar, Clock, DollarSign, LayoutDashboardIcon, LayoutTemplate, ListCheck, LogOut, Map, Menu, PanelTopOpen, UserRound, UsersRound } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { RoleService } from "@/services/roleService";
import { SidebarMenuItem } from "./sidebar-menuitems";
import type { MenuConfig } from "@/types/role-menu-permission";
import { LogoutConfirm } from "./logout-confirm";
import { dashboardRoutes, getRoute, leaveRoutes, payrollRoutes } from "@/lib/utils";

export default function Sidebar({ onClose }: { onClose: () => void }) {
    const authStore = useAuthStore();
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false)
    const menuPermissions = authStore.user?.menuTree?.menuTree;
    const role = authStore.user?.roleName?.toLowerCase();

    const dashboardRoute = getRoute(
        role,
        dashboardRoutes,
        "/employee/dashboard"
    );

    const leaveRoute = getRoute(
        role,
        leaveRoutes,
        "/leave/employee"
    );

    const payrollRoute = getRoute(
        role,
        payrollRoutes,
        "/payroll"
    );
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
                { label: "Menu Group", icon: <Menu />, path: "/menu-group", menuGroupCode: "MENU", menuItemCode : "MENU_GROUP" },
                { label: "Menu Item", icon: <PanelTopOpen />, path: "/menu-item", menuGroupCode: "MENU", menuItemCode : "MENU_ITEM" }],
        },
        { label: "Role & Menu Permission", icon: <UserRound />, menuGroupCode: "ROLE_MENU_PERMISSION", path: "/role-menu-permission", },
        { label: "Company Rules", icon: <Book />, menuGroupCode: "COMPANY_RULES", path: "/company-rules", },
        { label: "Employee", icon: <UsersRound />, menuGroupCode: "EMPLOYEE", path: "/employee", },
        {
            label: "Backlog Module", icon: <LayoutTemplate />, menuGroupCode: "BACKLOG",
            children: [
                { label: "Backlog", icon: <ListCheck />, path: "/backlog", menuGroupCode: "BACKLOG", menuItemCode : "BACKLOG"},
                { label: "Project", icon: <Briefcase />, path: "/project", menuGroupCode: "BACKLOG", menuItemCode : "PROJECT" }
            ],
        }, {
            label: "Attendance Module", icon: <Clock />, menuGroupCode: "ATTENDANCE",
            children: [
                { label: "Location", icon: <Map />, path: "/location", menuGroupCode: "ATTENDANCE", menuItemCode: "LOCATION" },
                { label: "Attendance", icon: <Clock />, path: "/attendance", menuGroupCode: "ATTENDANCE", menuItemCode: "ATTENDANCE" }],
        },
        { label: "Payroll", icon: <DollarSign />, menuGroupCode: "PAYROLL", path: payrollRoute },
        { label: "Leave", icon: <Calendar />, menuGroupCode: "LEAVE", path: leaveRoute, }];


    const toggleMenu = useCallback((key: string) => {
        setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const logoutConfirm = () => {
        setOpenLogoutConfirm(true)
    }

    const logOut = useCallback(async () => {
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

            <button onClick={logoutConfirm} className="sidebar-btn">
                <LogOut /> Logout
            </button>
            <LogoutConfirm open={openLogoutConfirm} onConfirm={logOut} onOpenChange={setOpenLogoutConfirm} />
        </div>
    );
}