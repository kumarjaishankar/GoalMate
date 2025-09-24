import { Cpu } from 'lucide-react';

export const AIPowered = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="glass-card rounded-2xl px-4 py-3 border border-accent/30 ring-1 ring-border/30 hover:border-accent/60 transition-colors">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
            <Cpu className="h-3.5 w-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold tracking-wide">AI‑Powered Experience</span>
          <span className="text-xs text-muted-foreground ml-2">smart insights • suggestions • analytics</span>
        </div>
      </div>
    </div>
  );
};
