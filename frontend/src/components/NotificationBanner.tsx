import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, X, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface NotificationBannerProps {
  email?: string;
  type: 'verification' | 'reset';
  onDismiss?: () => void;
}

export const NotificationBanner = ({ email, type, onDismiss }: NotificationBannerProps) => {
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  const handleResend = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      if (type === 'verification') {
        await apiClient.resendVerification(email);
        toast({
          title: "Verification Email Sent",
          description: "Please check your email for the verification link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend email",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const message = type === 'verification' 
    ? "Please check your email and click the verification link to activate your account."
    : "A password reset link has been sent to your email address.";

  return (
    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
      <Mail className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-blue-800 dark:text-blue-200">{message}</span>
        <div className="flex items-center gap-2 ml-4">
          {type === 'verification' && email && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={isResending}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {isResending ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Mail className="h-3 w-3 mr-1" />
              )}
              Resend
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-blue-600 hover:bg-blue-100 p-1"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};