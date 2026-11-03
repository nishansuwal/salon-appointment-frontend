
import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../components/axiosInstance";
import createDataSlice from "@/store/components/createDataSlice";
import handleError from "@/store/components/handleError";
import saveToRedux from "@/store/components/saveToRedux";

const modelName = "Appointment";
const tableName = "appointments";
const pathName = "/appointments";

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
// UPDATE APPOINTMENT STATUS
// ==========================================

export const updateRecordStatus = createAsyncThunk(
  `${modelName}s/updateRecordStatus`,
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `${pathName}/${data.id}/status`,
        {
          status: data.status,
        }
      );

      // Refresh appointment list
      dispatch(fetchAllRecords());

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || `Failed to update ${modelName} status`,
        }
      );
    }
  }
);

// ==========================================
// ADD RECORD
// ==========================================

export const addRecord = createAsyncThunk(
  `${modelName}s/addRecord`,
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        pathName,
        data
      );

      // Refresh appointment list
      dispatch(fetchAllRecords());

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: error.message || `Failed to add ${modelName}`,
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
      await axiosInstance.delete(
        `${pathName}/${id}`
      );

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

  builder
    .addCase(fetchAllRecords.pending, (state) => {
      state.loading = true;
      state.message = "";
    })

    .addCase(fetchAllRecords.fulfilled, (state, action) => {
      saveToRedux(state, action.payload);
      state.loading = false;
    })

    .addCase(fetchAllRecords.rejected, (state, action) => {
      state.loading = false;

      state.message =
        action.payload?.message ||
        `Failed to fetch ${modelName}s!`;
    });

  // --------------------------------------
  // FETCH RECORD BY ID
  // --------------------------------------

  builder
    .addCase(fetchRecordById.pending, (state) => {
      state.loading = true;
      state.message = "";
    })

    .addCase(fetchRecordById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedRecord = action.payload.data;
    })

    .addCase(fetchRecordById.rejected, (state, action) => {
      state.loading = false;

      state.message =
        action.payload?.message ||
        `Failed to fetch ${modelName} by ID!`;
    });

  // --------------------------------------
  // ADD RECORD
  // --------------------------------------

  builder
    .addCase(addRecord.pending, (state) => {
      state.loading = true;
      state.message = "";
    })

    .addCase(addRecord.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload?.message || "";
      saveToRedux(state, action.payload);
    })

    .addCase(addRecord.rejected, (state, action) => {
      state.loading = false;

      state.message =
        action.payload?.message ||
        `Failed to add ${modelName}!`;
    });

  // --------------------------------------
  // UPDATE RECORD
  // --------------------------------------

  builder
    .addCase(updateRecord.pending, (state) => {
      state.loading = true;
      state.message = "";
    })

    .addCase(updateRecord.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload?.message || "";
      saveToRedux(state, action.payload);
    })

    .addCase(updateRecord.rejected, (state, action) => {
      state.loading = false;

      state.message =
        action.payload?.message ||
        `Failed to update ${modelName}!`;
    });

  // --------------------------------------
  // UPDATE STATUS
  // --------------------------------------

  builder
    .addCase(updateRecordStatus.pending, (state) => {
      state.loading = true;
      state.message = "";
    })

    .addCase(updateRecordStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload?.message || "";
    })

    .addCase(updateRecordStatus.rejected, (state, action) => {
      state.loading = false;

      state.message =
        action.payload?.message ||
        `Failed to update ${modelName} status!`;
    });

  // --------------------------------------
  // DELETE RECORD
  // --------------------------------------

  builder
    .addCase(deleteRecord.pending, (state) => {
      state.loading = true;
      state.message = "";
    })

    .addCase(deleteRecord.fulfilled, (state, action) => {
      state.loading = false;

      state.data = state.data.filter(
        (item) => item.id !== action.payload
      );
    })

    .addCase(deleteRecord.rejected, (state, action) => {
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
