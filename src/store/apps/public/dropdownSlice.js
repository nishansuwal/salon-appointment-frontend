import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../components/axiosInstance";
import handleError from "@/store/components/handleError";

// Fetch Dropdown Data
export const fetchDropdownData = createAsyncThunk(
  "dropdown/fetchDropdownData",
  async ({ key, ...params }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/dropdown/options", params);

      return {
        key,
        data: response.data.data ?? [],
        message: response.data.message ?? "",
      };
    } catch (error) {
      handleError(error);

      return rejectWithValue({
        key,
        ...(error.response?.data || {
          message: "Failed to fetch dropdown data",
        }),
      });
    }
  }
);

const initialState = {
  dataByKey: {},
  loadingByKey: {},
  errorByKey: {},
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,

  reducers: {
    clearDropdown: (state, action) => {
      const key = action.payload;

      delete state.dataByKey[key];
      delete state.loadingByKey[key];
      delete state.errorByKey[key];
    },

    clearAllDropdowns: (state) => {
      state.dataByKey = {};
      state.loadingByKey = {};
      state.errorByKey = {};
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDropdownData.pending, (state, action) => {
        const key = action.meta.arg.key;

        state.loadingByKey[key] = true;
        state.errorByKey[key] = null;
      })

      .addCase(fetchDropdownData.fulfilled, (state, action) => {
        const { key, data } = action.payload;

        state.dataByKey[key] = data;
        state.loadingByKey[key] = false;
      })

      .addCase(fetchDropdownData.rejected, (state, action) => {
        const key = action.meta.arg.key;

        state.loadingByKey[key] = false;
        state.errorByKey[key] =
          action.payload?.message || "Failed to fetch dropdown data";
      });
  },
});

export const {
  clearDropdown,
  clearAllDropdowns,
} = dropdownSlice.actions;

export default dropdownSlice.reducer;