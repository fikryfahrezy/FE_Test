"use client";

import { Box, Button, Tab, Tabs } from "@mui/material";
import { FileDownload as FileDownloadIcon } from "@mui/icons-material";
import { tabs } from "../constants";
import type { PaymentMethod } from "../types";

type PaymentMethodTabsProps = {
  activeTab: PaymentMethod;
  onTabChange: (tab: PaymentMethod) => void;
  onExport: () => void;
};

export function PaymentMethodTabs({
  activeTab,
  onTabChange,
  onExport,
}: PaymentMethodTabsProps) {
  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: PaymentMethod,
  ) => {
    onTabChange(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
      }}
    >
      <Tabs value={activeTab} onChange={handleTabChange}>
        {tabs.map((tab) => {
          return <Tab key={tab.value} label={tab.label} value={tab.value} />;
        })}
      </Tabs>
      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={onExport}
        size="small"
      >
        Export
      </Button>
    </Box>
  );
}
