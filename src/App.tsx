import { Route, Routes } from "react-router-dom";

//auth
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import OtpVerification from "@/pages/Auth/OtpVerification";
import PasswordChanged from "@/pages/Auth/PasswordChanged";
import ResetPassword from "@/pages/Auth/ResetPassword";
import LoginPage from "@/pages/Login";

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
  const menuPermissions: MenuPermission[] = authStore.user?.menuTree?.menuTree;
  const hasMenuPermission = (menuPermissions: MenuPermission[], permissions: permissions) =>
    menuPermissions?.some(m => m.isChecked
      && ((m.childMenus?.length
        && m.childMenus.some(item =>
          item.menuItemCode === permissions.menuCode
          && item.isChecked
          && item.permissions.some(pcode => pcode === permissions.permissionCode))
      )
        || (!m.childMenus.length && m.menuGroupCode === permissions.menuCode)));

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
