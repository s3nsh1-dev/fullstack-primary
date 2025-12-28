import type { FC } from "react";
import { OverlayDrawer } from "../ui-components/NavbarStyledComponents";
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
    <OverlayDrawer open={open} onClose={toggleDrawer} role="presentation">
      <DrawerContents open={open} closeDrawer={closeDrawer} />
    </OverlayDrawer>
  );
};

export default DedicatedDrawer;
