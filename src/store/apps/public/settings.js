import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../components/axiosInstance";
import createDataSlice from "@/store/components/createDataSlice";
import handleError from "@/store/components/handleError";
import saveToRedux from "@/store/components/saveToRedux";

const modelName = "Setting";
const tableName = "settings";
const pathName = "settings";

// Fetch Settings
export const fetchRecords = createAsyncThunk(
  `${modelName}s/fetch${pathName}s`,
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(pathName, { params });

      return response.data;
    } catch (error) {
      handleError(error);
      return rejectWithValue(error.response?.data);
    }
  },
);

// Update Settings
export const updateRecord = createAsyncThunk(
  `${modelName}s/update${modelName}`,
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${pathName}/update`, data);

      return response.data;
    } catch (error) {
      handleError(error);
      return rejectWithValue(error.response?.data);
    }
  },
);

const initialState = {
  data: null,
  message: "",
  loading: false,
};

const extraReducers = (builder) => {
  // FETCH
  builder.addCase(fetchRecords.pending, (state) => {
    state.loading = true;
  });

  builder.addCase(fetchRecords.fulfilled, (state, action) => {
    saveToRedux(state, action.payload);
    state.loading = false;
  });

  builder.addCase(fetchRecords.rejected, (state, action) => {
    state.message = action.payload?.message || "Failed to fetch settings!";
    state.loading = false;
  });

  // UPDATE
  builder.addCase(updateRecord.pending, (state) => {
    state.loading = true;
  });

  builder.addCase(updateRecord.fulfilled, (state, action) => {
    saveToRedux(state, action.payload);
    state.loading = false;
  });

  builder.addCase(updateRecord.rejected, (state, action) => {
    state.message = action.payload?.message || "Failed to update settings!";
    state.loading = false;
  });
};

export const dataSlice = createDataSlice(
  tableName,
  extraReducers,
  initialState,
);

export default dataSlice.reducer;
