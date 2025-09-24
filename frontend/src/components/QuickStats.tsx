import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, ListTodo, Percent } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export const QuickStats = () => {
  const [total, setTotal] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  const [active, setActive] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    if (!isAuthenticated) {
      // Reset stats for unauthenticated users
      setTotal(0);
      setCompleted(0);
      setActive(0);
      setPercent(0);
      setError(null);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const summary = await apiClient.getTaskSummary();
        const totalNum = parseInt(String(summary.total)) || 0;
        const completedNum = parseInt(String(summary.completed)) || 0;
        const percentNum = parseFloat(String(summary.percent_completed)) || 0;
        
        setTotal(totalNum);
        setCompleted(completedNum);
        setPercent(Math.round(percentNum));
        setActive(Math.max(0, totalNum - completedNum));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, authLoading]);

  const stats = [
    { icon: ListTodo, label: 'Total Tasks', value: total.toString(), color: 'text-primary' },
    { icon: Activity, label: 'Active Tasks', value: active.toString(), color: 'text-warning' },
    { icon: CheckCircle2, label: 'Completed', value: completed.toString(), color: 'text-accent' },
    { icon: Percent, label: 'Success Rate', value: `${percent}%`, color: 'text-primary' },
  ];

  return (
    <div className="glass-card p-4 rounded-2xl">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Stats</h3>
      {!isAuthenticated ? (
        <div className="text-xs text-muted-foreground">Not authenticated</div>
      ) : loading ? (
        <div className="text-xs text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-xs text-destructive">{error}</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="p-3 rounded-xl bg-gradient-to-br from-card/50 to-transparent border border-border/50 hover:border-border/80 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color} group-hover:scale-110 transition-transform duration-200`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};