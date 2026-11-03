import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/store/components/axiosInstance";
import createDataSlice from "@/store/components/createDataSlice";
import handleError from "@/store/components/handleError";
import saveToRedux from "@/store/components/saveToRedux";

const modelName = "StaffAppointment";
const tableName = "staffAppointments";
const pathName = "/staff/appointments";

// Fetch staff appointments
export const fetchRecords = createAsyncThunk(
  `${modelName}/fetchRecords`,
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(pathName, { params });
      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || "Failed to fetch appointments.",
        }
      );
    }
  }
);

// Fetch single appointment
export const fetchRecordById = createAsyncThunk(
  `${modelName}/fetchRecordById`,
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${pathName}/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || "Failed to fetch appointment details.",
        }
      );
    }
  }
);

// Update appointment status
export const updateAppointmentStatus = createAsyncThunk(
  `${modelName}/updateAppointmentStatus`,
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.patch(
        `${pathName}/${id}/status`,
        { status }
      );

      // Refresh appointment list after updating status
      dispatch(fetchRecords());

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || "Failed to update appointment status.",
        }
      );
    }
  }
);

const initialState = {
  data: [],
  selectedRecord: null,
  message: "",
  nextPageUrl: null,
  prevPageUrl: null,
  total: 0,
  loading: false,
  detailsLoading: false,
  statusLoading: false,
};

const extraReducers = (builder) => {
  // FETCH APPOINTMENTS
  builder
    .addCase(fetchRecords.pending, (state) => {
      state.loading = true;
      state.message = "";
    })
    .addCase(fetchRecords.fulfilled, (state, action) => {
      saveToRedux(state, action.payload);
      state.loading = false;
    })
    .addCase(fetchRecords.rejected, (state, action) => {
      state.loading = false;
      state.message =
        action.payload?.message || "Failed to fetch appointments.";
    });

  // FETCH SINGLE APPOINTMENT
  builder
    .addCase(fetchRecordById.pending, (state) => {
      state.detailsLoading = true;
    })
    .addCase(fetchRecordById.fulfilled, (state, action) => {
      state.detailsLoading = false;
      state.selectedRecord = action.payload?.data ?? action.payload;
    })
    .addCase(fetchRecordById.rejected, (state, action) => {
      state.detailsLoading = false;
      state.message =
        action.payload?.message || "Failed to fetch appointment details.";
    });

  // UPDATE APPOINTMENT STATUS
  builder
    .addCase(updateAppointmentStatus.pending, (state) => {
      state.statusLoading = true;
      state.message = "";
    })
    .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
      state.statusLoading = false;
      state.message = action.payload?.message || "Status updated successfully.";
    })
    .addCase(updateAppointmentStatus.rejected, (state, action) => {
      state.statusLoading = false;
      state.message =
        action.payload?.message || "Failed to update appointment status.";
    });
};

const dataSlice = createDataSlice(
  tableName,
  extraReducers,
  initialState
);

export default dataSlice.reducer;