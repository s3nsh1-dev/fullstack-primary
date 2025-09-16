import type { FC } from "react";
import Drawer from "@mui/material/Drawer";
import DrawerContents from "./DrawerContents";

type DedicatedDrawerProps = {
  open: boolean;
  toggleDrawer: () => void;
};

const DedicatedDrawer: FC<DedicatedDrawerProps> = ({ open, toggleDrawer }) => {
  return (
    <Drawer open={open} onClose={toggleDrawer} role="presentation">
      <DrawerContents open={open} />
    </Drawer>
  );
};

export default DedicatedDrawer;
