import type {
  CreateGerbangRequest,
  CreateGerbangResponse,
  DeleteGerbangRequest,
  DeleteGerbangResponse,
  GetGerbangsParams,
  GetGerbangsResponse,
  GetLalinsParams,
  GetLalinsResponse,
  LoginRequest,
  LoginResponse,
  UpdateGerbangRequest,
  UpdateGerbangResponse,
} from './highway-service.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_HIGHWAY_SERVICE_URL || 'http://localhost:8080';

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class HighwayService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || 'An error occurred',
          errorData.code
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 'Network error or failed to fetch');
    }
  }

  private buildQueryString(params: Record<string, any>) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getGerbangs(params?: GetGerbangsParams){
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<GetGerbangsResponse>(`/api/gerbangs${queryString}`);
  }

  async createGerbang(data: CreateGerbangRequest) {
    return this.request<CreateGerbangResponse>('/api/gerbangs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGerbang(data: UpdateGerbangRequest) {
    return this.request<UpdateGerbangResponse>('/api/gerbangs/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGerbang(data: DeleteGerbangRequest) {
    return this.request<DeleteGerbangResponse>('/api/gerbangs/', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  async getLalins(params?: GetLalinsParams) {
    const queryString = params ? this.buildQueryString(params) : '';
    return this.request<GetLalinsResponse>(`/api/lalins${queryString}`);
  }

  async login(credentials: LoginRequest) {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}

export const highwayService = new HighwayService();

export { HighwayService, ApiError };

