import SearchIcon from "@mui/icons-material/Search";
import {
  SearchIconWrapper,
  StyledInputBase,
  Search,
} from "../ui-components/NavbarStyledComponents";

const NavbarSearchArea = () => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
      />
    </Search>
  );
};

export default NavbarSearchArea;
