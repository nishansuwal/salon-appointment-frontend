import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/store/components/axiosInstance";
import createDataSlice from "@/store/components/createDataSlice";
import handleError from "@/store/components/handleError";

const modelName = "Dashboard";
const tableName = "dashboard";

// API endpoints
const endpoints = {
  user: "/user/dashboard",
  admin: "/admin/dashboard",
  staff: "/staff/dashboard",
};

// Common dashboard fetching function
const fetchDashboard = async (endpoint, rejectWithValue) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    handleError(error);

    return rejectWithValue(
      error.response?.data || {
        message: error.message || "Failed to fetch dashboard data.",
      }
    );
  }
};

// Fetch User Dashboard
export const fetchUserDashboard = createAsyncThunk(
  `${modelName}/fetchUserDashboard`,
  async (_, { rejectWithValue }) => {
    return fetchDashboard(endpoints.user, rejectWithValue);
  }
);

// Fetch Admin Dashboard
export const fetchAdminDashboard = createAsyncThunk(
  `${modelName}/fetchAdminDashboard`,
  async (_, { rejectWithValue }) => {
    return fetchDashboard(endpoints.admin, rejectWithValue);
  }
);

// Fetch Staff Dashboard
export const fetchStaffDashboard = createAsyncThunk(
  `${modelName}/fetchStaffDashboard`,
  async (_, { rejectWithValue }) => {
    return fetchDashboard(endpoints.staff, rejectWithValue);
  }
);

const initialState = {
  user: null,
  admin: null,
  staff: null,

  userLoading: false,
  adminLoading: false,
  staffLoading: false,

  userError: null,
  adminError: null,
  staffError: null,
};

const extraReducers = (builder) => {
  // USER DASHBOARD
  builder
    .addCase(fetchUserDashboard.pending, (state) => {
      state.userLoading = true;
      state.userError = null;
    })
    .addCase(fetchUserDashboard.fulfilled, (state, action) => {
      state.userLoading = false;
      state.user = action.payload?.data ?? action.payload;
    })
    .addCase(fetchUserDashboard.rejected, (state, action) => {
      state.userLoading = false;
      state.userError =
        action.payload?.message || "Failed to fetch user dashboard.";
    });

  // ADMIN DASHBOARD
  builder
    .addCase(fetchAdminDashboard.pending, (state) => {
      state.adminLoading = true;
      state.adminError = null;
    })
    .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
      state.adminLoading = false;
      state.admin = action.payload?.data ?? action.payload;
    })
    .addCase(fetchAdminDashboard.rejected, (state, action) => {
      state.adminLoading = false;
      state.adminError =
        action.payload?.message || "Failed to fetch admin dashboard.";
    });

  // STAFF DASHBOARD
  builder
    .addCase(fetchStaffDashboard.pending, (state) => {
      state.staffLoading = true;
      state.staffError = null;
    })
    .addCase(fetchStaffDashboard.fulfilled, (state, action) => {
      state.staffLoading = false;
      state.staff = action.payload?.data ?? action.payload;
    })
    .addCase(fetchStaffDashboard.rejected, (state, action) => {
      state.staffLoading = false;
      state.staffError =
        action.payload?.message || "Failed to fetch staff dashboard.";
    });
};

const dataSlice = createDataSlice(
  tableName,
  extraReducers,
  initialState
);

export default dataSlice.reducer;