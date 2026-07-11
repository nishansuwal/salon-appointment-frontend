import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  Image,
  Settings,
} from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#122d40] text-white">
        <div className="p-6 text-2xl font-black border-b border-white/10">
          Admin Panel
        </div>

        <nav className="p-4 space-y-2">
          <SidebarLink to="/admin" icon={<LayoutDashboard size={18} />}>
            Dashboard
          </SidebarLink>

          <SidebarLink to="/admin/appointments" icon={<Calendar size={18} />}>
            Appointments
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

          <SidebarLink to="/admin/gallery" icon={<Image size={18} />}>
            Gallery
          </SidebarLink>

          <SidebarLink to="/admin/settings" icon={<Settings size={18} />}>
            Settings
          </SidebarLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

/* Sidebar Link Component */
function SidebarLink({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 rounded px-4 py-3 font-medium transition
        ${
          isActive
            ? "bg-[#01e281] text-black"
            : "text-white/80 hover:bg-white/10"
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}