import { useEffect, useMemo, useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, Pencil, Trash2, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient, Task } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export const TaskOverview = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('general');
  const [priority, setPriority] = useState<string>('Medium');
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('general');
  const [editPriority, setEditPriority] = useState<string>('Medium');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadTasks = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const data = await apiClient.getTasks();
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!isAuthenticated) {
      // Reset tasks for unauthenticated users
      setTasks([]);
      setError(null);
      return;
    }

    loadTasks();
  }, [isAuthenticated, authLoading]);

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      setError(null);
      await apiClient.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category || 'general',
        priority,
      });
      setOpenCreate(false);
      setTitle('');
      setDescription('');
      setCategory('general');
      setPriority('Medium');
      await loadTasks();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditCategory(task.category || 'general');
    setEditPriority(task.priority || 'Medium');
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (!editingTask) return;
    try {
      setIsUpdating(true);
      setError(null);
      await apiClient.updateTask(editingTask.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
        category: editCategory,
        priority: editPriority,
      });
      setOpenEdit(false);
      setEditingTask(null);
      await loadTasks();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      setTogglingId(task.id);
      const nextCompleted = !task.completed;
      // optimistic flip
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: nextCompleted } : t));
      // send full payload to be safe with validators
      const payload = {
        title: task.title,
        description: task.description || undefined,
        category: (task.category || 'general'),
        priority: task.priority || 'Medium',
        completed: nextCompleted,
      };
      const updated = await apiClient.updateTask(task.id, payload);
      // sync with server response
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: updated.completed, priority: updated.priority, category: updated.category } : t));
    } catch (e) {
      // revert on error
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t));
      setError(e instanceof Error ? e.message : 'Failed to update task status');
    } finally {
      setTogglingId(null);
    }
  };

  const requestDelete = (task: Task) => {
    setTaskToDelete(task);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await apiClient.deleteTask(taskToDelete.id);
      setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      setOpenDelete(false);
      setTaskToDelete(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusIcon = (completed: boolean) => {
    if (completed) return <CheckCircle2 className="h-4 w-4 text-accent" />;
    return <Clock className="h-4 w-4 text-primary" />;
  };

  const getPriorityColor = (p: string | undefined) => {
    switch ((p || 'Medium').toLowerCase()) {
      case 'high':
        return 'border-l-destructive bg-destructive/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      case 'low':
        return 'border-l-accent bg-accent/5';
      default:
        return 'border-l-muted bg-muted/5';
    }
  };

  const filteredTasks = useMemo(() => {
    if (activeTab === 'completed') return tasks.filter(t => t.completed);
    if (activeTab === 'active') return tasks.filter(t => !t.completed);
    return tasks;
  }, [tasks, activeTab]);

  const actionBtnClass = "bg-transparent border border-accent/40 hover:border-accent/80 hover:bg-transparent hover:ring-1 hover:ring-accent/60 transition-colors";
  const deleteBtnClass = "bg-transparent border border-destructive/50 text-destructive hover:border-destructive hover:bg-transparent hover:ring-1 hover:ring-destructive/60 transition-colors";

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Task Overview</h3>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2 glass-button">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Schedule team meeting" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Optional details" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {error && (
                <div className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="break-words">{error}</span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenCreate(false)}
                className="bg-transparent border border-accent/40 hover:border-accent/80 hover:ring-1 hover:ring-accent/60 hover:bg-transparent transition-colors"
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!title.trim() || isCreating}>
                {isCreating ? 'Adding...' : 'Add Task'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="m-0" />
        <TabsContent value="active" className="m-0" />
        <TabsContent value="completed" className="m-0" />
      </Tabs>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading tasks...</div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:scale-[1.01] ${getPriorityColor(task.priority)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.completed)}
                  <div>
                    <h4 className="font-medium text-foreground">{task.title}</h4>
                    <div className="text-xs text-muted-foreground">{(task.category || 'General').toString()} • {task.priority || 'Medium'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={actionBtnClass}
                    onClick={() => handleToggleComplete(task)}
                    title={task.completed ? 'Mark as active' : 'Mark as completed'}
                    disabled={togglingId === task.id}
                  >
                    {task.completed ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" className={actionBtnClass} onClick={() => startEdit(task)} title="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className={deleteBtnClass} onClick={() => requestDelete(task)} title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <div className="text-sm text-muted-foreground">No tasks to show.</div>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input id="edit-description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={editPriority} onValueChange={setEditPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && (
              <div className="text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isUpdating || !editTitle.trim()}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation - dynamic messaging */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="border border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {taskToDelete?.completed ? 'Remove completed task?' : 'Delete pending task?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {taskToDelete?.completed
                ? 'Well done! This task is complete. You can safely remove it to keep your list clean.'
                : "This task is still in progress — are you sure you want to remove it? Keep momentum strong!"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-transparent border border-accent/40 hover:border-accent/80 hover:ring-1 hover:ring-accent/60 hover:bg-transparent transition-colors"
            >
              Keep Task
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-destructive text-white hover:bg-destructive/90">
              {isDeleting ? 'Removing...' : 'Remove Task'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
        <div className="text-sm text-center text-muted-foreground">
          {tasks.filter(t => t.completed).length} completed • {tasks.filter(t => !t.completed).length} active
        </div>
      </div>
    </div>
  );
};