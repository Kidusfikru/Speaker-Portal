import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  useGetEventQuery,
  useGetEventRsvpsQuery,
  useRsvpEventMutation,
} from "../api/eventsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import axios from "axios";

const RSVP_COLORS = {
  yes: "success",
  no: "error",
  maybe: "warning",
};

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useGetEventQuery(id!);
  const { data: rsvps, isLoading: rsvpsLoading } = useGetEventRsvpsQuery(id!);
  const [rsvpEvent, { isLoading: rsvpLoading }] = useRsvpEventMutation();
  const user = useSelector((state: RootState) => state.auth.user);
  const isSpeaker = user?.role === "speaker";
  const isAttendee = user?.role === "attendee";
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [showAttendees, setShowAttendees] = useState(false);
  // Track if attendee is already registered
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  // Attendee registration handler
  const handleRegister = async () => {
    if (!user || !event) return;
    setRegistering(true);
    setRegisterError(null);
    try {
      await axios.post("http://localhost:3000/api/registrations", {
        eventId: event._id,
        name: user.name,
        email: user.email,
        contactInfo: user.contactInfo,
      });
      setRegistering(false);
      setAlreadyRegistered(true);
    } catch (err: any) {
      setRegistering(false);
      if (err?.response?.status === 409 && err?.response?.data?.message) {
        setRegisterError(err.response.data.message);
        setAlreadyRegistered(true);
      } else {
        setRegisterError(err?.response?.data?.message || "Failed to register");
      }
    }
  };

  // Fetch attendees for this event (for both attendee and speaker logic)
  const fetchAttendees = async (show: boolean = false) => {
    if (!event) return;
    if (show) setShowAttendees(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/api/events/${event._id}/attendees`,
        user && user.token
          ? { headers: { Authorization: `Bearer ${user.token}` } }
          : {}
      );
      const attendeeList = res.data as any[];
      setAttendees(attendeeList);
      // Check if current attendee is already registered
      if (isAttendee && user?.email) {
        setAlreadyRegistered(
          attendeeList.some((a: any) => a.email === user.email)
        );
      }
    } catch {
      setAttendees([]);
      if (isAttendee) setAlreadyRegistered(false);
    }
  };

  // Fetch attendees on mount for attendee registration status
  React.useEffect(() => {
    if (event && isAttendee && user?.email) {
      fetchAttendees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, isAttendee, user?.email]);

  const myRsvp = rsvps?.find(
    (r) => r.speakerId._id === user?._id || r.speakerId._id === user?.id
  );

  const handleRsvp = async (status: "yes" | "no" | "maybe") => {
    if (!id) return;
    await rsvpEvent({ eventId: id, status });
  };

  if (isLoading || rsvpsLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) return <Typography>Event not found</Typography>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={2}>
          {event.title}
        </Typography>
        <Typography variant="subtitle1" mb={2}>
          {event.description}
        </Typography>
        <Typography variant="body2" mb={2}>
          <b>Date/Time:</b> {new Date(event.dateTime).toLocaleString()}
        </Typography>
        {event.zoomLink && (
          <Typography variant="body2" mb={2}>
            <b>Zoom Link:</b>{" "}
            <a href={event.zoomLink} target="_blank" rel="noopener noreferrer">
              {event.zoomLink}
            </a>
          </Typography>
        )}
        <Typography variant="h6" mt={3} mb={1}>
          Invited Speakers & RSVP Status
        </Typography>
        <Grid container spacing={2}>
          {event.speakerIds.map((sp: any) => {
            const rsvp = rsvps?.find((r) => r.speakerId._id === (sp._id || sp));
            return (
              <Grid item key={sp._id || sp} xs={12} sm={6} md={4}>
                <Paper
                  sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box>
                    <Typography fontWeight={600}>{sp.name || sp}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sp.email || "-"}
                    </Typography>
                  </Box>
                  <Chip
                    label={rsvp?.status || "No Response"}
                    color={
                      (rsvp?.status &&
                      ["yes", "no", "maybe"].includes(rsvp.status)
                        ? RSVP_COLORS[rsvp.status as keyof typeof RSVP_COLORS]
                        : "default") as
                        | "success"
                        | "error"
                        | "warning"
                        | "default"
                    }
                    size="small"
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Attendee: Show Reserve/Attend button */}
        {isAttendee && (
          <Box mt={4}>
            {alreadyRegistered ? (
              <Button variant="contained" color="success" disabled>
                Registered
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                disabled={registering}
                onClick={handleRegister}
              >
                {registering ? "Reserving..." : "Reserve/Attend"}
              </Button>
            )}
            {registerError && (
              <Typography color="error" mt={1}>
                {registerError}
              </Typography>
            )}
          </Box>
        )}

        {/* Speaker: Show RSVP and attendee list */}
        {event.speakerIds.some(
          (sp: any) =>
            sp._id === user?._id || sp === user?._id || sp === user?.id
        ) &&
          isSpeaker && (
            <Box mt={4}>
              <Typography variant="h6" mb={1}>
                Your RSVP
              </Typography>
              <Button
                variant={myRsvp?.status === "yes" ? "contained" : "outlined"}
                color="success"
                sx={{ mr: 2 }}
                disabled={rsvpLoading}
                onClick={() => handleRsvp("yes")}
              >
                Yes
              </Button>
              <Button
                variant={myRsvp?.status === "maybe" ? "contained" : "outlined"}
                color="warning"
                sx={{ mr: 2 }}
                disabled={rsvpLoading}
                onClick={() => handleRsvp("maybe")}
              >
                Maybe
              </Button>
              <Button
                variant={myRsvp?.status === "no" ? "contained" : "outlined"}
                color="error"
                disabled={rsvpLoading}
                onClick={() => handleRsvp("no")}
              >
                No
              </Button>
              <Button
                variant="outlined"
                color="info"
                sx={{ ml: 2 }}
                onClick={() => fetchAttendees(true)}
              >
                View Attendees
              </Button>
              {showAttendees && (
                <Box mt={2}>
                  <Typography variant="subtitle1" mb={1}>
                    Attendees
                  </Typography>
                  {attendees.length === 0 ? (
                    <Typography>No attendees yet.</Typography>
                  ) : (
                    attendees.map((a) => (
                      <Paper key={a.email} sx={{ p: 1, mb: 1 }}>
                        <Typography fontWeight={600}>{a.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {a.email}
                        </Typography>
                        {a.contactInfo && (
                          <Typography variant="body2">
                            {a.contactInfo}
                          </Typography>
                        )}
                      </Paper>
                    ))
                  )}
                </Box>
              )}
            </Box>
          )}
      </Paper>
    </Box>
  );
};

export default EventDetailPage;
