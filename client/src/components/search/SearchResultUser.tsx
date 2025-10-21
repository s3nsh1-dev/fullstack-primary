import React from "react";
import type { UserSearchResult } from "../../hooks/searching/useSearchUserQuery";

const SearchResultUser: React.FC<PropType> = () => {
  const renderMatchingUser = <></>;

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
