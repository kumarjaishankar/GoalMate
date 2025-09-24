import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthModal } from '@/components/AuthModal';
import { 
  Target, 
  TrendingUp, 
  Zap, 
  Users, 
  CheckCircle, 
  BarChart3, 
  Timer, 
  Brain,
  ArrowRight,
  Play,
  Star,
  Sparkles,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';

// Animated Background Component
const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.5 + 0.1
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 animate-pulse" />
      
      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-accent rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      
      {/* Animated grid lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-accent/20 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
      
      {/* Cursor trail effect */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-accent/5 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

// Floating Icons Component
const FloatingIcons = () => {
  const icons = [Target, BarChart3, Timer, Brain, Zap, Activity, Cpu, Layers];
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, i) => (
        <div
          key={i}
          className="absolute opacity-10 text-accent"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            animation: `float ${Math.random() * 8 + 12}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        >
          <Icon className="h-8 w-8 animate-spin" style={{ animationDuration: `${Math.random() * 20 + 20}s` }} />
        </div>
      ))}
    </div>
  );
};

export const Homepage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Target,
      title: "Smart Task Management",
      description: "Organize, prioritize, and track your tasks with intelligent categorization and due date management.",
      color: "text-blue-400"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Visualize your productivity patterns with beautiful graphs and comprehensive performance metrics.",
      color: "text-green-400"
    },
    {
      icon: Timer,
      title: "Focus Timer",
      description: "Built-in Pomodoro timer to help you maintain focus and track your productive work sessions.",
      color: "text-purple-400"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions and productivity recommendations powered by advanced AI algorithms.",
      color: "text-orange-400"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your growth with streak counters, completion rates, and detailed activity heatmaps.",
      color: "text-pink-400"
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Streamline your workflow with one-click actions for common tasks and bulk operations.",
      color: "text-yellow-400"
    }
  ];

  const stats = [
    { number: "Demo", label: "Version" },
    { number: "6", label: "Core Features" },
    { number: "Open", label: "Source" },
    { number: "Free", label: "To Use" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      {/* Animated Background Effects */}
      <AnimatedBackground />
      <FloatingIcons />
      
      {/* Mouse cursor trail */}
      <div 
        className="fixed w-96 h-96 pointer-events-none z-0 opacity-30"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          background: 'radial-gradient(circle, rgba(var(--accent), 0.1) 0%, transparent 70%)',
          transition: 'all 0.1s ease-out'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
          {/* Navigation */}
          <nav className="flex items-center justify-between p-6 md:p-8 backdrop-blur-sm bg-background/50 border-b border-accent/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/25 animate-pulse">
                <Target className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">GoalMate</span>
              <Sparkles className="h-5 w-5 text-accent animate-pulse ml-2" />
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowAuthModal(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-all duration-300"
              >
                Sign In
              </Button>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300"
              >
                Get Started
              </Button>
              <ThemeToggle />
            </div>
          </nav>

          {/* Hero Section */}
          <section className="px-6 md:px-8 py-20 text-center relative">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                  <span className="text-accent font-medium text-sm tracking-wider uppercase">AI-Powered Productivity</span>
                  <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="gradient-text">Your Intelligent</span>
                  <br />
                  <span className="text-accent bg-gradient-to-r from-accent via-accent/80 to-accent bg-clip-text text-transparent animate-pulse">Goal Achievement</span>
                  <br />
                  <span className="gradient-text">Companion</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Transform your productivity with <span className="text-accent font-semibold">AI-powered</span> task management, 
                  <span className="text-accent font-semibold"> real-time analytics</span>, and intelligent insights that adapt to your workflow.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-300 group"
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Your Journey
                  <Sparkles className="h-4 w-4 ml-2 animate-pulse" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    // Scroll to features section
                    const featuresSection = document.querySelector('section:nth-of-type(3)');
                    featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border-accent/40 hover:border-accent/80 hover:bg-accent/5 px-8 py-4 text-lg rounded-xl hover:scale-105 transition-all duration-300 group"
                >
                  Watch Demo
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="px-6 md:px-8 py-16 backdrop-blur-sm bg-accent/5 rounded-3xl mx-6 md:mx-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl md:text-5xl font-bold gradient-text mb-2 group-hover:animate-pulse">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground text-lg">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="px-6 md:px-8 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Brain className="h-6 w-6 text-accent animate-pulse" />
                  <span className="text-accent font-medium text-sm tracking-wider uppercase">Powerful Features</span>
                  <Brain className="h-6 w-6 text-accent animate-pulse" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
                  background: 'linear-gradient(135deg, hsl(259, 94%, 51%), hsl(259, 94%, 71%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.3',
                  display: 'inline-block',
                  padding: '0.2em 0'
                }}>
                  Everything You Need
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Supercharge your productivity and achieve your goals faster than ever with our intelligent features.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="glass-card hover:scale-105 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 group border border-accent/10">
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                          <feature.icon className={`h-6 w-6 ${feature.color} group-hover:animate-pulse`} />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-6 md:px-8 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <Card className="glass-card p-12 bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 shadow-2xl shadow-accent/10 hover:shadow-accent/20 transition-all duration-500">
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Star className="h-5 w-5 text-accent animate-spin" style={{ animationDuration: '3s' }} />
                      <span className="text-accent font-medium text-sm tracking-wider uppercase">Ready to Start?</span>
                      <Star className="h-5 w-5 text-accent animate-spin" style={{ animationDuration: '3s' }} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                      Transform Your Productivity
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      Join thousands of users who have revolutionized their workflow with GoalMate.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => setShowAuthModal(true)}
                      className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white px-8 py-4 text-lg rounded-xl shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 transition-all duration-300 group"
                    >
                      <Star className="h-5 w-5 mr-2 group-hover:animate-spin" />
                      Get Started Free
                      <Sparkles className="h-4 w-4 ml-2 animate-pulse" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        // Scroll to features section
                        const featuresSection = document.querySelector('section:nth-of-type(3)');
                        featuresSection?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="border-accent/40 hover:border-accent/80 hover:bg-accent/5 px-8 py-4 text-lg rounded-xl hover:scale-105 transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-6 md:px-8 py-12 border-t border-accent/20 backdrop-blur-sm bg-background/50">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/25 animate-pulse">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">GoalMate</span>
                <Sparkles className="h-4 w-4 text-accent animate-pulse" />
              </div>
              <p className="text-muted-foreground">
                © 2025 GoalMate. Empowering productivity through intelligent design.
              </p>
            </div>
          </footer>
        </div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    );
  };
