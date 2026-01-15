"use client";

import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";

type HeaderProps = {
  drawerWidth: number;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
};

export function Header({
  drawerWidth,
  sidebarCollapsed,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <AppBar
      component="header"
      position="fixed"
      elevation={0}
      role="banner"
      sx={{
        borderBottom: "1px solid",
        borderColor: "primary.dark",
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        transition: "width 0.2s ease-in-out, margin-left 0.2s ease-in-out",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          color="inherit"
          size="small"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>

        <Box
          component="nav"
          aria-label="User actions"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <IconButton color="inherit" size="small" aria-label="User profile">
            <AccountCircleIcon />
          </IconButton>
          <IconButton color="inherit" size="small" aria-label="Settings">
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
