import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { Plus, CheckCircle, Archive, Trash2, Zap } from 'lucide-react';

export const QuickActions = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleQuickAction = async (action: string) => {
    if (!isAuthenticated) return;
    
    setLoading(action);
    try {
      switch (action) {
        case 'quick-task':
          await apiClient.createTask({
            title: 'Quick Task',
            description: 'Created via quick action',
            category: 'general',
            priority: 'medium'
          });
          break;
        case 'complete-all':
          // This would need a bulk complete endpoint
          console.log('Complete all pending tasks');
          break;
        case 'archive-completed':
          // This would need an archive endpoint
          console.log('Archive completed tasks');
          break;
        case 'clear-completed':
          // This would need a bulk delete endpoint
          console.log('Clear completed tasks');
          break;
      }
    } catch (error) {
      console.error('Quick action failed:', error);
      // Add user-facing error notification
      if (typeof window !== 'undefined' && 'dispatchEvent' in window) {
        window.dispatchEvent(new CustomEvent('toast', {
          detail: { message: 'Action failed. Please try again.', type: 'error' }
        }));
      }
    } finally {
      setLoading(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Sign in to access quick actions
          </div>
        </CardContent>
      </Card>
    );
  }

  const actions = [
    {
      id: 'quick-task',
      label: 'Add Quick Task',
      icon: Plus,
      color: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30'
    },
    {
      id: 'complete-all',
      label: 'Complete All',
      icon: CheckCircle,
      color: 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30'
    },
    {
      id: 'archive-completed',
      label: 'Archive Done',
      icon: Archive,
      color: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/30'
    },
    {
      id: 'clear-completed',
      label: 'Clear Done',
      icon: Trash2,
      color: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30'
    }
  ];

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Quick Actions
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              disabled={loading === action.id}
              size="sm"
              className={`${action.color} border h-auto py-3 flex flex-col items-center gap-1 transition-all duration-200 hover:scale-105`}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{action.label}</span>
              {loading === action.id && (
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
