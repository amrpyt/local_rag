// API client for database operations
import apiClient from './client';

export const fetchProjects = async () => {
  try {
    const response = await apiClient.get('/projects/');
    const data = response.data;
    if (data && data.projects) {
      return data.projects;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
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
  try {
    const response = await apiClient.post('/projects/', { name });
    const data = response.data;
    if (data && data.project) {
      return data.project;
    }
    if (data && data.signal === 'project_created') {
      return { id: parseInt(name), name: `Project ${name}` };
    }
    throw new Error(data?.detail || 'Failed to create project.');
  } catch (error: any) {
    console.error("Failed to create project:", error);
    if (error.response) {
      throw new Error(`Server error: ${error.response.data?.detail || error.response.status}`);
    }
    throw error;
  }
};

export interface Statistics {
  totalDocuments: number;
  totalQueries: number;
  documentTypes: { type: string; count: number }[];
  queries_over_time: { date: string; count: number }[];
}

export const fetchStatistics = async (projectId: string): Promise<Statistics> => {
  try {
    const response = await apiClient.get(`/statistics/${projectId}`);
    const data = response.data;
    // The backend now provides the full statistics object
    return {
      totalDocuments: data.total_documents || 0,
      totalQueries: data.total_queries || 0,
      documentTypes: data.document_types || [],
      queries_over_time: data.queries_over_time || [],
    };
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    return {
      totalDocuments: 0,
      totalQueries: 0,
      documentTypes: [],
      queries_over_time: []
    };
  }
};

export interface IndexInfo {
  signal?: string;
  collection_info?: { // Make optional to handle different signals
    points_count: number;
    table_info: any;
  };
}

export const fetchIndexInfo = async (projectId: string): Promise<IndexInfo> => {
  try {
    const response = await apiClient.get(`/nlp/index/info/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch index info:", error);
    throw error;
  }
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
  try {
    const response = await apiClient.post(`/nlp/search/${projectId}`, {
      text: query,
      limit: limit,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to search documents:", error);
    throw error;
  }
};

export interface QAResult {
  signal?: string;
  answer: string;
  prompt: string;
}

export const askQuestion = async (projectId: string, query: string): Promise<QAResult> => {
  try {
    const response = await apiClient.post(`/nlp/answer/${projectId}`, { text: query });
    return response.data;
  } catch (error) {
    console.error("Failed to ask question:", error);
    throw error;
  }
};

export interface PushResult {
  signal?: string;
  inserted_items_count: number;
}

export const pushToIndex = async (projectId: string, resetIndex: boolean): Promise<PushResult> => {
  try {
    const response = await apiClient.post(`/nlp/index/push/${projectId}`, {
      do_reset: resetIndex ? 1 : 0,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to push to index:", error);
    throw error;
  }
}; 