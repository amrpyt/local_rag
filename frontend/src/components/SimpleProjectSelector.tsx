import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useProject } from '../context/ProjectContext.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import apiClient from '../api/client';
import { createProjectAPI } from '../api/db-client';

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
    try {
      const response = await apiClient.get('/projects/');
      if (response.data && Array.isArray(response.data.projects)) {
        const fetchedProjects = response.data.projects;
        setProjects(fetchedProjects);
        if(fetchedProjects.length > 0 && !selectedProject) {
            setSelectedProject(fetchedProjects[0].id);
        }
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
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
    try {
      const newProject = await createProjectAPI(newProjectName);
      if (newProject) {
        if (!projects.find(p => p.id === newProject.id)) {
          setProjects([...projects, newProject]);
        }
        setSelectedProject(newProject.id);
        setDialogOpen(false);
        setNewProjectName('');
      }
    } catch (error) {
      console.error('Error creating/switching project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Select 
          value={selectedProject?.toString()} 
          onValueChange={(value) => setSelectedProject(parseInt(value))}
          disabled={loading}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                projects.find(p => p.id === selectedProject)?.name || (selectedProject ? `Project ${selectedProject}` : "Select project...")
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="icon"
          variant="outline"
          onClick={() => setDialogOpen(true)}
          title="Switch or Create Project"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="outline"
          onClick={loadProjects}
          title="Refresh"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>

      {/* مربع حوار إنشاء مشروع جديد */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch or Create Project</DialogTitle>
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