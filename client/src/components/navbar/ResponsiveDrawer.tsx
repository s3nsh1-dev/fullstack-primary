import React from "react";
import { RespDrawer } from "../ui-components/NavbarStyledComponents";
import type { ResponsiveDrawerProps } from "../../constants/componentPropTypes";
import DrawerContents from "./DrawerContents";

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({
  open,
  closeDrawer,
}) => {
  return (
    <RespDrawer variant="permanent" open={open} onClose={closeDrawer}>
      <DrawerContents open={open} closeDrawer={closeDrawer} />
    </RespDrawer>
  );
};

export default ResponsiveDrawer;
