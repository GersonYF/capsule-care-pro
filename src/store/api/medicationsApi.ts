import { apiSlice } from './apiSlice';
import {
  Medication,
  UserMedication,
  CreateUserMedicationRequest,
  PaginatedResponse,
} from '../types';

interface GetMedicationsParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export const medicationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMedications: builder.query<PaginatedResponse<Medication>, GetMedicationsParams>({
      query: ({ page = 1, per_page = 20, search = '' } = {}) => ({
        url: '/medications',
        params: { page, per_page, search },
      }),
      providesTags: ['Medication'],
    }),
    
    getMedicationById: builder.query<Medication, number>({
      query: (id) => `/medications/${id}`,
      providesTags: (result, error, id) => [{ type: 'Medication', id }],
    }),
    
    createMedication: builder.mutation<{ message: string; medication: Medication }, Partial<Medication>>({
      query: (medication) => ({
        url: '/medications',
        method: 'POST',
        body: medication,
      }),
      invalidatesTags: ['Medication'],
    }),
    
    updateMedication: builder.mutation<{ message: string; medication: Medication }, Partial<Medication> & { id: number }>({
      query: ({ id, ...medication }) => ({
        url: `/medications/${id}`,
        method: 'PUT',
        body: medication,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Medication', id }],
    }),
    
    deleteMedication: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/medications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Medication'],
    }),
    
    getUserMedications: builder.query<{ medications: UserMedication[] }, void>({
      query: () => '/medications/user',
      providesTags: ['UserMedication'],
    }),
    
    getUserMedicationById: builder.query<UserMedication, number>({
      query: (id) => `/medications/user/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserMedication', id }],
    }),
    
    addUserMedication: builder.mutation<{ message: string; user_medication: UserMedication }, CreateUserMedicationRequest>({
      query: (medication) => ({
        url: '/medications/user',
        method: 'POST',
        body: medication,
      }),
      invalidatesTags: ['UserMedication'],
    }),
    
    updateUserMedication: builder.mutation<{ message: string; user_medication: UserMedication }, Partial<CreateUserMedicationRequest> & { id: number }>({
      query: ({ id, ...medication }) => ({
        url: `/medications/user/${id}`,
        method: 'PUT',
        body: medication,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'UserMedication', id }],
    }),
    
    deleteUserMedication: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/medications/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserMedication'],
    }),
  }),
});

export const {
  useGetMedicationsQuery,
  useGetMedicationByIdQuery,
  useCreateMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation,
  useGetUserMedicationsQuery,
  useGetUserMedicationByIdQuery,
  useAddUserMedicationMutation,
  useUpdateUserMedicationMutation,
  useDeleteUserMedicationMutation,
} = medicationsApi;
