import { BarChart3, TrendingUp, Target, CheckCircle } from 'lucide-react';

export const ProgressCharts = () => {
  const stats = [
    { label: 'Completed Today', value: 8, total: 12, color: 'bg-accent' },
    { label: 'Weekly Progress', value: 24, total: 35, color: 'bg-primary' },
    { label: 'Goals Achieved', value: 5, total: 7, color: 'bg-warning' },
  ];

  const getProgress = (value: number, total: number) => (value / total) * 100;

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
                {stat.value}/{stat.total}
              </span>
            </div>
            
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${stat.color} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${getProgress(stat.value, stat.total)}%` }}
              />
            </div>
            
            <div className="text-xs text-right text-muted-foreground">
              {Math.round(getProgress(stat.value, stat.total))}% complete
            </div>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-3 rounded-xl bg-accent/10">
            <CheckCircle className="h-6 w-6 text-accent mx-auto mb-2" />
            <div className="text-xl font-bold">67%</div>
            <div className="text-xs text-muted-foreground">Efficiency</div>
          </div>
          
          <div className="text-center p-3 rounded-xl bg-primary/10">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-xl font-bold">5</div>
            <div className="text-xs text-muted-foreground">Streak Days</div>
          </div>
          
          <div className="text-center p-3 rounded-xl bg-warning/10">
            <TrendingUp className="h-6 w-6 text-warning mx-auto mb-2" />
            <div className="text-xl font-bold">+23%</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};