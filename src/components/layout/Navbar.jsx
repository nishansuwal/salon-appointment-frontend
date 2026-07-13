import { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle menu"]')
      ) {
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-md bg-stone-950 text-sm font-black text-white">
            LC
          </span>

          <span className="hidden sm:block">
            <span className="block text-sm font-black leading-4 text-stone-950">
              {SALON.name}
            </span>

            <span className="text-xs font-medium text-stone-500">
              Online Booking
            </span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-md p-2 text-stone-600 hover:bg-stone-100 md:hidden ml-auto"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation - Desktop */}
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

        {/* Right - Desktop */}
        <div className="hidden items-center gap-3 md:flex">
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

      {/* Mobile Menu - Hidden when closed */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="fixed top-[73px] right-0 z-50 h-[calc(100vh-73px)] w-72 bg-white shadow-2xl md:hidden"
          >
            <div className="flex h-full flex-col overflow-y-auto p-4">
              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-1 border-b border-stone-200 pb-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-md px-4 py-3 text-base font-semibold transition ${
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

              {/* Mobile User Actions */}
              <div className="mt-4 flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg bg-stone-50 px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-700">
                          {user.name}
                        </p>
                        <p className="text-sm text-stone-500">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg px-4 py-3 text-center font-semibold text-stone-700 transition hover:bg-stone-100"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="rounded-lg px-4 py-3 text-center font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="secondary" className="w-full">
                      Login
                    </Button>
                  </Link>
                )}

                <Link
                  to="/book-appointment"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full">Book Appointment</Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}