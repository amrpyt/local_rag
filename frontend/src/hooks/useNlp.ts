import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Define response shapes based on the PRD
interface IndexPushResponse {
  signal: string;
  inserted_items_count: number;
}

interface SearchResponse {
  signal: string;
  results: any[]; // Define a more specific type for results if possible
}

interface AnswerResponse {
  signal: string;
  answer: string;
  full_prompt: string;
  chat_history: any; // Define a more specific type for chat history if possible
}

interface ResetIndexResponse {
  signal: string;
}

// Define API call functions
const pushIndex = async ({ projectId, doReset }: { projectId: string; doReset: boolean }): Promise<IndexPushResponse> => {
  const { data } = await axios.post<IndexPushResponse>(`/api/v1/nlp/index/push/${projectId}`, { do_reset: doReset });
  return data;
};

const searchIndex = async ({ projectId, text, limit }: { projectId: string; text: string; limit?: number }): Promise<SearchResponse> => {
  const { data } = await axios.post<SearchResponse>(`/api/v1/nlp/index/search/${projectId}`, { text, limit });
  return data;
};

const answerQuestion = async ({ projectId, text, limit }: { projectId: string; text: string; limit?: number }): Promise<AnswerResponse> => {
  const { data } = await axios.post<AnswerResponse>(`/api/v1/nlp/index/answer/${projectId}`, { text, limit });
  return data;
};

const resetIndex = async (projectId: string): Promise<ResetIndexResponse> => {
  const { data } = await axios.post<ResetIndexResponse>(`/api/v1/nlp/index/reset/${projectId}`);
  return data;
};

// Define hooks
export const usePushIndex = () => {
  const queryClient = useQueryClient();
  return useMutation<IndexPushResponse, Error, { projectId: string; doReset: boolean }>({
    mutationFn: pushIndex,
    onSuccess: () => {
      queryClient.invalidateQueries(['indexInfo']);
      queryClient.invalidateQueries(['statistics']);
    },
  });
};

export const useSearch = () => {
    return useMutation<SearchResponse, Error, { projectId: string; text: string; limit?: number }>({
        mutationFn: searchIndex,
    });
};

export const useAnswer = () => {
    return useMutation<AnswerResponse, Error, { projectId: string; text: string; limit?: number }>({
        mutationFn: answerQuestion,
    });
};

export const useResetIndex = () => {
    const queryClient = useQueryClient();
    return useMutation<ResetIndexResponse, Error, string>({
        mutationFn: resetIndex,
        onSuccess: () => {
            queryClient.invalidateQueries(['indexInfo']);
            queryClient.invalidateQueries(['statistics']);
        },
    });
}; 