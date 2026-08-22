// src/context/AuthContext/authHelpers.js

export const getUserRole = (user) => {
  return user?.role?.toLowerCase() || "";
};

export const isAdminRole = (user) => {
  return getUserRole(user) === "admin";
};

export const isStaffRole = (user) => {
  return getUserRole(user) === "staff";
};

export const isUserRole = (user) => {
  return getUserRole(user) === "user";
};

export const getAuthState = (
  user,
  accessToken,
) => {
  const role = getUserRole(user);

  return {
    role,

    isAuthenticated: Boolean(
      user && accessToken,
    ),

    isAdmin: role === "admin",

    isStaff: role === "staff",

    isUser: role === "user",
  };
};