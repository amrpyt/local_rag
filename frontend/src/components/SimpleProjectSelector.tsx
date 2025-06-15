import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, Plus, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useProject } from '../context/ProjectContext.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import apiClient from '../api/client';
import { createProjectAPI } from '../api/db-client';
import { toast } from 'sonner';

// نوع بيانات المشروع
interface Project {
  id: number;
  name: string;
}

export function SimpleProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { selectedProject, setSelectedProject } = useProject();
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // جلب قائمة المشاريع عند تحميل المكون
  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      handleProjectSelect(projects[0].id.toString());
    }
  }, [projects, selectedProject]);

  // دالة لجلب قائمة المشاريع من الخادم
  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use direct fetch instead of apiClient to ensure it works
      const response = await fetch('http://localhost:8000/api/v1/projects');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data.projects)) {
        const fetchedProjects = data.projects;
        setProjects(fetchedProjects);
        if(fetchedProjects.length > 0 && !selectedProject) {
            setSelectedProject(fetchedProjects[0].id);
        }
        console.log('Projects loaded successfully:', fetchedProjects);
      } else {
        setProjects([]);
        setError('Invalid response format from server');
        console.error('Invalid response format:', data);
      }
    } catch (error: any) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
      setError(error.message || 'Failed to connect to server');
      toast.error('Failed to load projects', {
        description: error.message || 'Network error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(parseInt(projectId));
  };

  // معالجة إنشاء مشروع جديد
  const handleCreateOrSwitchProject = async () => {
    if (!newProjectName.trim()) return;
    
    setIsCreating(true);
    setError(null);
    try {
      // Use direct fetch for project creation
      const response = await fetch('http://localhost:8000/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newProjectName }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.project) {
        const newProject = data.project;
        if (!projects.find(p => p.id === newProject.id)) {
          setProjects([...projects, newProject]);
        }
        setSelectedProject(newProject.id);
        setDialogOpen(false);
        setNewProjectName('');
        toast.success('Project created successfully');
      } else if (data && data.signal === 'project_created') {
        // Handle case where backend returns success but in a different format
        const newProject = { id: parseInt(newProjectName), name: `Project ${newProjectName}` };
        if (!projects.find(p => p.id === newProject.id)) {
        setProjects([...projects, newProject]);
        }
        setSelectedProject(newProject.id);
        setDialogOpen(false);
        setNewProjectName('');
        toast.success('Project created successfully');
      } else {
        throw new Error(data?.detail || 'Failed to create project');
      }
    } catch (error: any) {
      console.error('Error creating/switching project:', error);
      setError(error.message || 'Failed to create project');
      toast.error('Failed to create project', {
        description: error.message || 'Server error',
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Find the selected project name
  const getSelectedProjectName = () => {
    if (!selectedProject) return "Select project...";
    
    const project = projects.find(p => p.id === selectedProject);
    return project ? project.name : `Project ${selectedProject}`;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Select 
          value={selectedProject?.toString()} 
          onValueChange={(value) => setSelectedProject(parseInt(value))}
          disabled={loading}
          data-testid="project-combobox"
        >
          <SelectTrigger className="w-[200px]" aria-label="Select a project">
            <SelectValue placeholder="Select a project">
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                getSelectedProjectName()
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent aria-label="List of available projects">
            {projects.length > 0 ? (
              projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
              ))
            ) : (
              <div className="p-2 text-center text-muted-foreground">
                {error ? (
                  <div className="flex items-center text-destructive">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>Connection error</span>
                  </div>
                ) : (
                  'No projects found'
                )}
              </div>
            )}
          </SelectContent>
        </Select>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setDialogOpen(true)}
          title="Switch or Create Project"
          data-testid="new-project-btn"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={loadProjects}
          title="Refresh"
        >
          <Loader2 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* مربع حوار إنشاء مشروع جديد */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby="dialog-title">
          <DialogHeader>
            <DialogTitle id="dialog-title">Switch or Create Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right">
                Project Name
              </Label>
              <Input
                id="project-name"
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter a new project name"
                className="col-span-3"
              />
            </div>
            {error && (
              <div className="text-destructive text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrSwitchProject} disabled={!newProjectName.trim() || isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 