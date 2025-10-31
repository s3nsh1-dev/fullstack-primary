import useUpdateAccountDetails from "../../hooks/CRUD-hooks/useUpdateAccountDetails";
import { useState } from "react";
import { SettingInput } from "../ui-components/TextStyledComponents";
import ShowInfoMessage from "./ShowInfoMessage";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

type UpdateFieldProps = {
  initialValue: BasicDetailType;
  successMessage: string;
};

// This component is the one you will loop or duplicate in the main file
const UpdateAccountFieldForm = ({
  initialValue,
  successMessage,
}: UpdateFieldProps) => {
  // 1. Use a single state object for the field value
  const [fieldState, setFieldState] = useState(initialValue);

  // 2. Import the mutation hook and destructure the built-in status flags
  const {
    mutate: updateDetails,
    isPending,
    isSuccess,
    isError,
    reset, // Crucial for clearing the success/error state
  } = useUpdateAccountDetails();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fieldState.content.length < 1) {
      // Use a visual indicator instead of 'alert'
      alert(`Please enter a valid ${fieldState.name}`);
      return;
    }

    // Reset status before a new mutation to clear old messages
    reset();

    updateDetails(fieldState, {
      onSuccess: () => {
        // Keep the input content for UX, or clear it if needed
        // setFieldState(initialValue);
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Reset the success/error state when the user starts typing again
    reset();
    setFieldState((prev) => ({ ...prev, content: e.target.value.trim() }));
  };

  return (
    <Stack component="form" onSubmit={handleSubmit} gap={0.5}>
      <SettingInput
        onChange={handleChange}
        name={fieldState.name}
        value={fieldState.content}
        placeholder={`Update ${fieldState.name}`}
        disabled={isPending}
      />
      <Button
        type="submit"
        color="secondary"
        variant="contained"
        disabled={isPending}
        sx={sxBtn}
      >
        {isPending ? "Updating..." : "Save"}
      </Button>

      {/* 3. Use React Query's built-in flags for messages */}
      {isError && (
        <ShowInfoMessage
          icon={<ErrorOutlineIcon color="error" fontSize="small" />}
          text={errorMessage}
          color="error"
        />
      )}
      {isSuccess && (
        <ShowInfoMessage
          icon={<CheckCircleOutlineIcon fontSize="small" color="success" />}
          text={successMessage}
          color="success"
        />
      )}
    </Stack>
  );
};

export default UpdateAccountFieldForm;

type BasicDetailType = {
  name: string;
  content: string;
};
const errorMessage = "Something went wrong";
const sxBtn = {
  padding: 0,
  px: 1,
};
