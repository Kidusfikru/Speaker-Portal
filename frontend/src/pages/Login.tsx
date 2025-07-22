import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth/authApi";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/auth/authSlice";
import type { RootState, AppDispatch } from "../store";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector(
    (state: RootState) => state.auth as RootState["auth"]
  );
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const data = await login(email, password);
      if (data && data.token && data.user) {
        dispatch(
          loginSuccess({
            ...data.user,
            token: data.token,
          })
        );
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Login failed";
      dispatch(loginFailure(message));
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
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
            {loading ? "Logging in..." : "Login"}
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
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
