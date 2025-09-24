import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { TrendingUp, Target, Clock, CheckCircle } from 'lucide-react';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  avgCompletionTime: string;
}

export const TaskAnalytics = () => {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setStats(null);
      setError(null);
      return;
    }

    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get tasks and calculate analytics
        const tasks = await apiClient.getTasks();
        const now = new Date();
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.filter(t => !t.completed).length;
        const overdue = tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date) < now).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Calculate average completion time (mock for now)
        const avgCompletionTime = "2.3 days";
        
        setStats({
          total,
          completed,
          pending,
          overdue,
          completionRate,
          avgCompletionTime
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    
    // Real-time updates every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Task Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Sign in to view your task analytics
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading && !stats) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Task Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Loading analytics...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Task Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-400 py-8">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const metrics = [
    {
      label: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: CheckCircle,
      color: stats.completionRate >= 70 ? 'text-green-400' : stats.completionRate >= 40 ? 'text-yellow-400' : 'text-red-400'
    },
    {
      label: 'Total Tasks',
      value: stats.total.toString(),
      icon: Target,
      color: 'text-blue-400'
    },
    {
      label: 'Pending',
      value: stats.pending.toString(),
      icon: Clock,
      color: 'text-orange-400'
    },
    {
      label: 'Avg Time',
      value: stats.avgCompletionTime,
      icon: TrendingUp,
      color: 'text-purple-400'
    }
  ];

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Task Analytics
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
              <div className="flex items-center justify-center mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div className={`text-xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
        
        {stats.overdue > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="text-center text-red-400 text-sm">
              ⚠️ {stats.overdue} overdue task{stats.overdue > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
