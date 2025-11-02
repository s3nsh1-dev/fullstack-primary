import Stack from "@mui/material/Stack";
import UpdateAccountFieldForm from "./UpdateAccountFieldForm";
const UpdateUserAccountDetails = () => {
  return (
    <Stack direction="column" gap={1}>
      <UpdateAccountFieldForm
        initialValue={resetEmail}
        successMessage="Email updated successfully"
        guide="Please enter a valid email address (e.g., you@example.com)."
      />
      <UpdateAccountFieldForm
        initialValue={resetFullname}
        successMessage="Fullname updated successfully"
        guide="Please enter first and last name. Avoid emojis or symbols. Max 20 characters."
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
