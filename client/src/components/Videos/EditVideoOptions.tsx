import { Box, IconButton, Typography } from "@mui/material";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Switch, { type SwitchProps } from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import { styled } from "@mui/material/styles";
import useMode from "../../hooks/useMode";

const EditVideoOptions = () => {
  const { mode } = useMode();
  return (
    <>
      Yeah
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: 2,
          borderRadius: 1,
          margin: "0px 1%",
          border: `2px solid ${mode ? "#A7E399" : "#44444E"}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component={"img"}
            src={imageSource}
            alt="Unsplash image"
            sx={{
              height: { xs: 60, sm: 80 },
              width: { xs: 110, sm: 130 },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IOSSwitch sx={{ m: 1 }} defaultChecked />
          <IconButton
            sx={{
              borderRadius: 2,
            }}
          >
            <DeleteForever color="error" />
            <Typography
              component={"span"}
              color="error"
              fontSize={"0.8rem"}
              fontWeight={"bold"}
            >
              remove
            </Typography>
          </IconButton>
          <IconButton
            sx={{
              borderRadius: 2,
            }}
          >
            <EditIcon color="secondary" />
            <Typography
              component={"span"}
              color="secondary"
              fontSize={"0.8rem"}
              fontWeight={"bold"}
            >
              changes
            </Typography>
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default EditVideoOptions;

const imageSource =
  "https://images.unsplash.com/photo-1760281853870-7a0bbf208d11?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170";

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
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
