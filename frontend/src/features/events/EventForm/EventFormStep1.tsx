import React from "react";
import { Box, TextField } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { type EventFormValues } from "./EventFormWizard";

const EventFormStep1: React.FC = () => {
  const { control } = useFormContext<EventFormValues>();
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Event Title"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        rules={{ required: "Description is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Description"
            multiline
            minRows={3}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="dateTime"
        control={control}
        rules={{ required: "Date & Time is required" }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Date & Time"
            type="datetime-local"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        )}
      />
    </Box>
  );
};

export default EventFormStep1;
