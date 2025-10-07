import { apiSlice } from './apiSlice';
import {
  Doctor,
  UserDoctor,
  CreateDoctorRequest,
  CreateUserDoctorRequest,
  PaginatedResponse,
} from '../types';

interface GetDoctorsParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const doctorsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<PaginatedResponse<Doctor>, GetDoctorsParams>({
      query: ({ page = 1, per_page = 20, search = '' } = {}) => ({
        url: '/doctors',
        params: { page, per_page, search },
      }),
      providesTags: ['Doctor'],
    }),
    
    getDoctorById: builder.query<Doctor, number>({
      query: (id) => `/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Doctor', id }],
    }),
    
    createDoctor: builder.mutation<{ message: string; doctor: Doctor }, CreateDoctorRequest>({
      query: (doctor) => ({
        url: '/doctors',
        method: 'POST',
        body: doctor,
      }),
      invalidatesTags: ['Doctor'],
    }),
    
    updateDoctor: builder.mutation<{ message: string; doctor: Doctor }, Partial<CreateDoctorRequest> & { id: number }>({
      query: ({ id, ...doctor }) => ({
        url: `/doctors/${id}`,
        method: 'PUT',
        body: doctor,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Doctor', id }],
    }),
    
    deleteDoctor: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/doctors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Doctor'],
    }),
    
    getUserDoctors: builder.query<{ doctors: UserDoctor[] }, void>({
      query: () => '/doctors/user',
      providesTags: ['UserDoctor'],
    }),
    
    getUserDoctorById: builder.query<UserDoctor, number>({
      query: (id) => `/doctors/user/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserDoctor', id }],
    }),
    
    addUserDoctor: builder.mutation<{ message: string; user_doctor: UserDoctor }, CreateUserDoctorRequest>({
      query: (doctor) => ({
        url: '/doctors/user',
        method: 'POST',
        body: doctor,
      }),
      invalidatesTags: ['UserDoctor'],
    }),
    
    updateUserDoctor: builder.mutation<{ message: string; user_doctor: UserDoctor }, Partial<CreateUserDoctorRequest> & { id: number }>({
      query: ({ id, ...doctor }) => ({
        url: `/doctors/user/${id}`,
        method: 'PUT',
        body: doctor,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'UserDoctor', id }],
    }),
    
    deleteUserDoctor: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/doctors/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserDoctor'],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
  useGetUserDoctorsQuery,
  useGetUserDoctorByIdQuery,
  useAddUserDoctorMutation,
  useUpdateUserDoctorMutation,
  useDeleteUserDoctorMutation,
} = doctorsApi;
