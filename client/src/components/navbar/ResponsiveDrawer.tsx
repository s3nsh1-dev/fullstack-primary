import React from "react";
import { RespDrawer } from "../ui-components/NavbarStyledComponents";
import type { ResponsiveDrawerProps } from "../../constants/componentPropTypes";
import DrawerContents from "./DrawerContents";

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ open }) => {
  return (
    <RespDrawer variant="permanent" open={open}>
      <DrawerContents open={open} />
    </RespDrawer>
  );
};

export default ResponsiveDrawer;
