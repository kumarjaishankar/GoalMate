import { useEffect, useState } from 'react';
import { Brain, Sparkles, TrendingUp, Target, Zap, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface InsightData {
  icon: any;
  title: string;
  value: string;
  trend: string;
  color: string;
}

export const ProductivityInsights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setInsights([]);
      return;
    }

    const generateInsights = async () => {
      try {
        setLoading(true);
        
        // Get real task data
        const tasks = await apiClient.getTasks();
        const analytics = await apiClient.getActivityAnalytics();
        
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        const overdue = tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length;
        
        // Calculate productivity trends
        const last7Days = analytics.heatmap_data.slice(-7);
        const thisWeekTotal = last7Days.reduce((sum, day) => sum + day.count, 0);
        const prevWeekTotal = analytics.heatmap_data.slice(-14, -7).reduce((sum, day) => sum + day.count, 0);
        const weeklyTrend = prevWeekTotal > 0 ? Math.round(((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100) : 0;
        
        const allInsights: InsightData[] = [
          {
            icon: Target,
            title: "Completion Rate",
            value: `${completionRate}%`,
            trend: completionRate >= 80 ? "Excellent performance!" : completionRate >= 60 ? "Good progress" : "Room for improvement",
            color: completionRate >= 80 ? "text-green-400" : completionRate >= 60 ? "text-yellow-400" : "text-red-400"
          },
          {
            icon: TrendingUp,
            title: "Weekly Trend",
            value: weeklyTrend >= 0 ? "↗ Rising" : "↘ Declining",
            trend: `${Math.abs(weeklyTrend)}% vs last week`,
            color: weeklyTrend >= 0 ? "text-green-400" : "text-red-400"
          },
          {
            icon: Award,
            title: "Current Streak",
            value: `${analytics.current_streak} days`,
            trend: analytics.current_streak >= analytics.longest_streak ? "New personal best!" : `Best: ${analytics.longest_streak} days`,
            color: "text-orange-400"
          },
          {
            icon: Zap,
            title: "Daily Average",
            value: `${Math.round(thisWeekTotal / 7)} tasks`,
            trend: `Goal: ${analytics.daily_goal} tasks/day`,
            color: Math.round(thisWeekTotal / 7) >= analytics.daily_goal ? "text-green-400" : "text-yellow-400"
          },
          {
            icon: Brain,
            title: "Focus Score",
            value: overdue === 0 ? "Excellent" : overdue <= 2 ? "Good" : "Needs Focus",
            trend: overdue > 0 ? `${overdue} overdue tasks` : "All tasks on track",
            color: overdue === 0 ? "text-green-400" : overdue <= 2 ? "text-yellow-400" : "text-red-400"
          }
        ];
        setInsights(allInsights);
      } catch (error) {
        console.error('Failed to generate insights:', error);
        // Fallback to static insights if API fails
        setInsights([
          {
            icon: Brain,
            title: "Focus Score",
            value: "Loading...",
            trend: "Analyzing your patterns",
            color: "text-purple-400"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
    
    // Update insights every 60 seconds
    const interval = setInterval(generateInsights, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    if (insights.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % insights.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [insights.length]);

  if (!isAuthenticated) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Productivity Insights</h3>
            <p className="text-sm text-muted-foreground">AI-powered analytics</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Sign in to unlock insights</div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-purple-500/20 animate-pulse">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Productivity Insights</h3>
            <p className="text-sm text-muted-foreground">AI-powered analytics</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Analyzing your patterns...</div>
      </div>
    );
  }

  const currentData = insights[currentInsight];
  const IconComponent = currentData.icon;

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-green-500/5 animate-pulse-slow" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-purple-500/20 animate-glow">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Productivity Insights</h3>
            <p className="text-sm text-muted-foreground">AI-powered analytics</p>
          </div>
        </div>

        {/* Main insight display */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-card/50 to-transparent border border-border/50">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-card/80 to-transparent`}>
              <IconComponent className={`h-6 w-6 ${currentData.color}`} />
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-1">{currentData.title}</div>
              <div className="text-2xl font-bold text-foreground mb-1">{currentData.value}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {currentData.trend}
              </div>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="flex items-center justify-center gap-2">
            {insights.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentInsight 
                    ? 'w-8 bg-purple-400' 
                    : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Quick stats grid - now shows real data */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
              <div className="text-lg font-bold text-green-400">
                {loading ? "..." : insights.length > 0 ? insights.find(i => i.title === "Completion Rate")?.value || "0%" : "0%"}
              </div>
              <div className="text-xs text-muted-foreground">Task Completion</div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
              <div className="text-lg font-bold text-blue-400">
                {loading ? "..." : insights.length > 0 ? insights.find(i => i.title === "Current Streak")?.value || "0 days" : "0 days"}
              </div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
