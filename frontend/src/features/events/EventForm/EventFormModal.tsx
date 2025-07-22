import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useCreateEventMutation } from "../../../api/eventsApi";
import { useGetSpeakersQuery } from "../../../api/speakersApi";
import dayjs from "dayjs";

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  title: string;
  description?: string;
  dateTime: string;
  speakerIds: string[];
}

const EventFormModal: React.FC<EventFormModalProps> = ({ open, onClose }) => {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      dateTime: dayjs().format("YYYY-MM-DDTHH:mm"),
      speakerIds: [],
    },
  });
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const { data: speakers, isLoading: speakersLoading } = useGetSpeakersQuery();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      // Only send the required fields to the backend
      await createEvent({
        title: values.title,
        description: values.description,
        dateTime: new Date(values.dateTime).toISOString(),
        speakerIds: values.speakerIds,
      }).unwrap();
      reset();
      onClose();
    } catch (err: any) {
      setError(err?.data?.message || "Failed to create event");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Event</DialogTitle>
      <DialogContent>
        <form id="event-form" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Title"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                margin="normal"
                multiline
                minRows={2}
              />
            )}
          />
          <Controller
            name="dateTime"
            control={control}
            rules={{ required: "Date/Time is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date & Time"
                type="datetime-local"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required
              />
            )}
          />
          <Controller
            name="speakerIds"
            control={control}
            rules={{ required: "Select at least one speaker" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Invite Speakers"
                select
                fullWidth
                margin="normal"
                SelectProps={{ multiple: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                required
              >
                {speakersLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} /> Loading...
                  </MenuItem>
                ) : (
                  speakers?.map((sp: any) => (
                    <MenuItem key={sp._id} value={sp._id}>
                      {sp.name} ({sp.email})
                    </MenuItem>
                  ))
                )}
              </TextField>
            )}
          />
          {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          type="submit"
          form="event-form"
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={20} /> : "Create Event"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventFormModal;
