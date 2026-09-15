import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UIState {
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
  locale: string;
  breadcrumbs: Array<{ label: string; path?: string }>;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: "light",
  locale: "en",
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
    setLocale: (state, action: PayloadAction<string>) => {
      state.locale = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; path?: string }>>) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setTheme, setLocale, setBreadcrumbs } = uiSlice.actions;
export default uiSlice.reducer;