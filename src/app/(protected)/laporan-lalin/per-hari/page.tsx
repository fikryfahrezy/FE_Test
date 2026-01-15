"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Search as SearchIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { useGetLalins } from "@/services/use-highway-service";
import type { Lalin } from "@/services/highway-service.types";

type PaymentMethod =
  | "Tunai"
  | "E-Toll"
  | "Flo"
  | "KTP"
  | "Keseluruhan"
  | "E-Toll+Tunai+Flo";

type TabConfig = {
  label: string;
  value: PaymentMethod;
};

const tabs: TabConfig[] = [
  { label: "Total Tunai", value: "Tunai" },
  { label: "Total E-Toll", value: "E-Toll" },
  { label: "Total Flo", value: "Flo" },
  { label: "Total KTP", value: "KTP" },
  { label: "Total Keseluruhan", value: "Keseluruhan" },
  { label: "Total E-Toll+Tunai+Flo", value: "E-Toll+Tunai+Flo" },
];

type Order = "asc" | "desc";

type LalinRow = {
  id: string;
  no: number;
  ruas: string;
  gerbang: string;
  gardu: string;
  hari: string;
  tanggal: string;
  metodePembayaran: string;
  golI: number;
  golII: number;
  golIII: number;
  golIV: number;
  golV: number;
  totalLalin: number;
};

const dayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

// Helper function to get payment value based on method
const getPaymentValue = (lalin: Lalin, method: PaymentMethod): number => {
  const eToll =
    lalin.eMandiri +
    lalin.eBri +
    lalin.eBni +
    lalin.eBca +
    lalin.eNobu +
    lalin.eDKI +
    lalin.eMega;
  const tunai = lalin.Tunai;
  const flo = lalin.eFlo;
  const ktp = lalin.DinasOpr + lalin.DinasMitra + lalin.DinasKary;

  switch (method) {
    case "Tunai":
      return tunai;
    case "E-Toll":
      return eToll;
    case "Flo":
      return flo;
    case "KTP":
      return ktp;
    case "Keseluruhan":
      return eToll + tunai + flo + ktp;
    case "E-Toll+Tunai+Flo":
      return eToll + tunai + flo;
    default:
      return 0;
  }
};

