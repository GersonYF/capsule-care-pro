import { apiSlice } from './apiSlice';
import {
  Reminder,
  ReminderLog,
  CreateReminderRequest,
  PaginatedResponse,
} from '../types';

interface GetReminderLogsParams {
  reminderId: number;
  page?: number;
  per_page?: number;
}

export const remindersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReminders: builder.query<{ reminders: Reminder[] }, void>({
      query: () => '/reminders',
      providesTags: ['Reminder'],
    }),
    
    getReminderById: builder.query<Reminder, number>({
      query: (id) => `/reminders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Reminder', id }],
    }),
    
    createReminder: builder.mutation<{ message: string; reminder: Reminder }, CreateReminderRequest>({
      query: (reminder) => ({
        url: '/reminders',
        method: 'POST',
        body: reminder,
      }),
      invalidatesTags: ['Reminder'],
    }),
    
    updateReminder: builder.mutation<{ message: string; reminder: Reminder }, Partial<CreateReminderRequest> & { id: number }>({
      query: ({ id, ...reminder }) => ({
        url: `/reminders/${id}`,
        method: 'PUT',
        body: reminder,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Reminder', id }],
    }),
    
    deleteReminder: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/reminders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reminder'],
    }),
    
    getReminderLogs: builder.query<PaginatedResponse<ReminderLog>, GetReminderLogsParams>({
      query: ({ reminderId, page = 1, per_page = 20 }) => ({
        url: `/reminders/${reminderId}/logs`,
        params: { page, per_page },
      }),
      providesTags: ['ReminderLog'],
    }),
    
    updateReminderLog: builder.mutation<{ message: string; log: ReminderLog }, Partial<ReminderLog> & { id: number }>({
      query: ({ id, ...log }) => ({
        url: `/reminders/logs/${id}`,
        method: 'PUT',
        body: log,
      }),
      invalidatesTags: ['ReminderLog'],
    }),
  }),
});

export const {
  useGetRemindersQuery,
  useGetReminderByIdQuery,
  useCreateReminderMutation,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  useGetReminderLogsQuery,
  useUpdateReminderLogMutation,
} = remindersApi;
