import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import useAuth from "../hooks/useAuth";
import NotLoggedIn from "./NotLoggedIn";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import Box from "@mui/material/Box";
import { useState, type ChangeEvent } from "react";
import useCheckAndUpdateUsername from "../hooks/CRUD-hooks/useCheckAndUpdateUsername";

const Settings = () => {
  const [nameText, setNameText] = useState<string>("");
  const { user, loading } = useAuth();
  const { mutate: changeUsername } = useCheckAndUpdateUsername();
  if (!user && !loading) return <NotLoggedIn />;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameText(e.target.value);
    handleSubmit();
  };

  const handleSubmit = () => {
    changeUsername(nameText, {
      onSuccess: (data) => {
        console.info("username response: ", data);
      },
      onError: (error) => {
        console.error("username change error: ", error);
      },
    });
  };
  return (
    <Box p={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      <ol style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
        <li>Update fullname</li>
        <li>Update username but live checking that username exist or not</li>
        <li>Update password</li>
        <li>Update email</li>
        <li>Delete account</li>
      </ol>
      <Box>
        <h1>Username</h1>
        <input type="text" value={nameText} onChange={handleChange} />
      </Box>
    </Box>
  );
};

export default Settings;
