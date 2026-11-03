
import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../components/axiosInstance";
import createDataSlice from "@/store/components/createDataSlice";
import handleError from "@/store/components/handleError";
import saveToRedux from "@/store/components/saveToRedux";

const modelName = "Profile";
const tableName = "profiles";
const pathName = "/profile";

// ==========================================
// FETCH ALL RECORDS
// ==========================================

export const fetchAllRecords = createAsyncThunk(
  `${modelName}s/fetchAllRecords`,
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${pathName}/all`,
        { params }
      );

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || `Failed to fetch ${modelName}s`,
        }
      );
    }
  }
);

// ==========================================
// FETCH RECORD BY ID
// ==========================================

export const fetchRecordById = createAsyncThunk(
  `${modelName}s/fetchRecordById`,
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${pathName}/${id}`
      );

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || `Failed to fetch ${modelName}`,
        }
      );
    }
  }
);

// ==========================================
// UPDATE RECORD
// ==========================================

export const updateRecord = createAsyncThunk(
  `${modelName}s/updateRecord`,
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${pathName}/${data.id}`,
        data
      );

      dispatch(fetchAllRecords());

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || `Failed to update ${modelName}`,
        }
      );
    }
  }
);

// ==========================================
// DELETE RECORD
// ==========================================

export const deleteRecord = createAsyncThunk(
  `${modelName}s/deleteRecord`,
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${pathName}/${id}`);

      dispatch(fetchAllRecords());

      return id;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || `Failed to delete ${modelName}`,
        }
      );
    }
  }
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
  data: [],
  selectedRecord: null,
  message: "",
  nextPageUrl: null,
  prevPageUrl: null,
  total: 0,
  loading: false,
};

// ==========================================
// EXTRA REDUCERS
// ==========================================

const extraReducers = (builder) => {
  // --------------------------------------
  // FETCH ALL RECORDS
  // --------------------------------------

  builder.addCase(fetchAllRecords.pending, (state) => {
    state.loading = true;
    state.message = "";
  });

  builder.addCase(fetchAllRecords.fulfilled, (state, action) => {
    saveToRedux(state, action.payload);
    state.loading = false;
  });

  builder.addCase(fetchAllRecords.rejected, (state, action) => {
    state.loading = false;
    state.message =
      action.payload?.message ||
      `Failed to fetch ${modelName}s!`;
  });

  // --------------------------------------
  // FETCH RECORD BY ID
  // --------------------------------------

  builder.addCase(fetchRecordById.pending, (state) => {
    state.loading = true;
    state.message = "";
    state.selectedRecord = null;
  });

  builder.addCase(fetchRecordById.fulfilled, (state, action) => {
    state.loading = false;
    state.selectedRecord = action.payload?.data ?? null;
  });

  builder.addCase(fetchRecordById.rejected, (state, action) => {
    state.loading = false;
    state.message =
      action.payload?.message ||
      `Failed to fetch ${modelName} by ID!`;
  });

  // --------------------------------------
  // UPDATE RECORD
  // --------------------------------------

  builder.addCase(updateRecord.pending, (state) => {
    state.loading = true;
    state.message = "";
  });

  builder.addCase(updateRecord.fulfilled, (state, action) => {
    state.loading = false;
    state.message = action.payload?.message || "";
    saveToRedux(state, action.payload);
  });

  builder.addCase(updateRecord.rejected, (state, action) => {
    state.loading = false;
    state.message =
      action.payload?.message ||
      `Failed to update ${modelName}!`;
  });

  // --------------------------------------
  // DELETE RECORD
  // --------------------------------------

  builder.addCase(deleteRecord.pending, (state) => {
    state.loading = true;
    state.message = "";
  });

  builder.addCase(deleteRecord.fulfilled, (state, action) => {
    state.loading = false;

    // Handle both array and paginated Redux data
    if (Array.isArray(state.data)) {
      state.data = state.data.filter(
        (item) => item.id !== action.payload
      );
    } else if (Array.isArray(state.data?.data)) {
      state.data.data = state.data.data.filter(
        (item) => item.id !== action.payload
      );
    }
  });

  builder.addCase(deleteRecord.rejected, (state, action) => {
    state.loading = false;
    state.message =
      action.payload?.message ||
      `Failed to delete ${modelName}!`;
  });
};

// ==========================================
// CREATE SLICE
// ==========================================

export const dataSlice = createDataSlice(
  tableName,
  extraReducers,
  initialState
);

export default dataSlice.reducer;
