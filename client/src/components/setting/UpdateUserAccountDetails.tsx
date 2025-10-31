import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useUpdateAccountDetails from "../../hooks/CRUD-hooks/useUpdateAccountDetails";
import { useState } from "react";
import { SettingInput } from "../ui-components/TextStyledComponents";

const UpdateUserAccountDetails = () => {
  const { mutate: updateDetails } = useUpdateAccountDetails();
  const [email, setEmail] = useState<BasicDetailType>(resetEmail);
  const [emailSuccess, setEmailSuccess] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [fullname, setFullname] = useState<BasicDetailType>(resetFullname);
  const [fullnameSuccess, setFullnameSuccess] = useState<boolean>(false);
  const [fullnameError, setFullnameError] = useState<boolean>(false);

  const handleSubmitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.content.length < 1) {
      alert("enterEmail");
      return;
    }
    updateDetails(email, {
      onSuccess: () => {
        setEmail(resetEmail);
        setEmailSuccess(true);
      },
      onError: () => {
        setEmailError(true);
      },
    });
  };
  const handleSubmitFullname = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fullname.content.length < 1) {
      alert("enter correct Fullname");
      return;
    }
    updateDetails(fullname, {
      onSuccess: () => {
        setFullname(resetFullname);
        setFullnameSuccess(true);
      },
      onError: () => {
        setFullnameError(true);
      },
    });
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail((prev) => {
        return { ...prev, content: value.trim() };
      });
    } else if (name === "fullname") {
      setFullname((prev) => {
        return { ...prev, content: value.trim() };
      });
    }
  };

  return (
    <Box>
      <Box component={"form"} onSubmit={handleSubmitEmail}>
        <SettingInput
          onChange={handleChange}
          name={email.name}
          value={email.content}
        />
        <Button type="submit">Submit</Button>
      </Box>
      <Box component={"form"} onSubmit={handleSubmitFullname}>
        <SettingInput
          onChange={handleChange}
          name={fullname.name}
          value={fullname.content}
        />
        <Button type="submit">Submit</Button>
      </Box>
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
