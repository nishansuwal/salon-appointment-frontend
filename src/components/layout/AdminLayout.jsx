import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Image,
  Settings,
  FolderTree,
  MessageSquare,
  Star,
  LogOut,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-[#122d40] text-white">
        {/* Logo */}
        <div className="border-b border-white/10 p-6 text-2xl font-black">
          Admin Panel
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <SidebarLink to="/admin" icon={<LayoutDashboard size={18} />}>
            Dashboard
          </SidebarLink>

          <SidebarLink to="/admin/appointments" icon={<Calendar size={18} />}>
            Appointments
          </SidebarLink>

          <SidebarLink to="/admin/categories" icon={<FolderTree size={18} />}>
            Categories
          </SidebarLink>

          <SidebarLink to="/admin/services" icon={<Scissors size={18} />}>
            Services
          </SidebarLink>

          <SidebarLink to="/admin/staff" icon={<Users size={18} />}>
            Staff
          </SidebarLink>

          <SidebarLink to="/admin/users" icon={<Users size={18} />}>
            Users
          </SidebarLink>

          <SidebarLink to="/admin/reviews" icon={<Star size={18} />}>
            Reviews
          </SidebarLink>

          <SidebarLink to="/admin/gallery" icon={<Image size={18} />}>
            Gallery
          </SidebarLink>

          <SidebarLink to="/admin/faq" icon={<MessageSquare size={18} />}>
            FAQs
          </SidebarLink>

          <SidebarLink to="/admin/settings" icon={<Settings size={18} />}>
            Settings
          </SidebarLink>
        </nav>
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 font-medium text-white/80 transition hover:bg-red-500 hover:text-white"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 h-screen overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition ${
          isActive
            ? "bg-[#01e281] text-black"
            : "text-white/80 hover:bg-white/10"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}
