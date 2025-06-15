import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

// Define the expected shape of the API response
interface ProjectsResponse {
  signal: string;
  projects: Project[];
}

// Define the shape for a single project (assuming it has an id and name)
interface Project {
  id: number;
  name: string;
}

// Define the shape of the error response
interface ApiError {
  message: string;
}

// Mock data to use when the backend is not available
const mockProjects: ProjectsResponse = {
  signal: "success",
  projects: [
    { id: 1, name: "نظام شؤون الطلاب" },
    { id: 2, name: "أرشيف مشاريع التخرج" },
    { id: 3, name: "قاعدة بيانات المقررات" },
    { id: 4, name: "نظام الامتحانات الالكتروني" },
    { id: 5, name: "بوابة الدراسات العليا" },
  ]
};

const fetchProjects = async (useMockData: boolean): Promise<ProjectsResponse> => {
  // If mock data is enabled, return mock data after a small delay
  if (useMockData) {
    console.log('[useProjects] MOCK MODE: Returning mock projects data.');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return mockProjects;
  }
  
  try {
    const { data } = await apiClient.get<ProjectsResponse>('/projects/');
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // In production, we should throw the error to show proper error UI
    throw error;
  }
};

const createProject = async ({ name, useMockData }: { name: string; useMockData: boolean }): Promise<Project> => {
  if (useMockData) {
    console.log('[useProjects] MOCK MODE: Faking project creation.');
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const newProject = { id: Math.floor(Math.random() * 1000) + 10, name };
    mockProjects.projects.push(newProject);
    return newProject;
  }
  
  try {
    const { data } = await apiClient.post('/projects', { name });
    return data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const useProjects = (useMockData: boolean) => {
  return useQuery<ProjectsResponse, ApiError>({
    queryKey: ['projects', useMockData],
    queryFn: () => fetchProjects(useMockData),
    retry: useMockData ? 0 : 2,
    retryDelay: 1000,
    staleTime: 30000,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};

export const useCreateProject = (useMockData: boolean) => {
  const queryClient = useQueryClient();
  return useMutation<Project, ApiError, { name: string }>({
    mutationFn: (variables) => createProject({ ...variables, useMockData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', useMockData] });
    },
  });
}; 