// Placeholder for db-client.ts - will be reconfigured shortly
import apiClient from './client';

export const fetchProjects = async () => {
  try {
    const response = await apiClient.get('/projects/');
    // The backend returns { signal: '...', projects: [{id: 1, name: 'Project 1'}, ...] }
    if (response.data && response.data.projects) {
      return response.data.projects;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
};

export const createProject = async (name: string) => {
    // This function is not directly supported by the backend in the same way.
    // A project is created implicitly when data is uploaded to its ID.
    // We can simulate this by returning a new project object.
    // The "name" here will be the new project ID.
    const newProjectId = parseInt(name, 10);
    if (isNaN(newProjectId)) {
      throw new Error("Project ID must be a number.");
    }
    return { id: newProjectId, name: `Project ${newProjectId}` };
};

export const createProjectAPI = async (name: string): Promise<{id: number, name: string}> => {
    const response = await apiClient.post('/projects/', { name });
    if (response.data && response.data.project) {
        return response.data.project;
    }
    throw new Error(response.data?.detail || 'Failed to create project.');
};

export interface Statistics {
  totalDocuments: number;
  totalQueries: number;
  documentTypes: { type: string; count: number }[];
  recentQueries: { date: string; count: number }[];
}

export const fetchStatistics = async (projectId: string): Promise<Statistics> => {
  const response = await apiClient.get(`/statistics/${projectId}`);
  return response.data;
};

export interface IndexInfo {
  signal?: string;
  collection_info: {
    record_count: number;
    table_info: {
      hasindexes: boolean;
      schemaname: string;
      tablename: string;
      tableowner: string;
      tablespace: any;
    };
  };
}

export const fetchIndexInfo = async (projectId: string): Promise<IndexInfo> => {
  const response = await apiClient.get(`/nlp/index/info/${projectId}`);
  if (response.data && response.data.signal === 'vectordb_collection_retrieved') {
    return response.data;
  }
  throw new Error(response.data?.signal || 'Failed to fetch index info.');
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

export interface SearchResponse {
  signal?: string;
  results: SearchResult[];
}

export const searchDocuments = async (projectId: string, query: string, limit: number): Promise<SearchResponse> => {
  const response = await apiClient.post(`/nlp/index/search/${projectId}`, {
    text: query,
    limit: limit,
  });
  return response.data;
};

export interface QAResult {
  signal?: string;
  answer: string;
  prompt: string;
}

export const askQuestion = async (projectId: string, query: string): Promise<QAResult> => {
  const response = await apiClient.post(`/nlp/index/answer/${projectId}`, { text: query });
  return response.data;
};

export interface PushResult {
  signal?: string;
  inserted_items_count: number;
}

export const pushToIndex = async (projectId: string, resetIndex: boolean): Promise<PushResult> => {
  const response = await apiClient.post(`/nlp/index/push/${projectId}`, {
    do_reset: resetIndex ? 1 : 0,
  });
  return response.data;
}; 