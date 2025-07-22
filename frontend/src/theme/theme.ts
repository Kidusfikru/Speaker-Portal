// src/theme/theme.ts
import { createTheme, type ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#0052cc", // Deep blue
      contrastText: "#fff",
    },
    secondary: {
      main: "#ff4081", // Vibrant pink
      contrastText: "#fff",
    },
    // accent: {
    //   main: "#00bfae", // Teal accent
    //   contrastText: "#fff",
    // },
    // neutral: {
    //   main: "#f5f7fa", // Light neutral
    //   contrastText: "#222",
    // },
    background: {
      default: "#f5f7fa",
      paper: "#fff",
    },
    text: {
      primary: "#222",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 700, fontSize: "2.5rem", letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.01em" },
    h3: { fontWeight: 600, fontSize: "1.5rem" },
    body1: { fontSize: "1rem", fontWeight: 400 },
    body2: { fontSize: "0.95rem", fontWeight: 400 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  spacing: 8, // 8px grid
  shape: {
    borderRadius: 12, // Consistent rounded corners
  },
};

const theme = createTheme(themeOptions);
export default theme;
