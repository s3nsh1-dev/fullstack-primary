import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import useMode from "../../hooks/useMode";
import { backgroundColor } from "../../constants/uiConstants";
import DrawerContents from "./DrawerContents";

type DedicatedDrawerProps = {
  open: boolean;
  toggleDrawer: () => void;
};

const DedicatedDrawer: React.FC<DedicatedDrawerProps> = ({
  open,
  toggleDrawer,
}) => {
  const { mode } = useMode();
  // const [open, setOpen] = React.useState(false);
  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setOpen(newOpen);
  // };

  return (
    <div>
      <Button onClick={toggleDrawer}>Open drawer</Button>
      <Drawer
        open={open}
        onClose={toggleDrawer}
        role="presentation"
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
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
    </div>
  );
};

export default DedicatedDrawer;
