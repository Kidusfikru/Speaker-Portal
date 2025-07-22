import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../features/auth/authApi";
import {
  signupStart,
  signupSuccess,
  signupFailure,
} from "../features/auth/authSlice";
import type { RootState, AppDispatch } from "../store";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Signup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [role, setRole] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      dispatch(signupFailure("Please select a role (Speaker or Attendee)."));
      return;
    }
    dispatch(signupStart());
    try {
      const data = await signup(name, email, password, bio, contactInfo, role);
      dispatch(
        signupSuccess({
          ...data.speaker,
          token: data.token,
        })
      );
      navigate("/");
    } catch (err: any) {
      dispatch(signupFailure(err.response?.data?.message || "Signup failed"));
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Use Vite public folder for static assets
  const bgUrl = "/corporate-businessman-giving-presentation-large-audience.jpg";
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "flex-end",
        background: `url(${bgUrl}) center center/cover no-repeat`,
        position: "relative",
      }}
    >
      <Box
        sx={{
          flex: isMobile ? 1 : "0 0 420px",
          maxWidth: 420,
          width: "100%",
          bgcolor: "rgba(255,255,255,0.82)",
          boxShadow: 12,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 2, sm: 5 },
          py: { xs: 5, sm: 6 },
          minHeight: "auto",
          borderRadius: 6,
          m: { xs: 2, sm: 6 },
          alignSelf: "center",
          backdropFilter: "blur(8px)",
          position: "relative",
        }}
      >
        <Typography
          variant="h4"
          mb={2}
          fontWeight={800}
          color="primary.main"
          textAlign="right"
        >
          Create your account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Bio"
            fullWidth
            margin="normal"
            multiline
            minRows={2}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <Input
            label="Contact Info"
            fullWidth
            margin="normal"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Box mt={2} mb={1}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              mb={0.5}
              textAlign="right"
            >
              Role <span style={{ color: theme.palette.error.main }}>*</span>
            </Typography>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant={role === "speaker" ? "contained" : "outlined"}
                color={role === "speaker" ? "primary" : "secondary"}
                onClick={() => setRole("speaker")}
                type="button"
                sx={{
                  minWidth: 120,
                  fontWeight: 700,
                  borderWidth: 2,
                  borderColor:
                    role === "speaker" ? "primary.main" : "secondary.main",
                  background:
                    role === "speaker"
                      ? "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)"
                      : "rgba(255,255,255,0.7)",
                  color: role === "speaker" ? "#fff" : "#1976d2",
                  transition: "all 0.2s",
                }}
              >
                Speaker
              </Button>
              <Button
                variant={role === "attendee" ? "contained" : "outlined"}
                color={role === "attendee" ? "primary" : "secondary"}
                onClick={() => setRole("attendee")}
                type="button"
                sx={{
                  minWidth: 120,
                  fontWeight: 700,
                  borderWidth: 2,
                  borderColor:
                    role === "attendee" ? "primary.main" : "secondary.main",
                  background:
                    role === "attendee"
                      ? "linear-gradient(90deg,#1976d2 60%,#42a5f5 100%)"
                      : "rgba(255,255,255,0.7)",
                  color: role === "attendee" ? "#fff" : "#1976d2",
                  transition: "all 0.2s",
                }}
              >
                Attendee
              </Button>
            </Box>
          </Box>
          <Input
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography color="error" mt={1} textAlign="right">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          <Button
            type="button"
            color="secondary"
            variant="outlined"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: 2,
              boxShadow: 1,
            }}
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;
