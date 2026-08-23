// src/context/AuthContext/AuthContext.jsx

import { createContext, useEffect, useState } from "react";
import axiosInstance from "../../store/components/axiosInstance";

import axios from "axios";

import { useLocation, useNavigate } from "react-router-dom";

import authConfig from "../../configs/auth";

import {
  isPublicRoute,
  isGuestOnlyRoute,
  getRequiredRole,
  getDashboardByRole,
} from "./authRoutes";

import { getAuthData, saveAuthData, clearAuthData } from "./authStorage";

import { getAuthState } from "./authHelpers";

// ============================================================
// CONTEXT
// ============================================================

const defaultProvider = {
  user: null,
  accessToken: "",

  loading: true,
  loginLoading: false,

  isAuthenticated: false,
  isAdmin: false,
  isStaff: false,
  isUser: false,

  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

export const AuthContext = createContext(defaultProvider);

// ============================================================
// PROVIDER
// ============================================================

export const AuthProvider = ({ children }) => {
  // ==========================================================
  // STATE
  // ==========================================================

  const [user, setUser] = useState(null);

  const [accessToken, setAccessToken] = useState("");

  const [loading, setLoading] = useState(true);

  const [loginLoading, setLoginLoading] = useState(false);

  // ==========================================================
  // ROUTER
  // ==========================================================

  const navigate = useNavigate();

  const { search } = useLocation();

  // ==========================================================
  // AUTH STATE
  // ==========================================================

  const { role, isAuthenticated, isAdmin, isStaff, isUser } = getAuthState(
    user,
    accessToken,
  );

  // ==========================================================
  // INITIALIZE AUTH
  // ==========================================================

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log("🔄 Initializing authentication...");

    const {
      accessToken: storedToken,
      user: storedUser,
      role: storedRole,
    } = getAuthData();

    const pathname = window.location.pathname;

    // ========================================================
    // NOT AUTHENTICATED
    // ========================================================

    if (!storedToken || !storedUser) {
      handleUnauthenticated(pathname);

      return;
    }

    // ========================================================
    // AUTHENTICATED
    // ========================================================
    try {
      console.log("🔐 Checking token with Laravel...");
      console.log("user profile");

      const response = await axiosInstance.get("profile");
      console.log(response, "auth profile");

      const verifiedUser = response.data.data;

      console.log("✅ Token is valid");
      console.log("Authenticated user:", verifiedUser);

      setUser(verifiedUser);
      setAccessToken(storedToken);

      handleAuthenticated(
        pathname,
        verifiedUser,
        verifiedUser?.role || storedRole,
      );
    } catch (error) {
      console.error("❌ Token expired or invalid:", error);

      // Clear authentication
      clearAuthData();

      setUser(null);
      setAccessToken("");

      setLoading(false);

      // Send user to login
      navigate("/login", {
        replace: true,
      });
    }
    // setUser(storedUser);

    // setAccessToken(storedToken);

    // handleAuthenticated(pathname, storedUser, storedRole);
  };

  // ==========================================================
  // NOT AUTHENTICATED
  // ==========================================================

  const handleUnauthenticated = (pathname) => {
    console.log("❌ User is NOT authenticated");

    setUser(null);

    setAccessToken("");

    // Public route
    if (isPublicRoute(pathname)) {
      console.log("🌐 Public route");

      setLoading(false);

      return;
    }

    // Login/register/etc.
    if (isGuestOnlyRoute(pathname)) {
      console.log("🔑 Guest route");

      setLoading(false);

      return;
    }

    // Protected route
    console.log("🔒 Protected route → login");

    setLoading(false);

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // AUTHENTICATED
  // ==========================================================

  const handleAuthenticated = (pathname, storedUser, storedRole) => {
    const currentRole = (storedUser?.role || storedRole || "").toLowerCase();

    console.log("✅ User authenticated");

    console.log("Current role:", currentRole);

    // ========================================================
    // GUEST PAGE
    // ========================================================

    if (isGuestOnlyRoute(pathname)) {
      console.log("🚫 Authenticated user on guest route");

      navigate(getDashboardByRole(currentRole), {
        replace: true,
      });

      setLoading(false);

      return;
    }

    // ========================================================
    // ROLE PROTECTION
    // ========================================================

    const requiredRole = getRequiredRole(pathname);

    console.log("Required role:", requiredRole);

    // Public page
    if (!requiredRole) {
      console.log("🌐 No role required");

      setLoading(false);

      return;
    }

    // ========================================================
    // WRONG ROLE
    // ========================================================

    if (currentRole !== requiredRole) {
      console.log("❌ WRONG ROLE");

      console.log("Required:", requiredRole);

      console.log("Current:", currentRole);

      navigate(getDashboardByRole(currentRole), {
        replace: true,
      });

      setLoading(false);

      return;
    }

    // ========================================================
    // CORRECT ROLE
    // ========================================================

    console.log(`✅ ${currentRole} access granted`);

    setLoading(false);
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleLogin = async (params, errorCallback) => {
    setLoginLoading(true);

    try {
      console.log("🔑 Login started");

      const response = await axios.post(authConfig.loginEndpoint, params);

      const { accessToken, refreshToken, userData } = response.data.data;

      console.log("Login user:", userData);

      const userRole = userData?.role?.toLowerCase();

      // Save
      saveAuthData({
        accessToken,
        refreshToken,
        user: userData,
        rememberMe: params.rememberMe,
      });

      // State
      setUser(userData);

      setAccessToken(accessToken);

      // Redirect
      navigate(getDashboardByRole(userRole), {
        replace: true,
      });
    } catch (error) {
      console.error("❌ Login failed:", error);

      errorCallback?.(error);
    } finally {
      setLoginLoading(false);
    }
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    console.log("🚪 Logging out...");

    clearAuthData();

    setUser(null);

    setAccessToken("");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // TOKEN VERIFICATION
  // ==========================================================

  const verifyToken = async (endpoint, token) => {
    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error("Token verification failed:", error);

      handleLogout();

      return false;
    }
  };

  // ==========================================================
  // ADMIN TOKEN
  // ==========================================================

  const verifyAdminToken = async () => {
    const { accessToken: token, role: storedRole } = getAuthData();

    if (storedRole?.toLowerCase() !== "admin") {
      handleLogout();

      throw new Error("Unauthorized admin access");
    }

    return verifyToken("/admin/refresh", token);
  };

  // ==========================================================
  // STAFF TOKEN
  // ==========================================================

  const verifyStaffToken = async () => {
    const { accessToken: token, role: storedRole } = getAuthData();

    if (storedRole?.toLowerCase() !== "staff") {
      handleLogout();

      throw new Error("Unauthorized staff access");
    }

    return verifyToken("/staff/refresh", token);
  };

  // ==========================================================
  // USER TOKEN
  // ==========================================================

  const verifyUserToken = async () => {
    const { accessToken: token, role: storedRole } = getAuthData();

    if (storedRole?.toLowerCase() !== "user") {
      handleLogout();

      throw new Error("Unauthorized user access");
    }

    return verifyToken("/user/refresh", token);
  };

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const values = {
    user,
    accessToken,

    loading,
    loginLoading,

    isAuthenticated,
    isAdmin,
    isStaff,
    isUser,

    role,

    setUser,
    setLoading,
    setLoginLoading,

    login: handleLogin,
    logout: handleLogout,

    verifyAdminToken,
    verifyStaffToken,
    verifyUserToken,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
