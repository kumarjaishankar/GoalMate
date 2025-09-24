import { useState, useEffect } from 'react';
import { Quote, ChevronRight } from 'lucide-react';

export const MotivationalQuotes = () => {
  const quotes = [
    {
      text: "Try not to become a person of success, but rather try to become a person of value.",
      author: "Albert Einstein"
    },
    {
      text: "The time to repair the roof is when the sun is shining.",
      author: "John F. Kennedy"
    },
    {
      text: "Innovation distinguishes between a leader and a follower.",
      author: "Steve Jobs"
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "Your time is limited, don't waste it living someone else's life.",
      author: "Steve Jobs"
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsVisible(true);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-primary/20 animate-glow">
          <Quote className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-sm font-medium text-muted-foreground">Daily Inspiration</h3>
      </div>

      <div className={`space-y-4 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <blockquote className="text-lg leading-relaxed text-foreground italic">
          "{quotes[currentQuote].text}"
        </blockquote>
        
        <div className="flex items-center justify-between">
          <cite className="text-sm text-muted-foreground font-medium not-italic">
            — {quotes[currentQuote].author}
          </cite>
          
          <div className="flex items-center gap-1">
            {quotes.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentQuote ? 'bg-primary scale-125' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 opacity-30">
        <ChevronRight className="h-4 w-4 text-primary animate-pulse" />
      </div>
    </div>
  );
};