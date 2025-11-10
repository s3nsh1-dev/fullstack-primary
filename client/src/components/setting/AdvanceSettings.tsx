import DeleteUser from "./DeleteUser";
import DeactivateUser from "./DeactivateUser";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const AdvanceSettings = () => {
  return (
    <Stack gap={1}>
      <Typography>
        Few actions are
        <Typography component="span" fontWeight="bold" color="warning">
          &nbsp;irreversible,&nbsp;
        </Typography>
        please be careful.
      </Typography>
      <DeleteUser />
      <DeactivateUser />
    </Stack>
  );
};

export default AdvanceSettings;
