"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

type BarChartCardProps = {
  title: string;
  data: number[];
  labels: string[];
  height?: number;
};

export function BarChartCard({
  title,
  data,
  labels,
  height = 300,
}: BarChartCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
          {title}
        </Typography>
        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: labels,
            },
          ]}
          series={[{ data }]}
          height={height}
        />
      </CardContent>
    </Card>
  );
}
