import React from "react";
import { backgroundColor } from "../../constants/uiConstants";
import useMode from "../../hooks/useMode";
import { Drawer } from "../ui-components/NavbarStyledComponents";
import type { ResponsiveDrawerProps } from "../../constants/componentPropTypes";
import DrawerContents from "./DrawerContents";

const ResponsiveDrawer: React.FC<ResponsiveDrawerProps> = ({ open }) => {
  const { mode } = useMode();

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRight: `1px solid ${
              mode ? backgroundColor.dark : backgroundColor.light
            }`,
          },
        }}
      >
        <DrawerContents open={open} />
      </Drawer>
    </>
  );
};

export default ResponsiveDrawer;
