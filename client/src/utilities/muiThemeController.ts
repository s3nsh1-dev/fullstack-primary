import { createTheme } from "@mui/material/styles";
import type { ModeType } from "../constants/genericTypes";
import type { PaletteMode } from "@mui/material/styles";
import { backgroundColor, textColor } from "../constants/uiConstants";

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
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: mode
              ? backgroundColor.light
              : backgroundColor.dark,
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${
              mode ? backgroundColor.dark : backgroundColor.light
            }`,
            backgroundColor: mode
              ? backgroundColor.light
              : backgroundColor.dark,
          },
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
            backgroundColor: mode ? "#f5f5f5" : "#23272b",
          },
        },
      },
    },
  });
};
