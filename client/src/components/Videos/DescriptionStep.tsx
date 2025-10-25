import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

const DescriptionStep: React.FC<DescriptionStepProps> = ({
  theme,
  description,
  descriptionError,
  onDescriptionChange,
  descriptionLength,
}) => {
  return (
    <Box sx={{ py: 3 }}>
      <Typography
        variant="h5"
        sx={{ color: theme.text, fontWeight: 600, mb: 3 }}
      >
        Additional Information
      </Typography>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Description"
          required
          multiline
          rows={6}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          error={!!descriptionError}
          helperText={
            descriptionError || `${descriptionLength}/5000 characters`
          }
          placeholder="Tell viewers about your video..."
          sx={{
            "& .MuiInputBase-input": { color: theme.text },
            "& .MuiInputLabel-root": { color: theme.textSecondary },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: theme.border },
              "&:hover fieldset": { borderColor: theme.text },
            },
          }}
        />

        {/* Tags removed because backend does not use them */}
      </Stack>
    </Box>
  );
};

export default DescriptionStep;

interface ThemeLike {
  bg: string;
  text: string;
  textSecondary: string;
  border: string;
  hoverBg: string;
  inputBg: string;
  primaryBg: string;
}

export interface DescriptionStepProps {
  theme: ThemeLike;
  description: string;
  descriptionError?: string;
  onDescriptionChange: (value: string) => void;
  descriptionLength: number;
}
