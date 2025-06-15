import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

// Define the index info response type
export interface IndexInfo {
  signal: string;
  collection_info: any;
}

// Mock data generation
const generateMockIndexInfo = (projectId: string): IndexInfo => ({
    "signal": "success",
    "collection_info": {
      "vector_count": Math.floor(Math.random() * 10000) + 1000,
      "indexed_vector_count": Math.floor(Math.random() * 1000) + 100,
      "points_count": Math.floor(Math.random() * 10000) + 1000,
    }
});

const fetchIndexInfo = async (projectId: string, useMockData: boolean): Promise<IndexInfo> => {
    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return generateMockIndexInfo(projectId);
    }
    const { data } = await apiClient.get(`/nlp/index/info/${projectId}`);
    return data;
};

export const useIndexInfo = (projectId: string | null, useMockData: boolean) => {
    return useQuery<IndexInfo, Error>({
      queryKey: ['indexInfo', projectId, useMockData],
      queryFn: () => fetchIndexInfo(projectId!, useMockData),
      enabled: !!projectId,
      retry: useMockData ? 0 : 2,
      refetchInterval: useMockData ? false : 5000,
    });
}; 