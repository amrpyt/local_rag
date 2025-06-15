import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Statistics, IndexInfo } from '../api/db-client'; // Assuming these types are defined in db-client

// We need to define the actual API endpoints
const fetchStatistics = async (projectId: string): Promise<Statistics> => {
  // This endpoint is an assumption, replace with the actual one
  const { data } = await axios.get(`/api/v1/statistics/${projectId}`);
  return data;
};

const fetchIndexInfo = async (projectId: string): Promise<IndexInfo> => {
    // This endpoint is an assumption, replace with the actual one
    const { data } = await axios.get(`/api/v1/nlp/index/info/${projectId}`);
    return data;
};


export const useStatistics = (projectId: string | null) => {
  return useQuery<Statistics, Error>({
    queryKey: ['statistics', projectId],
    queryFn: () => fetchStatistics(projectId!),
    enabled: !!projectId, // Only run the query if a project is selected
  });
};

export const useIndexInfo = (projectId: string | null) => {
    return useQuery<IndexInfo, Error>({
      queryKey: ['indexInfo', projectId],
      queryFn: () => fetchIndexInfo(projectId!),
      enabled: !!projectId, // Only run the query if a project is selected
      refetchInterval: 5000, // Poll every 5 seconds
    });
  }; 