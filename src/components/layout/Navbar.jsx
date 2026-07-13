import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

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

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-stone-950 text-sm font-black text-white">
            LC
          </span>

          <span>
            <span className="block text-sm font-black leading-4 text-stone-950">
              {SALON.name}
            </span>

            <span className="text-xs font-medium text-stone-500">
              Online Booking
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-rose-50 text-rose-700"
                    : "text-stone-600 hover:bg-stone-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 rounded-lg border border-stone-300 bg-white px-3 py-2 transition hover:bg-stone-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-600 font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <span className="hidden font-semibold text-stone-700 sm:block">
                  {user.name}
                </span>

                <ChevronDown
                  size={18}
                  className={`transition ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xl">
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-5 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="w-full px-5 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button variant="secondary">
                Login
              </Button>
            </Link>
          )}

          <Link to="/book-appointment">
            <Button>Book Appointment</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}