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
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectId, setNewProjectId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // جلب قائمة المشاريع عند تحميل المكون
  useEffect(() => {
    loadProjects();
  }, []);

  // دالة لجلب قائمة المشاريع من الخادم
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setProjects(data);
      
      // If there is a selected project from localStorage, ensure it's valid
      if (selectedProject && !data.some(p => p.id === selectedProject)) {
        // If the stored project ID is not in the fetched list,
        // you might want to reset it or handle it as an invalid state.
        // For now, we'll just let it be, and the user can switch.
      } else if (!selectedProject && data.length > 0) {
        // تعيين المشروع الافتراضي إذا لم يكن هناك مشروع محدد
        setSelectedProject(data[0].id);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // معالجة إنشاء مشروع جديد
  const handleCreateOrSwitchProject = async () => {
    if (!newProjectId.trim()) return;
    
    setIsCreating(true);
    try {
      // We use the 'createProject' function which now just formats the object
      const newProject = await createProject(newProjectId);
      if (newProject) {
        // Check if project already exists in the list
        if (!projects.find(p => p.id === newProject.id)) {
          setProjects([...projects, newProject]);
        }
        setSelectedProject(newProject.id);
        setDialogOpen(false);
        setNewProjectId('');
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
      </div>

      {/* مربع حوار إنشاء مشروع جديد */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch or Create Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-id" className="text-right">
                Project ID
              </Label>
              <Input
                id="project-id"
                type="number"
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
                className="col-span-3"
                placeholder="Enter a project ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateOrSwitchProject} 
              disabled={!newProjectId.trim() || isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Go to Project'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 