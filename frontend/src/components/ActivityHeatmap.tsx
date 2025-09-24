import { useEffect, useState } from 'react';
import { TrendingUp, Flame, Calendar, BarChart3, Target } from 'lucide-react';
import { apiClient, ActivityAnalytics } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export const ActivityHeatmap = () => {
  const [analytics, setAnalytics] = useState<ActivityAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const loadAnalytics = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getActivityAnalytics();
      setAnalytics(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      setAnalytics(null);
      setError(null);
      return;
    }

    loadAnalytics();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, authLoading]);

  const getIntensityClass = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-800';
      case 1: return 'bg-green-900';
      case 2: return 'bg-green-700';
      case 3: return 'bg-green-500';
      case 4: return 'bg-green-300';
      default: return 'bg-gray-800';
    }
  };

  const getMonthData = (heatmapData: any[]) => {
    const months = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = monthDate.toLocaleDateString('en', { month: 'short' });
      
      // Get days for this month
      const monthDays = heatmapData.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate.getMonth() === monthDate.getMonth() && 
               dayDate.getFullYear() === monthDate.getFullYear();
      });
      
      months.push({
        name: monthName,
        days: monthDays
      });
    }
    
    return months;
  };

  const getWeekDays = () => ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (!isAuthenticated) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Activity Graph
          </div>
          <div>
            <h3 className="text-lg font-semibold">Activity Heatmap</h3>
            <p className="text-sm text-muted-foreground">Your productivity journey</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Please sign in to view your activity</div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-accent/20">
          <TrendingUp className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Activity Heatmap</h3>
          <p className="text-sm text-muted-foreground">Your productivity journey</p>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading activity data...</div>
      ) : error ? (
        <div className="text-sm text-destructive">{error}</div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{analytics.current_streak}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Flame className="h-3 w-3" />
                Current Streak
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{analytics.longest_streak}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Target className="h-3 w-3" />
                Longest Streak
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{analytics.total_tasks}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Calendar className="h-3 w-3" />
                Total Tasks
              </div>
            </div>
          </div>

          {/* Activity Graph */}
          <div className="space-y-4">
            {/* Graph Container */}
            <div className="relative h-32 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-4 overflow-hidden">
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="absolute w-full border-t border-accent/20" style={{ top: `${i * 20}%` }} />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="absolute h-full border-l border-accent/20" style={{ left: `${i * 12.5}%` }} />
                ))}
              </div>

              {/* Activity Line Chart */}
              <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="activityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="rgb(var(--accent))" stopOpacity="1" />
                    <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                
                {/* Generate path from last 30 days of data */}
                {(() => {
                  const last30Days = analytics.heatmap_data.slice(-30);
                  const maxCount = Math.max(...last30Days.map(d => d.count), 1);
                  const points = last30Days.map((day, i) => {
                    const x = (i / (last30Days.length - 1)) * 400;
                    const y = 120 - (day.count / maxCount) * 100;
                    return `${x},${y}`;
                  }).join(' ');
                  
                  const pathData = `M ${points.split(' ').join(' L ')}`;
                  const areaData = `${pathData} L 400,120 L 0,120 Z`;
                  
                  return (
                    <>
                      {/* Area fill */}
                      <path
                        d={areaData}
                        fill="url(#activityGradient)"
                        className="animate-pulse"
                      />
                      {/* Line */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="2"
                        className="drop-shadow-sm"
                      />
                      {/* Data points */}
                      {last30Days.map((day, i) => {
                        const x = (i / (last30Days.length - 1)) * 400;
                        const y = 120 - (day.count / maxCount) * 100;
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill="rgb(var(--accent))"
                            className="drop-shadow-sm hover:r-4 transition-all duration-200"
                          >
                            <title>{`${day.date}: ${day.count} tasks`}</title>
                          </circle>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>

              {/* Floating stats */}
              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1 text-xs">
                <span className="text-accent font-medium">Last 30 days</span>
              </div>
            </div>

            {/* Graph Legend */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-gradient-to-r from-accent/60 via-accent to-accent/60 rounded-full" />
                  <span className="text-muted-foreground">Daily Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-accent font-medium">
                    Goal: {analytics.today_count}/{analytics.daily_goal}
                  </span>
                </div>
              </div>
              
              <div className="text-muted-foreground">
                Peak: {Math.max(...analytics.heatmap_data.slice(-30).map(d => d.count))} tasks
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
