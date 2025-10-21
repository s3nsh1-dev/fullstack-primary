import React from "react";
import type { UserSearchResult } from "../../hooks/searching/useSearchUserQuery";
import { UserSearchCard } from "./UserSearchCard";

const SearchResultUser: React.FC<PropType> = ({ users }) => {
  const renderMatchingUser = users.map((user) => (
    <UserSearchCard
      key={user._id}
      user={user}
      onClick={() => {
        // Handle user click - navigate to user profile
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
