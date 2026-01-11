import { useState, type FC } from "react";
import FormModal from "../others/FormModal";
import CloseToggleIcon from "../ui-components/CloseToggleIcon";
import FormTitle from "../ui-components/FormTitle";
import FormControlThemed from "../others/FormControlThemed";
import {
  FormBox,
  FormInput,
  ContainedButton,
} from "../ui-components/StyledComponents";
import useMode from "../../hooks/useMode";
import useSendContact, {
  type ContactFormData,
} from "../../hooks/data-fetching/useSendContact";
import { Alert } from "@mui/material";

type ContactModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const ContactModal: FC<ContactModalProps> = ({ open, setOpen }) => {
  const { mode } = useMode();
  const { mutate, isPending } = useSendContact();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutate(formData, {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({ name: "", email: "", message: "" });
          setOpen(false);
        }, 2000);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess(false);
    setError("");
  };

  return (
    <FormModal open={open} toggleModal={handleClose}>
      <FormBox component="form" onSubmit={handleSubmit}>
        <CloseToggleIcon toggleOpen={handleClose} />
        <FormTitle text="Contact Us" />

        {success ? (
          <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
            Message sent successfully!
          </Alert>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                {error}
              </Alert>
            )}
            {/* there is a length constraint for name */}
            <FormControlThemed htmlFor="name" label="Name">
              <FormInput
                id="name"
                name="name"
                placeholder="Your Name"
                variant="standard"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControlThemed>
            <FormControlThemed htmlFor="email" label="Email">
              <FormInput
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                variant="standard"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControlThemed>
            <FormControlThemed htmlFor="message" label="Message">
              <FormInput
                id="message"
                name="message"
                placeholder="Your Message..."
                variant="standard"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                fullWidth
              />
            </FormControlThemed>
            <ContainedButton
              type="submit"
              sx={{ mt: 2 }}
              mode={mode}
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send Message"}
            </ContainedButton>
          </>
        )}
      </FormBox>
    </FormModal>
  );
};

export default ContactModal;
