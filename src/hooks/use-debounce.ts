import { debounce } from "@/utils/debounce";
import { useMemo } from "react";

export const useDebounce = <R, A extends unknown[]>(
  callback: (...args: A) => R,
  time?: number,
) => {
  return useMemo(() => {
    return debounce(callback, time);
  }, [callback, time]);
};
