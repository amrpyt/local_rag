import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define the expected shape of the API response
interface ProjectsResponse {
  signal: string;
  projects: number[];
}

// Define the shape of the error response
interface ApiError {
  message: string;
}

const fetchProjects = async (): Promise<ProjectsResponse> => {
  const { data } = await axios.get<ProjectsResponse>('/api/v1/projects/');
  return data;
};

export const useProjects = () => {
  return useQuery<ProjectsResponse, ApiError>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}; 