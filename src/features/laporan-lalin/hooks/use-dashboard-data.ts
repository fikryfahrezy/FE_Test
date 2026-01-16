import { useMemo } from "react";
import type { GetLalinsResponse } from "@/services/highway-service.types";

type PieDataItem = {
  id: number;
  value: number;
  label: string;
};

type GerbangDataItem = {
  label: string;
  value: number;
};

type UseDashboardDataParams = {
  lalinsData: GetLalinsResponse | undefined;
};

type DashboardData = {
  cabangData: number[];
  gerbangData: GerbangDataItem[];
  shiftData: PieDataItem[];
  ruasData: PieDataItem[];
};

export function useDashboardData({
  lalinsData,
}: UseDashboardDataParams): DashboardData {
  return useMemo(() => {
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

    const shiftTotal = Array.from(shiftMap.values()).reduce(
      (a, b) => a + b,
      0,
    );
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
}
