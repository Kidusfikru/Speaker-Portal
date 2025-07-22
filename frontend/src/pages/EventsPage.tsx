import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Button,
  Modal,
} from "@mui/material";
import { EventFormWizard } from "../features/events/EventForm";
import { Visibility } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";
import { useGetEventsQuery } from "../api/eventsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import EventSpeakerStatusCell from "../components/EventSpeakerStatusCell";
import EventSearchToolbar from "../components/EventSearchToolbar";

const EventsPage: React.FC = () => {
  const { data: events, isLoading, error } = useGetEventsQuery();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isSpeaker = user?.role === "speaker";
  const isAttendee = user?.role === "attendee";
  const [open, setOpen] = useState(false);

  // Fetch all RSVPs for all events (optional: optimize for large lists)
  // For demo, we will not fetch all RSVPs here, but you can extend this with a batch API if needed.

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
      {
        field: "dateTime",
        headerName: "Date/Time",
        flex: 1,
        minWidth: 180,
        valueGetter: (params: any) => {
          const date = params?.row?.dateTime;
          if (!date) return "";
          const d = new Date(date);
          return isNaN(d.getTime()) ? "" : d.toLocaleString();
        },
      },
      {
        field: "speakers",
        headerName: "Speakers & RSVP",
        flex: 2,
        minWidth: 260,
        renderCell: (params) => {
          const event = params.row;
          const speakers = Array.isArray(event.speakerIds)
            ? event.speakerIds
            : [];
          const rsvps = Array.isArray(event.rsvps) ? event.rsvps : [];
          return <EventSpeakerStatusCell speakers={speakers} rsvps={rsvps} />;
        },
        sortable: false,
        filterable: false,
        valueGetter: (params: any) => {
          if (!params || !params.row) return [];
          return params.row.speakerIds || [];
        },
      },
      {
        field: "rsvpStatus",
        headerName: "Status",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 100,
        renderCell: (params) => (
          <IconButton
            color="primary"
            onClick={() => navigate(`/events/${params.row._id}`)}
          >
            <Visibility />
          </IconButton>
        ),
        sortable: false,
        filterable: false,
      },
    ],
    [navigate]
  );

  return (
    <Box sx={{ width: "100%", mt: 6, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Events
      </Typography>
      {/* Speaker-only: Show event creation button/modal */}
      {isSpeaker && (
        <Box textAlign="right" mb={2}>
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
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, width: "100%" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Failed to load events.</Typography>
        ) : (
          <DataGrid
            autoHeight
            rows={events?.map((e: any) => ({ ...e, id: e._id })) || []}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            slots={{ toolbar: EventSearchToolbar }}
            disableRowSelectionOnClick
            sx={{ background: "background.paper" }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default EventsPage;
