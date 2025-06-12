import { ReactNode } from 'react';

export interface ProjectContextType {
  selectedProject: number | null;
  setSelectedProject: (projectId: number | null) => void;
}

export function useProject(): ProjectContextType;

export function ProjectProvider({ children }: { children: ReactNode }): JSX.Element; 