"use client";

import { useMemo, useCallback } from "react";

export type SortDirection = "asc" | "desc" | null;

type SortConfig<T> = {
  key: keyof T | null;
  direction: SortDirection;
};

type UseTableSortProps<T> = {
  sortBy: keyof T | null;
  sortDirection: SortDirection;
  onSortChange: (key: keyof T | null, direction: SortDirection) => void;
};

export function useTableSort<T extends Record<string, unknown>>({
  sortBy,
  sortDirection,
  onSortChange,
}: UseTableSortProps<T>) {
  const sortConfig: SortConfig<T> = useMemo(
    () => ({
      key: sortBy,
      direction: sortDirection,
    }),
    [sortBy, sortDirection],
  );

  const handleSort = useCallback(
    (key: keyof T) => {
      let newDirection: SortDirection = "desc";

      if (sortConfig.key === key) {
        // Cycle: desc -> asc -> null
        if (sortConfig.direction === "desc") {
          newDirection = "asc";
        } else if (sortConfig.direction === "asc") {
          newDirection = null;
        }
      }

      onSortChange(newDirection ? key : null, newDirection);
    },
    [sortConfig, onSortChange],
  );

  const sortedData = useCallback(
    <TData extends T>(data: TData[]): TData[] => {
      if (!sortConfig.key || !sortConfig.direction) {
        return data;
      }

      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle null/undefined
        if (aValue == null && bValue == null) {
          return 0;
        }
        if (aValue == null) {
          return 1;
        }
        if (bValue == null) {
          return -1;
        }

        // String comparison (case-insensitive)
        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue
            .toLowerCase()
            .localeCompare(bValue.toLowerCase());
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        // Numeric comparison
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Default comparison
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    },
    [sortConfig],
  );

  return {
    sortConfig,
    handleSort,
    sortedData,
  };
}
