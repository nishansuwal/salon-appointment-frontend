import { NavLink } from "react-router-dom";

const links = [
  { label: "Overview", to: "/dashboard" },
  { label: "Book Appointment", to: "/book" },
  { label: "My Appointments", to: "/appointments" },
  { label: "Profile", to: "/profile" },
  { label: "Admin", to: "/admin" },
];

export default function Sidebar() {
  return (
    <aside className="rounded-lg border border-stone-200 bg-white p-2 shadow-sm">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                isActive ? "bg-stone-950 text-white" : "text-stone-600 hover:bg-stone-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
