import { apiSlice } from './apiSlice';

interface AnalyzePrescriptionResponse {
  message: string;
  analysis: {
    name: string;
    generic_name?: string;
    brand_name?: string;
    dosage?: string;
    frequency?: string;
    instructions?: string;
    notes?: string;
    manufacturer?: string;
    strength?: string;
    route_of_administration?: string;
  };
  confidence: string;
  media_file_id: number;
  file_path: string;
}

export const aiApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    analyzePrescription: builder.mutation<AnalyzePrescriptionResponse, FormData>({
      query: (formData) => ({
        url: '/ai/analyze-prescription',
        method: 'POST',
        body: formData,
      }),
    }),
    
    extractText: builder.mutation<{ text: string; file_path: string }, FormData>({
      query: (formData) => ({
        url: '/ai/extract-text',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useAnalyzePrescriptionMutation,
  useExtractTextMutation,
} = aiApi;
