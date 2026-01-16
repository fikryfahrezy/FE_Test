"use client";

import { useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useGetLalins } from "@/services/use-highway-service";
import { useQueryParams } from "@/hooks/use-query-params";
import { useDashboardData } from "@/features/laporan-lalin/hooks/use-dashboard-data";
import { DateFilter } from "@/features/laporan-lalin/components/date-filter";
import { BarChartCard } from "@/features/laporan-lalin/components/bar-chart-card";
import { PieChartCard } from "@/features/laporan-lalin/components/pie-chart-card";

export default function DashboardPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();

  const dateParam = getQueryParam("date");
  const selectedDate = useMemo(() => {
    return dateParam ? dayjs(dateParam) : null;
  }, [dateParam]);

  const { data: lalinsData } = useGetLalins({
    tanggal: selectedDate?.format("YYYY-MM-DD"),
  });

  const { cabangData, gerbangData, shiftData, ruasData } = useDashboardData({
    lalinsData,
  });

  const handleDateChange = (date: Dayjs | null) => {
    setQueryParams({
      date: date?.format("YYYY-MM-DD"),
    });
  };

  const handleFilter = () => {
    // TODO: Implement filter
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <DateFilter
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onFilter={handleFilter}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <BarChartCard
            title="Jumlah Lalin"
            data={cabangData}
            labels={["BCA", "BRI", "BNI", "DKI", "Mandiri", "Mega", "Flo"]}
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
    </Box>
  );
}
