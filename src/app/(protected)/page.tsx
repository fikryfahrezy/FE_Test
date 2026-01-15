"use client";

import { useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import dayjs, { Dayjs } from "dayjs";
import { useGetLalins } from "@/services/use-highway-service";
import { useQueryParams } from "@/hooks/use-query-params";

export default function DashboardPage() {
  const { getQueryParam, setQueryParams } = useQueryParams();

  const dateParam = getQueryParam("date");
  const selectedDate = useMemo(() => {
    return dateParam ? dayjs(dateParam) : null;
  }, [dateParam]);

  const { data: lalinsData } = useGetLalins({
    tanggal: selectedDate?.format("YYYY-MM-DD"),
  });

  const handleDateChange = (date: Dayjs | null) => {
    setQueryParams({
      date: date?.format("YYYY-MM-DD"),
    });
  };

  const handleFilter = () => {
    // TODO: Implement filter
  };

  const { cabangData, gerbangData, shiftData, ruasData } = useMemo(() => {
    if (
      !lalinsData?.data?.rows?.rows ||
      lalinsData.data.rows.rows.length === 0
    ) {
      return {
        cabangData: [],
        gerbangData: [],
        shiftData: [],
        ruasData: [],
      };
    }

    const lalins = lalinsData.data.rows.rows;

    const paymentMethodMap = new Map<number, number>();
    const gerbangMap = new Map<number, number>();
    const shiftMap = new Map<number, number>();

    lalins.forEach((lalin) => {
      paymentMethodMap.set(1, (paymentMethodMap.get(1) || 0) + lalin.eBca);
      paymentMethodMap.set(2, (paymentMethodMap.get(2) || 0) + lalin.eBri);
      paymentMethodMap.set(3, (paymentMethodMap.get(3) || 0) + lalin.eBni);
      paymentMethodMap.set(4, (paymentMethodMap.get(4) || 0) + lalin.eDKI);
      paymentMethodMap.set(5, (paymentMethodMap.get(5) || 0) + lalin.eMandiri);
      paymentMethodMap.set(6, (paymentMethodMap.get(6) || 0) + lalin.eMega);
      paymentMethodMap.set(7, (paymentMethodMap.get(7) || 0) + lalin.eFlo);

      const total =
        lalin.Tunai +
        lalin.eMandiri +
        lalin.eBri +
        lalin.eBni +
        lalin.eBca +
        lalin.eNobu +
        lalin.eDKI +
        lalin.eMega +
        lalin.eFlo;

      gerbangMap.set(
        lalin.IdGerbang,
        (gerbangMap.get(lalin.IdGerbang) || 0) + total,
      );
      shiftMap.set(lalin.Shift, (shiftMap.get(lalin.Shift) || 0) + total);
    });

    const cabangDataArray = [
      paymentMethodMap.get(1) || 0,
      paymentMethodMap.get(2) || 0,
      paymentMethodMap.get(3) || 0,
      paymentMethodMap.get(4) || 0,
      paymentMethodMap.get(5) || 0,
      paymentMethodMap.get(6) || 0,
      paymentMethodMap.get(7) || 0,
    ];

    const gerbangDataArray = Array.from(gerbangMap.entries())
      .slice(0, 5)
      .map(([id, value]) => ({ label: `Gerbang ${id}`, value }));

    const shiftTotal = Array.from(shiftMap.values()).reduce((a, b) => a + b, 0);
    const shiftDataArray = Array.from(shiftMap.entries()).map(
      ([id, value]) => ({
        id,
        value: shiftTotal > 0 ? Math.round((value / shiftTotal) * 100) : 0,
        label: `Shift ${id}`,
      }),
    );

    const ruasDataArray = [
      { id: 0, value: 60, label: "Ruas 1" },
      { id: 1, value: 20, label: "Ruas 2" },
      { id: 2, value: 20, label: "Ruas 3" },
    ];

    return {
      cabangData: cabangDataArray,
      gerbangData: gerbangDataArray,
      shiftData: shiftDataArray,
      ruasData: ruasDataArray,
    };
  }, [lalinsData]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
        <DatePicker
          label="Tanggal"
          value={selectedDate}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              size: "small",
              sx: { width: 200 },
            },
          }}
        />
        <Button variant="contained" onClick={handleFilter}>
          Filter
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                Jumlah Lalin
              </Typography>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: [
                      "BCA",
                      "BRI",
                      "BNI",
                      "DKI",
                      "Mandiri",
                      "Mega",
                      "Flo",
                    ],
                  },
                ]}
                series={[{ data: cabangData }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                Total Lalin
              </Typography>
              <PieChart
                series={[
                  {
                    data: shiftData,
                    innerRadius: 60,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 5,
                  },
                ]}
                height={300}
              />
              <Box sx={{ mt: 2 }}>
                {shiftData.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.5,
                    }}
                  >
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                Jumlah Lalin
              </Typography>
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: gerbangData.map((d) => d.label),
                  },
                ]}
                series={[{ data: gerbangData.map((d) => d.value) }]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
                Total Lalin
              </Typography>
              <PieChart
                series={[
                  {
                    data: ruasData,
                    innerRadius: 60,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 5,
                  },
                ]}
                height={300}
              />
              <Box sx={{ mt: 2 }}>
                {ruasData.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 0.5,
                    }}
                  >
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
