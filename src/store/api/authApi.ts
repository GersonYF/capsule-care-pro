import { apiSlice } from './apiSlice';
import { User, LoginRequest, RegisterRequest, LoginResponse } from '../types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    
    forgotPassword: builder.mutation<{ message: string; reset_url?: string }, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    
    verifyResetToken: builder.mutation<{ valid: boolean; email?: string; error?: string }, { token: string }>({
      query: (data) => ({
        url: '/auth/verify-reset-token',
        method: 'POST',
        body: data,
      }),
    }),
    
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
  useVerifyResetTokenMutation,
  useResetPasswordMutation,
} = authApi;
