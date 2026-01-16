"use client";

import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { SortableHeader } from "@/components/ui/sort-icon";
import type { Gerbang } from "@/services/highway-service.types";
import type { SortDirection } from "@/hooks/use-table-sort";

type GerbangTableProps = {
  rows: Gerbang[];
  isLoading: boolean;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  sortBy: keyof Gerbang | null;
  sortDirection: SortDirection;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (key: keyof Gerbang) => void;
  onEdit: (gerbang: Gerbang) => void;
  onDelete: (gerbang: Gerbang) => void;
};

export function GerbangTable({
  rows,
  isLoading,
  page,
  rowsPerPage,
  totalCount,
  sortBy,
  sortDirection,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  onEdit,
  onDelete,
}: GerbangTableProps) {
  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>
                <SortableHeader
                  active={sortBy === "NamaGerbang"}
                  direction={sortDirection}
                  onClick={() => {
                    onSort("NamaGerbang");
                  }}
                >
                  Nama Gerbang
                </SortableHeader>
              </TableCell>
              <TableCell>
                <SortableHeader
                  active={sortBy === "NamaCabang"}
                  direction={sortDirection}
                  onClick={() => {
                    onSort("NamaCabang");
                  }}
                >
                  Nama Cabang
                </SortableHeader>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              rows.map((gerbang, index) => {
                const rowNumber = page * rowsPerPage + index + 1;
                return (
                  <TableRow key={`${gerbang.id}-${gerbang.IdCabang}`} hover>
                    <TableCell>{rowNumber}</TableCell>
                    <TableCell>{gerbang.NamaGerbang}</TableCell>
                    <TableCell>{gerbang.NamaCabang}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => {
                          onEdit(gerbang);
                        }}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          onDelete(gerbang);
                        }}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </>
  );
}
