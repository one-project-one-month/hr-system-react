import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
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

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const location = useLocation();
  const authStore = useAuthStore();
  const [isBacklogSubMenuOpen, setIsBacklogSubMenuOpen] = useState(false);
  const toggleBacklogSubmenu = () =>
    setIsBacklogSubMenuOpen(!isBacklogSubMenuOpen);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const toggleSubmenu = () => setIsSubMenuOpen(!isSubMenuOpen);
  const [isSubMenuItemOpen, setIsSubMenuItemOpen] = useState(false);
  const toglemenuItem = () => setIsSubMenuItemOpen(!isSubMenuItemOpen);
  const [isBackLogMenuOpen, setIsBackLogMenuOpen] = useState(false);
  const toggleBackLogMenu = () => setIsBackLogMenuOpen(!isBackLogMenuOpen);

  const logOut = () => {
    authStore.logout();
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <Link
        to="/management/dashboard"
        onClick={onClose}
        className={`sidebar-btn ${
          location.pathname === "/management/dashboard"
            ? "bg-primary-500 text-natural-50"
            : ""
        }`}
      >
        <LayoutDashboardIcon />
        Dashboard
      </Link>
      <Link
        to="/management/admin/role"
        onClick={onClose}
        className={`sidebar-btn ${
          location.pathname === "/management/admin/role"
            ? "bg-primary-500 text-natural-50"
            : ""
        }`}
      >
        <UserRound />
        Role
      </Link>
      <div
        className="sidebar-btn flex w-full justify-between"
        onClick={() => toglemenuItem()}
      >
        <span className="cursor-pointer flex gap-1">
          <LayoutDashboardIcon />
          Menu
        </span>
        <ChevronUp
          className={`mt-2 text-sm transition-transform duration-300 ${
            isSubMenuItemOpen ? "rotate-180" : "rotate-0"
          }`}
          size={14}
        />
      </div>
      {isSubMenuItemOpen && (
        <div className="ms-2 w-[90%]">
          <Link
            to="/management/admin/menu-group"
            className={`sidebar-btn ${
              location.pathname === "/management/admin/menu-group"
                ? "bg-primary-500 text-natural-50"
                : ""
            }`}
            onClick={onClose}
          >
            <Menu />
            MenuGroup
          </Link>
          <Link
            to="/management/admin/menu-item"
            className={`sidebar-btn ${
              location.pathname === "/management/admin/menu-item"
                ? "bg-primary-500 text-natural-50"
                : ""
            }`}
            onClick={onClose}
          >
            <PanelTopOpen />
            Menu Item
          </Link>
        </div>
      )}
      <Link
        to="/management/admin/role-menu-permission"
        onClick={onClose}
        className={`sidebar-btn ${
          location.pathname === "/management/admin/role-menu-permission"
            ? "bg-primary-500 text-natural-50"
            : ""
        }`}
      >
        <UserRound />
        Role & Menu Permission
      </Link>
      <Link
        to="/management/admin/company-rules"
        onClick={onClose}
        className={`sidebar-btn ${
          location.pathname === "/management/admin/company-rules"
            ? "bg-primary-500 text-natural-50"
            : ""
        }`}
      >
        <UserRound />
        Company Rules
      </Link>
      <Link
        to="/employee"
        onClick={onClose}
        className={`sidebar-btn ${
          location.pathname === "/employee"
            ? "bg-primary-500 text-natural-50"
            : ""
        }`}
      >
        <UsersRound />
        Employee
      </Link>
      <div
        className="sidebar-btn w-full justify-between"
        onClick={toggleBackLogMenu}
      >
        <span className="cursor-pointer flex gap-1">
          <LayoutTemplate />
          Backlog Module
        </span>
        <ChevronUp
          className={`mt-2 text-sm transition-transform duration-300 ${
            isBackLogMenuOpen ? "rotate-180" : "rotate-0"
          }`}
          size={14}
        />
      </div>
      {isBackLogMenuOpen && (
        <div className="ms-2 w-[90%]">
          <Link
            to="/backlog"
            className={`sidebar-btn ${
              location.pathname === "/backlog"
                ? "bg-primary-500 text-natural-50"
                : ""
            }`}
            onClick={onClose}
          >
            <ListCheck />
            Backlog
          </Link>
          <Link
            to="/project"
            className={`sidebar-btn ${
              location.pathname === "/project"
                ? "bg-primary-500 text-natural-50"
                : ""
            }`}
            onClick={onClose}
          >
            <Briefcase />
            Project
          </Link>
        </div>
      )}
      <div
        className="sidebar-btn flex w-full justify-between"
        onClick={() => {
          toggleSubmenu();
        }}
      >
        <span className="cursor-pointer flex gap-1">
          <Clock />
          Attendance Module
        </span>
        <ChevronUp
          className={`mt-2 text-sm transition-transform duration-300 ${
            isSubMenuOpen ? "rotate-180" : "rotate-0"
          }`}
          size={14}
        />
      </div>
      {isSubMenuOpen && (
        <div className="ms-2 w-[90%]">
          <Link
            to="/location"
            onClick={onClose}
            className={`sidebar-btn ${
              location.pathname === "/location"
                ? "bg-primary-500 text-natural-50"
                : ""
            }`}
          >
            <Map />
            Location
          </Link>
          <Link
            to="/attendance"
            onClick={onClose}
            className={`sidebar-btn ${
              location.pathname === "/attendance"
                ? "bg-primary-500 text-natural-50"
                : ""
            }`}
          >
            <Clock />
            Attendance
          </Link>
        </div>
      )}
      <Link
        to="/payroll"
        onClick={onClose}
        className={`sidebar-btn ${
          location.pathname === "/payroll"
            ? "bg-primary-500 text-natural-50"
            : ""
        }`}
      >
        <DollarSign /> Payroll
      </Link>
      <button onClick={logOut} className="sidebar-btn">
        <LogOut /> Logout
      </button>
    </div>
  );
}
