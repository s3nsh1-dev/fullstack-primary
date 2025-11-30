import React from "react";
import type { UserSearchResult } from "../../hooks/searching/useSearchUserQuery";
import { UserSearchCard } from "./UserSearchCard";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

const SearchResultUser: React.FC<PropType> = ({ users }) => {
  const navigate = useNavigate();
  if (!users || users.length === 0) {
    return (
      <Typography color="textSecondary" sx={{ textAlign: "center" }}>
        No Users
      </Typography>
    );
  }

  const renderMatchingUser = users.map((user) => (
    <UserSearchCard
      key={user._id}
      user={user}
      onClick={() => {
        navigate(`/${user?.username}`);
      }}
    />
  ));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {renderMatchingUser}
    </div>
  );
};

export default SearchResultUser;
type PropType = {
  users: UserSearchResult[];
};
