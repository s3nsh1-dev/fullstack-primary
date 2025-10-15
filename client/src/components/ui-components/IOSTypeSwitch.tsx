import { styled } from "@mui/material/styles";
import Switch, { type SwitchProps } from "@mui/material/Switch";
import { useState } from "react";

const IOSTypeSwitch = () => {
  const [selected, setSelected] = useState(false);

  return (
    <IOSSwitch
      sx={{ m: 1 }}
      checked={selected}
      onChange={(e) => setSelected(e.target.checked)}
    />
  );
};

export default IOSTypeSwitch;

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(22px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2ecc71",
        opacity: 1,
        border: 0,
      },
      // Change icon to checkmark when checked
      "& .MuiSwitch-thumb::before": {
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="gray"><path d="M12 5.5 6.5 11 4 8.5l1.4-1.4 1.1 1.1L10.6 4z"/></svg>'
        )}")`,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      // Default icon when switch is OFF (publish/upload icon)
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="gray"><path d="M8 2 3 7h3v5h4V7h3z"/></svg>'
      )}")`,
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));
