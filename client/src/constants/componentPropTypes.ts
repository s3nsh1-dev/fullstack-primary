import type { ButtonProps } from "@mui/material";

export interface CustomButtonProps extends ButtonProps {
  text?: string;
}

export type TestProps = {
  navTitle?: string;
  children?: React.ReactNode;
};

export type ResponsiveDrawerProps = {
  open: boolean;
};
