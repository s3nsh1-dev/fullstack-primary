import type { FC } from "react";
import Drawer from "@mui/material/Drawer";
import DrawerContents from "./DrawerContents";

type DedicatedDrawerProps = {
  open: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
};

const DedicatedDrawer: FC<DedicatedDrawerProps> = ({
  open,
  toggleDrawer,
  closeDrawer,
}) => {
  return (
    <Drawer open={open} onClose={toggleDrawer} role="presentation">
      <DrawerContents open={open} closeDrawer={closeDrawer} />
    </Drawer>
  );
};

export default DedicatedDrawer;
