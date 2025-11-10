import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Stack from "@mui/material/Stack";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import ChangeUsername from "../components/setting/ChangeUsername";
import ChangeUserPassword from "../components/setting/ChangeUserPassword";
import UpdateUserAccountDetails from "../components/setting/UpdateUserAccountDetails";
import AdvanceSettings from "../components/setting/AdvanceSettings";

const Settings = () => {
  const theme = useTheme();
  const [viewOptions, setViewOptions] = useState<ViewOptionsType>(InitialView);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const handleChangeOption = (option: string) => {};
  return (
    <Stack p={1} gap={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      {isMobile ? (
        <Box>This is Mobile View</Box>
      ) : (
        <Stack direction="row">
          <Stack gap={1}>
            <Typography
              onClick={() => handleChangeOption("accountDetails")}
              sx={{ cursor: "pointer" }}
            >
              Account Details
            </Typography>
            <Typography>Username</Typography>
            <Typography>Password</Typography>
            <Typography>Advance</Typography>
          </Stack>
          <Box>
            <UpdateUserAccountDetails />
            <ChangeUsername />
            <ChangeUserPassword />
            <AdvanceSettings />
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export default Settings;

const InitialView = {
  accountDetails: { flag: true, component: <UpdateUserAccountDetails /> },
  username: { flag: false, component: <ChangeUsername /> },
  password: { flag: false, component: <ChangeUserPassword /> },
  advance: { flag: false, component: <AdvanceSettings /> },
};

type ViewOptionsType = typeof InitialView;
