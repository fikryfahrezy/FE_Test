import {
  type MutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  ApiError,
  highwayService,
} from './highway-service';
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

export const highwayKeys = {
  all: ['highway'] as const,
  gerbangs: () => { 
    return [...highwayKeys.all, 'gerbangs'] as const
  },
  gerbang: (params: GetGerbangsParams) => {
    return [...highwayKeys.gerbangs(), params] as const;
  },
  lalins: () => { 
    return [...highwayKeys.all, 'lalins'] as const
  },
  lalin: (params: GetLalinsParams) => {
    return [...highwayKeys.lalins(), params] as const;
  },
  auth: () => { 
    return [...highwayKeys.all, 'auth'] as const
  },
  home: () => { 
    return [...highwayKeys.all, 'home'] as const
  },
};

export function useGetGerbangs(
  params?: GetGerbangsParams,
  options?: Omit<
    UseQueryOptions<GetGerbangsResponse, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: highwayKeys.gerbang(params || {}),
    queryFn: async () => {
      return await highwayService.getGerbangs(params);
    },
    ...options,
  });
}

export function useCreateGerbang(
  options?: Omit<
    MutationOptions<CreateGerbangResponse, ApiError, CreateGerbangRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess: onUserSuccess, ...restOptions } = options || {};
  
  return useMutation({
    mutationFn: async (payload) => {
      return await highwayService.createGerbang(payload);
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: highwayKeys.gerbangs(),
      });
      onUserSuccess?.(data, variables, context, mutation);
    },
    ...restOptions,
  });
}

export function useUpdateGerbang(
  options?: Omit<
    MutationOptions<UpdateGerbangResponse, ApiError, UpdateGerbangRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess: onUserSuccess, ...restOptions } = options || {};
  
  return useMutation({
    mutationFn: async (payload) => {
      return await highwayService.updateGerbang(payload);
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: highwayKeys.gerbangs(),
      });
      onUserSuccess?.(data, variables, context, mutation);
    },
    ...restOptions,
  });
}

export function useDeleteGerbang(
  options?: Omit<
    MutationOptions<DeleteGerbangResponse, ApiError, DeleteGerbangRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess: onUserSuccess, ...restOptions } = options || {};
  
  return useMutation({
    mutationFn: async (payload) => {
      return await highwayService.deleteGerbang(payload);
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: highwayKeys.gerbangs(),
      });
      onUserSuccess?.(data, variables, context, mutation);
    },
    ...restOptions,
  });
}

export function useGetLalins(
  params?: GetLalinsParams,
  options?: Omit<
    UseQueryOptions<GetLalinsResponse, ApiError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: highwayKeys.lalin(params || {}),
    queryFn: async () => {
      return await highwayService.getLalins(params);
    },
    ...options,
  });
}

export function useLogin(
  options?: Omit<
    MutationOptions<LoginResponse, ApiError, LoginRequest>,
    'mutationFn'
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess: onUserSuccess, ...restOptions } = options || {};
  
  return useMutation({
    mutationFn: async (payload) => {
      return await highwayService.login(payload);
    },
    onSuccess: (data, variables, context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: highwayKeys.auth(),
      });
      onUserSuccess?.(data, variables, context, mutation);
    },
    ...restOptions,
  });
}
