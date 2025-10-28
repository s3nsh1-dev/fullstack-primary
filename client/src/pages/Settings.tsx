import { useState, type ChangeEvent } from "react";
import useUsernameAvailability from "../hooks/CRUD-hooks/useUsernameAvailability";

const Settings = () => {
  const [username, setUsername] = useState("");
  const {
    data: available,
    isLoading,
    isError,
  } = useUsernameAvailability(username);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value.trim());
  };

  return (
    <div>
      <h1>Username</h1>
      <input type="text" value={username} onChange={handleChange} />
      {isLoading && <p>checking...</p>}
      {isError && <p>something went wrong...</p>}
      {available === false && (
        <p style={{ color: "red" }}>username already exist</p>
      )}
      {available === true && (
        <p style={{ color: "green" }}>username available</p>
      )}
    </div>
  );
};

export default Settings;
