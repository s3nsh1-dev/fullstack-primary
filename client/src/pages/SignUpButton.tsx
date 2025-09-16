import { useState } from "react";
import BtnContainer from "../components/others/BtnContainer";
import { ContainedButton } from "../components/ui-components/StyledComponents";
import FormModal from "../components/others/FormModal";
import RegisterForm from "../components/RegisterForm";
import useMode from "../hooks/useMode";

const SignUpButton = () => {
  const [open, setOpen] = useState(false);
  const { mode } = useMode();
  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <BtnContainer>
        <ContainedButton mode={mode} onClick={toggleOpen}>
          Sign Up
        </ContainedButton>
      </BtnContainer>
      {open && (
        <FormModal open={open} toggleModal={toggleOpen}>
          <RegisterForm toggleOpen={toggleOpen} />
        </FormModal>
      )}
    </>
  );
};

export default SignUpButton;
