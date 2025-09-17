import { useState } from "react";
import { ContainedButton } from "../components/ui-components/StyledComponents";
import FormModal from "../components/others/FormModal";
import RegisterForm from "../components/RegisterForm";
import useMode from "../hooks/useMode";
import { BoxCenter } from "../components/ui-components/StyledComponents";
import { Box, Button, Typography } from "@mui/material";
import Login from "./Login";

const SignUpButton = () => {
  const { mode } = useMode();
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const toggleIsLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const buttonStyle = {
    height: "40px",
    color: mode ? "purple" : "magenta",
    fontWeight: "bold",
    fontStyle: "italic",
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
          {isLogin ? (
            <Login toggleOpen={toggleOpen} />
          ) : (
            <RegisterForm toggleOpen={toggleOpen} />
          )}
          <Box sx={{ padding: "10px 0px" }}>
            <Typography sx={{ textAlign: "center" }}>
              {isLogin ? "Need an account?" : "Already have an account?"}

              <Button onClick={toggleIsLogin} sx={buttonStyle}>
                {isLogin ? "Sign Up" : "Log In"}
              </Button>
            </Typography>
          </Box>
        </FormModal>
      )}
    </>
  );
};

export default SignUpButton;
