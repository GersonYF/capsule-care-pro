import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Medication',
    'UserMedication',
    'Doctor',
    'UserDoctor',
    'Reminder',
    'ReminderLog',
    'Prescription',
    'Notification',
    'MediaFile',
    'EmergencyContact',
    'UserSetting',
    'ActivityLog',
    'MedicationIntake',
  ],
  endpoints: () => ({}),
});

export default apiSlice;
