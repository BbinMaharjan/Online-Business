import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { AdminUser } from "../types";
import apiClient from "@/lib/apiClient";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminUser | null;
  permissions: string[];
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  admin: null,
  permissions: [],
  accessToken: null,
  refreshToken: null,
};

export const loadAdmin = createAsyncThunk(
  "auth/loadAdmin",
  async (_, { rejectWithValue, getState }) => {
    const state = getState() as { auth: AuthState };
    const { accessToken, isAuthenticated } = state.auth;

    if (isAuthenticated && accessToken) {
      try {
        const response = await apiClient.get<{
          success: boolean;
          data: { admin: AdminUser };
        }>("/auth/me");
        if (response.data.success) {
          return response.data.data.admin;
        }
      } catch {
        // Silently fail - user is already authenticated via login
      }
      return rejectWithValue("Already authenticated");
    }

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: { admin: AdminUser };
      }>("/auth/me");
      if (response.data.success) {
        return response.data.data.admin;
      }
      return rejectWithValue("Failed to load admin");
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to load admin");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        admin: AdminUser;
        permissions: string[];
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.admin = action.payload.admin;
      state.permissions = action.payload.permissions;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.admin = null;
      state.permissions = [];
      state.accessToken = null;
      state.refreshToken = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    updateAdmin: (state, action: PayloadAction<Partial<AdminUser>>) => {
      if (state.admin) {
        state.admin = { ...state.admin, ...action.payload };
      }
    },
    initAuth: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadAdmin.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.admin = action.payload;
        state.permissions = action.payload.permissions || [];
      })
      .addCase(loadAdmin.rejected, (state, action) => {
        if (action.payload !== "Already authenticated") {
          state.isAuthenticated = false;
          state.isLoading = false;
          state.admin = null;
          state.permissions = [];
          state.accessToken = null;
          state.refreshToken = null;
        } else {
          state.isLoading = false;
        }
      });
  },
});

export const { setAuth, clearAuth, setLoading, setAccessToken, setRefreshToken, updateAdmin, initAuth } =
  authSlice.actions;
export default authSlice.reducer;
