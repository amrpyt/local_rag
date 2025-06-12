import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useProject } from '../context/ProjectContext.jsx';
import { fetchProjects, createProject } from '../api/db-client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

// نوع بيانات المشروع
interface Project {
  id: number;
  name: string;
}

export function SimpleProjectSelector() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { selectedProject, setSelectedProject } = useProject();
  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // جلب قائمة المشاريع عند تحميل المكون
  useEffect(() => {
    loadProjects();
  }, []);

  // تحديث اسم المشروع المحدد عند تغيير المشروع
  useEffect(() => {
    if (selectedProject) {
      const project = projects.find(p => p.id === selectedProject);
      setSelectedProjectName(project ? project.name : '');
    } else {
      setSelectedProjectName('');
    }
  }, [selectedProject, projects]);

  // دالة لجلب قائمة المشاريع من الخادم
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
      
      // تعيين المشروع الافتراضي إذا لم يكن هناك مشروع محدد
      if (!selectedProject && data.length > 0) {
        setSelectedProject(data[0].id);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // معالجة إنشاء مشروع جديد
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    setIsCreating(true);
    try {
      const newProject = await createProject(newProjectName);
      if (newProject) {
        setProjects([...projects, newProject]);
        setSelectedProject(newProject.id);
        setDialogOpen(false);
        setNewProjectName('');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // استخدام Select بدلاً من Popover و Command
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
                selectedProjectName || "Select project..."
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
          title="Create new project"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* مربع حوار إنشاء مشروع جديد */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right">
                Project Name
              </Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="col-span-3"
                placeholder="Enter project name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProject} 
              disabled={!newProjectName.trim() || isCreating}
            >
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