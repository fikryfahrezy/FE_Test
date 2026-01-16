"use client";

import { useMemo } from "react";
import { Grid, Typography, Stack } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useGetLalins } from "@/services/use-highway-service";
import { useQueryParams } from "@/hooks/use-query-params";
import { useDebounce } from "@/hooks/use-debounce";
import { useDashboardData } from "@/features/laporan-lalin/hooks/use-dashboard-data";
import { FilterControls } from "@/features/laporan-lalin/components/filter-controls";
import { BarChartCard } from "@/features/laporan-lalin/components/bar-chart-card";
import { PieChartCard } from "@/features/laporan-lalin/components/pie-chart-card";

export default function DashboardPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();

  const searchQuery = getQueryParam("search") || "";
  const dateParam = getQueryParam("date");
  const selectedDate = useMemo(() => {
    return dateParam ? dayjs(dateParam) : null;
  }, [dateParam]);

  const params = {
    tanggal: selectedDate?.format("YYYY-MM-DD"),
    limit: 100000,
  };
  const { data: lalinsData } = useGetLalins(params);

  const { paymentMethodData, gerbangData, shiftData, ruasData } =
    useDashboardData({
      lalinsData,
      searchQuery,
    });

  const debouncedSearchChange = useDebounce((value: string) => {
    setQueryParams({
      search: value,
    });
  }, 300);

  const handleDateChange = (date: Dayjs | null) => {
    setQueryParams({
      date: date?.format("YYYY-MM-DD"),
    });
  };

  const handleFilter = () => {
    setQueryParams(params);
  };

  const handleReset = () => {
    setQueryParams({
      search: null,
      date: null,
    });
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={500}>
        Dashboard
      </Typography>

      <FilterControls
        selectedDate={selectedDate}
        onSearchChange={debouncedSearchChange}
        onDateChange={handleDateChange}
        onFilter={handleFilter}
        onReset={handleReset}
        searchPlaceholder="Search by Ruas, Gerbang, or Gardu"
        dateLabel="Tanggal"
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <BarChartCard
            title="Jumlah Lalin"
            data={paymentMethodData.map((item) => item.value)}
            labels={paymentMethodData.map((item) => item.label)}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <PieChartCard title="Total Lalin" data={shiftData} />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <BarChartCard
            title="Jumlah Lalin"
            data={gerbangData.map((d) => d.value)}
            labels={gerbangData.map((d) => d.label)}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <PieChartCard title="Total Lalin" data={ruasData} />
        </Grid>
      </Grid>
    </Stack>
  );
}
