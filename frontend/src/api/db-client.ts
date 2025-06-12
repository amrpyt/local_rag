// Placeholder for db-client.ts - will be reconfigured shortly
import axios from 'axios';

const dbApiClient = axios.create({
  baseURL: 'http://173.212.254.228:3001/api/v1'
});

export const fetchProjects = async () => {
    const response = await dbApiClient.get('/projects');
    return response.data;
};

export const createProject = async (name: string) => {
    const response = await dbApiClient.post('/projects', { name });
    return response.data;
};

export interface Statistics {
  totalDocuments: number;
  totalQueries: number;
  documentTypes: { type: string; count: number }[];
  recentQueries: { date: string; count: number }[];
}

export const fetchStatistics = async (projectId: string): Promise<Statistics> => {
  const response = await dbApiClient.get(`/statistics/${projectId}`);
  return response.data;
};

export interface IndexInfo {
  vectors_count: number;
  indexed_vectors_count: number;
  vectors_dim: number;
}

export const fetchIndexInfo = async (projectId: string): Promise<IndexInfo> => {
  const response = await dbApiClient.get(`/nlp/index/info/${projectId}`);
  // The API returns the data within a `collection_info` object
  return response.data.collection_info;
};

export interface SearchResult {
  id: string;
  score: number;
  payload: {
    text: string;
    file_name: string;
    [key: string]: any;
  };
}

export const searchDocuments = async (projectId: string, query: string, limit: number): Promise<SearchResult[]> => {
  const response = await dbApiClient.post(`/nlp/index/search/${projectId}`, {
    text: query,
    limit: limit,
  });
  return response.data.results;
};

export interface QAResult {
  answer: string;
  prompt: string;
}

export const askQuestion = async (projectId: string, query: string): Promise<QAResult> => {
  const response = await dbApiClient.post(`/nlp/index/answer/${projectId}`, { text: query });
  return response.data;
};

export interface PushResult {
  inserted_items_count: number;
}

export const pushToIndex = async (projectId: string, resetIndex: boolean): Promise<PushResult> => {
  const response = await dbApiClient.post(`/nlp/index/push/${projectId}`, {
    do_reset: resetIndex ? 1 : 0,
  });
  return response.data;
}; 