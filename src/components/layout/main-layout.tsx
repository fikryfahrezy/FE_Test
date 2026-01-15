"use client";

import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Header } from "./header";
import {
  Sidebar,
  DRAWER_WIDTH_EXPANDED,
  DRAWER_WIDTH_COLLAPSED,
} from "./sidebar";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const drawerWidth = sidebarCollapsed
    ? DRAWER_WIDTH_COLLAPSED
    : DRAWER_WIDTH_EXPANDED;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header
        drawerWidth={drawerWidth}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />
      <Sidebar collapsed={sidebarCollapsed} />
      <Box
        component="main"
        role="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: "width 0.2s ease-in-out",
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        {children}
      </Box>
    </Box>
  );
}
