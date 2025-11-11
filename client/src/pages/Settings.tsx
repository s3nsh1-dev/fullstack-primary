import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ChangeUsername from "../components/setting/ChangeUsername";
import ChangeUserPassword from "../components/setting/ChangeUserPassword";
import UpdateUserAccountDetails from "../components/setting/UpdateUserAccountDetails";
import AdvanceSettings from "../components/setting/AdvanceSettings";
import useMode from "../hooks/useMode";
import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";

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
  const [selectValue, setSelectValue] = useState("basicDetails");

  const { user, loading } = useAuth();
  if (!user && !loading) return <NotLoggedIn />;

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectValue(value);
    setViewOptions(getResetView(value));
  };

  const handleOptionClick = (optionName: string) => {
    setViewOptions(getResetView(optionName));
    setSelectValue(optionName);
  };

  const optionsButtons = optionButtonLabels.map((option) => {
    return (
      <Box key={option.name} onClick={() => handleOptionClick(option.name)}>
        <Typography sx={typoStyle}>{option.label}</Typography>
        <Divider orientation="horizontal" flexItem />
      </Box>
    );
  });

  const renderOptions = optionButtonLabels.map((option) => {
    return (
      <MenuItem key={option.name} value={option.name}>
        {option.label}
      </MenuItem>
    );
  });

  const activeComponent = viewOptions.find((option) => option.flag)?.component;

  return (
    <Stack p={1} gap={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      {isMobile ? (
        <Stack gap={5}>
          <FormControl fullWidth>
            <Select value={selectValue} onChange={handleChange}>
              {renderOptions}
            </Select>
            <FormHelperText>Change account settings</FormHelperText>
          </FormControl>
          <Box sx={grid2Style}>{activeComponent}</Box>
        </Stack>
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
    flag: true,
    component: <UpdateUserAccountDetails />,
  },
  { name: "username", flag: false, component: <ChangeUsername /> },
  { name: "password", flag: false, component: <ChangeUserPassword /> },
  { name: "advance", flag: false, component: <AdvanceSettings /> },
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
