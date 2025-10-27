import { useState, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import {
  SearchIconWrapper,
  StyledInputBase,
  Search,
} from "../ui-components/NavbarStyledComponents";
import { useNavigate } from "react-router-dom";

const NavbarSearchArea = () => {
  const [text, setText] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        ref={searchRef}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={text}
        onChange={(e) => {
          return setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && text.trim()) {
            navigate(`/search?q=${encodeURIComponent(text.trim())}`);
          }
          // after searching how to remove the focus form the search bar ?
        }}
      />
    </Search>
  );
};

export default NavbarSearchArea;
