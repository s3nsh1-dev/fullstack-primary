import React from "react";
import type { UserSearchResult } from "../../hooks/searching/useSearchUserQuery";
import { UserSearchCard } from "./UserSearchCard";
import { useNavigate } from "react-router-dom";

const SearchResultUser: React.FC<PropType> = ({ users }) => {
  const navigate = useNavigate();
  const renderMatchingUser = users.map((user) => (
    <UserSearchCard
      key={user._id}
      user={user}
      onClick={() => {
        navigate(`/${user?.username}`);
        console.log("User clicked:", user._id);
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
