import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../components/axiosInstance";
import createDataSlice from "@/store/components/createDataSlice";
import handleError from "@/store/components/handleError";

const sliceName = "customerServices";

/*
|--------------------------------------------------------------------------
| Fetch Active Services
|--------------------------------------------------------------------------
*/

export const fetchActiveServices = createAsyncThunk(
  `${sliceName}/fetchActiveServices`,
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/services", {
        params,
      });
      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch active services.",
        },
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| Fetch Service Detail
|--------------------------------------------------------------------------
*/

export const fetchServiceBySlug = createAsyncThunk(
  `${sliceName}/fetchServiceBySlug`,
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/services/${slug}`);

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: "Failed to fetch service.",
        },
      );
    }
  },
);

const initialState = {
  // Services
  activeServices: [],
  selectedService: null,

  // Query Params
  params: {},

  // Pagination
  currentPage: 1,
  lastPage: 1,
  perPage: 0,
  total: 0,
  nextPageUrl: null,
  prevPageUrl: null,

  // Status
  loading: false,
  message: "",
};

const extraReducers = (builder) => {
  builder

    /*
    |--------------------------------------------------------------------------
    | Active Services
    |--------------------------------------------------------------------------
    */

    .addCase(fetchActiveServices.pending, (state) => {
      state.loading = true;
      state.message = "";
    })

    .addCase(fetchActiveServices.fulfilled, (state, action) => {
      state.loading = false;

      // Save current filters
      state.params = action.meta.arg || {};

      const response = action.payload.data;

      state.activeServices = response.data ?? [];
      state.currentPage = response.current_page ?? 1;
      state.lastPage = response.last_page ?? 1;
      state.perPage = response.per_page ?? 0;
      state.total = response.total ?? 0;
      state.nextPageUrl = response.next_page_url;
      state.prevPageUrl = response.prev_page_url;

      state.message = action.payload.message ?? "";
    })

    .addCase(fetchActiveServices.rejected, (state, action) => {
      state.loading = false;

      state.message =
        action.payload?.message || "Failed to fetch active services.";
    })

    /*
    |--------------------------------------------------------------------------
    | Service Detail
    |--------------------------------------------------------------------------
    */

    .addCase(fetchServiceBySlug.pending, (state) => {
      state.loading = true;
      state.message = "";
      state.selectedService = null;
    })

    .addCase(fetchServiceBySlug.fulfilled, (state, action) => {
      state.loading = false;

      state.selectedService = action.payload.data;

      state.message = action.payload.message ?? "";
    })

    .addCase(fetchServiceBySlug.rejected, (state, action) => {
      state.loading = false;

      state.message = action.payload?.message || "Failed to fetch service.";
    });
};

export const dataSlice = createDataSlice(
  sliceName,
  extraReducers,
  initialState,
);

export default dataSlice.reducer;