export default function LaporanLalinPerHariPage() {
  const [activeTab, setActiveTab] = useState<PaymentMethod>("Tunai");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof LalinRow>("tanggal");
  const [order, setOrder] = useState<Order>("desc");

  const { data: lalinsData, isLoading } = useGetLalins({
    tanggal: selectedDate?.format("YYYY-MM-DD"),
    page: page + 1,
    limit: 1000, // Get all records to aggregate
  });

  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: PaymentMethod,
  ) => {
    setActiveTab(newValue);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof LalinRow) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleFilter = () => {
    setPage(0);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDate(null);
    setPage(0);
  };

  const handleExport = () => {
    console.log("Export clicked");
  };

  const aggregatedRows: LalinRow[] = useMemo(() => {
    if (!lalinsData?.data?.rows?.rows) return [];

    const grouped = new Map<
      string,
      {
        ruas: string;
        gerbang: string;
        gardu: string;
        tanggal: string;
        hari: string;
        idCabang: number;
        idGerbang: number;
        idGardu: number;
        golI: number;
        golII: number;
        golIII: number;
        golIV: number;
        golV: number;
      }
    >();

    lalinsData.data.rows.rows.forEach((lalin) => {
      const date = dayjs(lalin.Tanggal);
      const key = `${lalin.IdCabang}-${lalin.IdGerbang}-${lalin.IdGardu}-${lalin.Tanggal}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          ruas: `Ruas ${lalin.IdCabang}`,
          gerbang: `Gerbang ${lalin.IdGerbang}`,
          gardu: String(lalin.IdGardu).padStart(2, "0"),
          tanggal: date.format("DD-MM-YYYY"),
          hari: dayNames[date.day()],
          idCabang: lalin.IdCabang,
          idGerbang: lalin.IdGerbang,
          idGardu: lalin.IdGardu,
          golI: 0,
          golII: 0,
          golIII: 0,
          golIV: 0,
          golV: 0,
        });
      }

      const entry = grouped.get(key)!;
      const value = getPaymentValue(lalin, activeTab);

      switch (lalin.Golongan) {
        case 1:
          entry.golI += value;
          break;
        case 2:
          entry.golII += value;
          break;
        case 3:
          entry.golIII += value;
          break;
        case 4:
          entry.golIV += value;
          break;
        case 5:
          entry.golV += value;
          break;
      }
    });

    const rows = Array.from(grouped.values()).map((entry, index) => ({
      id: `${entry.idCabang}-${entry.idGerbang}-${entry.idGardu}-${entry.tanggal}`,
      no: index + 1,
      ruas: entry.ruas,
      gerbang: entry.gerbang,
      gardu: entry.gardu,
      hari: entry.hari,
      tanggal: entry.tanggal,
      metodePembayaran:
        activeTab === "E-Toll+Tunai+Flo" ? "E-Toll+Tunai+Flo" : activeTab,
      golI: entry.golI,
      golII: entry.golII,
      golIII: entry.golIII,
      golIV: entry.golIV,
      golV: entry.golV,
      totalLalin:
        entry.golI + entry.golII + entry.golIII + entry.golIV + entry.golV,
    }));

    const filteredRows = searchQuery
      ? rows.filter(
          (row) =>
            row.ruas.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.gerbang.toLowerCase().includes(searchQuery.toLowerCase()) ||
            row.gardu.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : rows;

    return filteredRows;
  }, [lalinsData, activeTab, searchQuery]);

  const paginatedRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return aggregatedRows
      .slice(startIndex, startIndex + rowsPerPage)
      .map((row, index) => ({
        ...row,
        no: startIndex + index + 1,
      }));
  }, [aggregatedRows, page, rowsPerPage]);

  const summaryByRuas = useMemo(() => {
    const summary: Record<
      string,
      {
        golI: number;
        golII: number;
        golIII: number;
        golIV: number;
        golV: number;
        totalLalin: number;
      }
    > = {};

    aggregatedRows.forEach((row) => {
      if (!summary[row.ruas]) {
        summary[row.ruas] = {
          golI: 0,
          golII: 0,
          golIII: 0,
          golIV: 0,
          golV: 0,
          totalLalin: 0,
        };
      }
      summary[row.ruas].golI += row.golI;
      summary[row.ruas].golII += row.golII;
      summary[row.ruas].golIII += row.golIII;
      summary[row.ruas].golIV += row.golIV;
      summary[row.ruas].golV += row.golV;
      summary[row.ruas].totalLalin += row.totalLalin;
    });

    return summary;
  }, [aggregatedRows]);

  const grandTotal = useMemo(() => {
    return Object.values(summaryByRuas).reduce(
      (acc, curr) => ({
        golI: acc.golI + curr.golI,
        golII: acc.golII + curr.golII,
        golIII: acc.golIII + curr.golIII,
        golIV: acc.golIV + curr.golIV,
        golV: acc.golV + curr.golV,
        totalLalin: acc.totalLalin + curr.totalLalin,
      }),
      { golI: 0, golII: 0, golIII: 0, golIV: 0, golV: 0, totalLalin: 0 },
    );
  }, [summaryByRuas]);

  const totalCount = aggregatedRows.length;

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
        Laporan Lalin Per Hari
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
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
              placeholder="Search"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              label="Tanggal"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  sx: { minWidth: 180 },
                },
              }}
            />
            <Button variant="contained" color="primary" onClick={handleFilter}>
              Filter
            </Button>
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  minWidth: "auto",
                  px: 2,
                  py: 0.75,
                  fontSize: 13,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    borderRadius: 1,
                  },
                },
              }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
              size="small"
            >
              Export
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "grey.50" }}>
                  <TableCell sx={{ fontSize: 12 }}>No.</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    <TableSortLabel
                      active={orderBy === "ruas"}
                      direction={orderBy === "ruas" ? order : "asc"}
                      onClick={() => handleRequestSort("ruas")}
                    >
                      Ruas
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    <TableSortLabel
                      active={orderBy === "gerbang"}
                      direction={orderBy === "gerbang" ? order : "asc"}
                      onClick={() => handleRequestSort("gerbang")}
                    >
                      Gerbang
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    <TableSortLabel
                      active={orderBy === "gardu"}
                      direction={orderBy === "gardu" ? order : "asc"}
                      onClick={() => handleRequestSort("gardu")}
                    >
                      Gardu
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    <TableSortLabel
                      active={orderBy === "hari"}
                      direction={orderBy === "hari" ? order : "asc"}
                      onClick={() => handleRequestSort("hari")}
                    >
                      Hari
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    <TableSortLabel
                      active={orderBy === "tanggal"}
                      direction={orderBy === "tanggal" ? order : "asc"}
                      onClick={() => handleRequestSort("tanggal")}
                    >
                      Tanggal
                    </TableSortLabel>
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
                ) : paginatedRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {paginatedRows.map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ fontSize: 12 }}>{row.no}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{row.ruas}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          {row.gerbang}
                        </TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{row.gardu}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>{row.hari}</TableCell>
                        <TableCell sx={{ fontSize: 12 }}>
                          {row.tanggal}
                        </TableCell>
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
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Show:"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
