import { Brain, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AIControlPanel = () => {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-accent/20 animate-glow">
          <Brain className="h-5 w-5 text-accent" />
        </div>
        <h3 className="text-lg font-semibold">AI Assistant</h3>
      </div>

      <div className="space-y-4">
        <Button 
          className="w-full justify-start gap-3 glass-button group"
          variant="outline"
        >
          <div className="p-1.5 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <div className="font-medium">AI Insights</div>
            <div className="text-xs text-muted-foreground">Analyze your productivity patterns</div>
          </div>
        </Button>

        <Button 
          className="w-full justify-start gap-3 glass-button group"
          variant="outline"
        >
          <div className="p-1.5 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
            <Zap className="h-4 w-4 text-accent" />
          </div>
          <div className="text-left">
            <div className="font-medium">Smart Suggestions</div>
            <div className="text-xs text-muted-foreground">Get personalized task recommendations</div>
          </div>
        </Button>

        <Button 
          className="w-full justify-start gap-3 glass-button group"
          variant="outline"
        >
          <div className="p-1.5 rounded-lg bg-warning/20 group-hover:bg-warning/30 transition-colors">
            <TrendingUp className="h-4 w-4 text-warning" />
          </div>
          <div className="text-left">
            <div className="font-medium">Performance Analytics</div>
            <div className="text-xs text-muted-foreground">Track your progress trends</div>
          </div>
        </Button>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-muted-foreground">AI is analyzing your tasks...</span>
        </div>
      </div>
    </div>
  );
};