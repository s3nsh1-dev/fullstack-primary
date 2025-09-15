import Typography from "@mui/material/Typography";

const FormTitle = ({ text }: { text: string }) => {
  return (
    <Typography
      variant="h3"
      sx={{ textAlign: "center", fontWeight: "bold" }}
      gutterBottom
    >
      {text}
    </Typography>
  );
};

export default FormTitle;
