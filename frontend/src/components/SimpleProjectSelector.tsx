import { useState } from 'react';
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useProject } from '../context/ProjectContext';
import { useProjects, useCreateProject } from '../hooks/useProjects';

// Define the Project type to match the API response
interface Project {
  id: number;
  name: string;
}

export function SimpleProjectSelector({ isCollapsed }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  
  const { selectedProject, setSelectedProject } = useProject();
  const { data: projectsData, isLoading, error } = useProjects();
  const createProjectMutation = useCreateProject();

  // FOR DEBUGGING: Log the props received from the context
  console.log('SimpleProjectSelector Props:', {
    projects: projectsData?.projects?.length,
    isLoading,
    error: !!error,
    selectedProject,
  });

  const handleCreateProject = () => {
    if (!newProjectName) return;
    createProjectMutation.mutate({ name: newProjectName }, {
      onSuccess: (data) => {
        setSelectedProject(data);
        setDialogOpen(false);
        setNewProjectName('');
      }
    });
  };

  // Find the current selected project from the projects array
  const currentProject = projectsData?.projects?.find(project => 
    (typeof selectedProject === 'object' && selectedProject?.id === project.id) || 
    selectedProject === project.id
  );

  if (isCollapsed) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* ... (rest of the collapsed view logic, no changes needed here) ... */}
      </Dialog>
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a project"
            className="w-[200px] justify-between"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : currentProject ? currentProject.name : 'Select a project'}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search project..." />
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {projectsData?.projects?.map((project: Project) => (
                  <CommandItem
                    key={project.id}
                    value={project.name}
                    onSelect={() => {
                      setSelectedProject(project);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4', 
                        (typeof selectedProject === 'object' && selectedProject?.id === project.id) || 
                        selectedProject === project.id 
                          ? 'opacity-100' 
                          : 'opacity-0'
                      )}
                    />
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem onSelect={() => setDialogOpen(true)}>
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Project
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Create Project Dialog Content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create a new project to start working with your documents.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateProject} disabled={createProjectMutation.isPending}>
            {createProjectMutation.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 