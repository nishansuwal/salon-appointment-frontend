import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../components/axiosInstance";
import createDataSlice from "../components/createDataSlice";
import handleError from "../components/handleError";

const sliceName = "auth";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  user: null,

  accessToken: localStorage.getItem("accessToken") || null,

  refreshToken: localStorage.getItem("refreshToken") || null,

  isAuthenticated: !!localStorage.getItem("accessToken"),

  loading: false,

  message: "",

  error: null,
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const login = createAsyncThunk(
  `${sliceName}/login`,
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login", credentials);
      console.log(response.data);

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: "Login failed.",
        },
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const register = createAsyncThunk(
  `${sliceName}/register`,
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/register", data);

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: "Registration failed.",
        },
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| Get Logged User
|--------------------------------------------------------------------------
*/

export const getProfile = createAsyncThunk(
  `${sliceName}/profile`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/me");

      return response.data;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: "Unable to fetch profile.",
        },
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logout = createAsyncThunk(
  `${sliceName}/logout`,
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/logout");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return true;
    } catch (error) {
      handleError(error);

      return rejectWithValue(
        error.response?.data || {
          message: "Logout failed.",
        },
      );
    }
  },
);

/*
|--------------------------------------------------------------------------
| Reducers
|--------------------------------------------------------------------------
*/

const extraReducers = (builder) => {
  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  builder

    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = "";
    })

    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;

      const { user, accessToken, refreshToken } = action.payload.data;

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      state.isAuthenticated = true;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      state.message = action.payload.message;
    })

    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.message = action.payload?.message;
    });

  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  builder

    .addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(register.fulfilled, (state, action) => {
      state.loading = false;

      state.message = action.payload.message;
    })

    .addCase(register.rejected, (state, action) => {
      state.loading = false;

      state.error = action.payload;

      state.message = action.payload?.message;
    });

  /*
  |--------------------------------------------------------------------------
  | Profile
  |--------------------------------------------------------------------------
  */

  builder

    .addCase(getProfile.pending, (state) => {
      state.loading = true;
    })

    .addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;

      state.user = action.payload.data;

      state.isAuthenticated = true;
    })

    .addCase(getProfile.rejected, (state) => {
      state.loading = false;

      state.user = null;

      state.isAuthenticated = false;
    });

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  builder

    .addCase(logout.pending, (state) => {
      state.loading = true;
    })

    .addCase(logout.fulfilled, (state) => {
      state.loading = false;

      state.user = null;

      state.accessToken = null;

      state.refreshToken = null;

      state.isAuthenticated = false;

      state.message = "";

      state.error = null;
    })

    .addCase(logout.rejected, (state, action) => {
      state.loading = false;

      state.message = action.payload?.message;
    });
};

export const authSlice = createDataSlice(
  sliceName,
  extraReducers,
  initialState,
);

export default authSlice.reducer;