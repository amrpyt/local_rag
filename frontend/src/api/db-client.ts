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

// Define the index info response type
export interface IndexInfo {
  signal: string;
  collection_info: any;
}

/**
 * Fetch index information for a specific project
 * @param projectId - The ID of the project to fetch index info for
 * @returns The index information
 */
export async function fetchIndexInfo(projectId: string): Promise<IndexInfo> {
  try {
    const { data } = await apiClient.get(`/nlp/index/info/${projectId}`);
    return data;
  } catch (error) {
    console.error('Error fetching index info:', error);
    throw new Error('Failed to fetch index information');
  }
}

export interface SearchResult {
  text: string;
  score: number;
  payload?: {
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
    const response = await apiClient.post(`/nlp/index/search/${projectId}`, {
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
  full_prompt: string;
  chat_history: any;
}

export const answerQuestion = async (projectId: string, query: string, limit: number): Promise<QAResult> => {
  try {
    const response = await apiClient.post(`/nlp/index/answer/${projectId}`, { text: query, limit });
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