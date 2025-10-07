import { apiSlice } from './apiSlice';
import { Prescription, CreatePrescriptionRequest } from '../types';

interface GetPrescriptionsParams {
  status?: 'active' | 'expired' | 'cancelled';
}

export const prescriptionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrescriptions: builder.query<{ prescriptions: Prescription[] }, GetPrescriptionsParams>({
      query: ({ status } = {}) => ({
        url: '/prescriptions',
        params: status ? { status } : {},
      }),
      providesTags: ['Prescription'],
    }),
    
    getPrescriptionById: builder.query<Prescription, number>({
      query: (id) => `/prescriptions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Prescription', id }],
    }),
    
    createPrescription: builder.mutation<{ message: string; prescription: Prescription }, CreatePrescriptionRequest>({
      query: (prescription) => ({
        url: '/prescriptions',
        method: 'POST',
        body: prescription,
      }),
      invalidatesTags: ['Prescription'],
    }),
    
    updatePrescription: builder.mutation<{ message: string; prescription: Prescription }, Partial<CreatePrescriptionRequest> & { id: number }>({
      query: ({ id, ...prescription }) => ({
        url: `/prescriptions/${id}`,
        method: 'PUT',
        body: prescription,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Prescription', id }],
    }),
    
    deletePrescription: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/prescriptions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Prescription'],
    }),
  }),
});

export const {
  useGetPrescriptionsQuery,
  useGetPrescriptionByIdQuery,
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
} = prescriptionsApi;
