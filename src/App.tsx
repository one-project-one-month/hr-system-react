import { Route, Routes, useLocation } from "react-router-dom";

//auth
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import OtpVerification from "@/pages/Auth/OtpVerification";
import PasswordChanged from "@/pages/Auth/PasswordChanged";
import ResetPassword from "@/pages/Auth/ResetPassword";
import LoginPage from "@/pages/Login";
import ChangePassword from "@/pages/Auth/ChangePassword";
import Unauthorized from "@/pages/Unauthorized";
import NotFound from "@/pages/NotFound";

import { useAuthStore } from "./stores/useAuthStore";
import { ProtectedRoute } from "./components/ui/custom/protected-route";
import AuthLayout from "./layouts/AuthLayout";
import { ScrollToTop } from "./pages/ScrollToTop";
import type { MenuPermission } from "./types/role-menu-permission";
import type { permissions } from "./types/appRoutes";
import MainLayout from "./layouts/MainLayout";
import { routes } from "./components/ui/custom/app-routes";

function App() {
  const authStore = useAuthStore();
  const menuPermissions: MenuPermission[] = authStore.user?.menuTree?.menuTree ?? [];
  const location = useLocation();
  const role = authStore.user?.roleName ?? "";
  const rolePathMap: Record<string, string> = {
    Administrator: "/admin",
    "HR Specialist": "/hr",
    HR:"/hr", 
    Employee: "/employee",
  };
  const defaultPath = "/employee";
  const hasMenuPermission = (
    menuPermissions: MenuPermission[],
    permissions: permissions
  ) => {

    const groupLevel = menuPermissions.find(m => m.isChecked && m.menuGroupCode === permissions.menuGroupCode)
    // guard by roles for dashboards
    if (groupLevel?.menuGroupCode === "DASHBOARD") {
      const requiredPath = rolePathMap[role] ?? defaultPath;
      if (!location.pathname.startsWith(requiredPath)) {
        return false;
      }
    }

    if (!!groupLevel) return true;

    // no child menus
    if (!!groupLevel?.childMenus?.length) return true;

    //with child menus
    return groupLevel?.childMenus.some(child =>
      child.isChecked
      && (child.menuCode === permissions.menuCode || child.menuCode === "") && permissions.permissionCode)
  }
  return (
    <>
      <ScrollToTop />
      <Routes>

        {/* Auth  */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-changed" element={<PasswordChanged />} />
          <Route path="/changePassword" element={<ChangePassword />} />,
        </Route>

        {/* error handling */}
        <Route>
          <Route path="*" element={<NotFound />} />
          <Route path="*" element={<Unauthorized />} />
        </Route>

        {/*Main Layout */}
        <Route element={<MainLayout />}>
          {routes.map(({ path, element, permission }) => (
            <Route
              key={path}
              path={path}
              element={
                permission ? (
                  <ProtectedRoute
                    isAllowed={hasMenuPermission(menuPermissions, permission)}
                  >
                    {element}
                  </ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          ))}
        </Route >
      </Routes >
    </>
  );
}

export default App;
