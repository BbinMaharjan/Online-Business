import { Components } from "@mui/material/styles";

export const components: Components = {
  MuiCssBaseline: {
    styleOverrides: {
      "*": {
        boxSizing: "border-box",
      },
      html: {
        MozOsxFontSmoothing: "grayscale",
        WebkitFontSmoothing: "antialiased",
        scrollBehavior: "smooth",
      },
      body: {
        scrollbarWidth: "thin",
        scrollbarColor: "#bdbdbd transparent",
        "&::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#bdbdbd",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#9e9e9e",
        },
      },
      "#__next": {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      },
    },
  },
  MuiContainer: {
    styleOverrides: {
      root: {
        paddingLeft: 16,
        paddingRight: 16,
        "@media (min-width:600px)": {
          paddingLeft: 24,
          paddingRight: 24,
        },
        "@media (min-width:900px)": {
          paddingLeft: 32,
          paddingRight: 32,
        },
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      size: "medium",
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 600,
        borderRadius: 8,
        padding: "10px 20px",
        transition: "all 0.2s ease-in-out",
      },
      contained: {
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
          transform: "translateY(-1px)",
        },
        "&:active": {
          transform: "translateY(0)",
        },
      },
      outlined: {
        borderWidth: 2,
        "&:hover": {
          borderWidth: 2,
          backgroundColor: "rgba(25, 118, 210, 0.04)",
        },
      },
      sizeSmall: {
        padding: "6px 12px",
        fontSize: "0.8125rem",
      },
      sizeLarge: {
        padding: "14px 28px",
        fontSize: "1rem",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: "1px solid #e0e0e0",
        boxShadow: "none",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
          borderColor: "#bdbdbd",
        },
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 16,
        "&:last-child": {
          paddingBottom: 16,
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: "small",
      variant: "outlined",
      fullWidth: true,
    },
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
          backgroundColor: "#fafafa",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "#f5f5f5",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
            },
          },
          "&.Mui-focused": {
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: 2,
            },
          },
        },
        "& .MuiInputLabel-root": {
          fontWeight: 500,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        fontSize: "0.875rem",
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        "& .MuiOutlinedInput-notchedOutline": {
          borderWidth: 1,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        borderRadius: 6,
      },
      sizeSmall: {
        height: 24,
        fontSize: "0.75rem",
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: "1px solid #e0e0e0",
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: "#fafafa",
        "& .MuiTableCell-head": {
          fontWeight: 600,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "#616161",
          borderBottom: "2px solid #e0e0e0",
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "12px 16px",
        borderBottom: "1px solid #f0f0f0",
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        "&:last-child .MuiTableCell-root": {
          borderBottom: "none",
        },
        "&:hover": {
          backgroundColor: "#fafafa",
        },
      },
    },
  },
  MuiPagination: {
    styleOverrides: {
      root: {
        "& .MuiPaginationItem-root": {
          borderRadius: 8,
          margin: "0 4px",
          minWidth: 36,
          height: 36,
          fontWeight: 500,
          "&.Mui-selected": {
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          },
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: 48,
      },
      indicator: {
        height: 3,
        borderRadius: "3px 3px 0 0",
      },
    },
  },
  MuiTab: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        fontWeight: 500,
        fontSize: "0.875rem",
        minHeight: 48,
        padding: "0 16px",
        "&.Mui-selected": {
          color: "#1976d2",
        },
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        "& .MuiAlert-icon": {
          fontSize: 20,
        },
      },
      standardSuccess: {
        backgroundColor: "#e8f5e9",
        color: "#1b5e20",
      },
      standardError: {
        backgroundColor: "#fdeaea",
        color: "#b71c1c",
      },
      standardWarning: {
        backgroundColor: "#fff8e1",
        color: "#e65100",
      },
      standardInfo: {
        backgroundColor: "#e3f2fd",
        color: "#0d47a1",
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
        padding: 8,
      },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: "1.25rem",
        fontWeight: 600,
        padding: "16px 24px",
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: "0 24px 16px",
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: "8px 16px 16px",
        gap: 8,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRight: "1px solid #e0e0e0",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e0e0e0",
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: "0.75rem",
        fontWeight: 500,
        backgroundColor: "#212121",
      },
      arrow: {
        color: "#212121",
      },
    },
  },
  MuiBreadcrumb: {
    styleOverrides: {
      root: {
        "& .MuiBreadcrumb-separator": {
          color: "#9e9e9e",
        },
      },
    },
  },
  MuiLink: {
    defaultProps: {
      underline: "hover",
    },
    styleOverrides: {
      root: {
        fontWeight: 500,
        transition: "color 0.2s ease-in-out",
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiRating: {
    styleOverrides: {
      root: {
        "& .MuiRating-iconFilled": {
          color: "#ffb300",
        },
        "& .MuiRating-iconHover": {
          color: "#ffb300",
        },
      },
    },
  },
  MuiSkeleton: {
    styleOverrides: {
      root: {
        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
        animation: "$shimmer 1.5s infinite",
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      root: {
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        "&:before": {
          display: "none",
        },
        "&:first-of-type": {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        "&:last-of-type": {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        padding: "12px 16px",
        "& .MuiAccordionSummary-content": {
          margin: 0,
        },
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: "0 16px 16px",
      },
    },
  },
};