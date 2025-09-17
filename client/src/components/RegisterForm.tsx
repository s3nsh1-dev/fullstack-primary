import { useState, type FC } from "react";
import useUserRegister from "../hooks/data-fetching/useUserRegister";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FormControlThemed from "./others/FormControlThemed";
import FormTitle from "./ui-components/FormTitle";
import CloseToggleIcon from "./ui-components/CloseToggleIcon";
import {
  OutlinedButton,
  ContainedButton,
  FormBox,
  FormInput,
} from "./ui-components/StyledComponents";
import type {
  UserLoginAuthDataType,
  RegistrationFormType,
} from "../constants/dataTypes";
import useMode from "../hooks/useMode";
import useAuth from "../hooks/useAuth";

type RegisterFormProps = {
  toggleOpen: () => void;
};

const RegisterForm: FC<RegisterFormProps> = ({ toggleOpen }) => {
  const { mode } = useMode();
  const registerMutate = useUserRegister();
  const { login } = useAuth();
  const resetForm: RegistrationFormType = {
    fullname: "",
    username: "",
    email: "",
    password: "",
    avatar: null as File | null,
    coverImage: null as File | null,
  };
  const [formData, setFormData] = useState(resetForm);

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
    registerMutate.mutate(formData, {
      onSuccess: (data: UserLoginAuthDataType) => {
        console.log("What data we are sending", data);
        login(data);
      },
    });
    setFormData(resetForm);
  };

  return (
    <FormBox component="form" onSubmit={handleSubmit}>
      <CloseToggleIcon toggleOpen={toggleOpen} />
      <FormTitle text="Sign Up" />
      <FormControlThemed htmlFor="email" label="Email">
        <FormInput
          type="email"
          id="email"
          autoComplete="email"
          name="email"
          placeholder="e.g. johndoe@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </FormControlThemed>
      <FormControlThemed htmlFor="fullname" label="Full Name">
        <FormInput
          id="fullname"
          autoComplete="name"
          name="fullname"
          placeholder="e.g. John Doe"
          value={formData.fullname}
          onChange={handleChange}
          required
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
        <FormInput
          id="username"
          autoComplete="username"
          name="username"
          placeholder="e.g. john0123"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </FormControlThemed>
      <FormControlThemed htmlFor="password" label="Password">
        <FormInput
          type="password"
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Enter a secure password"
          value={formData.password}
          onChange={handleChange}
          required
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
    </FormBox>
  );
};

export default RegisterForm;
