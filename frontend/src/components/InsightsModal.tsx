import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductivityInsights } from '@/lib/api';
import { Brain, Target, Rocket, AlertTriangle, CheckCircle2, Clock, Bolt } from 'lucide-react';

interface InsightsModalProps {
  open: boolean;
  onClose: () => void;
  insights: ProductivityInsights | null;
}

const headline = (ins: ProductivityInsights | null): string => {
  if (!ins) return '';
  const rate = ins.completion_rate;
  if (ins.total_tasks === 0) return "Blank canvas. Add one quick win to spark momentum.";
  if (rate >= 80) return "Prime flow state. Double down on what's working.";
  if (rate >= 50) return "Solid tempo. One focused sprint pushes you over the top.";
  if (rate > 0) return "You're lifting off. Reduce friction and claim easy wins.";
  return "Let's kick off with a small, high-clarity task.";
};

const buildQuickWins = (ins: ProductivityInsights | null): string[] => {
  if (!ins) return [];
  const wins: string[] = [];
  if (ins.total_tasks === 0) {
    wins.push("Create 1 five‑minute task to start a streak");
    wins.push("Draft a simple title + due time for clarity");
    return wins;
  }
  if (ins.completed_tasks < Math.max(1, Math.round(ins.total_tasks * 0.2))) {
    wins.push("Finish the smallest pending task in under 10 minutes");
  }
  if (ins.most_productive_category && (ins.category_distribution?.[ins.most_productive_category] || 0) >= 2) {
    wins.push(`Batch 2 similar tasks in ${ins.most_productive_category}`);
  }
  if ((ins.priority_distribution?.['High'] || 0) > ins.total_tasks * 0.6) {
    wins.push("Downgrade 1 High priority task to Medium to reduce pressure");
  }
  if ((ins.priority_distribution?.['Low'] || 0) === 0 && ins.total_tasks >= 3) {
    wins.push("Add 1 low‑effort task for quick momentum");
  }
  if (wins.length === 0) wins.push("Schedule a 25‑minute focus block for your top task");
  return wins;
};

const buildNextActions = (ins: ProductivityInsights | null): string[] => {
  if (!ins) return [];
  const actions: string[] = [];
  // Focus first
  actions.push(`Start a 25‑minute focus block on ${ins.most_productive_category}`);
  // Balance priorities
  if ((ins.priority_distribution?.['High'] || 0) > ins.total_tasks * 0.6) {
    actions.push("Re‑prioritize: keep at most 3 High items active");
  } else if ((ins.priority_distribution?.['High'] || 0) <= 1) {
    actions.push("Promote one meaningful task to High to create focus");
  }
  // Throughput
  if (ins.completion_rate < 50 && ins.total_tasks > 0) {
    actions.push("Pick 2 smallest tasks and finish them back‑to‑back");
  }
  // Category hygiene
  if (Object.keys(ins.category_distribution || {}).length > 5) {
    actions.push("Park non‑essential categories; limit active areas to 3");
  }
  return actions.slice(0, 4);
};

const buildFocusBlocks = (ins: ProductivityInsights | null): string[] => {
  if (!ins) return [];
  const blocks: string[] = [];
  const top = ins.most_productive_category || 'Focus';
  blocks.push(`${top}: 25m deep work + 5m break`);
  if (ins.total_tasks - ins.completed_tasks >= 3) {
    blocks.push("Rapid wins: 3 x 10m micro‑tasks");
  }
  if (ins.completion_rate >= 60) {
    blocks.push("Stretch goal: 45m session on your toughest task");
  }
  return blocks;
};

export const InsightsModal = ({ open, onClose, insights }: InsightsModalProps) => {
  const wins = buildQuickWins(insights);
  const actions = buildNextActions(insights);
  const blocks = buildFocusBlocks(insights);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="gradient-text flex items-center gap-2"><Brain className="h-5 w-5 text-accent" /> AI Insights</DialogTitle>
        </DialogHeader>

        {!insights ? (
          <div className="text-sm text-muted-foreground">No insights available.</div>
        ) : (
          <div className="space-y-6">
            {/* Headline */}
            <Card className="glass-card border-0">
              <CardContent className="p-5 flex items-start gap-3">
                <Rocket className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Personalized Guidance</div>
                  <div className="text-lg font-semibold">{headline(insights)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Focus & Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card border-0"><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">Top Focus</div><div className="flex items-center gap-2"><Target className="h-4 w-4 text-primary" /><div className="font-medium">{insights.most_productive_category || 'N/A'}</div></div></CardContent></Card>
              <Card className="glass-card border-0"><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">Success Rate</div><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /><div className="font-medium">{Math.round(insights.completion_rate)}%</div></div></CardContent></Card>
              <Card className="glass-card border-0"><CardContent className="p-4"><div className="text-xs text-muted-foreground mb-1">Health Check</div><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /><div className="font-medium">{insights.total_tasks > 0 ? `${insights.total_tasks - insights.completed_tasks} active, ${insights.completed_tasks} done` : 'No tasks yet'}</div></div></CardContent></Card>
            </div>

            {/* Quick Wins */}
            <Card className="glass-card border-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-medium">Quick Wins</div>
                  <Badge variant="outline" className="border-accent/40 text-accent">Actionable</Badge>
                </div>
                <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                  {wins.map((w, i) => (<li key={i}>{w}</li>))}
                </ul>
              </CardContent>
            </Card>

            {/* Next Best Actions */}
            {actions.length > 0 && (
              <Card className="glass-card border-0">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium">Next Best Actions</div>
                    <Badge variant="outline" className="border-primary/40 text-primary flex items-center gap-1"><Bolt className="h-3.5 w-3.5" /> Focus</Badge>
                  </div>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                    {actions.map((a, i) => (<li key={i}>{a}</li>))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Focus Blocks */}
            {blocks.length > 0 && (
              <Card className="glass-card border-0">
                <CardContent className="p-5">
                  <div className="text-sm font-medium mb-3">Suggested Focus Blocks</div>
                  <div className="flex flex-wrap gap-2">
                    {blocks.map((b, i) => (
                      <Badge key={i} variant="outline" className="border-border/60 text-muted-foreground">{b}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
