import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosInstance from "@/store/components/axiosInstance";
import axiosInstance from "../../components/axiosInstance";
import createDataSlice from "@/store/components/createDataSlice";
import handleError from "@/store/components/handleError";
import saveToRedux from "@/store/components/saveToRedux";

const modelName = "Staff";
const tableName = "staffs";
const pathName = "staffs";

// ** Fetch Records
export const fetchRecords = createAsyncThunk(
    `${modelName}s/fetch${pathName}s`,
    async (params, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(pathName, { params });
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
    `${modelName}s/fetch${modelName}ById`,
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${pathName}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Fetch staff by ID error:", error);

            return rejectWithValue(
                error.response?.data || {
                    message: error.message || `Failed to fetch ${modelName}`,
                }
            );
        }
    }
);

// ==========================================
// ADD RECORD
// ==========================================

export const addRecord = createAsyncThunk(
    `${modelName}s/add${modelName}`,
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${pathName}`, data);

            return response.data;
        } catch (error) {
            console.error("API Error:", error);

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
    `${modelName}s/update${modelName}`,
    async (data, { getState, dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${pathName}/${data.id}`,
                data
            );

            dispatch(fetchRecords(getState().centers?.params));

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
    `${modelName}s/delete${modelName}`,
    async (id, { getState, dispatch, rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${pathName}/${id}`);

            dispatch(fetchRecords(getState().centers?.params));

            return id;
        } catch (error) {
            handleError(error, 500);

            return rejectWithValue(
                error.response?.data || {
                    message: error.message || `Failed to delete ${modelName}`,
                }
            );
        }
    }
);

// ==========================================
// FETCH AVAILABLE STAFF FOR EACH SERVICE
// ==========================================

export const fetchAvailableStaff = createAsyncThunk(
    `${modelName}s/fetchAvailableStaff`,
    async (
        { serviceId, date, start_time },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post("available-staff", {
                service_id: serviceId,
                date,
                start_time,
            });

            return {
                serviceId,
                data: response.data.data ?? [],
            };
        } catch (error) {
            console.error(
                "Fetch available staff error:",
                error.response?.data || error
            );

            return rejectWithValue({
                serviceId,
                message:
                    error.response?.data?.message ||
                    "Failed to fetch available staff",
            });
        }
    }
);

// ==========================================
// ROLE ID WISE ROLE DATA
// ==========================================

export const IdWiseRoleData = createAsyncThunk(
    "roles/getRoleData",
    async (roleId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                pathName + `/${roleId}`
            );

            return response.data.data;
        } catch (error) {
            if (error.response?.status === 422) {
                const { message, errors } = error.response.data;

                return rejectWithValue({ message, errors });
            }

            return rejectWithValue(
                error.message || "An error occurred"
            );
        }
    }
);

// ==========================================
// INITIAL STATE
// ==========================================

const initialState = {
    data: [],

    // Staff grouped by service ID
    availableStaff: {},

    // Loading status grouped by service ID
    availableStaffLoadingByService: {},

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
    // FETCH RECORDS
    // --------------------------------------

    builder.addCase(fetchRecords.pending, (state) => {
        state.loading = true;
    });

    builder.addCase(fetchRecords.fulfilled, (state, action) => {
        saveToRedux(state, action.payload);
        state.loading = false;
    });

    builder.addCase(fetchRecords.rejected, (state, action) => {
        state.message =
            action.payload?.message || `Failed to fetch ${modelName}s!`;

        state.loading = false;
    });

    // --------------------------------------
    // FETCH RECORD BY ID
    // --------------------------------------

    builder.addCase(fetchRecordById.pending, (state) => {
        state.loading = true;
        state.message = "";
    });

    builder.addCase(fetchRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecord = action.payload.data;
    });

    builder.addCase(fetchRecordById.rejected, (state, action) => {
        state.loading = false;

        state.message =
            action.payload?.message ||
            `Failed to fetch ${modelName} by ID!`;
    });

    // --------------------------------------
    // ADD RECORD
    // --------------------------------------

    builder.addCase(addRecord.pending, (state) => {
        state.loading = true;
    });

    builder.addCase(addRecord.fulfilled, (state, action) => {
        saveToRedux(state, action.payload);
        state.loading = false;
    });

    builder.addCase(addRecord.rejected, (state, action) => {
        state.message =
            action.payload?.message || `Failed to add ${modelName}!`;

        state.loading = false;
    });

    // --------------------------------------
    // UPDATE RECORD
    // --------------------------------------

    builder.addCase(updateRecord.pending, (state) => {
        state.loading = true;
    });

    builder.addCase(updateRecord.fulfilled, (state, action) => {
        saveToRedux(state, action.payload);
        state.loading = false;
    });

    builder.addCase(updateRecord.rejected, (state, action) => {
        state.message =
            action.payload?.message || `Failed to update ${modelName}!`;

        state.loading = false;
    });

    // --------------------------------------
    // DELETE RECORD
    // --------------------------------------

    builder.addCase(deleteRecord.pending, (state) => {
        state.loading = true;
    });

    builder.addCase(deleteRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter(
            (item) => item.id !== action.payload
        );
    });

    builder.addCase(deleteRecord.rejected, (state, action) => {
        state.message =
            action.payload?.message || `Failed to delete ${modelName}!`;

        state.loading = false;
    });

    // --------------------------------------
    // FETCH AVAILABLE STAFF
    // --------------------------------------

    builder.addCase(fetchAvailableStaff.pending, (state, action) => {
        const serviceId = action.meta.arg.serviceId;

        state.availableStaffLoadingByService[serviceId] = true;
    });

    builder.addCase(fetchAvailableStaff.fulfilled, (state, action) => {
        const { serviceId, data } = action.payload;

        // Store staff for the particular service
        state.availableStaff[serviceId] = Array.isArray(data)
            ? data
            : [];

        state.availableStaffLoadingByService[serviceId] = false;
    });

    builder.addCase(fetchAvailableStaff.rejected, (state, action) => {
        const serviceId =
            action.payload?.serviceId ?? action.meta.arg.serviceId;

        state.availableStaffLoadingByService[serviceId] = false;

        state.message =
            action.payload?.message || "Failed to fetch available staff";
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