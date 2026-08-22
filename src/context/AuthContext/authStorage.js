// src/context/AuthContext/authStorage.js

import authConfig from "../../configs/auth";

const TOKEN_KEY =
  authConfig.storageTokenKeyName;

const getStorage = () => {
  const localToken =
    window.localStorage.getItem(TOKEN_KEY);

  return localToken
    ? window.localStorage
    : window.sessionStorage;
};

export const getAuthData = () => {
  const storage = getStorage();

  const accessToken =
    storage.getItem(TOKEN_KEY);

  const refreshToken =
    storage.getItem("refreshToken");

  const userData =
    storage.getItem("userData");

  const role =
    storage.getItem("role");

  let user = null;

  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch (error) {
      console.error(
        "Invalid userData:",
        error,
      );
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    role,
    storage,
  };
};

export const saveAuthData = ({
  accessToken,
  refreshToken,
  user,
  rememberMe = false,
}) => {
  const storage = rememberMe
    ? window.localStorage
    : window.sessionStorage;

  const role =
    user?.role?.toLowerCase() || "user";

  storage.setItem(
    TOKEN_KEY,
    accessToken,
  );

  storage.setItem(
    "refreshToken",
    refreshToken,
  );

  storage.setItem(
    "userData",
    JSON.stringify(user),
  );

  storage.setItem(
    "role",
    role,
  );
};

export const clearAuthData = () => {
  // Local storage
  window.localStorage.removeItem(
    TOKEN_KEY,
  );

  window.localStorage.removeItem(
    "refreshToken",
  );

  window.localStorage.removeItem(
    "userData",
  );

  window.localStorage.removeItem(
    "role",
  );

  // Session storage
  window.sessionStorage.removeItem(
    TOKEN_KEY,
  );

  window.sessionStorage.removeItem(
    "refreshToken",
  );

  window.sessionStorage.removeItem(
    "userData",
  );

  window.sessionStorage.removeItem(
    "role",
  );

  window.sessionStorage.removeItem(
    "isRedirected",
  );
};