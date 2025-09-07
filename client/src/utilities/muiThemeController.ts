import { createTheme } from "@mui/material/styles";
import type { ModeType } from "../constants/genericConstants";
import type { PaletteMode } from "@mui/material/styles";

const backgroundColor = {
  light: "#f5f5f5",
  dark: "#23272b",
};

const textColor = {
  light: "#f5f5f5",
  dark: "#000000ff",
};

export const getTheme = (mode: ModeType) => {
  const themeMode: PaletteMode = mode === true ? "light" : "dark";

  return createTheme({
    typography: {
      fontFamily: ["'Roboto'", "sans-serif"].join(","),
    },
    palette: {
      mode: themeMode,
      primary: { main: mode ? backgroundColor.light : backgroundColor.dark },
      background: {
        default: mode ? backgroundColor.light : backgroundColor.dark,
      },
      text: {
        primary: mode ? textColor.dark : textColor.light,
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
        defaultProps: {
          variant: "contained",
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontSize: "1rem",
            borderRadius: 0,
            fontWeight: 600,
            color: mode ? textColor.dark : textColor.light,
          },
        },
      },
    },
  });
};
