export type ApiResponse<T> = {
  status: boolean;
  message: string;
  code: number;
  data: T;
};

export type PaginatedData<T> = {
  total_pages: number;
  current_page: number;
  count: number;
  rows: {
    count: number;
    rows: T[];
  };
};

export type Gerbang = {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
};

export type GetGerbangsParams = {
  id?: number;
  IdCabang?: number;
  NamaCabang?: string;
  NamaGerbang?: string;
  page?: number;
  limit?: number;
};

export type GetGerbangsResponse = ApiResponse<PaginatedData<Gerbang>>;

export type CreateGerbangRequest = {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
};

export type CreateGerbangResponse = ApiResponse<unknown> &
  Gerbang & { createdAt: string; updatedAt: string };

export type UpdateGerbangRequest = {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
};

export type UpdateGerbangResponse = ApiResponse<number[]>;

export type DeleteGerbangRequest = {
  id: number;
  IdCabang: number;
};

export type DeleteGerbangResponse = ApiResponse<unknown> & {
  IdGerbang: number;
  IdCabang: number;
};

export type Lalin = {
  id: number;
  IdCabang: number;
  IdGerbang: number;
  Tanggal: string;
  Shift: number;
  IdGardu: number;
  Golongan: number;
  IdAsalGerbang: number;
  Tunai: number;
  DinasOpr: number;
  DinasMitra: number;
  DinasKary: number;
  eMandiri: number;
  eBri: number;
  eBni: number;
  eBca: number;
  eNobu: number;
  eDKI: number;
  eMega: number;
  eFlo: number;
};

export type GetLalinsParams = {
  tanggal?: string;
  page?: number;
  limit?: number;
};

export type GetLalinsResponse = ApiResponse<PaginatedData<Lalin>>;

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginData = {
  is_logged_in?: number;
  token?: string;
};

export type LoginResponse = ApiResponse<unknown> & LoginData;
