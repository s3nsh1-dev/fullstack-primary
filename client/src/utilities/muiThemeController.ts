import { createTheme } from "@mui/material/styles";
import type { ModeType } from "../constants/genericConstants";
import type { PaletteMode } from "@mui/material/styles";

const buttonColor = {
  default: "#9112BC",
  hover: "#9655c7ff",
};

const backgroundColor = {
  light: "#f5f5f5",
  dark: "#23272b",
};

const textColor = {
  light: "#f5f5f5",
  dark: "#23272b",
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
          contained: {
            textTransform: "none",
            borderRadius: 0,
            fontWeight: 600,
            fontSize: "1rem",
            backgroundColor: buttonColor.default,
            color: textColor.light,
            "&:hover": {
              backgroundColor: buttonColor.hover,
            },
          },
          outlinedPrimary: {
            textTransform: "none",
            borderRadius: 0,
            fontWeight: 600,
            fontSize: "1rem",
            backgroundColor: "transparent",
            color: mode ? textColor.dark : textColor.light,
            border: `2px solid ${mode ? textColor.light : textColor.dark}`,
            ":hover": {
              backgroundColor: buttonColor.default,
            },
          },
        },
      },
    },
  });
};
