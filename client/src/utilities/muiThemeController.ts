import { createTheme } from "@mui/material/styles";
import type { ModeType } from "../constants/genericConstants";
import type { PaletteMode } from "@mui/material/styles";

export const getTheme = (mode: ModeType) => {
  const themeMode: PaletteMode = mode === true ? "light" : "dark";

  return createTheme({
    typography: {
      fontFamily: ["'Roboto'", "sans-serif"].join(","),
    },
    palette: {
      mode: themeMode,
      primary: { main: mode ? "#f5f5f5" : "#23272b" },
      background: {
        default: mode ? "#f5f5f5" : "#23272b",
      },
      text: {
        primary: mode ? "#23272b" : "#f5f5f5",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {},
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {},
        },
      },
      MuiButton: {
        styleOverrides: {
          contained: {},
          outlined: {},
        },
      },
    },
  });
};
