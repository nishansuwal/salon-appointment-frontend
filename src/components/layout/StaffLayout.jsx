import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Star,
} from "lucide-react";

export default function StaffLayout() {
  return (
    <div className="h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-[#122d40] text-white">
        {/* Logo */}
        <div className="border-b border-white/10 p-6 text-2xl font-black">
          Staff Panel
        </div>

        {/* Scrollable Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          <SidebarLink
            to="/staff"
            icon={<LayoutDashboard size={18} />}
          >
            Dashboard
          </SidebarLink>

          <SidebarLink
            to="/staff/appointments"
            icon={<Calendar size={18} />}
          >
            Appointments
          </SidebarLink>

          <SidebarLink
            to="/staff/calendar"
            icon={<Calendar size={18} />}
          >
            Calendar
          </SidebarLink>

          <SidebarLink
            to="/staff/profile"
            icon={<Users size={18} />}
          >
            Profile
          </SidebarLink>

          <SidebarLink
            to="/staff/reviews"
            icon={<Star size={18} />}
          >
            Reviews
          </SidebarLink>
        </nav>
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