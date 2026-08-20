import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "@/store/components/axiosInstance";
import axiosInstance from "../../components/axiosInstance";
import createDataSlice from "@/store/components/createDataSlice";
import handleError from "@/store/components/handleError";
import saveToRedux from "@/store/components/saveToRedux";

const modelName = "Gallery";
const tableName = "gallery";
const pathName = "gallery";

// ** Fetch Records
export const fetchRecords = createAsyncThunk(
  `${modelName}s/fetch${pathName}s`,
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(pathName, { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
);

// ** Add Record
export const addRecord = createAsyncThunk(
  `${modelName}s/add${modelName}`,
  async (data, { getState, dispatch }) => {
    try {
      console.log("data", data);
      const response = await axiosInstance.post(`${pathName}`, data);
      // const response = await axios.post(pathName, data);
      console.log("response", response);
      // dispatch(fetchRecords(getState().centers?.params));
      return response.data;
    } catch (error) {
      // handleError(error);
      console.error("❌ API Error:", error);
      return Promise.reject(error); // Add this line
    }
  },
);

// ** Update Record
export const updateRecord = createAsyncThunk(
  `${modelName}s/update${modelName}`,
  async (data, { getState, dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${pathName}/${data.id}`, data);
      dispatch(fetchRecords(getState().centers?.params));
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
);

// ** Delete Record
export const deleteRecord = createAsyncThunk(
  `${modelName}s/delete${modelName}`,
  async (id, { getState, dispatch }) => {
    try {
      await axiosInstance.delete(`${pathName}/${id}`);
      dispatch(fetchRecords(getState().centers?.params));
      return id;
    } catch (error) {
      handleError(error, 500);
    }
  },
);

// ** role id wise Role data
export const IdWiseRoleData = createAsyncThunk(
  "roles/getRoleData",
  async (roleId) => {
    try {
      const response = await axiosInstance.get(pathName + `/${roleId}`);
      return response.data.data;
    } catch (error) {
      // Check if error is rejected with value
      if (error.response && error.response.status === 422) {
        // Extract error message and errors from response data
        const { message, errors } = error.response.data;

        // Construct error object with message and errors
        const errorObj = { message, errors };

        // Reject the promise with the error object
        return rejectWithValue(errorObj);
      } else {
        // If there's an error other than 422, reject the promise with the error message
        return rejectWithValue(error.message || "An error occurred");
      }
    }
  },
);

const initialState = {
  data: [], // Array to store data
  message: "", // Message from API response
  nextPageUrl: null,
  prevPageUrl: null,
  total: 0,
  loading: false,
};

const extraReducers = (builder) => {
  // *** FETCH CASES
  // API fetching state
  builder.addCase(fetchRecords.pending, (state) => {
    state.loading = true; // Set loading true to show loading screen
  });

  // API response received state (SUCCESS)
  builder.addCase(fetchRecords.fulfilled, (state, action) => {
    // Assuming action.payload is the response from the API
    saveToRedux(state, action.payload); // Saving records to redux
    state.loading = false; // Set loading false to hide loading screen
  });

  // API response received state (FAILURE)
  builder.addCase(fetchRecords.rejected, (state, action) => {
    state.message = action.payload?.message || `Failed to fetch ${modelName}s!`;
    state.loading = false; // Set loading false to hide loading screen
  });

  // *** ADD CASES
  // API fetching state
  builder.addCase(addRecord.pending, (state) => {
    state.loading = true; // Set loading true to show loading screen
  });

  // API response received state (SUCCESS)
  builder.addCase(addRecord.fulfilled, (state, action) => {
    console.log("action.payload", action.payload);
    // Assuming action.payload is the response from the API
    saveToRedux(state, action.payload); // Saving Referral Points to redux
    state.loading = false; // Set loading false to hide loading screen
  });

  // API response received state (FAILURE)
  builder.addCase(addRecord.rejected, (state, action) => {
    state.message = action.payload?.message || `Failed to add ${modelName}!`;
    state.loading = false; // Set loading false to hide loading screen
  });

  // *** UPDATE CASES
  // API fetching state
  builder.addCase(updateRecord.pending, (state) => {
    state.loading = true; // Set loading true to show loading screen
  });

  // API response received state (SUCCESS)
  builder.addCase(updateRecord.fulfilled, (state, action) => {
    // Assuming action.payload is the response from the API
    saveToRedux(state, action.payload); // Saving Referral Points to redux
    state.loading = false; // Set loading false to hide loading screen
  });

  // API response received state (FAILURE)
  builder.addCase(updateRecord.rejected, (state, action) => {
    state.message = action.payload?.message || `Failed to update ${modelName}!`;
    state.loading = false; // Set loading false to hide loading screen
  });

  // *** DELETE CASES
  // API fetching state
  builder.addCase(deleteRecord.pending, (state) => {
    state.loading = true; // Set loading true to show loading screen
  });

  // API response received state (SUCCESS)
  builder.addCase(deleteRecord.fulfilled, (state, action) => {
    // Assuming action.payload is the response from the API
    state.loading = false; // Set loading false to hide loading screen
    state.roles = state.centers?.filter((data) => data.id !== action.payload);
  });

  // API response received state (FAILURE)
  builder.addCase(deleteRecord.rejected, (state, action) => {
    state.message = action.payload?.message || `Failed to delete ${modelName}!`;
    state.loading = false; // Set loading false to hide loading screen
  });
};

export const dataSlice = createDataSlice(
  tableName,
  extraReducers,
  initialState,
);
export default dataSlice.reducer;
