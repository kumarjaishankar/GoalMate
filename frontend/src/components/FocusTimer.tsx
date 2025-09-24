import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw, Coffee } from 'lucide-react';

export const FocusTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsRunning(false);
      if (mode === 'work') {
        setSessions(prev => prev + 1);
        setMode('break');
        setTimeLeft(5 * 60); // 5 minute break
      } else {
        setMode('work');
        setTimeLeft(25 * 60); // 25 minute work session
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = () => {
    setIsRunning(false);
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Timer className="h-5 w-5 text-accent" />
          Focus Timer
          <div className="ml-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs text-muted-foreground">{sessions} sessions</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          {/* Mode indicator */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              mode === 'work' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {mode === 'work' ? '🎯 Work Time' : '☕ Break Time'}
            </div>
          </div>

          {/* Timer display */}
          <div className={`text-4xl font-mono font-bold ${
            mode === 'work' ? 'text-blue-400' : 'text-green-400'
          }`}>
            {formatTime(timeLeft)}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-accent/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                mode === 'work' ? 'bg-blue-400' : 'bg-green-400'
              }`}
              style={{ 
                width: `${((mode === 'work' ? 25 * 60 : 5 * 60) - timeLeft) / (mode === 'work' ? 25 * 60 : 5 * 60) * 100}%` 
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={toggleTimer}
              size="sm"
              className={`${
                mode === 'work' 
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30' 
                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30'
              } border`}
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={resetTimer}
              size="sm"
              variant="outline"
              className="bg-transparent border-accent/40 hover:border-accent/80"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={switchMode}
              size="sm"
              variant="outline"
              className="bg-transparent border-accent/40 hover:border-accent/80"
            >
              {mode === 'work' ? <Coffee className="h-4 w-4" /> : <Timer className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
