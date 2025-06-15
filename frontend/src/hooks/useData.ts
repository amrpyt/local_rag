import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UploadResponse {
  signal: string;
  file_id: string;
}

interface ProcessResponse {
  signal: string;
  inserted_chunks: number;
  processed_files: number;
}

const uploadFile = async ({ projectId, file }: { projectId: string; file: File }): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post<UploadResponse>(`/api/v1/data/upload/${projectId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const processData = async ({ projectId, ...rest }: { projectId: string; file_id?: string; chunk_size?: number; overlap_size?: number; do_reset?: number }): Promise<ProcessResponse> => {
    const { data } = await axios.post<ProcessResponse>(`/api/v1/data/process/${projectId}`, rest);
    return data;
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation<UploadResponse, Error, { projectId: string; file: File }>({
    mutationFn: uploadFile,
    onSuccess: () => {
      // Invalidate and refetch queries that should be updated after a successful upload
      // For example, if there's a query that lists files for a project
      // queryClient.invalidateQueries(['projectFiles']);
    },
  });
};

export const useProcessData = () => {
    const queryClient = useQueryClient();
    return useMutation<ProcessResponse, Error, { projectId: string; file_id?: string; chunk_size?: number; overlap_size?: number; do_reset?: number }>({
        mutationFn: processData,
        onSuccess: () => {
            // Invalidate and refetch queries that should be updated after processing
            queryClient.invalidateQueries(['indexInfo']);
            queryClient.invalidateQueries(['statistics']);
        },
    });
}; 