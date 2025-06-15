import React, { createContext, useState, useContext, useEffect } from 'react';

const ProjectContext = createContext();

export const useProject = () => {
  return useContext(ProjectContext);
};

export const ProjectProvider = ({ children }) => {
  // Initialize from localStorage or null if not found
  const [selectedProject, setSelectedProjectState] = useState(() => {
    const saved = localStorage.getItem('selectedProject');
    const initialValue = saved ? JSON.parse(saved) : null;
    return initialValue;
  });

  // Custom setter that updates both state and localStorage
  const setSelectedProject = (project) => {
    // console.log('Setting selected project in context:', project);
    setSelectedProjectState(project);
    localStorage.setItem('selectedProject', JSON.stringify(project));
  };

  // Make the value object
  const value = {
    selectedProject,
    setSelectedProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 