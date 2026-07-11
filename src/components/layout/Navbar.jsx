import { NavLink, Link } from "react-router-dom";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";
import { SALON } from "../../utils/constants";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-stone-950 text-sm font-black text-white">
            LC
          </span>
          <span>
            <span className="block text-sm font-black leading-4 text-stone-950">{SALON.name}</span>
            <span className="text-xs font-medium text-stone-500">Online booking</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-rose-50 text-rose-700" : "text-stone-600 hover:bg-stone-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm font-semibold text-stone-700 sm:block">{user.name}</span>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button as={Link} variant="secondary">
              Login
            </Button>
          )}
          <Link to="/book-appointment">
            <Button>Book Appointment</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
