import api from "./api";

export const userService = {
  list: () => api.get("/users"),
  profile: () => api.get("/users/profile"),
  updateProfile: (payload) => api.patch("/users/profile", payload),
};
