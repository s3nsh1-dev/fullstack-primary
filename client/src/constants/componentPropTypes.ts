import type { ButtonProps } from "@mui/material/Button";

export interface CustomButtonProps extends ButtonProps {
  text?: string;
}

export type ResponsiveDrawerProps = {
  open: boolean;
  closeDrawer: () => void;
};
