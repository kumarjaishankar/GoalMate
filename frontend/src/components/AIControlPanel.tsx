import { useState } from 'react';
import { Brain, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiClient, AISuggestions, ProductivityInsights } from '@/lib/api';
import { AnalyticsModal } from '@/components/AnalyticsModal';
import { SuggestionsModal } from '@/components/SuggestionsModal';
import { InsightsModal } from '@/components/InsightsModal';

export const AIControlPanel = () => {
  const [open, setOpen] = useState(false);
  const [openAnalytics, setOpenAnalytics] = useState(false);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [openInsights, setOpenInsights] = useState(false);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestions | null>(null);
  const [insights, setInsights] = useState<ProductivityInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getProductivityInsights();
      setInsights(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInsights = async () => {
    await loadInsights();
    setOpenInsights(true);
  };

  const handleOpenAnalytics = async () => {
    await loadInsights();
    setOpenAnalytics(true);
  };

  const handleSuggest = async () => {
    try {
      setLoading(true);
      setError(null);
      setInsights(null);
      const data = await apiClient.enhanceTask(title || 'New Task');
      setSuggestions(data);
      setOpenSuggestions(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to get suggestions');
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Shared styles: force transparent bg on all states; only border/ring change
  const baseNoBg = 'bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent data-[state=open]:bg-transparent';
  const actionBase = `w-full rounded-xl px-1.5 py-3 justify-start text-left flex items-center transition-all duration-200 border ring-1 ${baseNoBg}`;
  const insightsRow = `${actionBase} border-accent/30 ring-border/30 hover:border-accent/60 hover:ring-indigo-500/40 hover:-translate-y-px hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60`;
  const analyticsRow = `${actionBase} border-accent/30 ring-border/30 hover:border-accent/60 hover:ring-amber-400/50 hover:-translate-y-px hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60`;
  const suggestBtn = `rounded-xl px-3 py-2 flex items-center gap-2 border border-accent/30 hover:border-accent/60 transition-all duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 ${baseNoBg}`;

  // Icon badges
  const iconWrapPrimary = 'shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-primary/20 -ml-1.5';
  const iconWrapWarn = 'shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-warning/20 -ml-1.5';

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-accent/20 animate-glow">
          <Brain className="h-5 w-5 text-accent" />
        </div>
        <h3 className="text-lg font-semibold tracking-wide">AI Assistant</h3>
      </div>

      <div className="space-y-3">
        <Button
          className={insightsRow}
          variant="outline"
          onClick={handleOpenInsights}
          disabled={loading}
          aria-label="Open AI Insights"
        >
          <div className={iconWrapPrimary}>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="ml-3">
            <div className="font-semibold">AI Insights</div>
            <div className="text-xs text-muted-foreground/85">Friendly guidance and quick wins</div>
          </div>
        </Button>

        <div className="flex items-center gap-2">
          <input
            className={`flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50`}
            placeholder="Task title for suggestions"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Task title for AI suggestion"
          />
          <Button
            className={suggestBtn}
            variant="outline"
            onClick={handleSuggest}
            disabled={loading}
            aria-label="Get AI suggestion"
          >
            <Zap className="h-6 w-6 text-accent" />
            Suggest
          </Button>
        </div>

        <Button
          className={analyticsRow}
          variant="outline"
          onClick={handleOpenAnalytics}
          disabled={loading}
          aria-label="Open Performance Analytics"
        >
          <div className={iconWrapWarn}>
            <TrendingUp className="h-6 w-6 text-warning" />
          </div>
          <div className="ml-3">
            <div className="font-semibold">Performance Analytics</div>
            <div className="text-xs text-muted-foreground/85">Deep-dive charts and metrics</div>
          </div>
        </Button>
      </div>

      <div className="my-4 border-t border-border/40" />

      <div className="p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-muted-foreground">{loading ? 'AI is thinking...' : 'AI is analyzing your tasks...'}</span>
        </div>
      </div>

      {/* Error dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI</DialogTitle>
          </DialogHeader>
          {error && <div className="text-sm text-destructive">{error}</div>}
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <AnalyticsModal open={openAnalytics} onClose={() => setOpenAnalytics(false)} insights={insights} />
      <InsightsModal open={openInsights} onClose={() => setOpenInsights(false)} insights={insights} />
      <SuggestionsModal open={openSuggestions} onClose={() => setOpenSuggestions(false)} suggestions={suggestions} />
    </div>
  );
};