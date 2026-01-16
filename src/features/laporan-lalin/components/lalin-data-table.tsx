"use client";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { SortableHeader } from "@/components/ui/sort-icon";
import type { SortDirection } from "@/hooks/use-table-sort";
import type { LalinRow } from "../types";

type RuasGolongan = {
  golI: number;
  golII: number;
  golIII: number;
  golIV: number;
  golV: number;
  totalLalin: number;
};

type LalinDataTableProps = {
  rows: LalinRow[];
  summaryByRuas: Record<string, RuasGolongan>;
  grandTotal: RuasGolongan;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  sortBy: keyof LalinRow | null;
  sortDirection: SortDirection;
  isLoading: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSort: (property: keyof LalinRow) => void;
};

export function LalinDataTable({
  rows,
  summaryByRuas,
  grandTotal,
  page,
  rowsPerPage,
  totalCount,
  sortBy,
  sortDirection,
  isLoading,
  onPageChange,
  onRowsPerPageChange,
  onSort,
}: LalinDataTableProps) {
  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 12 }}>No.</TableCell>
              <TableCell sx={{ fontSize: 12 }}>
                <SortableHeader
                  active={sortBy === "ruas"}
                  direction={sortDirection}
                  onClick={() => {
                    onSort("ruas");
                  }}
                >
                  Ruas
                </SortableHeader>
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>
                <SortableHeader
                  active={sortBy === "gerbang"}
                  direction={sortDirection}
                  onClick={() => {
                    onSort("gerbang");
                  }}
                >
                  Gerbang
                </SortableHeader>
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>
                <SortableHeader
                  active={sortBy === "gardu"}
                  direction={sortDirection}
                  onClick={() => {
                    onSort("gardu");
                  }}
                >
                  Gardu
                </SortableHeader>
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>
                <SortableHeader
                  active={sortBy === "hari"}
                  direction={sortDirection}
                  onClick={() => {
                    onSort("hari");
                  }}
                >
                  Hari
                </SortableHeader>
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>
                <SortableHeader
                  active={sortBy === "tanggal"}
                  direction={sortDirection}
                  onClick={() => {
                    onSort("tanggal");
                  }}
                >
                  Tanggal
                </SortableHeader>
              </TableCell>
              <TableCell sx={{ fontSize: 12 }}>Metode Pembayaran</TableCell>
              <TableCell align="right" sx={{ fontSize: 12 }}>
                Gol I
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 12 }}>
                Gol II
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 12 }}>
                Gol III
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 12 }}>
                Gol IV
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 12 }}>
                Gol V
              </TableCell>
              <TableCell align="right" sx={{ fontSize: 12 }}>
                Total Lalin
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              <>
                {rows.map((row, index) => {
                  const rowNumber = page * rowsPerPage + index + 1;
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontSize: 12 }}>{rowNumber}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.ruas}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.gerbang}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.gardu}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.hari}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>{row.tanggal}</TableCell>
                      <TableCell sx={{ fontSize: 12 }}>
                        {row.metodePembayaran}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {row.golI}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {row.golII}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {row.golIII}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {row.golIV}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {row.golV}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>
                        {row.totalLalin}
                      </TableCell>
                    </TableRow>
                  );
                })}

                {Object.entries(summaryByRuas).map(([ruas, totals]) => (
                  <TableRow
                    key={`summary-${ruas}`}
                    sx={{ bgcolor: "grey.100" }}
                  >
                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ fontWeight: 600, fontSize: 12 }}
                    >
                      Total Lalin {ruas}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, fontSize: 12 }}
                    >
                      {totals.golI}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, fontSize: 12 }}
                    >
                      {totals.golII}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, fontSize: 12 }}
                    >
                      {totals.golIII}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, fontSize: 12 }}
                    >
                      {totals.golIV}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, fontSize: 12 }}
                    >
                      {totals.golV}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, fontSize: 12 }}
                    >
                      {totals.totalLalin}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow sx={{ bgcolor: "primary.main" }}>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
                  >
                    Total Lalin Keseluruhan
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
                  >
                    {grandTotal.golI}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
                  >
                    {grandTotal.golII}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
                  >
                    {grandTotal.golIII}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
                  >
                    {grandTotal.golIV}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
                  >
                    {grandTotal.golV}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
                  >
                    {grandTotal.totalLalin}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Show:"
        />
      </Box>
    </>
  );
}
