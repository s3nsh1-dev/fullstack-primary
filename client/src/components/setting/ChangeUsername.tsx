import { useState, type ChangeEvent } from "react";
import useUsernameAvailability from "../../hooks/CRUD-hooks/useUsernameAvailability";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useUpdateUsername from "../../hooks/CRUD-hooks/useUpdateUsername";

const ChangeUsername = () => {
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
    <Box>
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

export default ChangeUsername;
