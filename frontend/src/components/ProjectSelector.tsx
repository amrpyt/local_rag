import { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext.jsx';
import apiClient from '../api/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// مشروع افتراضي للاستخدام في حالة فشل الاتصال بالخادم
const DEFAULT_PROJECT = 1;

export function ProjectSelector() {
  const [projects, setProjects] = useState([1]); // ابدأ بمشروع افتراضي
  const [isLoading, setIsLoading] = useState(true);
  const { selectedProject, setSelectedProject } = useProject();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/projects/');
        
        if (response.data && response.data.signal === 'success') {
          const projectsList = response.data.projects || [];
          if (projectsList.length > 0) {
            setProjects(projectsList);
            
            if (!selectedProject) {
              setSelectedProject(projectsList[0]);
            }
          } else {
            // استخدم المشروع الافتراضي إذا لم يتم العثور على مشاريع
            setProjects([DEFAULT_PROJECT]);
            setSelectedProject(DEFAULT_PROJECT);
          }
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        // استخدم المشروع الافتراضي في حالة الخطأ
        setProjects([DEFAULT_PROJECT]);
        if (!selectedProject) {
          setSelectedProject(DEFAULT_PROJECT);
        }
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

  // تأكد من أن selectedProject له قيمة
  const currentProject = selectedProject || (projects.length > 0 ? projects[0] : DEFAULT_PROJECT);

  return (
    <Select 
      value={currentProject.toString()} 
      onValueChange={handleProjectChange} 
      disabled={projects.length <= 1}
    >
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