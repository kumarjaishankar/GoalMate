import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-primary/20">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">Current Time</h3>
      </div>
      
      <div className="space-y-3">
        <div className="font-mono text-3xl font-bold gradient-text tracking-wider">
          {formatTime(time)}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(time)}</span>
        </div>
      </div>
      
      <div className="mt-4 h-1 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse-slow" />
    </div>
  );
};