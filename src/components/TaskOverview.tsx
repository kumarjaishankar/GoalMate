import { Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TaskOverview = () => {
  const tasks = [
    {
      id: 1,
      title: "Complete quarterly report",
      status: "in-progress",
      priority: "high",
      dueDate: "Today",
      progress: 75
    },
    {
      id: 2,
      title: "Review team presentations",
      status: "pending",
      priority: "medium",
      dueDate: "Tomorrow",
      progress: 0
    },
    {
      id: 3,
      title: "Update project documentation",
      status: "completed",
      priority: "low",
      dueDate: "Yesterday",
      progress: 100
    },
    {
      id: 4,
      title: "Schedule client meeting",
      status: "in-progress",
      priority: "high",
      dueDate: "Today",
      progress: 50
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-accent" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-primary" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Task Overview</h3>
        </div>
        
        <Button size="sm" className="gap-2 glass-button">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:scale-[1.02] cursor-pointer ${getPriorityColor(task.priority)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                {getStatusIcon(task.status)}
                <h4 className="font-medium text-foreground">{task.title}</h4>
              </div>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                {task.dueDate}
              </span>
            </div>
            
            {task.status !== 'completed' && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
        <div className="text-sm text-center text-muted-foreground">
          🎯 <strong className="text-foreground">3</strong> tasks completed today!
          Keep up the great momentum.
        </div>
      </div>
    </div>
  );
};