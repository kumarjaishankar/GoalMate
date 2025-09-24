import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, Wifi, Zap } from 'lucide-react';

interface SystemMetrics {
  apiLatency: number;
  dbConnections: number;
  uptime: string;
  responseTime: number;
}

export const SystemStats = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateMetrics = () => {
      const mockMetrics: SystemMetrics = {
        apiLatency: Math.floor(Math.random() * 50) + 20, // 20-70ms
        dbConnections: Math.floor(Math.random() * 5) + 3, // 3-8 connections
        uptime: '2h 34m',
        responseTime: Math.floor(Math.random() * 30) + 10, // 10-40ms
      };
      setMetrics(mockMetrics);
      setLoading(false);
    };

    updateMetrics();
    
    // Update every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-400';
    if (value <= thresholds[1]) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            System Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Loading metrics...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const stats = [
    {
      label: 'API Latency',
      value: `${metrics.apiLatency}ms`,
      icon: Wifi,
      color: getStatusColor(metrics.apiLatency, [30, 50])
    },
    {
      label: 'DB Pool',
      value: metrics.dbConnections.toString(),
      icon: Database,
      color: 'text-blue-400'
    },
    {
      label: 'Response',
      value: `${metrics.responseTime}ms`,
      icon: Zap,
      color: getStatusColor(metrics.responseTime, [20, 35])
    },
    {
      label: 'Uptime',
      value: metrics.uptime,
      icon: Activity,
      color: 'text-purple-400'
    }
  ];

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" />
          System Stats
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-2 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
              <div className="flex items-center justify-center mb-1">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className={`text-sm font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="text-center text-green-400 text-xs">
            🟢 All systems operational
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
