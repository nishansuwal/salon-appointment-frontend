export const PUBLIC_ROUTES = [
  "/",
  "/services",
  "/service/:slug",
  "/book-appointment",
  "/about",
  "/gallery",
];

export const GUEST_ONLY_ROUTES = ["/login", "/register"];

export const ROLE_ROUTES = {
  admin: "/admin",
  staff: "/staff",
  user: "/user",
};

export const isExactOrChildRoute = (pathname, route) => {
  return pathname === route || pathname.startsWith(`${route}/`);
};

export const isPublicRoute = (pathname) => {
  return PUBLIC_ROUTES.some((route) => {
    if (route === "/") {
      return pathname === "/";
    }

    return isExactOrChildRoute(pathname, route);
  });
};

export const isGuestOnlyRoute = (pathname) => {
  return GUEST_ONLY_ROUTES.some((route) =>
    isExactOrChildRoute(pathname, route),
  );
};

export const getRequiredRole = (pathname) => {
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

export const getDashboardByRole = (role) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/admin";

    case "staff":
      return "/staff";

    case "user":
      return "/user";

    default:
      return "/";
  }
};
