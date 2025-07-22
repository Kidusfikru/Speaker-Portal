import React from "react";
import { Chip, Stack } from "@mui/material";

interface Speaker {
  _id: string;
  name: string;
  email: string;
}
interface RSVP {
  speaker: Speaker;
  status: "yes" | "no" | "maybe";
}

const statusColor: Record<string, "success" | "error" | "warning" | "default"> =
  {
    yes: "success",
    no: "error",
    maybe: "warning",
    undefined: "default",
    null: "default",
  };

const EventSpeakerStatusCell: React.FC<{
  speakers: Speaker[];
  rsvps?: RSVP[];
}> = ({ speakers, rsvps = [] }) => {
  return (
    <Stack direction="column" spacing={0.5}>
      {speakers.map((sp) => {
        const rsvp = rsvps.find((r) => r.speaker._id === sp._id);
        const status = rsvp?.status || null;
        return (
          <Chip
            key={sp._id}
            label={`${sp.name} (${
              status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : "No Response"
            })`}
            color={statusColor[status ?? "undefined"]}
            size="small"
            sx={{ mb: 0.5 }}
          />
        );
      })}
    </Stack>
  );
};

export default EventSpeakerStatusCell;
