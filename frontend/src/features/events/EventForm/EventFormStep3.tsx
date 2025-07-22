import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import { type EventFormValues } from "./EventFormWizard";
import { useGetSpeakersQuery } from "../../../api/speakersApi";

const EventFormStep3: React.FC = () => {
  const { control } = useFormContext<EventFormValues>();
  const { data: allUsers, isLoading, error } = useGetSpeakersQuery();
  // Only allow users with role 'speaker' to be selectable
  const speakers = Array.isArray(allUsers)
    ? allUsers.filter((u: any) => u.role === "speaker")
    : [];
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {isLoading ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress size={20} />
          <Typography>Loading speakers...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error">Failed to load speakers.</Typography>
      ) : (
        <Controller
          name="speakers"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Invite Speakers</InputLabel>
              <Select
                {...field}
                label="Invite Speakers"
                multiple
                renderValue={(selected: string[]) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((id) => {
                      const speaker = speakers?.find((s: any) => s._id === id);
                      return <Chip key={id} label={speaker?.name || id} />;
                    })}
                  </Box>
                )}
              >
                {speakers?.map((speaker: any) => (
                  <MenuItem key={speaker._id} value={speaker._id}>
                    {speaker.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      )}
    </Box>
  );
};

export default EventFormStep3;
