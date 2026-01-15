import { useMemo } from "react";
import dayjs from "dayjs";
import type { GetLalinsResponse } from "@/services/highway-service.types";
import type { LalinRow, PaymentMethod } from "../types";
import { dayNames } from "../constants";
import { getPaymentValue } from "../utils";

type UseLalinDataParams = {
  lalinsData: GetLalinsResponse | undefined;
  activeTab: PaymentMethod;
};

type GroupedLalinEntry = {
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
};

export function useLalinData({ lalinsData, activeTab }: UseLalinDataParams) {
  const aggregatedRows: LalinRow[] = useMemo(() => {
    if (!lalinsData?.data?.rows?.rows) {
      return [];
    }

    const grouped = new Map<string, GroupedLalinEntry>();

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

    return Array.from(grouped.values()).map((entry) => ({
      id: `${entry.idCabang}-${entry.idGerbang}-${entry.idGardu}-${entry.tanggal}`,
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
  }, [lalinsData, activeTab]);

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

  return {
    aggregatedRows,
    summaryByRuas,
    grandTotal,
  };
}
