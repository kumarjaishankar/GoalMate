import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { Typewriter } from '@/components/Typewriter';
import { Homepage } from '@/components/Homepage';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  // Show homepage for non-authenticated users
  if (!isAuthenticated) {
    return <Homepage />;
  }

  // Show dashboard for authenticated users
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            GoalMate
          </h1>
          <p className="text-muted-foreground">
            Your intelligent goal achievement
            {' '}
            <Typewriter
              words={[
                'companion',
                'assistant',
                'partner',
                'co‑pilot',
                'guide',
                'ally',
              ]}
              className="inline font-medium"
              typingSpeedMs={50}
              deletingSpeedMs={30}
              holdMs={600}
            />
          </p>
        </div>
        
        <div className="flex items-center gap-4 animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/20">
              <User className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
            <Button
              aria-label="Logout"
              variant="outline"
              size="sm"
              onClick={logout}
              className="bg-transparent border border-accent/40 hover:border-accent/80 hover:ring-1 hover:ring-accent/60 hover:bg-transparent transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Dashboard Content */}
      <Dashboard />

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="glass-card p-6 rounded-xl inline-block max-w-3xl">
          <p className="text-xl md:text-2xl font-semibold italic gradient-text">
            "In the space between curiosity and courage, progress finds its path."
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default Index;