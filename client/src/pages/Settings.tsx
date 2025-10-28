import { useState, type ChangeEvent } from "react";
import useUsernameAvailability from "../hooks/CRUD-hooks/useUsernameAvailability";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import useUpdateUsername from "../hooks/CRUD-hooks/useUpdateUsername";

const Settings = () => {
  const [username, setUsername] = useState("");
  const {
    data: available,
    isLoading,
    isError,
  } = useUsernameAvailability(username);
  const { mutate: updataUsername } = useUpdateUsername();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.trim());
  };

  const handleSubmit = () => {
    updataUsername(username, {
      onSuccess: () => {
        setUsername("");
      },
      onError: (error) => {
        console.error("Request Failed to update username: ", error);
      },
    });
  };

  return (
    <Box p={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      <Typography variant="h5">Username</Typography>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
      {isLoading && <Typography>checking...</Typography>}
      {isError && <Typography>something went wrong...</Typography>}
      {available === false && (
        <Typography sx={{ color: "red" }}>username already exist</Typography>
      )}
      {available === true && (
        <Typography sx={{ color: "green" }}>username available</Typography>
      )}
    </Box>
  );
};

export default Settings;
