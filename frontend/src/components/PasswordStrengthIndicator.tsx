import { apiClient } from '@/lib/api';

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export const PasswordStrengthIndicator = ({ password, className = '' }: PasswordStrengthIndicatorProps) => {
  const { score, feedback, color } = apiClient.checkPasswordStrength(password);
  
  if (!password) return null;
  
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Very Strong'];
  const strengthLabel = strengthLabels[score] || 'Very Weak';
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password Strength</span>
        <span className="text-sm font-medium" style={{ color }}>
          {strengthLabel}
        </span>
      </div>
      
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-2 flex-1 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: i <= score ? color : '#e5e7eb'
            }}
          />
        ))}
      </div>
      
      {feedback.length > 0 && (
        <div className="text-xs text-muted-foreground">
          Missing: {feedback.join(', ')}
        </div>
      )}
    </div>
  );
};