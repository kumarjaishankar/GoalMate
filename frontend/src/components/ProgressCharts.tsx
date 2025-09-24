import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { apiClient, ProductivityInsights } from '@/lib/api';

export const ProgressCharts = () => {
  const [insights, setInsights] = useState<ProductivityInsights | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiClient.getProductivityInsights();
        setInsights(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load insights');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const getProgress = (value: number, total: number) => (total ? (value / total) * 100 : 0);

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-2xl text-sm text-muted-foreground">Loading analytics...</div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 rounded-2xl text-sm text-destructive">{error}</div>
    );
  }

  const total = insights?.total_tasks ?? 0;
  const completed = insights?.completed_tasks ?? 0;
  const completionRate = insights?.completion_rate ?? 0;

  const stats = [
    { label: 'Completed Tasks', value: completed, total: total || 1, color: 'bg-accent' },
    { label: 'Completion Rate', value: Math.round(completionRate), total: 100, color: 'bg-primary' },
    { label: 'Categories', value: Object.keys(insights?.category_distribution || {}).length, total: 10, color: 'bg-warning' },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/20">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">Progress Overview</h3>
      </div>

      <div className="space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{stat.label}</span>
              <span className="font-mono font-medium">
                {stat.label === 'Completion Rate' ? `${stat.value}%` : `${stat.value}/${stat.total}`}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${stat.color} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${getProgress(stat.value, stat.total)}%` }}
              />
            </div>
            <div className="text-xs text-right text-muted-foreground">
              {Math.round(getProgress(stat.value, stat.total))}%
            </div>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-3 rounded-xl bg-accent/10">
            <CheckCircle className="h-6 w-6 text-accent mx-auto mb-2" />
            <div className="text-xl font-bold">{Math.round(completionRate)}%</div>
            <div className="text-xs text-muted-foreground">Efficiency</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-primary/10">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-xl font-bold">{insights?.most_productive_category || 'None'}</div>
            <div className="text-xs text-muted-foreground">Top Category</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-warning/10">
            <TrendingUp className="h-6 w-6 text-warning mx-auto mb-2" />
            <div className="text-xl font-bold">{insights?.productivity_score ?? 0}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>
      </div>
    </div>
  );
};