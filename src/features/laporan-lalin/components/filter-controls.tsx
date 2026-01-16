"use client";

import { Box, Button, TextField, InputAdornment } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Search as SearchIcon } from "@mui/icons-material";
import type { Dayjs } from "dayjs";

type FilterControlsProps = {
  searchQuery?: string;
  selectedDate: Dayjs | null;
  onSearchChange: (value: string) => void;
  onDateChange: (date: Dayjs | null) => void;
  onFilter: () => void;
  onReset: () => void;
  searchPlaceholder?: string;
  dateLabel?: string;
};

export function FilterControls({
  searchQuery,
  selectedDate,
  onSearchChange,
  onDateChange,
  onFilter,
  onReset,
  searchPlaceholder = "Search",
  dateLabel = "Dari Tanggal",
}: FilterControlsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
        alignItems: "flex-end",
      }}
    >
      <TextField
        placeholder={searchPlaceholder}
        size="small"
        value={searchQuery}
        onChange={(event) => {
          onSearchChange(event.target.value);
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: 200 }}
      />
      <DatePicker
        label={dateLabel}
        value={selectedDate}
        onChange={onDateChange}
        slotProps={{
          textField: {
            size: "small",
            sx: { minWidth: 180 },
          },
        }}
      />
      <Button variant="contained" color="primary" onClick={onFilter}>
        Filter
      </Button>
      <Button variant="outlined" onClick={onReset}>
        Reset
      </Button>
    </Box>
  );
}
