export type PaymentMethod =
  | "Tunai"
  | "E-Toll"
  | "Flo"
  | "KTP"
  | "Keseluruhan"
  | "E-Toll+Tunai+Flo";

export type Order = "asc" | "desc";

export type LalinRow = {
  id: string;
  ruas: string;
  gerbang: string;
  gardu: string;
  hari: string;
  tanggal: string;
  metodePembayaran: string;
  golI: number;
  golII: number;
  golIII: number;
  golIV: number;
  golV: number;
  totalLalin: number;
};

export type TabConfig = {
  label: string;
  value: PaymentMethod;
};
