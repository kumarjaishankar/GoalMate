import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface RecentTask {
  id: number;
  title: string;
  completed: boolean;
  created_at?: string;
  priority: string;
}

export const RecentActivity = () => {
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadRecentTasks = async () => {
      try {
        setLoading(true);
        const tasks = await apiClient.getTasks();
        // Get last 5 tasks sorted by creation date
        const recent = tasks
          .filter(task => task.created_at)
          .sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 5);
        setRecentTasks(recent);
      } catch (error) {
        console.error('Failed to load recent tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentTasks();
    const interval = setInterval(loadRecentTasks, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!isAuthenticated) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Sign in to view recent activity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-accent" />
          Recent Activity
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-muted-foreground py-4">
            Loading recent activity...
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No recent tasks found
          </div>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                <div className="flex-shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{task.created_at ? formatTimeAgo(task.created_at) : 'Unknown'}</span>
                    <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
