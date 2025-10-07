import { apiSlice } from './apiSlice';
import {
  User,
  UserSetting,
  EmergencyContact,
  ActivityLog,
  CreateEmergencyContactRequest,
  UpdateUserProfileRequest,
  PaginatedResponse,
} from '../types';

interface GetActivityLogsParams {
  page?: number;
  per_page?: number;
}

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    
    updateUserProfile: builder.mutation<{ message: string; user: User }, UpdateUserProfileRequest>({
      query: (profile) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profile,
      }),
      invalidatesTags: ['User'],
    }),
    
    getUserSettings: builder.query<{ settings: UserSetting[] }, void>({
      query: () => '/users/settings',
      providesTags: ['UserSetting'],
    }),
    
    createUserSetting: builder.mutation<{ message: string; setting: UserSetting }, Partial<UserSetting>>({
      query: (setting) => ({
        url: '/users/settings',
        method: 'POST',
        body: setting,
      }),
      invalidatesTags: ['UserSetting'],
    }),
    
    updateUserSetting: builder.mutation<{ message: string; setting: UserSetting }, Partial<UserSetting> & { id: number }>({
      query: ({ id, ...setting }) => ({
        url: `/users/settings/${id}`,
        method: 'PUT',
        body: setting,
      }),
      invalidatesTags: ['UserSetting'],
    }),
    
    deleteUserSetting: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/users/settings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserSetting'],
    }),
    
    getEmergencyContacts: builder.query<{ contacts: EmergencyContact[] }, void>({
      query: () => '/users/emergency-contacts',
      providesTags: ['EmergencyContact'],
    }),
    
    getEmergencyContactById: builder.query<EmergencyContact, number>({
      query: (id) => `/users/emergency-contacts/${id}`,
      providesTags: (result, error, id) => [{ type: 'EmergencyContact', id }],
    }),
    
    createEmergencyContact: builder.mutation<{ message: string; contact: EmergencyContact }, CreateEmergencyContactRequest>({
      query: (contact) => ({
        url: '/users/emergency-contacts',
        method: 'POST',
        body: contact,
      }),
      invalidatesTags: ['EmergencyContact'],
    }),
    
    updateEmergencyContact: builder.mutation<{ message: string; contact: EmergencyContact }, Partial<CreateEmergencyContactRequest> & { id: number }>({
      query: ({ id, ...contact }) => ({
        url: `/users/emergency-contacts/${id}`,
        method: 'PUT',
        body: contact,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'EmergencyContact', id }],
    }),
    
    deleteEmergencyContact: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/users/emergency-contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EmergencyContact'],
    }),
    
    getActivityLogs: builder.query<PaginatedResponse<ActivityLog>, GetActivityLogsParams>({
      query: ({ page = 1, per_page = 20 } = {}) => ({
        url: '/users/activity-logs',
        params: { page, per_page },
      }),
      providesTags: ['ActivityLog'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserSettingsQuery,
  useCreateUserSettingMutation,
  useUpdateUserSettingMutation,
  useDeleteUserSettingMutation,
  useGetEmergencyContactsQuery,
  useGetEmergencyContactByIdQuery,
  useCreateEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
  useGetActivityLogsQuery,
} = usersApi;
