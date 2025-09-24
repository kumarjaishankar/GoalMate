import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { AISuggestions } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Timer, ListChecks } from 'lucide-react';

interface SuggestionsModalProps {
  open: boolean;
  onClose: () => void;
  suggestions: AISuggestions | null;
}

const priorityColor = (p?: string) => {
  const v = (p || 'Medium').toLowerCase();
  if (v === 'high') return 'bg-red-500/15 text-red-400 border-red-500/30';
  if (v === 'low') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
};

export const SuggestionsModal = ({ open, onClose, suggestions }: SuggestionsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="gradient-text">AI Suggestions</DialogTitle>
        </DialogHeader>
        {!suggestions ? (
          <div className="text-sm text-muted-foreground">No suggestions available.</div>
        ) : (
          <div className="space-y-6">
            {/* Headline */}
            <Card className="glass-card border-0">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Enhanced Title</div>
                    <div className="text-xl font-semibold">{suggestions.enhanced_title}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`border ${priorityColor(suggestions.suggested_priority)}`}>{suggestions.suggested_priority}</Badge>
                    <Badge variant="outline" className="border-accent/40 text-accent">{suggestions.suggested_category}</Badge>
                    <Badge variant="outline" className="border-primary/40 text-primary flex items-center gap-1">
                      <Timer className="h-3.5 w-3.5" />
                      {suggestions.estimated_time}h
                    </Badge>
                  </div>
                </div>
                {suggestions.ai_insights && (
                  <div className="mt-3 text-sm text-muted-foreground flex gap-2">
                    <Lightbulb className="h-4 w-4 text-warning mt-0.5" />
                    <p>{suggestions.ai_insights}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Breakdown */}
            {suggestions.task_breakdown && suggestions.task_breakdown.length > 0 && (
              <Card className="glass-card border-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ListChecks className="h-4 w-4 text-primary" />
                    <div className="font-medium">Recommended Breakdown</div>
                  </div>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    {suggestions.task_breakdown.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
