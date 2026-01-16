"use client";

import { useMemo } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useGetLalins } from "@/services/use-highway-service";
import { useQueryParams } from "@/hooks/use-query-params";
import { useTableSort, type SortDirection } from "@/hooks/use-table-sort";
import { useClientSearch } from "@/hooks/use-client-search";
import { FilterControls } from "@/features/laporan-lalin/components/filter-controls";
import { LalinDataTable } from "@/features/laporan-lalin/components/lalin-data-table";
import { PaymentMethodTabs } from "@/features/laporan-lalin/components/payment-method-tabs";
import { useLalinData } from "@/features/laporan-lalin/hooks/use-lalin-data";
import { useLalinExport } from "@/features/laporan-lalin/hooks/use-lalin-export";
import type { PaymentMethod, LalinRow } from "@/features/laporan-lalin/types";

export default function LaporanLalinPerHariPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();

  const activeTab = (getQueryParam("tab") as PaymentMethod) || "Tunai";
  const searchQuery = getQueryParam("search") || "";
  const dateParam = getQueryParam("date");
  const selectedDate = useMemo(() => {
    return dateParam ? dayjs(dateParam) : null;
  }, [dateParam]);
  const page = Number(getQueryParam("page")) || 0;
  const rowsPerPage = Number(getQueryParam("limit")) || 5;
  const sortBy = (getQueryParam("sort_by") as keyof LalinRow | null) || null;
  const sortDirection = (getQueryParam("sort_dir") as SortDirection) || null;

  const handleSortChange = (
    key: keyof LalinRow | null,
    direction: SortDirection,
  ) => {
    setQueryParams({
      sort_by: key as string | null,
      sort_dir: direction,
    });
  };

  const { sortConfig, handleSort, sortedData } = useTableSort<LalinRow>({
    sortBy,
    sortDirection,
    onSortChange: handleSortChange,
  });

  const { data: lalinsData, isLoading } = useGetLalins({
    tanggal: selectedDate?.format("YYYY-MM-DD"),
    page: 1,
    limit: 100000,
  });

  const { displayRows, summaryByRuas, grandTotal } = useLalinData({
    lalinsData,
    activeTab,
  });

  const { exportCsv, exportPdf } = useLalinExport();

  const searchedRows = useClientSearch({
    data: displayRows,
    searchQuery,
    searchKeys: ["ruas", "gerbang", "gardu"],
  });

  const sortedRows = useMemo(
    () => sortedData(searchedRows),
    [searchedRows, sortedData],
  );

  // Paginate on frontend after aggregation, search, and sort
  const paginatedRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedRows.slice(startIndex, endIndex);
  }, [sortedRows, page, rowsPerPage]);

  const handleTabChange = (newTab: PaymentMethod) => {
    setQueryParams({
      tab: newTab,
      page: 0,
    });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setQueryParams({
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQueryParams({
      limit: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handleSearchChange = (value: string) => {
    setQueryParams({
      search: value,
      page: 0,
    });
  };

  const handleDateChange = (date: Dayjs | null) => {
    setQueryParams({
      date: date?.format("YYYY-MM-DD"),
      page: 0,
    });
  };

  const handleFilter = () => {
    setQueryParams({
      page: 0,
    });
  };

  const handleReset = () => {
    setQueryParams({
      search: null,
      date: null,
      page: 0,
    });
  };

  const handleExportExcel = () => {
    exportCsv({
      rows: sortedRows,
      summaryByRuas,
      grandTotal,
      activeTab,
      selectedDate: selectedDate?.format("YYYY-MM-DD") || null,
      generatedAt: dayjs().format("YYYY-MM-DD HH:mm"),
    });
  };

  const handleExportPDF = () => {
    exportPdf({
      rows: sortedRows,
      summaryByRuas,
      grandTotal,
      activeTab,
      selectedDate: selectedDate?.format("YYYY-MM-DD") || null,
      generatedAt: dayjs().format("YYYY-MM-DD HH:mm"),
    });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
        Laporan Lalin Per Hari
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FilterControls
            searchQuery={searchQuery}
            selectedDate={selectedDate}
            onSearchChange={handleSearchChange}
            onDateChange={handleDateChange}
            onFilter={handleFilter}
            onReset={handleReset}
          />

          <PaymentMethodTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
          />

          <LalinDataTable
            rows={paginatedRows}
            summaryByRuas={summaryByRuas}
            grandTotal={grandTotal}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={sortedRows.length}
            sortBy={sortConfig.key}
            sortDirection={sortConfig.direction}
            isLoading={isLoading}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            onSort={handleSort}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
