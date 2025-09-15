import React from "react";
import { FormControl, FormLabel } from "@mui/material";
import useMode from "../../hooks/useMode";
import { buttonColor } from "../../constants/uiConstants";

type FormControlThemedType = {
  children: React.ReactNode;
  htmlFor: string;
  label: string;
};

const FormControlThemed: React.FC<FormControlThemedType> = ({
  children,
  htmlFor,
  label,
}) => {
  const { mode } = useMode();
  return (
    <FormControl
      fullWidth
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
      }}
    >
      <FormLabel
        htmlFor={htmlFor}
        sx={{
          width: "9rem",
          textAlign: "center",
          backgroundColor: buttonColor.default,
          padding: 1,
          fontWeight: "bold",
          boxShadow: mode
            ? "-3px -3px 1px rgba(0, 0, 0, 0.7)"
            : "-3px -3px 1px rgba(220, 220, 200)",
        }}
      >
        {label}
      </FormLabel>
      {children}
    </FormControl>
  );
};

export default FormControlThemed;
