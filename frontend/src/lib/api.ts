// API Service Layer for GoalMate
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  due_date?: string;
  completed: boolean;
  priority: string;
  created_at?: string;
  updated_at?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  category: string;
  due_date?: string;
  priority?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  category?: string;
  due_date?: string;
  priority?: string;
  completed?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
}

export interface MessageResponse {
  message: string;
}

export interface ProductivityInsights {
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
  category_distribution: Record<string, number>;
  priority_distribution: Record<string, number>;
  most_productive_category: string;
  productivity_score: number;
  recommendations: string[];
}

export interface AISuggestions {
  enhanced_title: string;
  suggested_category: string;
  suggested_priority: string;
  estimated_time: number;
  task_breakdown: string[];
  ai_insights: string;
}

export interface ActivityData {
  date: string;
  count: number;
  level: number;
}

export interface ActivityAnalytics {
  current_streak: number;
  longest_streak: number;
  total_tasks: number;
  heatmap_data: ActivityData[];
  daily_goal: number;
  today_count: number;
}

// API Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private formatErrorDetail(detail: any): string {
    if (!detail) return 'Request failed';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      const parts = detail.map((d) => {
        if (typeof d === 'string') return d;
        if (d?.msg) return d.msg;
        if (d?.detail) return typeof d.detail === 'string' ? d.detail : JSON.stringify(d.detail);
        if (d?.loc) return `${(d.loc as any[]).join('.')}: ${d?.msg || 'invalid'}`;
        try { return JSON.stringify(d); } catch { return String(d); }
      });
      return parts.filter(Boolean).join(' • ');
    }
    try { return JSON.stringify(detail); } catch { return String(detail); }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as any).Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const body = await response.json();
        const detail = body?.detail ?? body;
        message = this.formatErrorDetail(detail);
      } catch {
        // ignore json parse error, keep default message
      }
      throw new Error(message);
    }

    return response.json();
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const body = await response.json();
        const detail = body?.detail ?? body;
        message = this.formatErrorDetail(detail);
      } catch {
        // ignore json parse error, keep default message
      }
      throw new Error(message);
    }

    const result = await response.json();
    this.token = result.access_token;
    localStorage.setItem('auth_token', result.access_token);
    return result;
  }

  async register(userData: RegisterRequest): Promise<MessageResponse> {
    return this.request<MessageResponse>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyEmail(token: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async forgotPassword(email: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  }

  async resendVerification(email: string): Promise<MessageResponse> {
    return this.request<MessageResponse>('/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return this.request<Task[]>('/tasks/');
  }

  async createTask(task: TaskCreate): Promise<Task> {
    return this.request<Task>('/tasks/', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: number, task: TaskUpdate): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(id: number): Promise<{ ok: boolean }> {
    return this.request<{ ok: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  async getTaskSummary(): Promise<{ total: number; completed: number; percent_completed: number }> {
    return this.request<{ total: number; completed: number; percent_completed: number }>('/tasks/summary');
  }

  // AI Features
  async enhanceTask(title: string, description: string = ''): Promise<AISuggestions> {
    return this.request<AISuggestions>('/ai/enhance-task', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  async getProductivityInsights(): Promise<ProductivityInsights> {
    return this.request<ProductivityInsights>('/ai/productivity-insights');
  }

  async getOfflineAIStatus(): Promise<any> {
    return this.request<any>('/ai/offline-status');
  }

  // Password Strength Checker
  checkPasswordStrength(password: string): { score: number; feedback: string[]; color: string } {
    let score = 0;
    const feedback: string[] = [];
    
    // Length scoring (more points for longer passwords)
    if (password.length >= 12) score += 3;
    else if (password.length >= 8) score += 2;
    else if (password.length >= 6) score += 1;
    else feedback.push('At least 8 characters');
    
    // Character type requirements
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('One lowercase letter');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('One uppercase letter');
    
    if (/\d/.test(password)) score += 1;
    else feedback.push('One number');
    
    if (/[^\w\s]/.test(password)) score += 1;
    else feedback.push('One special character');
    
    // Bonus points for complexity
    if (/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?-]/.test(password)) score += 1; // Strong special chars
    if ((password.match(/\d/g) || []).length >= 2) score += 1; // Multiple numbers
    if ((password.match(/[A-Z]/g) || []).length >= 2) score += 1; // Multiple uppercase
    if (password.length >= 16) score += 1; // Very long password
    
    // Convert to 0-4 scale for display
    let displayScore = 0;
    if (score >= 9) displayScore = 4; // Very Strong
    else if (score >= 7) displayScore = 3; // Strong  
    else if (score >= 5) displayScore = 2; // Good
    else if (score >= 3) displayScore = 1; // Fair
    else displayScore = 0; // Weak
    
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    return {
      score: displayScore,
      feedback,
      color: colors[displayScore] || colors[0]
    };
  }

  // User Profile
  async getProfile(): Promise<User> {
    return this.request<User>('/profile');
  }

  async updateProfile(profile: Partial<User>): Promise<User> {
    return this.request<User>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/change-password', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
  }

  // Analytics
  async getActivityAnalytics(): Promise<ActivityAnalytics> {
    return this.request<ActivityAnalytics>('/analytics/activity');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export const getCategoryColor = (category: string): string => {
  const colors = {
    work: 'bg-blue-100 text-blue-800',
    personal: 'bg-purple-100 text-purple-800',
    learning: 'bg-green-100 text-green-800',
    health: 'bg-red-100 text-red-800',
    planning: 'bg-yellow-100 text-yellow-800',
    finance: 'bg-emerald-100 text-emerald-800',
    travel: 'bg-indigo-100 text-indigo-800',
  } as const;
  return (colors as any)[category?.toLowerCase?.()] || 'bg-gray-100 text-gray-800';
};
