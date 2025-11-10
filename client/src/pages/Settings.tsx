import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Stack from "@mui/material/Stack";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState, Fragment } from "react";
import Typography from "@mui/material/Typography";
import ChangeUsername from "../components/setting/ChangeUsername";
import ChangeUserPassword from "../components/setting/ChangeUserPassword";
import UpdateUserAccountDetails from "../components/setting/UpdateUserAccountDetails";
import AdvanceSettings from "../components/setting/AdvanceSettings";

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [viewOptions, setViewOptions] = useState<ViewOptionsType>(initialView);
  const optionsButtons = optionButtonLabels.map((option) => {
    return (
      <Typography
        key={option.name}
        onClick={() => setViewOptions(getResetView(option.name))}
        sx={{ cursor: "pointer" }}
      >
        {option.label}
      </Typography>
    );
  });
  const renderOptionComponent = viewOptions.map((options) => {
    return (
      <Fragment key={options.name}>
        {options.flag && options.component}
      </Fragment>
    );
  });

  return (
    <Stack p={1} gap={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      {isMobile ? (
        <Box>This is Mobile View</Box>
      ) : (
        <Stack direction="row">
          <Stack gap={1}>{optionsButtons}</Stack>
          <Box>{renderOptionComponent}</Box>
        </Stack>
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
    name: "accountDetails",
    flag: false,
    component: <UpdateUserAccountDetails />,
  },
  { name: "username", flag: false, component: <ChangeUsername /> },
  { name: "password", flag: false, component: <ChangeUserPassword /> },
  { name: "advance", flag: true, component: <AdvanceSettings /> },
];
const optionButtonLabels = [
  { name: "accountDetails", label: "Account Details" },
  { name: "username", label: "Username" },
  { name: "password", label: "Password" },
  { name: "advance", label: "Advance" },
];

type ViewOptionsType = typeof initialView;
