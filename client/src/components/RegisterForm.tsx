import { useState } from "react";
import { Box, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormControlThemed from "./others/FormControlThemed";
import {
  OutlinedButton,
  ContainedButton,
} from "./ui-components/StyledComponents";
import useMode from "../hooks/useMode";
import { backgroundColor, textColor } from "../constants/uiConstants";

const RegisterForm = () => {
  const { mode } = useMode();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null as File | null,
    coverImage: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formBody = new FormData();
    formBody.append("fullname", formData.fullname);
    formBody.append("username", formData.username);
    formBody.append("email", formData.email);
    formBody.append("password", formData.password);
    if (formData.avatar) formBody.append("avatar", formData.avatar);
    if (formData.coverImage) formBody.append("coverImage", formData.coverImage);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 3,
        border: `1px solid ${
          mode ? backgroundColor.dark : backgroundColor.light
        }`,
        boxShadow: `0 0 0 2px #b744dd, 0 0 0 3px ${
          mode ? backgroundColor.dark : backgroundColor.light
        }`,
      }}
    >
      <FormControlThemed htmlFor="email" label="Email">
        <TextField
          type="email"
          id="email"
          autoComplete="email"
          name="email"
          placeholder="e.g. johndoe@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          variant="standard"
          sx={{
            width: "20rem",
            "& input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px transparent inset",
              WebkitTextFillColor: `${mode ? textColor.dark : textColor.light}`,
            },
          }}
        />
      </FormControlThemed>
      <FormControlThemed htmlFor="fullname" label="Full Name">
        <TextField
          id="fullname"
          autoComplete="name"
          name="fullname"
          placeholder="e.g. John Doe"
          value={formData.fullname}
          onChange={handleChange}
          required
          variant="standard"
          sx={{ width: "20rem" }}
        />
      </FormControlThemed>

      <OutlinedButton
        component="label" // important
        mode={mode}
        startIcon={<CloudUploadIcon />}
      >
        {formData.avatar ? formData.avatar.name : "Upload Avatar"}
        <input
          type="file"
          name="avatar"
          hidden
          accept="image/*"
          onChange={handleChange}
        />
      </OutlinedButton>

      <FormControlThemed htmlFor="username" label="Username">
        <TextField
          id="username"
          autoComplete="username"
          name="username"
          placeholder="e.g. john0123"
          value={formData.username}
          onChange={handleChange}
          required
          variant="standard"
          sx={{ width: "20rem" }}
        />
      </FormControlThemed>
      <FormControlThemed htmlFor="password" label="Password">
        <TextField
          type="password"
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Enter a secure password"
          value={formData.password}
          onChange={handleChange}
          required
          variant="standard"
          sx={{ width: "20rem" }}
        />
      </FormControlThemed>

      <OutlinedButton
        mode={mode}
        component="label" // important
        startIcon={<CloudUploadIcon />}
      >
        {formData.coverImage ? formData.coverImage.name : "Upload Cover Image"}
        <input
          type="file"
          name="coverImage"
          hidden
          accept="image/*"
          onChange={handleChange}
        />
      </OutlinedButton>

      <ContainedButton mode={mode} type="submit" sx={{ mt: 2 }}>
        Register
      </ContainedButton>
    </Box>
  );
};

export default RegisterForm;
