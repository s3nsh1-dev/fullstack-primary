import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ChangeUsername from "../components/setting/ChangeUsername";
import ChangeUserPassword from "../components/setting/ChangeUserPassword";
import UpdateUserAccountDetails from "../components/setting/UpdateUserAccountDetails";
import AdvanceSettings from "../components/setting/AdvanceSettings";
import useMode from "../hooks/useMode";

const Settings = () => {
  const { mode } = useMode();
  const theme = useTheme();
  const grid2Style = {
    p: 2,
    borderRadius: 2,
    border: `2px solid ${theme.palette.divider}`,
    minHeight: `40vh`,
    backgroundColor: mode ? "#feffb63a" : "#39393968",
  };
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [viewOptions, setViewOptions] = useState<ViewOptionsType>(initialView);
  const optionsButtons = optionButtonLabels.map((option) => {
    return (
      <Box
        key={option.name}
        onClick={() => setViewOptions(getResetView(option.name))}
      >
        <Typography sx={typoStyle}>{option.label}</Typography>
        <Divider orientation="horizontal" flexItem />
      </Box>
    );
  });
  const activeComponent = viewOptions.find((option) => option.flag)?.component;

  return (
    <Stack p={1} gap={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      {isMobile ? (
        <Box>This is Mobile View</Box>
      ) : (
        <Grid container columns={12}>
          <Grid size={4} sx={grid1Style}>
            {optionsButtons}
          </Grid>
          <Grid size={8} sx={grid2Style}>
            {activeComponent}
          </Grid>
        </Grid>
      )}
    </Stack>
  );
};

export default Settings;

const getResetView = (optionName: string) => {
  return initialView.map((item) => {
    if (item.name === optionName) {
      return { ...item, flag: true };
    } else {
      return { ...item, flag: false };
    }
  });
};

const initialView = [
  {
    name: "basicDetails",
    flag: false,
    component: <UpdateUserAccountDetails />,
  },
  { name: "username", flag: false, component: <ChangeUsername /> },
  { name: "password", flag: false, component: <ChangeUserPassword /> },
  { name: "advance", flag: true, component: <AdvanceSettings /> },
];
const optionButtonLabels = [
  { name: "basicDetails", label: "Basic Details" },
  { name: "username", label: "Username" },
  { name: "password", label: "Password" },
  { name: "advance", label: "Advance" },
];

type ViewOptionsType = typeof initialView;

const grid1Style = { display: "flex", flexDirection: "column", gap: 2, mt: 4 };
const typoStyle = {
  fontSize: "1.2rem",
  cursor: "pointer",
  fontWeight: "bold",
};
