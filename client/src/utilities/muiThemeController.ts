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
      MuiDrawer: {
        styleOverrides: {
          paper: {
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
        styleOverrides: {
          root: {
            textTransform: "none",
            fontSize: "1rem",
            borderRadius: 0,
            fontWeight: 600,
            color: mode ? textColor.dark : textColor.light,
            ":hover": {
              borderBottom: `2px solid ${
                mode ? backgroundColor.dark : backgroundColor.light
              }`,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode ? textColor.dark : textColor.light,
          },
        },
      },
    },
  });
};
