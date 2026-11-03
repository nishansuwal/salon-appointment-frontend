// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import users from "./apps/users";
import adminServices from "./apps/admin/adminServices";
import userServices from "./apps/user/userServices";
import categories from "./apps/public/categories";
import images from "./apps/public/images";
import staffs from "./apps/public/staffs";
import settings from "./apps/public/settings";
import testimonials from "./apps/public/testimonials";
import faqs from "./apps/public/faqs";
import appointment from "./apps/public/appointment";
import userProfiles from "./apps/user/userProfiles";

import adminAppointment from "./apps/admin/adminAppointment";

import dropdownReducer from "./apps/public/dropdownSlice";
import dashboardReducer from "./apps/dashboard";

import staffAppointmentsReducer from "./apps/staff/staffAppointments";
import staffProfileReducer from "./apps/staff/staffProfiles";

export const store = configureStore({
  reducer: {
    userProfiles,
    users,
    staffProfile: staffProfileReducer,
    dashboard: dashboardReducer,
    adminServices,
    categories,
    images,
    userServices,
    staffs,
    settings,
    testimonials,
    faqs,
    appointment,
    adminAppointment,
    dropdown: dropdownReducer,
    staffAppointments: staffAppointmentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
