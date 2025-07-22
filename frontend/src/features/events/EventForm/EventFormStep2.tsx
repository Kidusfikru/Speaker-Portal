import React from "react";
import { Box, Switch, FormControlLabel, TextField } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { type EventFormValues } from "./EventFormWizard";

const EventFormStep2: React.FC = () => {
  const { control, watch } = useFormContext<EventFormValues>();
  const zoomEnabled = watch("zoomEnabled");
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Controller
        name="zoomEnabled"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Switch {...field} checked={!!field.value} />}
            label="Enable Zoom Integration"
          />
        )}
      />
      {zoomEnabled && (
        <Controller
          name="zoomLink"
          control={control}
          rules={{ required: "Zoom link is required when enabled" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Zoom Link"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
      )}
    </Box>
  );
};

export default EventFormStep2;
