import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

// Define the index info response type
export interface IndexInfo {
  signal: string;
  collection_info: {
    vector_count?: number;
    indexed_vector_count?: number;
    points_count?: number;
    record_count?: number;
    table_info?: {
      tablename?: string;
      hasindexes?: boolean;
    };
  };
}

// Mock data generation
const generateMockIndexInfo = (projectId: string): IndexInfo => ({
    "signal": "success",
    "collection_info": {
      "vector_count": Math.floor(Math.random() * 10000) + 1000,
      "indexed_vector_count": Math.floor(Math.random() * 1000) + 100,
      "points_count": Math.floor(Math.random() * 10000) + 1000,
      "record_count": Math.floor(Math.random() * 10000) + 1000,
      "table_info": {
        "tablename": `collection_${Math.floor(Math.random() * 10)}_${Math.floor(Math.random() * 10)}`,
        "hasindexes": true
      }
    }
});

const fetchIndexInfo = async (projectId: string | number | null, useMockData: boolean): Promise<IndexInfo> => {
    if (!projectId) {
        throw new Error('Project ID is required');
    }
    
    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 600));
        return generateMockIndexInfo(String(projectId));
    }
    const { data } = await apiClient.get(`/nlp/index/info/${projectId}`);
    return data;
};

export const useIndexInfo = (projectId: string | number | null, useMockData = false) => {
    return useQuery<IndexInfo, Error>({
      queryKey: ['indexInfo', projectId, useMockData],
      queryFn: () => fetchIndexInfo(projectId, useMockData),
      enabled: !!projectId,
      retry: useMockData ? 0 : 2,
      refetchInterval: useMockData ? false : 5000,
    });
}; 