import { ReactNode } from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { Theme as MUITheme } from "@mui/material/styles/createTheme";

type ThemeContextValue = {
  theme: MUITheme;
  setTheme: React.Dispatch<React.SetStateAction<MUITheme>>;
};

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = React.useState<MUITheme>({
    palette: {
      mode: "light",
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <children />
    </MUIThemeProvider>
  );
};

export default ThemeProvider;
export { ThemeContextValue };