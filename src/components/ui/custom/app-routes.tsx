import type { JSX } from "react";
import CreateRole from "@/pages/Admin/Role/CreatetRole";
import Role from "@/pages/Admin/Role/Role";
import UpdateRole from "@/pages/Admin/Role/UpdateRole";
import ViewRole from "@/pages/Admin/Role/ViewRole";

// Backlog
import { BacklogCreate } from "@/pages/Backlog/Create";
import { BacklogDetail } from "@/pages/Backlog/Detail";
import { BacklogEdit } from "@/pages/Backlog/Edit";
import Backlog from "@/pages/Backlog/Index";

// layout and dashboard
import HRDashboard from "@/pages/Dashboard/HRDashboard";

// location
import Location from "@/pages/Attendance/Location/Index";
import LocationCreate from "@/pages/Attendance/Location/LocationCreate";
import LocationDetail from "@/pages/Attendance/Location/LocationDetail";
import LocationEdit from "@/pages/Attendance/Location/LocationEdit";

// attendance
import { CreateAttendance } from "@/pages/Attendance/Create";
import { AttendanceList } from "@/pages/Attendance/Index";
import { UpdateAttendance } from "@/pages/Attendance/Edit";
import { DetailsAttendance } from "@/pages/Attendance/Detail";

// Payroll
import Payroll from "@/pages/Payroll/Payroll";
import PayrollDetail from "@/pages/Payroll/PayrollDetail";

// menu Group
import MenuGroupList from "@/pages/Admin/MenuGroup/Index";
import MenuGroupCreate from "@/pages/Admin/MenuGroup/Create";
import MenuGroupEdit from "@/pages/Admin/MenuGroup/Edit";

// menu item
import MenuItemCreate from "@/pages/Admin/MenuGroup/MenuItem/Create";
import MenuItemEdit from "@/pages/Admin/MenuGroup/MenuItem/Edit";
import MenuItemList from "@/pages/Admin/MenuGroup/MenuItem/Index";
import MenuItemDetail from "@/pages/Admin/MenuGroup/MenuItem/Detail";

// project
import ProjectList from "@/pages/Backlog/Project/Index";
import { ProjectCreate } from "@/pages/Backlog/Project/ProjectCreate";
import { ProjectDetails } from "@/pages/Backlog/Project/ProjectDetails";
import { ProjectEdit } from "@/pages/Backlog/Project/ProjectEdit";

//Add Employee
import { AddEmployee } from "@/pages/Backlog/Project/AddEmployee";
import { RemoveEmployee } from "@/pages/Backlog/Project/RemoveEmployee";

// employee
import EmployeeCreate from "@/pages/Employee/EmployeeCreate";
import EmployeeDetail from "@/pages/Employee/EmployeeDetail";
import EmployeeEdit from "@/pages/Employee/EmployeeEdit";
import EmployeeList from "@/pages/Employee/Index";

// company rules
import { CompanyRulesList } from "@/pages/Admin/CompanyRules";
import Profile from "@/pages/Profile/Profile";

//dashboards
import { RoleMenuTreeViewCreate } from "@/pages/Admin/Role-Menu-Permission/Create";
import AdminDashboard from "@/pages/Dashboard/AdminDashboard";
import EmployeeDashboard from "@/pages/Dashboard/EmployeeDashboard";
import type { AppRoute } from "@/types/appRoutes";
import Unauthorized from "@/pages/Unauthorized";
import { CompanyRulesEdit } from "@/pages/Admin/CompanyRules/Edit";

