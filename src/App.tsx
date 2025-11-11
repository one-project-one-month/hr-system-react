import { BrowserRouter, Route, Routes } from "react-router-dom";

// Role
import CreateRole from "./pages/Management/Admin/Role/CreatetRole";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import Role from "./pages/Management/Admin/Role/Role";
>>>>>>> develop
=======
import Role from "./pages/Management/Admin/Role/Role";
>>>>>>> develop
import UpdateRole from "./pages/Management/Admin/Role/UpdateRole";
import ViewRole from "./pages/Management/Admin/Role/ViewRole";

// Backlog
import { BacklogCreate } from "./pages/Management/Backlog/Create";
import { BacklogDetail } from "./pages/Management/Backlog/Detail";
import { BacklogEdit } from "./pages/Management/Backlog/Edit";
import Backlog from "./pages/Management/Backlog/Index";

// layout and dashboard
import MainLayout from "./layouts/MainLayout";
import ManagementDashboard from "./pages/Management/Dashboard/Index";

// location
import Location from "./pages/Management/Attendance/Location/Index";
import LocationCreate from "./pages/Management/Attendance/Location/LocationCreate";
import LocationDetail from "./pages/Management/Attendance/Location/LocationDetail";
import LocationEdit from "./pages/Management/Attendance/Location/LocationEdit";

// attendance
import { CreateAttendance } from "./pages/Management/Attendance/Create";
import { AttendanceList } from "./pages/Management/Attendance/Index";
import { UpdateAttendance } from "./pages/Management/Attendance/[id]";

// Payroll
import Payroll from "./pages/Management/Payroll/Payroll";
import PayrollCreate from "./pages/Management/Payroll/PayrollCreate";
import PayrollDetail from "./pages/Management/Payroll/PayrollDetail";
import PayrollEdit from "./pages/Management/Payroll/PayrollEdit";

// menu item
import MenuItem from "./pages/Management/Admin/Menu/MenuItem";
import MenuItemCreate from "./pages/Management/Admin/Menu/MenuItemCreate";
import MenuItemEdit from "./pages/Management/Admin/Menu/MenuItemEdit";

// project
import ProjectList from "./pages/Management/Backlog/Project/Index";
import { ProjectCreate } from "./pages/Management/Backlog/Project/ProjectCreate";
<<<<<<< HEAD
<<<<<<< HEAD
import { ProjectEdit } from "./pages/Management/Backlog/Project/ProjectEdit";
=======
=======
>>>>>>> develop
import { ProjectDetails } from "./pages/Management/Backlog/Project/ProjectDetails";
import { ProjectEdit } from "./pages/Management/Backlog/Project/ProjectEdit";

//Add Employee
import { AddEmployee } from "./pages/Management/Backlog/Project/AddEmployee";
import { RemoveEmployee } from "./pages/Management/Backlog/Project/RemoveEmployee";
<<<<<<< HEAD
>>>>>>> develop
=======
>>>>>>> develop

// employee
import EmployeeCreate from "./pages/Management/Employee/EmployeeCreate";
import EmployeeDetail from "./pages/Management/Employee/EmployeeDetail";
import EmployeeEdit from "./pages/Management/Employee/EmployeeEdit";
import EmployeeList from "./pages/Management/Employee/Index";

//auth
import AuthLayout from "./layouts/AuthLayout";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import OtpVerification from "./pages/Auth/OtpVerification";
import PasswordChanged from "./pages/Auth/PasswordChanged";
import ResetPassword from "./pages/Auth/ResetPassword";
import LoginPage from "./pages/Login";

import { RoleGuard } from "./components/ui/RoleGuard";
import Profile from "./pages/Profile/Profile";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { RoleMenuTreeViewCreate } from "./pages/Management/Admin/role-menu-permission/Create";
>>>>>>> develop
=======
import { RoleMenuTreeViewCreate } from "./pages/Management/Admin/Role-Menu-Permission/Create";
>>>>>>> develop

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-changed" element={<PasswordChanged />} />
          </Route>

          {/* admin */}
          <Route element={<MainLayout />}>
            <Route
              path="/management/dashboard"
              element={
                <RoleGuard allowedRoles={["admin", "hr"]}>
                  <ManagementDashboard />
                </RoleGuard>
              }
            ></Route>
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> develop
            <Route
              path="/management/admin/role-menu-permission"
              element={<RoleMenuTreeViewCreate />}
            ></Route>
<<<<<<< HEAD
>>>>>>> develop
=======
>>>>>>> develop
            <Route path="/backlog" element={<Backlog />}></Route>
            <Route path="/backlog/:id" element={<BacklogDetail />} />
            <Route path="/backlog/create" element={<BacklogCreate />}></Route>
            <Route path="/backlog/edit/:id" element={<BacklogEdit />}></Route>
            <Route path="/project" element={<ProjectList />}></Route>
            <Route path="/projects/new" element={<ProjectCreate />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/projects/:id/edit" element={<ProjectEdit />} />

            <Route path="/projects/add-employee" element={<AddEmployee />} />
            <Route
              path="/projects/remove-employee"
              element={<RemoveEmployee />}
            />

            <Route path="/role" element={<Role />}></Route>
            <Route path="/role/create" element={<CreateRole />}></Route>
            <Route path="/role/update" element={<UpdateRole />}></Route>
            <Route path="/role/view" element={<ViewRole />}></Route>
            <Route path="/location" element={<Location />}></Route>
            <Route path="/location/create" element={<LocationCreate />}></Route>
            <Route path="/location/edit/:id" element={<LocationEdit />} />
            <Route path="/location/detail/:id" element={<LocationDetail />} />
            <Route path="/attendance" element={<AttendanceList />}></Route>

            <Route
              path="/attendance/create"
              element={<CreateAttendance />}
            ></Route>
            <Route
              path="/attendance/:code/update"
              element={<UpdateAttendance />}
            ></Route>
            <Route path="/payroll" element={<Payroll />}></Route>
            <Route path="/payroll/create" element={<PayrollCreate />}></Route>
            <Route path="/payroll/:id/edit" element={<PayrollEdit />}></Route>
            <Route path="/payroll/:id" element={<PayrollDetail />}></Route>
            <Route path="/menuitem" element={<MenuItem />}></Route>
            <Route path="/menuitem/create" element={<MenuItemCreate />} />
            <Route path="/menuitem/edit" element={<MenuItemEdit />} />
<<<<<<< HEAD
<<<<<<< HEAD
            <Route path="/employee" element={<EmployeeList />}></Route>
=======
            <Route
              path="/employee"
              element={
                <EmployeeList onSort={undefined} sortConfig={undefined} />
              }
            ></Route>
>>>>>>> develop
=======
            <Route path="/employee" element={<EmployeeList />}></Route>
>>>>>>> develop
            <Route path="/employee/new" element={<EmployeeCreate />}></Route>
            <Route path="/employee/edit/:code" element={<EmployeeEdit />} />
            <Route path="/employee/detail/:code" element={<EmployeeDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/notFound" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
