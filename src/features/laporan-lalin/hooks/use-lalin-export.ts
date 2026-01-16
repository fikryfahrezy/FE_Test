"use client";

import { useCallback } from "react";
import type { LalinRow, RuasSummary } from "../types";

export type LalinExportPayload = {
  rows: LalinRow[];
  summaryByRuas: Record<string, RuasSummary>;
  grandTotal: RuasSummary;
  activeTab: string;
  selectedDate: string | null;
  generatedAt: string;
};

const csvHeaders = [
  "No",
  "Ruas",
  "Gerbang",
  "Gardu",
  "Hari",
  "Tanggal",
  "Metode Pembayaran",
  "Gol I",
  "Gol II",
  "Gol III",
  "Gol IV",
  "Gol V",
  "Total Lalin",
];

const escapeCsvValue = (value: string | number) => {
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const buildCsvContent = (payload: LalinExportPayload) => {
  const rows = payload.rows.map((row, index) => [
    index + 1,
    row.ruas,
    row.gerbang,
    row.gardu,
    row.hari,
    row.tanggal,
    row.metodePembayaran,
    row.golI,
    row.golII,
    row.golIII,
    row.golIV,
    row.golV,
    row.totalLalin,
  ]);

  const summaryRows = Object.entries(payload.summaryByRuas).map(
    ([ruas, totals]) => [
      "",
      `Total Lalin ${ruas}`,
      "",
      "",
      "",
      "",
      "",
      totals.golI,
      totals.golII,
      totals.golIII,
      totals.golIV,
      totals.golV,
      totals.totalLalin,
    ],
  );

  const grandTotalRow = [
    "",
    "Total Lalin Keseluruhan",
    "",
    "",
    "",
    "",
    "",
    payload.grandTotal.golI,
    payload.grandTotal.golII,
    payload.grandTotal.golIII,
    payload.grandTotal.golIV,
    payload.grandTotal.golV,
    payload.grandTotal.totalLalin,
  ];

  const dataRows = [...rows, ...summaryRows, grandTotalRow]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  return [csvHeaders.join(","), dataRows].join("\n");
};

const downloadCsv = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export function useLalinExport() {
  const exportCsv = useCallback((payload: LalinExportPayload) => {
    const csvContent = buildCsvContent(payload);
    const dateSuffix = payload.selectedDate || "";
    const filename = dateSuffix
      ? `laporan-lalin-${dateSuffix}.csv`
      : "laporan-lalin.csv";

    downloadCsv(csvContent, filename);
  }, []);

  const exportPdf = useCallback((payload: LalinExportPayload) => {
    const key = `lalin-export-${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(payload));

    const url = `/print/laporan-lalin-per-hari/?key=${encodeURIComponent(key)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return { exportCsv, exportPdf };
}
