import useUpdateAccountDetails from "../../hooks/CRUD-hooks/useUpdateAccountDetails";
import { useState } from "react";
import { SettingInput } from "../ui-components/TextStyledComponents";
import ShowInfoMessage from "./ShowInfoMessage";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const UpdateAccountFieldForm = ({
  initialValue,
  successMessage,
  guide,
}: UpdateFieldProps) => {
  const [fieldState, setFieldState] = useState(initialValue);
  const [showInfo, setShowInfo] = useState(true);

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
      alert(`Please enter a valid ${fieldState.name}`);
      return;
    }
    updateDetails(fieldState, {
      onSuccess: () => setFieldState(initialValue),
      onSettled: () => setShowInfo(false),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (isSuccess || isError) reset();
    if (!showInfo) setShowInfo(true);
    setFieldState((prev) => ({ ...prev, content: e.target.value }));
  };

  return (
    <Stack direction={"column"} height={55} gap={0.5}>
      <Stack
        direction="row"
        component="form"
        onSubmit={handleSubmit}
        alignItems={"center"}
        gap={0.5}
      >
        <SettingInput
          onChange={handleChange}
          name={fieldState.name}
          value={fieldState.content}
          placeholder={`Update ${fieldState.name}`}
          disabled={isPending}
          fullWidth
        />

        <Button
          type="submit"
          color="secondary"
          variant="contained"
          disabled={fieldState.content.length < 1 || isPending}
          sx={sxBtn}
        >
          {isPending ? "Updating..." : "Save"}
        </Button>
      </Stack>

      <Stack>
        {showInfo ? (
          <ShowInfoMessage
            icon={<InfoOutlineIcon fontSize="small" color="info" />}
            text={guide}
            color="info"
          />
        ) : (
          <>
            {isError && (
              <ShowInfoMessage
                icon={<ErrorOutlineIcon color="error" fontSize="small" />}
                text={errorMessage}
                color="error"
              />
            )}
            {isSuccess && (
              <ShowInfoMessage
                icon={
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                }
                text={successMessage}
                color="success"
              />
            )}
          </>
        )}
      </Stack>
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
  height: "36px",
  width: "80px",
};

type UpdateFieldProps = {
  initialValue: BasicDetailType;
  successMessage: string;
  guide: string;
};
