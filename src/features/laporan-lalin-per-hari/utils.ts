import type { Lalin } from "@/services/highway-service.types";
import type { PaymentMethod } from "./types";

export function getPaymentValue(lalin: Lalin, method: PaymentMethod): number {
  const eToll =
    lalin.eMandiri +
    lalin.eBri +
    lalin.eBni +
    lalin.eBca +
    lalin.eNobu +
    lalin.eDKI +
    lalin.eMega;
  const tunai = lalin.Tunai;
  const flo = lalin.eFlo;
  const ktp = lalin.DinasOpr + lalin.DinasMitra + lalin.DinasKary;

  switch (method) {
    case "Tunai":
      return tunai;
    case "E-Toll":
      return eToll;
    case "Flo":
      return flo;
    case "KTP":
      return ktp;
    case "Keseluruhan":
      return eToll + tunai + flo + ktp;
    case "E-Toll+Tunai+Flo":
      return eToll + tunai + flo;
    default:
      return 0;
  }
}
