import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PermissionState {
  permissions: string[];
  roles: Record<string, string[]>;
}

const initialState: PermissionState = {
  permissions: [],
  roles: {},
};

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    setRoles: (state, action: PayloadAction<Record<string, string[]>>) => {
      state.roles = action.payload;
    },
    addPermission: (state, action: PayloadAction<string>) => {
      if (!state.permissions.includes(action.payload)) {
        state.permissions.push(action.payload);
      }
    },
    removePermission: (state, action: PayloadAction<string>) => {
      state.permissions = state.permissions.filter((p) => p !== action.payload);
    },
  },
});

export const { setPermissions, setRoles, addPermission, removePermission } = permissionSlice.actions;
export default permissionSlice.reducer;