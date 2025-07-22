import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Modal,
  IconButton,
} from "@mui/material";
import { EventFormWizard } from "../features/events/EventForm";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { styled } from "@mui/material/styles";
import axios from "axios";

const StatCard = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(3),
  borderRadius:
    typeof theme.shape.borderRadius === "number"
      ? theme.shape.borderRadius * 2
      : `calc(${theme.shape.borderRadius} * 2)`,
  boxShadow: theme.shadows[3],
  minHeight: 110,
}));

const iconStyles = { fontSize: 40, marginRight: 20, color: "primary.main" };

interface DashboardSummary {
  eventCount: number;
  speakerCount: number;
  attendeeCount: number;
  registrationCount: number;
  rsvpCount: number;
  topEvents: { eventId: string; title: string; attendeeCount: number }[];
}

const DashboardPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const isSpeaker = user?.role === "speaker";
  const isAttendee = user?.role === "attendee";
  const userName = user?.name || "";

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "http://localhost:3000/api/dashboard/summary",
          {
            headers: user?.token
              ? { Authorization: `Bearer ${user.token}` }
              : {},
          }
        );
        setSummary(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchSummary();
  }, [user?.token]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 6, px: 2 }}>
      {/* Greeting Banner */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(90deg, #0052cc 0%, #00bfae 100%)",
          color: "#fff",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isSpeaker && (
            <>Welcome back, Speaker{userName ? ` ${userName}` : ""}!</>
          )}
          {isAttendee && (
            <>Welcome back, Attendee{userName ? ` ${userName}` : ""}!</>
          )}
          {!isSpeaker && !isAttendee && "Welcome back!"}
        </Typography>
        <Typography variant="h6" fontWeight={400}>
          Here’s a quick overview of your event activity.
        </Typography>
      </Paper>
      {/* Summary Cards Row - Beautiful, modern, responsive */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2.4}>
          <StatCard
            sx={{
              background: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
              color: "#fff",
            }}
          >
            <EventIcon sx={{ ...iconStyles, color: "#fff" }} />
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.85 }}>
                Events
              </Typography>
              <Typography variant="h3" fontWeight={800}>
                {loading ? "..." : summary?.eventCount ?? 0}
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <StatCard
            sx={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "#fff",
            }}
          >
            <GroupIcon sx={{ ...iconStyles, color: "#fff" }} />
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.85 }}>
                Speakers
              </Typography>
              <Typography variant="h3" fontWeight={800}>
                {loading ? "..." : summary?.speakerCount ?? 0}
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <StatCard
            sx={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "#fff",
            }}
          >
            <GroupIcon sx={{ ...iconStyles, color: "#fff" }} />
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.85 }}>
                Attendees
              </Typography>
              <Typography variant="h3" fontWeight={800}>
                {loading ? "..." : summary?.attendeeCount ?? 0}
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <StatCard
            sx={{
              background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
              color: "#fff",
            }}
          >
            <ScheduleIcon sx={{ ...iconStyles, color: "#fff" }} />
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.85 }}>
                Registrations
              </Typography>
              <Typography variant="h3" fontWeight={800}>
                {loading ? "..." : summary?.registrationCount ?? 0}
              </Typography>
            </Box>
          </StatCard>
        </Grid>
        <Grid item xs={12} md={2.4}>
          <StatCard
            sx={{
              background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
              color: "#fff",
            }}
          >
            <EventIcon sx={{ ...iconStyles, color: "#fff" }} />
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.85 }}>
                RSVPs
              </Typography>
              <Typography variant="h3" fontWeight={800}>
                {loading ? "..." : summary?.rsvpCount ?? 0}
              </Typography>
            </Box>
          </StatCard>
        </Grid>
      </Grid>

      {/* Top Events Table - Beautiful, modern, responsive */}
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2, mb: 4 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary">
          Top Events by Attendance
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : summary?.topEvents?.length ? (
          <Box sx={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 400,
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: 12,
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    Event Title
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: 12,
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    Attendees
                  </th>
                </tr>
              </thead>
              <tbody>
                {summary.topEvents.map((event) => (
                  <tr
                    key={event.eventId}
                    style={{ borderBottom: "1px solid #eee" }}
                  >
                    <td style={{ padding: 12, fontWeight: 600, color: "#222" }}>
                      {event.title}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        textAlign: "right",
                        fontWeight: 700,
                        color: "#1976d2",
                        fontSize: 18,
                      }}
                    >
                      {event.attendeeCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ) : (
          <Typography>No event data available.</Typography>
        )}
      </Paper>
      {/* Quick Action Button: Only for speakers */}
      {isSpeaker && (
        <Box textAlign="right">
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: 3,
            }}
            onClick={() => setOpen(true)}
          >
            Create New Event
          </Button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
              }}
            >
              <Box sx={{ outline: "none" }}>
                <EventFormWizard onSuccess={() => setOpen(false)} />
              </Box>
            </Box>
          </Modal>
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage;
