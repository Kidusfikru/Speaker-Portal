import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { type EventFormValues } from "./EventFormWizard";

const EventFormReview: React.FC = () => {
  const { getValues } = useFormContext<EventFormValues>();
  const values = getValues();
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Review Event Details
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Title" secondary={values.title} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Description" secondary={values.description} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Date & Time" secondary={values.dateTime} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Zoom Enabled"
            secondary={values.zoomEnabled ? "Yes" : "No"}
          />
        </ListItem>
        {values.zoomEnabled && (
          <ListItem>
            <ListItemText primary="Zoom Link" secondary={values.zoomLink} />
          </ListItem>
        )}
        <ListItem>
          <ListItemText
            primary="Speakers"
            secondary={values.speakers.join(", ") || "None"}
          />
        </ListItem>
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="body2" color="text.secondary">
        Please review all details before submitting your event.
      </Typography>
    </Box>
  );
};

export default EventFormReview;
