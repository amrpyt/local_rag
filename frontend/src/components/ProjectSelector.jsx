import { useState, useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import apiClient from '@/api/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ProjectSelector() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedProject, setSelectedProject } = useProject();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/projects/');
        
        if (response.data && response.data.signal === 'success') {
          const projectsList = response.data.projects || [];
          setProjects(projectsList);
          
          if (projectsList.length > 0 && !selectedProject) {
            setSelectedProject(projectsList[0]);
          } else if (projectsList.length === 0) {
            setSelectedProject(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = (value) => {
    setSelectedProject(parseInt(value, 10));
  };

  if (isLoading) {
    return (
        <div className="w-[180px] text-sm text-muted-foreground">Loading...</div>
    );
  }

  return (
    <Select value={selectedProject?.toString() || ''} onValueChange={handleProjectChange} disabled={projects.length === 0}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        {projects.length > 0 ? (
            projects.map((project) => (
            <SelectItem key={project} value={project.toString()}>
                Project {project}
            </SelectItem>
            ))
        ) : (
            <div className="p-2 text-sm text-center text-muted-foreground">No projects found.</div>
        )}
      </SelectContent>
    </Select>
  );
} 