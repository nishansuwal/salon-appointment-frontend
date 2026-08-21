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

export const store = configureStore({
  reducer: {
    users,
    adminServices,
    categories,
    images,
    userServices,
    staffs,
    settings,
    testimonials,
    faqs,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
