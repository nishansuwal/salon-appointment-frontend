// ** React Imports
import { createContext, useEffect, useState } from "react";

// ** Axios
import axios from "axios";

// ** Config
import authConfig from "../configs/auth";

// ** React Router
import { useLocation, useNavigate } from "react-router-dom";

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  loginLoading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  setLoginLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

// ============================================================
// Query Params Hook
// ============================================================

const useQueryParams = () => {
  const { search } = useLocation();

  return new URLSearchParams(search);
};

// ============================================================
// Auth Provider
// ============================================================

const AuthProvider = ({ children }) => {
  // ==========================================================
  // States
  // ==========================================================

  const [user, setUser] = useState(defaultProvider.user);

  const [accessToken, setAccessToken] = useState("");

  const [loading, setLoading] = useState(defaultProvider.loading);

  const [loginLoading, setLoginLoading] = useState(
    defaultProvider.loginLoading,
  );

  // ==========================================================
  // Hooks
  // ==========================================================

  const navigate = useNavigate();

  const queryParams = useQueryParams();

  // ==========================================================
  // ROUTE CONFIGURATION
  // ==========================================================

  const PUBLIC_ROUTES = [
    "/",
    "/services",
    "/book-appointment",
    "/about",
    "/gallery",
  ];

  const GUEST_ONLY_ROUTES = [
    "/forgot-password",
    "/reset-password",
    "/login",
    "/register",
  ];

  const ROLE_ROUTES = {
    admin: "/admin",
    staff: "/staff",
    user: "/user",
  };

  const isExactOrChildRoute = (pathname, route) => {
    return pathname === route || pathname.startsWith(`${route}/`);
  };

  const isPublicRoute = (pathname) => {
    return PUBLIC_ROUTES.some((route) => {
      if (route === "/") {
        return pathname === "/";
      }

      return isExactOrChildRoute(pathname, route);
    });
  };

  const isGuestOnlyRoute = (pathname) => {
    return GUEST_ONLY_ROUTES.some((route) =>
      isExactOrChildRoute(pathname, route),
    );
  };

  /**
   * Get the role required for the current route.
   *
   * /admin       -> admin
   * /admin/users -> admin
   *
   * /staff       -> staff
   * /staff/...   -> staff
   *
   * /user        -> user
   * /user/...    -> user
   */
  const getRequiredRole = (pathname) => {
    if (isExactOrChildRoute(pathname, ROLE_ROUTES.admin)) {
      return "admin";
    }

    if (isExactOrChildRoute(pathname, ROLE_ROUTES.staff)) {
      return "staff";
    }

    if (isExactOrChildRoute(pathname, ROLE_ROUTES.user)) {
      return "user";
    }

    return null;
  };

  /**
   * Get dashboard based on user role.
   */
  const getDashboardByRole = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "/admin/";

      case "staff":
        return "/staff/";

      case "user":
        return "/user/";

      default:
        return "/";
    }
  };

  // ==========================================================
  // HANDLE QUERY PARAM LOGIN / REDIRECT
  // ==========================================================

  useEffect(() => {
    const accessTokenFromQuery = queryParams.get("accessToken");

    const refreshTokenFromQuery = queryParams.get("refreshToken");

    const userDataString = queryParams.get("userData");

    if (accessTokenFromQuery && refreshTokenFromQuery && userDataString) {
      try {
        // ------------------------------------------------------
        // Store authentication information
        // ------------------------------------------------------

        window.localStorage.setItem(
          authConfig.storageTokenKeyName,
          accessTokenFromQuery,
        );

        window.localStorage.setItem("refreshToken", refreshTokenFromQuery);

        window.localStorage.setItem("userData", userDataString);

        // ------------------------------------------------------
        // Parse user
        // ------------------------------------------------------

        const userData = JSON.parse(userDataString);

        const role = userData?.role?.toLowerCase() || "user";

        window.localStorage.setItem("role", role);

        sessionStorage.setItem("isRedirected", "true");

        // ------------------------------------------------------
        // Clear query parameters
        // ------------------------------------------------------

        window.history.replaceState({}, "", window.location.pathname);

        // ------------------------------------------------------
        // Set state
        // ------------------------------------------------------

        setUser(userData);

        setAccessToken(accessTokenFromQuery);

        // ------------------------------------------------------
        // Redirect according to role
        // ------------------------------------------------------

        if (role === "admin") {
          navigate("/admin/", {
            replace: true,
          });
        } else if (role === "staff") {
          navigate("/staff/", {
            replace: true,
          });
        } else {
          navigate("/user/", {
            replace: true,
          });
        }
      } catch (error) {
        console.error(
          "Failed to process authentication query parameters:",
          error,
        );

        navigate("/login", {
          replace: true,
        });
      }
    }
  }, [queryParams, navigate]);

  // ==========================================================
  // AUTHENTICATION + ROUTE PROTECTION
  // ==========================================================

  useEffect(() => {
    const storedToken =
      window.localStorage.getItem(authConfig.storageTokenKeyName) ||
      window.sessionStorage.getItem(authConfig.storageTokenKeyName);

    const storedUserData =
      window.localStorage.getItem("userData") ||
      window.sessionStorage.getItem("userData");

    const storedRole =
      window.localStorage.getItem("role") ||
      window.sessionStorage.getItem("role");

    const pathname = window.location.pathname || "/";

    // ----------------------------------------------------------
    // Parse user data
    // ----------------------------------------------------------

    let parsedUser = null;

    if (storedUserData) {
      try {
        parsedUser = JSON.parse(storedUserData);
      } catch (error) {
        console.error("Invalid userData stored in browser:", error);

        window.localStorage.removeItem("userData");

        window.sessionStorage.removeItem("userData");
      }
    }

    // ----------------------------------------------------------
    // Authentication status
    // ----------------------------------------------------------

    const isAuthenticated = Boolean(storedToken && parsedUser);

    // ----------------------------------------------------------
    // Get current user role
    // ----------------------------------------------------------

    const role = (parsedUser?.role || storedRole || "user").toLowerCase();

    // ----------------------------------------------------------
    // Get required role for current URL
    // ----------------------------------------------------------

    const requiredRole = getRequiredRole(pathname);

    // ==========================================================
    // USER IS NOT LOGGED IN
    // ==========================================================

    if (!isAuthenticated) {
      // --------------------------------------------------------
      // Public routes
      // --------------------------------------------------------

      if (isPublicRoute(pathname)) {
        setUser(null);
        setAccessToken("");
        setLoading(false);

        return;
      }

      // --------------------------------------------------------
      // Guest-only routes
      // --------------------------------------------------------

      if (isGuestOnlyRoute(pathname)) {
        setUser(null);
        setAccessToken("");
        setLoading(false);

        return;
      }

      // --------------------------------------------------------
      // Everything else requires login
      // --------------------------------------------------------

      console.log("🔒 Authentication required:", pathname);

      setUser(null);
      setAccessToken("");

      setLoading(false);

      navigate("/login", {
        replace: true,
      });

      return;
    }

    // ==========================================================
    // USER IS LOGGED IN
    // ==========================================================

    setUser(parsedUser);

    setAccessToken(storedToken);

    // ----------------------------------------------------------
    // Logged-in users cannot access guest-only routes
    // ----------------------------------------------------------

    if (isGuestOnlyRoute(pathname)) {
      console.log("🔒 Logged-in user cannot access:", pathname);

      navigate(getDashboardByRole(role), {
        replace: true,
      });

      setLoading(false);

      return;
    }

    // ==========================================================
    // ROLE BASED PROTECTION
    // ==========================================================

    if (requiredRole) {
      // --------------------------------------------------------
      // User has wrong role
      // --------------------------------------------------------

      if (role !== requiredRole) {
        console.warn(
          `❌ Unauthorized access.
Required role: ${requiredRole}
Current role: ${role}
Route: ${pathname}`,
        );

        navigate(getDashboardByRole(role), {
          replace: true,
        });

        setLoading(false);

        return;
      }

      // --------------------------------------------------------
      // Correct role
      // --------------------------------------------------------

      console.log(`✅ ${role} access granted: ${pathname}`);
    }

    // ==========================================================
    // AUTHENTICATION SUCCESSFUL
    // ==========================================================

    setLoading(false);
  }, [navigate]);

  // ==========================================================
  // AXIOS INTERCEPTOR
  // ==========================================================

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            console.log("🔹 Refreshing token...");

            const refreshToken =
              window.localStorage.getItem("refreshToken") ||
              window.sessionStorage.getItem("refreshToken");

            if (!refreshToken) {
              console.error("❌ No refresh token found.");

              handleLogout();

              return Promise.reject(error);
            }

            const response = await axios.post(authConfig.refreshEndpoint, {
              refresh_token: refreshToken,
            });

            const data = response?.data?.data;

            if (!data?.accessToken || !data?.refreshToken) {
              throw new Error("Invalid refresh token response.");
            }

            const newAccessToken = data.accessToken;

            const newRefreshToken = data.refreshToken;

            const isUsingLocalStorage = Boolean(
              window.localStorage.getItem(authConfig.storageTokenKeyName),
            );

            const storage = isUsingLocalStorage
              ? window.localStorage
              : window.sessionStorage;

            storage.setItem(authConfig.storageTokenKeyName, newAccessToken);

            storage.setItem("refreshToken", newRefreshToken);

            // ----------------------------------------------
            // Update React state
            // ----------------------------------------------

            setAccessToken(newAccessToken);

            // ----------------------------------------------
            // Update original request
            // ----------------------------------------------

            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };

            // ----------------------------------------------
            // Retry original request
            // ----------------------------------------------

            return axios(originalRequest);
          } catch (refreshError) {
            console.error(
              "❌ Refresh token failed:",
              refreshError?.response?.data ||
                refreshError?.message ||
                refreshError,
            );

            // ----------------------------------------------
            // Refresh failed
            // ----------------------------------------------

            handleLogout();

            return Promise.reject(refreshError);
          }
        }

        // ----------------------------------------------------
        // Not a 401
        // ----------------------------------------------------

        return Promise.reject(error);
      },
    );

    // ----------------------------------------------------------
    // Cleanup interceptor
    // ----------------------------------------------------------

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleLogin = async (params, errorCallback) => {
    setLoginLoading(true);

    try {
      console.log(authConfig.loginEndpoint);

      // --------------------------------------------------------
      // Login request
      // --------------------------------------------------------

      const response = await axios.post(authConfig.loginEndpoint, params);

      console.log(response, "response from login");

      const { accessToken, refreshToken, userData, redirectUrl } =
        response.data.data;

      // --------------------------------------------------------
      // Get role
      // --------------------------------------------------------

      const role = userData?.role?.toLowerCase() || "user";

      // ========================================================
      // IFRAME LOGIN
      // ========================================================

      if (window.self !== window.top) {
        const query = new URLSearchParams({
          accessToken,
          refreshToken,
          role,
          userData: JSON.stringify(userData),
        }).toString();

        const redirectWithParams = `${redirectUrl}?${query}`;

        window.top.location.href = redirectWithParams;

        return;
      }

      // ========================================================
      // NORMAL LOGIN
      // ========================================================

      const storage = params.rememberMe
        ? window.localStorage
        : window.sessionStorage;

      // --------------------------------------------------------
      // Store authentication data
      // --------------------------------------------------------

      storage.setItem(authConfig.storageTokenKeyName, accessToken);

      storage.setItem("role", role);

      storage.setItem("userData", JSON.stringify(userData));

      // --------------------------------------------------------
      // Refresh token
      // --------------------------------------------------------

      if (params.rememberMe) {
        window.localStorage.setItem("refreshToken", refreshToken);
      } else {
        window.sessionStorage.setItem("refreshToken", refreshToken);
      }

      // --------------------------------------------------------
      // Update state
      // --------------------------------------------------------

      setUser(userData);

      setAccessToken(accessToken);

      // ========================================================
      // ROLE BASED REDIRECT
      // ========================================================

      if (role === "admin") {
        navigate("/admin/", {
          replace: true,
        });
      } else if (role === "staff") {
        navigate("/staff/", {
          replace: true,
        });
      } else if (role === "user") {
        navigate("/user/", {
          replace: true,
        });
      } else {
        console.error("❌ Invalid role:", role);

        navigate("/", {
          replace: true,
        });
      }
    } catch (err) {
      console.error("❌ Login error:", err);

      if (errorCallback) {
        errorCallback(err);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleLogout = () => {
    console.log("🚪 Logging out...");

    // ----------------------------------------------------------
    // Clear React state
    // ----------------------------------------------------------

    setUser(null);

    setAccessToken("");

    // ----------------------------------------------------------
    // Clear localStorage
    // ----------------------------------------------------------

    window.localStorage.removeItem("userData");

    window.localStorage.removeItem(authConfig.storageTokenKeyName);

    window.localStorage.removeItem("refreshToken");

    window.localStorage.removeItem("role");

    // ----------------------------------------------------------
    // Clear sessionStorage
    // ----------------------------------------------------------

    window.sessionStorage.removeItem("userData");

    window.sessionStorage.removeItem(authConfig.storageTokenKeyName);

    window.sessionStorage.removeItem("refreshToken");

    window.sessionStorage.removeItem("role");

    window.sessionStorage.removeItem("isRedirected");

    // ----------------------------------------------------------
    // Redirect to login
    // ----------------------------------------------------------

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================================
  // GET ACCESS TOKEN + USER ROLE
  // ==========================================================

  const getAccessTokenAndUserData = () => {
    const accessToken =
      window.localStorage.getItem(authConfig.storageTokenKeyName) ||
      window.sessionStorage.getItem(authConfig.storageTokenKeyName);

    const role =
      window.localStorage.getItem("role") ||
      window.sessionStorage.getItem("role");

    if (!accessToken || !role) {
      console.error("❌ No access token or user role found");

      handleLogout();

      throw new Error("Missing token or user data");
    }

    return {
      accessToken,
      role,
    };
  };

  // ==========================================================
  // VERIFY TOKEN
  // ==========================================================

  const verifyToken = async (refreshUrl, accessToken) => {
    try {
      const response = await axios.get(refreshUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,

          "Content-Type": "application/json",
        },
      });

      if (response?.data && response.status === 200) {
        console.log("✅ Refresh token is valid");

        return true;
      }

      console.warn("⚠️ Invalid token, logging out...");

      handleLogout();

      throw new Error("Invalid refresh token");
    } catch (error) {
      console.error(
        "🚨 Error verifying token:",
        error?.response?.data || error.message,
      );

      handleLogout();

      throw new Error("Error verifying refresh token");
    }
  };

  // ==========================================================
  // VERIFY ADMIN TOKEN
  // ==========================================================

  const verifyAdminToken = async () => {
    const { accessToken, role } = getAccessTokenAndUserData();

    if (role?.toLowerCase() !== "admin") {
      console.error("❌ Not an admin user");

      handleLogout();

      throw new Error("Unauthorized admin access");
    }

    return await verifyToken("/admin/refresh", accessToken);
  };

  // ==========================================================
  // VERIFY STAFF TOKEN
  // ==========================================================

  const verifyStaffToken = async () => {
    const { accessToken, role } = getAccessTokenAndUserData();

    if (role?.toLowerCase() !== "staff") {
      console.error("❌ Not a staff user");

      handleLogout();

      throw new Error("Unauthorized staff access");
    }

    return await verifyToken("/staff/refresh", accessToken);
  };

  // ==========================================================
  // VERIFY USER TOKEN
  // ==========================================================

  const verifyUserToken = async () => {
    const { accessToken, role } = getAccessTokenAndUserData();

    if (role?.toLowerCase() !== "user") {
      console.error("❌ Not a regular user");

      handleLogout();

      throw new Error("Unauthorized user access");
    }

    return await verifyToken("/user/refresh", accessToken);
  };

  const values = {
    user,

    accessToken,

    loading,

    loginLoading,

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

export { AuthContext, AuthProvider };
