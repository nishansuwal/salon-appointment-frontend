import api from "./api";

export const appointmentService = {
  list: () => api.get("/appointments"),
  create: (payload) => api.post("/appointments", payload),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
};
