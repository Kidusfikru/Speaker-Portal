// src/theme/ThemeProvider.tsx
import React, { type ReactNode } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

interface Props {
  children: ReactNode;
}

const ThemeProvider: React.FC<Props> = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <MuiThemeProvider theme={theme}>
      <StyledComponentsThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </StyledComponentsThemeProvider>
    </MuiThemeProvider>
  </StyledEngineProvider>
);

export default ThemeProvider;
