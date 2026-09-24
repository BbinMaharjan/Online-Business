import { createTheme, ThemeOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    displayLarge: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displaySmall: React.CSSProperties;
    headlineLarge: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineSmall: React.CSSProperties;
    titleLarge: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleSmall: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodySmall: React.CSSProperties;
    labelLarge: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelSmall: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    displayLarge?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    headlineLarge?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineSmall?: React.CSSProperties;
    titleLarge?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
    labelLarge?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    displayLarge: true;
    displayMedium: true;
    displaySmall: true;
    headlineLarge: true;
    headlineMedium: true;
    headlineSmall: true;
    titleLarge: true;
    titleMedium: true;
    titleSmall: true;
    bodyLarge: true;
    bodyMedium: true;
    bodySmall: true;
    labelLarge: true;
    labelMedium: true;
    labelSmall: true;
  }
}

export const typography: ThemeOptions["typography"] = {
  fontFamily: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(","),
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  h3: {
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  button: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.5,
    textTransform: "none",
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.5,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  displayLarge: {
    fontSize: "clamp(3.5rem, 6vw, 5rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  displayMedium: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  displaySmall: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
  },
  headlineLarge: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  headlineMedium: {
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
    fontWeight: 600,
    lineHeight: 1.3,
  },
  headlineSmall: {
    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  titleLarge: {
    fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)",
    fontWeight: 600,
    lineHeight: 1.4,
  },
  titleMedium: {
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  titleSmall: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  bodyLarge: {
    fontSize: "1.125rem",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  bodyMedium: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  bodySmall: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  labelLarge: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.5,
  },
  labelMedium: {
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  labelSmall: {
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },
};