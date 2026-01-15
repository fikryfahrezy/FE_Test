"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

export const DRAWER_WIDTH_EXPANDED = 200;
export const DRAWER_WIDTH_COLLAPSED = 64;

type MenuItem = {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { label: string; path: string }[];
};

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    path: "/",
  },
  {
    label: "Laporan Lalin",
    icon: <AssessmentIcon fontSize="small" />,
    children: [{ label: "Laporan Per Hari", path: "/laporan-lalin/per-hari" }],
  },
  {
    label: "Master Gerbang",
    icon: <SettingsIcon fontSize="small" />,
    path: "/master-gerbang",
  },
];

type SidebarProps = {
  collapsed: boolean;
};

const removeTrailingSlash = (path: string) => {
  return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
};

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    "Laporan Lalin": true,
  });

  const drawerWidth = collapsed
    ? DRAWER_WIDTH_COLLAPSED
    : DRAWER_WIDTH_EXPANDED;

  const handleMenuClick = (item: MenuItem) => {
    if (item.children) {
      if (!collapsed) {
        setOpenMenus((prev) => ({
          ...prev,
          [item.label]: !prev[item.label],
        }));
      }
    } else if (item.path) {
      router.push(item.path);
    }
  };

  const handleChildClick = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    return removeTrailingSlash(pathname) === removeTrailingSlash(path);
  };

  const isChildActive = (children?: { label: string; path: string }[]) => {
    return children?.some(
      (child) =>
        removeTrailingSlash(pathname) === removeTrailingSlash(child.path),
    );
  };

  return (
    <Drawer
      component="aside"
      variant="permanent"
      aria-label="Main navigation"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: "width 0.2s ease-in-out",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          borderRight: "1px solid",
          borderColor: "grey.200",
          bgcolor: "background.paper",
          transition: "width 0.2s ease-in-out",
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 64,
          borderBottom: "1px solid",
          borderColor: "grey.200",
          px: 2,
        }}
      >
        {!collapsed ? (
          <img
            src="/app-logo.png"
            alt="App Logo"
            style={{
              width: "100%",
              height: 40,
              objectFit: "contain",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "white", fontWeight: 700 }}
            >
              H
            </Typography>
          </Box>
        )}
      </Box>

      <Box component="nav" aria-label="Primary navigation" sx={{ flex: 1 }}>
        <List component="ul" sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <li key={item.label} style={{ listStyle: "none" }}>
              <Tooltip title={collapsed ? item.label : ""} placement="right">
                <ListItemButton
                  onClick={() => handleMenuClick(item)}
                  selected={
                    item.path
                      ? isActive(item.path)
                      : isChildActive(item.children)
                  }
                  sx={{
                    py: 1.25,
                    px: collapsed ? 2.5 : 2,
                    justifyContent: collapsed ? "center" : "flex-start",
                    "&.Mui-selected": {
                      bgcolor: "primary.light",
                      "&:hover": {
                        bgcolor: "primary.light",
                      },
                    },
                    "&:hover": {
                      bgcolor: "grey.100",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 32,
                      color: (
                        item.path
                          ? isActive(item.path)
                          : isChildActive(item.children)
                      )
                        ? "primary.dark"
                        : "grey.600",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <>
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            fontSize: 13,
                            fontWeight:
                              isActive(item.path || "") ||
                              isChildActive(item.children)
                                ? 500
                                : 400,
                          },
                        }}
                      />
                      {item.children &&
                        (openMenus[item.label] ? (
                          <ExpandLess fontSize="small" />
                        ) : (
                          <ExpandMore fontSize="small" />
                        ))}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
              {item.children && !collapsed && (
                <Collapse
                  in={openMenus[item.label]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="ul" disablePadding sx={{ pl: 0 }}>
                    {item.children.map((child) => (
                      <li key={child.path} style={{ listStyle: "none" }}>
                        <ListItemButton
                          onClick={() => handleChildClick(child.path)}
                          selected={isActive(child.path)}
                          sx={{
                            pl: 6,
                            py: 0.75,
                            "&.Mui-selected": {
                              bgcolor: "primary.light",
                              "&:hover": {
                                bgcolor: "primary.light",
                              },
                            },
                            "&:hover": {
                              bgcolor: "grey.100",
                            },
                          }}
                        >
                          <ListItemText
                            primary={child.label}
                            slotProps={{
                              primary: {
                                fontSize: 12,
                                fontWeight: isActive(child.path) ? 500 : 400,
                              },
                            }}
                          />
                        </ListItemButton>
                      </li>
                    ))}
                  </List>
                </Collapse>
              )}
            </li>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
