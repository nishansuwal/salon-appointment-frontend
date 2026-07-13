import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const demoUser = {
  name: "Aarati Karki",
  email: "aarati@example.com",
  role: "admin",
  phone: "+977 981-456-7890",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(demoUser);

  const login = (payload) => {
    const nextUser = {
      name: payload.name || "Salon Client",
      email: payload.email,
      role: payload.role || "user",
      phone: payload.phone || "",
    };
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      isStaff: user?.role === "admin",
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function   useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
