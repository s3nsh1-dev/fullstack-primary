import React from "react";
import type { UserSearchResult } from "../../hooks/searching/useSearchUserQuery";

const SearchResultUser: React.FC<PropType> = ({ users }) => {
  const renderMatchingUser = users.map((user) => {
    return <div key={user._id}></div>;
  });

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
