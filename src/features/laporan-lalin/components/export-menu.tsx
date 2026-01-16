"use client";

import { useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  Description as DescriptionIcon,
  TableChart as TableChartIcon,
} from "@mui/icons-material";

type ExportMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
};

export function ExportMenu({
  anchorEl,
  open,
  onClose,
  onExportExcel,
  onExportPDF,
}: ExportMenuProps) {
  const handleExportExcel = () => {
    onExportExcel();
    onClose();
  };

  const handleExportPDF = () => {
    onExportPDF();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={handleExportExcel}>
        <ListItemIcon>
          <TableChartIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Excel</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleExportPDF}>
        <ListItemIcon>
          <DescriptionIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>PDF</ListItemText>
      </MenuItem>
    </Menu>
  );
}