export const routes: AppRoute[] = [
    // Menu Group 
    {
        path: "/menu-group",
        element: <MenuGroupList />,
        permission: { menuCode: "MENU_GROUP", permissionCode: "LIST" },
    },
    {
        path: "/menu-group/create",
        element: <MenuGroupCreate />,
        permission: { menuCode: "MENU_GROUP", permissionCode: "CREATE" },
    },
    {
        path: "/menu-group/edit/:id",
        element: <MenuGroupEdit />,
        permission: { menuCode: "MENU_GROUP", permissionCode: "UPDATE" },
    },

    // Menu Item
    {
        path: "/menu-item",
        element: <MenuItemList />,
        permission: { menuCode: "MENU_ITEM", permissionCode: "LIST" },
    },
    {
        path: "/menu-item/create",
        element: <MenuItemCreate />,
        permission: { menuCode: "MENU_ITEM", permissionCode: "CREATE" },
    },
    {
        path: "/menu-item/edit/:code",
        element: <MenuItemEdit />,
        permission: { menuCode: "MENU_ITEM", permissionCode: "UPDATE" },
    },
    {
        path: "/menu-item/detail/:code",
        element: <MenuItemDetail />,
        permission: { menuCode: "MENU_ITEM", permissionCode: "DETAIL" },
    },

    // Company Rules
    {
        path: "/company-rules",
        element: <CompanyRulesList />,
        permission: { menuCode: "COMPANY_RULES", permissionCode: "LIST" },

    },
    {
        path: "/company-rules/update",
        element: <CompanyRulesEdit />,
        permission: { menuCode: "COMPANY_RULES", permissionCode: "UPDATE" },

    },

    // Roles
    {
        path: "/role",
        element: <Role />,
        permission: { menuCode: "ROLE", permissionCode: "LIST" },
    },
    {
        path: "/role/create",
        element: <CreateRole />,
        permission: { menuCode: "ROLE", permissionCode: "CREATE" },
    },
    {
        path: "/role/update",
        element: <UpdateRole />,
        permission: { menuCode: "ROLE", permissionCode: "UPDATE" },
    },
    {
        path: "/role/view",
        element: <ViewRole />,
        permission: { menuCode: "ROLE", permissionCode: "DETAIL" },
    },
    {
        path: "/role-menu-permission",
        element: <RoleMenuTreeViewCreate />,
        permission: { menuCode: "ROLE", permissionCode: "PERMISSION" },
    },

    // Dashboards
    {
        path: "/hr/dashboard",
        element: <HRDashboard />,
        permission: { menuCode: "DASHBOARD", permissionCode: "" },
    },
    {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
        permission: { menuCode: "DASHBOARD", permissionCode: "" },
    },
    {
        path: "/employee/dashboard",
        element: <EmployeeDashboard />,
        permission: { menuCode: "DASHBOARD", permissionCode: "" },
    },

    // Backlog
    {
        path: "/backlog",
        element: <Backlog />,
        permission: { menuCode: "BACKLOG", permissionCode: "LIST" },

    },
    {
        path: "/backlog/:id",
        element: <BacklogDetail />,
        permission: { menuCode: "BACKLOG", permissionCode: "DETAILS" },

    },
    {
        path: "/backlog/create",
        element: <BacklogCreate />,
        permission: { menuCode: "BACKLOG", permissionCode: "CREATE" },

    },
    {
        path: "/backlog/edit/:id",
        element: <BacklogEdit />,
        permission: { menuCode: "BACKLOG", permissionCode: "EDIT" },
    },

    // Projects
    {
        path: "/project",
        element: <ProjectList />,
        permission: { menuCode: "PROJECT", permissionCode: "LIST" },
    },
    {
        path: "/projects/new",
        element: <ProjectCreate />,
        permission: { menuCode: "PROJECT", permissionCode: "CREATE" },
    },
    {
        path: "/projects/:id",
        element: <ProjectDetails />,
        permission: { menuCode: "PROJECT", permissionCode: "DETAILS" },
    },
    {
        path: "/projects/:id/edit",
        element: <ProjectEdit />,
        permission: { menuCode: "PROJECT", permissionCode: "EDIT" },
    },
    {
        path: "/projects/add-employee",
        element: <AddEmployee />,
        permission: { menuCode: "PROJECT", permissionCode: "EDIT" },
    },
    {
        path: "/projects/remove-employee",
        element: <RemoveEmployee />,
        permission: { menuCode: "PROJECT", permissionCode: "EDIT" },
    },

    // Location
    {
        path: "/location",
        element: <Location />,
        permission: { menuCode: "LOCATION", permissionCode: "LIST" },

    },
    {
        path: "/location/create",
        element: <LocationCreate />,
        permission: { menuCode: "LOCATION", permissionCode: "CREATE" },
    },
    {
        path: "/location/edit/:id",
        element: <LocationEdit />,
        permission: { menuCode: "LOCATION", permissionCode: "EDIT" },

    },
    {
        path: "/location/detail/:id",
        element: <LocationDetail />,
        permission: { menuCode: "LOCATION", permissionCode: "DETAILS" },

    },

    // Attendance
    {
        path: "/attendance",
        element: <AttendanceList />,
        permission: { menuCode: "ATTENDANCE", permissionCode: "LIST" },

    },

    {
        path: "/attendance/create",
        element: <CreateAttendance />,
        permission: { menuCode: "ATTENDANCE", permissionCode: "CREATE" }
    },
    {
        path: "/attendance/:code/detail",
        element: <DetailsAttendance />,
        permission: { menuCode: "ATTENDANCE", permissionCode: "DETAILS" }
    },
    {
        path: "/attendance/:code/update",
        element: <UpdateAttendance />,
        permission: { menuCode: "ATTENDANCE", permissionCode: "UPDATE" }
    },

    // Payroll
    {
        path: "/payroll",
        element: <Payroll />,
        permission: { menuCode: "PAYROLL", permissionCode: "" }
    },
    {
        path: "/payroll/:id",
        element: <PayrollDetail />
    },

    // Employee
    {
        path: "/employee/new",
        element: <EmployeeCreate />,
        permission: { menuCode: "EMPLOYEE", permissionCode: "CREATE" }
    },
    {
        path: "/employee",
        element: <EmployeeList />,
        permission: { menuCode: "EMPLOYEE", permissionCode: "LIST" }
    },
    {
        path: "/employee/edit/:code",
        element: <EmployeeEdit />,
        permission: { menuCode: "EMPLOYEE", permissionCode: "EDIT" }
    },
    {
        path: "/employee/detail/:code",
        element: <EmployeeDetail />,
        permission: { menuCode: "EMPLOYEE", permissionCode: "DETAIL" }
    },

    // Profile / Unauthorized
    { path: "/profile", element: <Profile /> },
    { path: "/unauthorized", element: <Unauthorized /> },
];