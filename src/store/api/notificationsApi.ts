import { apiSlice } from './apiSlice';
import {
  Notification,
  MedicationIntake,
  CreateMedicationIntakeRequest,
  PaginatedResponse,
} from '../types';

interface GetNotificationsParams {
  page?: number;
  per_page?: number;
  status?: 'pending' | 'sent' | 'failed' | 'read';
  unread_only?: boolean;
}

interface GetMedicationIntakesParams {
  page?: number;
  per_page?: number;
}

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<PaginatedResponse<Notification>, GetNotificationsParams>({
      query: ({ page = 1, per_page = 20, status, unread_only = false } = {}) => ({
        url: '/notifications',
        params: { page, per_page, status, unread_only },
      }),
      providesTags: ['Notification'],
    }),
    
    getNotificationById: builder.query<Notification, number>({
      query: (id) => `/notifications/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),
    
    markNotificationAsRead: builder.mutation<{ message: string; notification: Notification }, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    
    markAllNotificationsAsRead: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    
    deleteNotification: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
    
    getMedicationIntakes: builder.query<PaginatedResponse<MedicationIntake>, GetMedicationIntakesParams>({
      query: ({ page = 1, per_page = 20 } = {}) => ({
        url: '/notifications/intake',
        params: { page, per_page },
      }),
      providesTags: ['MedicationIntake'],
    }),
    
    createMedicationIntake: builder.mutation<{ message: string; intake: MedicationIntake }, CreateMedicationIntakeRequest>({
      query: (intake) => ({
        url: '/notifications/intake',
        method: 'POST',
        body: intake,
      }),
      invalidatesTags: ['MedicationIntake'],
    }),
    
    updateMedicationIntake: builder.mutation<{ message: string; intake: MedicationIntake }, Partial<CreateMedicationIntakeRequest> & { id: number }>({
      query: ({ id, ...intake }) => ({
        url: `/notifications/intake/${id}`,
        method: 'PUT',
        body: intake,
      }),
      invalidatesTags: ['MedicationIntake'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useGetMedicationIntakesQuery,
  useCreateMedicationIntakeMutation,
  useUpdateMedicationIntakeMutation,
} = notificationsApi;
