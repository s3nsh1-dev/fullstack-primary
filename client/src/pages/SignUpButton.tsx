import { useState } from "react";
import { ContainedButton } from "../components/ui-components/StyledComponents";
import FormModal from "../components/others/FormModal";
import RegisterForm from "../components/RegisterForm";
import useMode from "../hooks/useMode";
import { BoxCenter } from "../components/ui-components/StyledComponents";

const SignUpButton = () => {
  const [open, setOpen] = useState(false);
  const { mode } = useMode();
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <BoxCenter sx={{ marginLeft: "10px" }}>
        <ContainedButton mode={mode} onClick={toggleOpen}>
          Sign Up
        </ContainedButton>
      </BoxCenter>
      {open && (
        <FormModal open={open} toggleModal={toggleOpen}>
          <RegisterForm toggleOpen={toggleOpen} />
        </FormModal>
      )}
    </>
  );
};

export default SignUpButton;
