import Stack from "@mui/material/Stack";
import UpdateAccountFieldForm from "./UpdateAccountFieldForm";
const UpdateUserAccountDetails = () => {
  return (
    <Stack direction="column" gap={1}>
      <UpdateAccountFieldForm
        initialValue={resetEmail}
        successMessage="Email updated successfully"
      />
      <UpdateAccountFieldForm
        initialValue={resetFullname}
        successMessage="Fullname updated successfully"
      />
    </Stack>
  );
};

export default UpdateUserAccountDetails;
const resetFullname: BasicDetailType = {
  name: "fullname",
  content: "",
};
const resetEmail: BasicDetailType = {
  name: "email",
  content: "",
};
type BasicDetailType = {
  name: string;
  content: string;
};
