import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  backgroundColor: "transparent",
  display: "flex",
  justifyContent: "end",
};

const CloseToggleIcon = ({ toggleOpen }: { toggleOpen: () => void }) => {
  return (
    <Box sx={style}>
      <IconButton onClick={toggleOpen}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default CloseToggleIcon;
