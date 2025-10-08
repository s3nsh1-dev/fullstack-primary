import React from "react";
import { emptyPageText } from "../../constants/constants";
import useMode from "../../hooks/useMode";
import { StyledButton } from "../../components/ui-components/StyledComponents";
import { buttonColor } from "../../constants/uiConstants";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Box } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const SubHomepage: React.FC<SubHomepageProps> = ({ username }) => {
  const { mode } = useMode();
  const location = useLocation();
  return (
    <Box className="tabs-container">
      <ButtonGroup
        variant="text"
        color="inherit"
        aria-label="tabs-container"
        fullWidth
        // sx={{ width: "100%" }}
      >
        {emptyPageText.map((tab) => {
          const to = `/${username}/${tab.id}`;
          const isVideosTab = tab.id === "videos";
          const isActive =
            location.pathname.endsWith(`/${tab.id}`) ||
            (isVideosTab && location.pathname === `/${username}`);

          console.log("isActive", isActive);
          return (
            <NavLink key={tab.id} to={to} style={{ width: "100%" }}>
              <StyledButton
                id={tab.id}
                mode={mode}
                sx={{
                  width: "100%",
                  backgroundColor: !isActive
                    ? buttonColor.default
                    : "transparent",
                }}
              >
                {tab.title}
              </StyledButton>
            </NavLink>
          );
        })}
      </ButtonGroup>
    </Box>
  );
};

export default SubHomepage;

type SubHomepageProps = {
  username: string;
};
