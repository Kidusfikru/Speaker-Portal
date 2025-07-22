import React, { useState } from "react";
import { useAuth } from "../features/auth/useAuth";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  CssBaseline,
  useTheme,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const drawerWidth = 220;

const navLinks = [
  { label: "Home", icon: <HomeIcon />, to: "/" },
  { label: "Events", icon: <EventIcon />, to: "/events" },
  { label: "Speakers", icon: <PeopleIcon />, to: "/speakers" },
  {
    label: "Profile",
    icon: (
      <Avatar
        sx={{ width: 24, height: 24, bgcolor: "primary.main", fontSize: 14 }}
      >
        P
      </Avatar>
    ),
    to: "/profile",
  },
  { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
];

const Layout: React.FC = () => {
  const { logout } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen((open) => !open);
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={700}></Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {navLinks.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              selected={location.pathname === item.to}
              sx={{
                borderLeft:
                  location.pathname === item.to
                    ? `4px solid ${theme.palette.primary.main}`
                    : "4px solid transparent",
                background:
                  location.pathname === item.to
                    ? theme.palette.action.selected
                    : "none",
                pl: 3,
              }}
              onClick={() => !isDesktop && setMobileOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        background:
          "linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 60%, #e3f2fd 100%)",
        position: "relative",
      }}
    >
      <CssBaseline />
      {/* Top App Bar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: theme.zIndex.drawer + 1, boxShadow: 2 }}
        color="inherit"
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="primary"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            World Salon
          </Typography>
          <IconButton onClick={handleAvatarClick} size="large" sx={{ ml: 2 }}>
            <Avatar alt="User" src="/assets/avatar.png" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                window.location.assign("/profile");
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                logout();
                window.location.assign("/login");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {/* Sidebar Drawer */}
      {isDesktop ? (
        <Drawer
          variant="permanent"
          open
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            mt: 8,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "rgba(255,255,255,0.82)",
              boxShadow: 8,
              marginTop: "64px",
              borderRadius: "0 24px 24px 0",
              backdropFilter: "blur(10px)",
              border: "1px solid #e3e8f0",
              transition: "background 0.3s",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "rgba(255,255,255,0.88)",
              boxShadow: 8,
              borderRadius: "0 24px 24px 0",
              backdropFilter: "blur(10px)",
              border: "1px solid #e3e8f0",
              transition: "background 0.3s",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          minHeight: "100vh",
          transition: theme.transitions.create("margin"),
          // Remove left margin, AppBar and Drawer now visually aligned
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
