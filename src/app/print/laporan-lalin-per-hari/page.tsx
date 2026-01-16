"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import type {
  LalinExportPayload,
  RuasSummary,
} from "@/features/laporan-lalin/hooks/use-lalin-export";

const emptySummary: RuasSummary = {
  golI: 0,
  golII: 0,
  golIII: 0,
  golIV: 0,
  golV: 0,
  totalLalin: 0,
};

export default function LalinPrintPage() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [payload, setPayload] = useState<
    LalinExportPayload | null | undefined
  >();

  useEffect(() => {
    if (!key) {
      return;
    }

    const stored = localStorage.getItem(key);
    const parsed = stored ? (JSON.parse(stored) as LalinExportPayload) : null;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setPayload(parsed);
    localStorage.removeItem(key);

    if (!parsed) {
      return;
    }

    const timeout = window.setTimeout(() => {
      window.print();
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [key]);

  const title = useMemo(() => {
    if (!payload) {
      return "Laporan Lalin";
    }

    const dateLabel = payload.selectedDate
      ? `Tanggal ${payload.selectedDate}`
      : "Semua Tanggal";

    return `Laporan Lalin Per Hari (${payload.activeTab}) - ${dateLabel}`;
  }, [payload]);

  if (payload === undefined) {
    return (
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  if (payload === null) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Data export tidak ditemukan.</Typography>
        <Typography color="text.secondary">
          Silakan ulangi proses export dari halaman utama.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        overflow: "hidden",
        "@media print": {
          p: 0,
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: 12 }}>
          Dibuat: {payload.generatedAt}
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ width: "100%", overflowX: "hidden" }}
      >
        <Table
          size="small"
          sx={{
            width: "100%",
            tableLayout: "fixed",
            "& th, & td": {
              fontSize: 10,
              px: 0.75,
              py: 0.5,
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 12 }}>No.</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Ruas</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Gerbang</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Gardu</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Hari</TableCell>
              <TableCell sx={{ fontSize: 12 }}>Tanggal</TableCell>
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
            {payload.rows.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontSize: 12 }}>{index + 1}</TableCell>
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
            ))}

            {Object.entries(payload.summaryByRuas).map(([ruas, totals]) => (
              <TableRow
                key={`summary-${ruas}`}
                sx={{ bgcolor: "var(--mui-palette-TableCell-border)" }}
              >
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ fontWeight: 600, fontSize: 12 }}
                >
                  Total Lalin {ruas}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12 }}>
                  {totals.golI}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12 }}>
                  {totals.golII}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12 }}>
                  {totals.golIII}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12 }}>
                  {totals.golIV}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12 }}>
                  {totals.golV}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, fontSize: 12 }}>
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
                {(payload.grandTotal || emptySummary).golI}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
              >
                {(payload.grandTotal || emptySummary).golII}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
              >
                {(payload.grandTotal || emptySummary).golIII}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
              >
                {(payload.grandTotal || emptySummary).golIV}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
              >
                {(payload.grandTotal || emptySummary).golV}
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 600, color: "white", fontSize: 12 }}
              >
                {(payload.grandTotal || emptySummary).totalLalin}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
