import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Add, Visibility } from "@mui/icons-material";
import {
  useGetSpeakersQuery,
  useCreateSpeakerMutation,
} from "../api/speakersApi";

const SpeakersPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetSpeakersQuery();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", bio: "" });
  const [createSpeaker, { isLoading: isCreating }] = useCreateSpeakerMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSpeaker(form).unwrap();
    setOpen(false);
    setForm({ name: "", email: "", bio: "" });
    refetch();
  };

  return (
    <Box sx={{ width: "100%", mt: 6, px: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Speakers
      </Typography>
      {/* <Box textAlign="right" mb={2}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Speaker
        </Button>
      </Box> */}
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, width: "100%" }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">Failed to load speakers.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Bio</TableCell>
                  {/* <TableCell align="right">Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((speaker: any) => (
                  <TableRow key={speaker._id} hover>
                    <TableCell>{speaker.name}</TableCell>
                    <TableCell>{speaker.email}</TableCell>
                    <TableCell>{speaker.bio}</TableCell>
                    {/* <TableCell align="right">
                      <IconButton
                        color="primary"
                        href={`/speakers/${speaker._id}`}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Paper sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 480 }}>
            <Typography variant="h6" mb={2}>
              Add Speaker
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                minRows={2}
              />
              <Box mt={2} textAlign="right">
                <Button onClick={() => setOpen(false)} sx={{ mr: 2 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isCreating}>
                  {isCreating ? "Adding..." : "Add"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
};

export default SpeakersPage;
