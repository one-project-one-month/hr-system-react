import { BrowserRouter, Route, Routes } from "react-router-dom";

// Role
import CreateRole from "./pages/Management/Admin/Role/CreatetRole";
import Role from "./pages/Management/Admin/Role/Role";
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
import { UpdateAttendance } from "./pages/Management/Attendance/Edit";
import { DetailsAttendance } from "./pages/Management/Attendance/Detail";

// Payroll
import Payroll from "./pages/Management/Payroll/Payroll";
import PayrollCreate from "./pages/Management/Payroll/PayrollCreate";
import PayrollDetail from "./pages/Management/Payroll/PayrollDetail";
import PayrollEdit from "./pages/Management/Payroll/PayrollEdit";

// menu Group
import MenuGroupList from "./pages/Management/Admin/MenuGroup/Index";
import MenuGroupCreate from "./pages/Management/Admin/MenuGroup/Create";
import MenuGroupEdit from "./pages/Management/Admin/MenuGroup/Edit";

// menu item
import MenuItemCreate from "./pages/Management/Admin/MenuGroup/MenuItem/Create";
import MenuItemEdit from "./pages/Management/Admin/MenuGroup/MenuItem/Edit";
import MenuItemList from "./pages/Management/Admin/MenuGroup/MenuItem/Index";
import MenuItemDetail from "./pages/Management/Admin/MenuGroup/MenuItem/Detail";

// project
import ProjectList from "./pages/Management/Backlog/Project/Index";
import { ProjectCreate } from "./pages/Management/Backlog/Project/ProjectCreate";
import { ProjectDetails } from "./pages/Management/Backlog/Project/ProjectDetails";
import { ProjectEdit } from "./pages/Management/Backlog/Project/ProjectEdit";

//Add Employee
import { AddEmployee } from "./pages/Management/Backlog/Project/AddEmployee";
import { RemoveEmployee } from "./pages/Management/Backlog/Project/RemoveEmployee";

// employee
import EmployeeCreate from "./pages/Management/Employee/EmployeeCreate";
import EmployeeDetail from "./pages/Management/Employee/EmployeeDetail";
import EmployeeEdit from "./pages/Management/Employee/EmployeeEdit";
import EmployeeList from "./pages/Management/Employee/Index";

// company rules
import { CompanyRulesList } from "./pages/Management/Admin/CompanyRules";
import { CompanyRulesDetails } from "./pages/Management/Admin/CompanyRules/Detail";
import { CompanyRulesEdit } from "./pages/Management/Admin/CompanyRules/Edit";

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
import { RoleMenuTreeViewCreate } from "./pages/Management/Admin/Role-Menu-Permission/Create";
import { ScrollToTop } from "./pages/ScrollToTop";
import AdminDashboard from "./pages/Management/Dashboard/AdminDashboard";
import EmployeeDashboard from "./pages/Management/Dashboard/EmployeeDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Auth  */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-changed" element={<PasswordChanged />} />
          </Route>

          {/* error handling */}
          <Route>
            <Route path="*" element={<NotFound />} />
            <Route path="*" element={<Unauthorized />} />
          </Route>

          {/*Main Layou */}
          <Route element={<MainLayout />}>
            {/* Admin Only */}
            <Route
              path="/management/admin/menu-group"
              element={<MenuGroupList />}
            ></Route>
            <Route
              path="/management/admin/menu-group/create"
              element={<MenuGroupCreate />}
            />
            <Route
              path="/management/admin/menu-group/edit/:id"
              element={<MenuGroupEdit />}
            />

            <Route
              path="/management/admin/menu-item"
              element={<MenuItemList />}
            ></Route>
            <Route
              path="/management/admin/menu-item/create"
              element={<MenuItemCreate />}
            />
            <Route
              path="/management/admin/menu-item/edit/:code"
              element={<MenuItemEdit />}
            />

            <Route
              path="/management/admin/menu-item/detail/:code"
              element={<MenuItemDetail />}
            />
            <Route
              path="/management/admin/company-rules"
              element={<CompanyRulesList />}
            ></Route>

            <Route path="/management/admin/role" element={<Role />}></Route>
            <Route
              path="/management/admin/role/create"
              element={<CreateRole />}
            ></Route>
            <Route
              path="/management/admin/role/update"
              element={<UpdateRole />}
            ></Route>
            <Route
              path="/management/admin/role/view"
              element={<ViewRole />}
            ></Route>

            <Route
              path="/management/admin/role-menu-permission"
              element={<RoleMenuTreeViewCreate />}
            ></Route>

            <Route
              path="/management/dashboard"
              element={<EmployeeDashboard />}
            ></Route>

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
              path="/attendance/:code/detail"
              element={<DetailsAttendance />}
            ></Route>
            <Route
              path="/attendance/:code/update"
              element={<UpdateAttendance />}
            ></Route>

            <Route path="/payroll" element={<Payroll />}></Route>
            <Route path="/payroll/create" element={<PayrollCreate />}></Route>
            <Route path="/payroll/:id/edit" element={<PayrollEdit />}></Route>
            <Route path="/payroll/:id" element={<PayrollDetail />}></Route>

            <Route path="/employee" element={<EmployeeList />}></Route>
            <Route path="/employee/new" element={<EmployeeCreate />}></Route>
            <Route path="/employee/edit/:code" element={<EmployeeEdit />} />
            <Route path="/employee/detail/:code" element={<EmployeeDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
