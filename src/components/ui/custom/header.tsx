import { Bell } from "lucide-react";
import { CircleUser, Menu } from "lucide-react";
import logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
  onToggleSidebar: () => void;
}
export default function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const goToProfile = () => {
    navigate("/profile");
  };
  return (
    <div className="bg-natural-50 flex justify-between items-center text-text h-full">
      <div className="cursor-pointer text-2xl flex gap-3 justify-center items-center ms-5">
        <Menu className="md:d-block lg:hidden me-2" onClick={onToggleSidebar} />
        <img src={logo} alt="logo" className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-4 text-2xl me-4" onClick={goToProfile}>
        <Bell className="cursor-pointer me-2" />
        <CircleUser className="cursor-pointer" />
      </div>
    </div>
  );
}
