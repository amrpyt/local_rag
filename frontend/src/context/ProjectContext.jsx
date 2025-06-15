import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useProjects } from '../hooks/useProjects'; // Import the data fetching hook
import { useError } from './ErrorContext'; // Import the error context
import apiClient from '../api/client';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [useMockData, setUseMockData] = useState(() => {
    const saved = localStorage.getItem('useMockData');
    return saved !== null ? JSON.parse(saved) : false;
  });

  const { data: projects, isLoading, error } = useProjects(useMockData);

  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (projects && projects.projects) {
      try {
        const savedId = localStorage.getItem('selectedProjectId');
        const project = savedId ? projects.projects.find(p => p.id.toString() === savedId) : null;
        if (project) {
          setSelectedProject(project);
        } else if (projects.projects.length > 0) {
          // If no saved project or saved project not in list, default to first
          setSelectedProject(projects.projects[0]);
        }
      } catch (e) {
        console.error("Failed to process selectedProject from localStorage", e);
        if (projects.projects.length > 0) {
          setSelectedProject(projects.projects[0]);
        }
      }
    }
  }, [projects]);

  const { setError } = useError();

  const toggleMockData = () => {
    // Keep the selected project ID, but the useEffect will handle picking the right object
    setUseMockData(prev => {
      const newState = !prev;
      localStorage.setItem('useMockData', JSON.stringify(newState));
      window.location.reload(); // Reload to get new project list
      return newState;
    });
  };

  const selectProject = (project) => {
    setSelectedProject(project);
    if (project) {
      localStorage.setItem('selectedProjectId', project.id.toString());
    } else {
      localStorage.removeItem('selectedProjectId');
    }
  };

  const clearSelectedProject = () => {
    setSelectedProject(null);
    localStorage.removeItem('selectedProjectId');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        selectProject,
        clearSelectedProject,
        isLoading,
        error,
        useMockData,
        toggleMockData,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}; 