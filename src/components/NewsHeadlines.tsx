import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

export const NewsHeadlines = () => {
  const headlines = [
    "Breaking: Revolutionary AI breakthrough transforms productivity workflows globally",
    "Tech Giants Unite: New collaboration framework announced for 2024",
    "Market Update: Digital transformation drives 23% growth in productivity sector",
    "Innovation Alert: Smart tracking systems see unprecedented adoption rates",
    "Industry Report: Remote work efficiency reaches all-time high with AI integration",
    "Global Trend: Personalized productivity tools become mainstream across enterprises",
    "Research: Advanced analytics show 40% improvement in task completion rates"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length);
        setIsVisible(true);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, [headlines.length]);

  return (
    <div className="glass-card p-4 rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 animate-pulse-slow" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1.5 rounded-lg bg-accent/20 animate-glow">
            <Newspaper className="h-4 w-4 text-accent" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Live Updates</h3>
          <div className="flex-1" />
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>

        <div className={`transition-all duration-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <p className="text-sm leading-relaxed text-foreground font-medium">
            {headlines[currentIndex]}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            {headlines.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-accent scale-125' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-50" />
        </div>
      </div>
    </div>
  );
};