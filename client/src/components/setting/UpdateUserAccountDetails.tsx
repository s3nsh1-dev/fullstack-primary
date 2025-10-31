import Box from "@mui/material/Box";
import UpdateAccountFieldForm from "./UpdateAccountFieldForm";
const UpdateUserAccountDetails = () => {
  return (
    <Box>
      <UpdateAccountFieldForm
        initialValue={resetEmail}
        successMessage="Email updated successfully"
      />
      <UpdateAccountFieldForm
        initialValue={resetFullname}
        successMessage="Fullname updated successfully"
      />
    </Box>
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
