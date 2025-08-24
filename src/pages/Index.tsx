import { ThemeToggle } from '@/components/ThemeToggle';
import { DigitalClock } from '@/components/DigitalClock';
import { AIControlPanel } from '@/components/AIControlPanel';
import { ProgressCharts } from '@/components/ProgressCharts';
import { MotivationalQuotes } from '@/components/MotivationalQuotes';
import { TaskOverview } from '@/components/TaskOverview';

const Index = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            Aether Tracker
          </h1>
          <p className="text-muted-foreground">
            Your intelligent productivity companion
          </p>
        </div>
        
        <div className="animate-scale-in">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column */}
        <div className="space-y-6 animate-slide-up">
          <DigitalClock />
          <AIControlPanel />
        </div>

        {/* Center Column */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <TaskOverview />
        </div>

        {/* Right Column */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <ProgressCharts />
          <MotivationalQuotes />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="glass-card p-4 rounded-xl inline-block">
          <p>Powered by AI • Built for Excellence • Designed for You</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;