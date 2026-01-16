"use client";

import { Box, Button, TextField, InputAdornment } from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";

type SearchBarProps = {
  searchQuery?: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
};

export function SearchBar({
  searchQuery,
  onSearchChange,
  onAddClick,
}: SearchBarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <TextField
        placeholder="Search"
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
        sx={{ minWidth: 250 }}
      />
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick}>
        Add Gerbang
      </Button>
    </Box>
  );
}
