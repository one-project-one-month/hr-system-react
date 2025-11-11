import { Link } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  UsersRound,
  UserRound,
  LogOut,
  DollarSign,
  LayoutTemplate,
  Clock,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const [isBacklogSubMenuOpen, setIsBacklogSubMenuOpen] = useState(false);
  const toggleBacklogSubmenu = () =>
    setIsBacklogSubMenuOpen(!isBacklogSubMenuOpen);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const toggleSubmenu = () => setIsSubMenuOpen(!isSubMenuOpen);
  const [isSubMenuItemOpen, setIsSubMenuItemOpen] = useState(false);
  const toglemenuItem = () => setIsSubMenuItemOpen(!isSubMenuItemOpen);
  const [isBackLogMenuOpen, setIsBackLogMenuOpen] = useState(false);
  const toggleBackLogMenu = () => setIsBackLogMenuOpen(!isBackLogMenuOpen);
  return (
    <div className="flex flex-col items-center gap-2">
      <Link to="/admin-dashboard" onClick={onClose} className="sidebar-btn">
        <LayoutDashboard />
        Dashboard
      </Link>
      <Link to="/role" onClick={onClose} className="sidebar-btn">
        <UserRound />
        Role
      </Link>
      <div
        className="sidebar-btn flex w-full justify-between"
        onClick={() => toglemenuItem()}
      >
        <span className="cursor-pointer flex gap-1">
          <LayoutDashboard />
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
        <>
          <Link to="/menuitem" className="sidebar-btn" onClick={onClose}>
            Menu Item
          </Link>
        </>
      )}
      <Link
        to="/management/admin/role-menu-permission"
        onClick={onClose}
        className="sidebar-btn"
      >
        <UserRound />
        Role & Menu Permission
      </Link>
      <Link to="/employee" onClick={onClose} className="sidebar-btn">
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
        <>
          <Link to="/backlog" className="sidebar-btn" onClick={onClose}>
            Backlog
          </Link>
          <Link to="/project" className="sidebar-btn" onClick={onClose}>
            Project
          </Link>
        </>
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
        <>
          <Link to="/location" onClick={onClose} className="sidebar-btn">
            Location
          </Link>
          <Link to="/attendance" onClick={onClose} className="sidebar-btn">
            Attendance
          </Link>
        </>
      )}
      <Link to="/payroll" onClick={onClose} className="sidebar-btn">
        <DollarSign /> Payroll
      </Link>
      <Link to="/logout" onClick={onClose} className="sidebar-btn">
        <LogOut /> Logout
      </Link>
    </div>
  );
}
