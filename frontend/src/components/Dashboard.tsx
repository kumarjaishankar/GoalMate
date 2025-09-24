import { DigitalClock } from '@/components/DigitalClock';
import { AIControlPanel } from '@/components/AIControlPanel';
import { TaskAnalytics } from '@/components/TaskAnalytics';
import { MotivationalQuotes } from '@/components/MotivationalQuotes';
import { TaskOverview } from '@/components/TaskOverview';
import { NewsHeadlines } from '@/components/NewsHeadlines';
import { ActivityHeatmap } from '@/components/ActivityHeatmap';
import { ProductivityInsights } from '@/components/ProductivityInsights';
import { FocusTimer } from '@/components/FocusTimer';
import { QuickActions } from '@/components/QuickActions';
import { WeatherWidget } from '@/components/WeatherWidget';
import { SystemStats } from '@/components/SystemStats';
import { RecentActivity } from '@/components/RecentActivity';
import { AIPowered } from '@/components/AIPowered';

export const Dashboard = () => {
  return (
    <>
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 auto-rows-min">
        {/* Left Column */}
        <div className="space-y-6 animate-slide-up flex flex-col">
          <DigitalClock />
          <WeatherWidget />
          <NewsHeadlines />
          <SystemStats />
          <QuickActions />
        </div>

        {/* Center Column */}
        <div className="space-y-6 animate-slide-up flex flex-col" style={{ animationDelay: '0.1s' }}>
          <TaskOverview />
          <TaskAnalytics />
          <RecentActivity />
          <FocusTimer />
        </div>

        {/* Right Column */}
        <div className="space-y-6 animate-slide-up flex flex-col" style={{ animationDelay: '0.2s' }}>
          <ActivityHeatmap />
          <ProductivityInsights />
          <AIControlPanel />
          <MotivationalQuotes />
        </div>
      </div>

      {/* AI Powered badge row */}
      <div className="my-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
        <AIPowered />
      </div>
    </>
  );
};
