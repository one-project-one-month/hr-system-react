import Header from "../components/ui/header";
import Sidebar from "../components/ui/sidebar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import "../styles/index.css";
import { useContext, useState } from "react";
import Logo from "../assets/logo.png";
import { X } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loading, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }
  return (
    <div className="flex h-screen flex-col overflow-hiden">
      <header className="h-[60px] flex-shrink-0 z-20 shadow-sm">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`w-[300px] bg-natural-50 text-text shadow-lg z-30
                    transition-transform duration-300
                    ${
                      isSidebarOpen
                        ? "fixed top-0 h-full overflow-y-auto overflow-x-hidden"
                        : "hidden lg:block max-h-[100vh-60px] overflow-y-auto"
                    }
                    lg:translate-x-0
                `}
        >
          <div
            className={`${
              isSidebarOpen
                ? "sticky inset-0 flex justify-between p-2 items-center bg-natural-50"
                : "hidden"
            }`}
          >
            <img src={Logo} alt="logo" className="w-30" />
            <X
              className="me-2 cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
          <div className="h-full w-full bg-primary flex justify-center mt-5">
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-natural-100">
          <Outlet />
        </main>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
