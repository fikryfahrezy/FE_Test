"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

type PieDataItem = {
  id: number;
  value: number;
  label: string;
};

type PieChartCardProps = {
  title: string;
  data: PieDataItem[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
};

export function PieChartCard({
  title,
  data,
  height = 300,
  innerRadius = 60,
  outerRadius = 100,
  showLegend = true,
}: PieChartCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={500} sx={{ mb: 2 }}>
          {title}
        </Typography>
        <PieChart
          series={[
            {
              data,
              innerRadius,
              outerRadius,
              paddingAngle: 2,
              cornerRadius: 5,
            },
          ]}
          height={height}
        />
        {showLegend && (
          <Box sx={{ mt: 2 }}>
            {data.map((item) => (
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
        )}
      </CardContent>
    </Card>
  );
}
