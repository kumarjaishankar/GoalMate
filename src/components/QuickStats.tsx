import { Activity, Users, Calendar, Star } from 'lucide-react';

export const QuickStats = () => {
  const stats = [
    { 
      icon: Activity, 
      label: 'Active Sessions', 
      value: '2.4k', 
      change: '+12%',
      color: 'text-accent'
    },
    { 
      icon: Users, 
      label: 'Team Members', 
      value: '48', 
      change: '+3',
      color: 'text-primary'
    },
    { 
      icon: Calendar, 
      label: 'Events Today', 
      value: '16', 
      change: '+8',
      color: 'text-warning'
    },
    { 
      icon: Star, 
      label: 'Achievements', 
      value: '127', 
      change: '+5',
      color: 'text-accent'
    }
  ];

  return (
    <div className="glass-card p-4 rounded-2xl">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Stats</h3>
      
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
              <span className="text-xs text-accent font-medium">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};