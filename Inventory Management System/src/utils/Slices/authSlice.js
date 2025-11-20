import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../axiosClient";

const registerUser = createAsyncThunk(
  "authSlice/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("auth/user/register", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const login = createAsyncThunk(
  "authSlice/login",
  (data, { rejectWithValue }) => {
    try {
      const response = axiosClient.post("authSlice/login", data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const authUser = createAsyncThunk(
  "authSlice/authUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/auth/authUser");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "authSlice/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("auth/logout");
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    user: null,
    isAuthenticated: false,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builders) => {
    builders
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action?.payload;
        state.error = null;
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(login.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(authUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action?.payload;
        state.error = null;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.error = action?.payload;
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
