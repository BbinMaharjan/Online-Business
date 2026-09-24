import { createTheme, ThemeOptions } from "@mui/material/styles";
import { colors, darkColors } from "./colors";
import { typography } from "./typography";
import { breakpoints, spacing, shape, transitions, zIndex } from "./breakpoints";
import { components } from "./components";

const baseTheme: ThemeOptions = {
  breakpoints,
  spacing,
  shape,
  transitions,
  zIndex,
  typography,
  components,
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    ...colors,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.05)",
    "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
    "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
    "0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.15)",
  ],
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    ...darkColors,
  },
  shadows: [
    "none",
    "0 1px 2px rgba(0,0,0,0.3)",
    "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
    "0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)",
    "0 10px 15px rgba(0,0,0,0.4), 0 4px 6px rgba(0,0,0,0.2)",
    "0 20px 25px rgba(0,0,0,0.4), 0 10px 10px rgba(0,0,0,0.15)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
    "0 25px 50px rgba(0,0,0,0.5)",
  ],
});

export const theme = lightTheme;

export type AppTheme = typeof lightTheme;