import { useMemo } from "react";
import dayjs from "dayjs";
import type { GetLalinsResponse } from "@/services/highway-service.types";
import type { LalinRow, PaymentMethod, RuasSummary } from "../types";
import { dayNames } from "../constants";
import { getPaymentValue } from "../utils";

type UseLalinDataParams = {
  lalinsData: GetLalinsResponse | undefined;
  activeTab: PaymentMethod;
};

export function useLalinData({ lalinsData, activeTab }: UseLalinDataParams) {
  const displayRows: LalinRow[] = useMemo(() => {
    if (!lalinsData?.data?.rows?.rows) {
      return [];
    }

    const grouped = new Map<string, LalinRow>();

    lalinsData.data.rows.rows.forEach((lalin) => {
      const date = dayjs(lalin.Tanggal);
      const key = `${lalin.IdCabang}-${lalin.IdGerbang}-${lalin.IdGardu}-${date.format("DD-MM-YYYY")}`;

      const paymentValue = getPaymentValue(lalin, activeTab);

      if (!grouped.has(key)) {
        grouped.set(key, {
          id: key,
          ruas: `Ruas ${lalin.IdCabang}`,
          gerbang: `Gerbang ${lalin.IdGerbang}`,
          gardu: String(lalin.IdGardu).padStart(2, "0"),
          hari: dayNames[date.day()],
          tanggal: date.format("DD-MM-YYYY"),
          metodePembayaran: activeTab,
          golI: 0,
          golII: 0,
          golIII: 0,
          golIV: 0,
          golV: 0,
          totalLalin: 0,
        });
      }

      const row = grouped.get(key)!;

      if (lalin.Golongan === 1) {
        row.golI += paymentValue;
      } else if (lalin.Golongan === 2) {
        row.golII += paymentValue;
      } else if (lalin.Golongan === 3) {
        row.golIII += paymentValue;
      } else if (lalin.Golongan === 4) {
        row.golIV += paymentValue;
      } else if (lalin.Golongan === 5) {
        row.golV += paymentValue;
      }

      row.totalLalin += paymentValue;
    });

    return Array.from(grouped.values());
  }, [lalinsData, activeTab]);

  const summaryByRuas = useMemo(() => {
    const summary: Record<string, RuasSummary> = {};

    displayRows.forEach((row) => {
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
  }, [displayRows]);

  const grandTotal = useMemo(() => {
    return Object.values(summaryByRuas).reduce(
      (acc, curr) => {
        return ({
          golI: acc.golI + curr.golI,
          golII: acc.golII + curr.golII,
          golIII: acc.golIII + curr.golIII,
          golIV: acc.golIV + curr.golIV,
          golV: acc.golV + curr.golV,
          totalLalin: acc.totalLalin + curr.totalLalin,
        })
      },
      { golI: 0, golII: 0, golIII: 0, golIV: 0, golV: 0, totalLalin: 0 },
    );
  }, [summaryByRuas]);

  return {
    displayRows,
    summaryByRuas,
    grandTotal,
  };
}
