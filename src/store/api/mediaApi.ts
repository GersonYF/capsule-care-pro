import { apiSlice } from './apiSlice';
import { MediaFile, CreateMediaFileRequest, PaginatedResponse } from '../types';

interface GetMediaFilesParams {
  page?: number;
  per_page?: number;
  entity_type?: string;
  entity_id?: number;
}

export const mediaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMediaFiles: builder.query<PaginatedResponse<MediaFile>, GetMediaFilesParams>({
      query: ({ page = 1, per_page = 20, entity_type, entity_id } = {}) => ({
        url: '/media',
        params: { page, per_page, entity_type, entity_id },
      }),
      providesTags: ['MediaFile'],
    }),
    
    getMediaFileById: builder.query<MediaFile, number>({
      query: (id) => `/media/${id}`,
      providesTags: (result, error, id) => [{ type: 'MediaFile', id }],
    }),
    
    createMediaFile: builder.mutation<{ message: string; media_file: MediaFile }, CreateMediaFileRequest>({
      query: (file) => ({
        url: '/media',
        method: 'POST',
        body: file,
      }),
      invalidatesTags: ['MediaFile'],
    }),
    
    updateMediaFile: builder.mutation<{ message: string; media_file: MediaFile }, Partial<CreateMediaFileRequest> & { id: number }>({
      query: ({ id, ...file }) => ({
        url: `/media/${id}`,
        method: 'PUT',
        body: file,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'MediaFile', id }],
    }),
    
    deleteMediaFile: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/media/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MediaFile'],
    }),
  }),
});

export const {
  useGetMediaFilesQuery,
  useGetMediaFileByIdQuery,
  useCreateMediaFileMutation,
  useUpdateMediaFileMutation,
  useDeleteMediaFileMutation,
} = mediaApi;