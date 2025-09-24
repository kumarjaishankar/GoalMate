import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ProductivityInsights } from '@/lib/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckCircle, Flame, Target } from 'lucide-react';

interface AnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  insights: ProductivityInsights | null;
}

const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#8B5CF6', '#10B981'];

const getTagline = (insights: ProductivityInsights | null): string => {
  if (!insights) return '';
  const rate = insights.completion_rate;
  const top = insights.most_productive_category;
  if (rate >= 80) return `Elite Execution: ${rate}% completion — unstoppable momentum in ${top}!`;
  if (rate >= 50) return `Solid strides: ${rate}% complete — keep stacking wins in ${top}.`;
  if (rate > 0) return `You're warming up: ${rate}% done — focus on ${top} to surge ahead.`;
  return `Let's kickstart progress — set a goal in ${top} and make the first move!`;
};

export const AnalyticsModal = ({ open, onClose, insights }: AnalyticsModalProps) => {
  const categoryData = insights ? Object.entries(insights.category_distribution).map(([name, value]) => ({ name, value })) : [];
  const priorityData = insights ? Object.entries(insights.priority_distribution).map(([name, value]) => ({ name, value })) : [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="gradient-text">Performance Analytics</DialogTitle>
        </DialogHeader>

        {!insights ? (
          <div className="text-sm text-muted-foreground">No insights available.</div>
        ) : (
          <div className="space-y-6">
            {/* Tagline */}
            <Card className="glass-card border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <Flame className="h-5 w-5 text-warning" />
                <p className="text-sm">{getTagline(insights)}</p>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-card border-0"><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground">Total Tasks</div><div className="text-2xl font-bold">{insights.total_tasks}</div></CardContent></Card>
              <Card className="glass-card border-0"><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground">Completed</div><div className="text-2xl font-bold flex items-center justify-center gap-1"><CheckCircle className="h-5 w-5 text-accent" />{insights.completed_tasks}</div></CardContent></Card>
              <Card className="glass-card border-0"><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground">Completion Rate</div><div className="text-2xl font-bold">{insights.completion_rate}%</div></CardContent></Card>
              <Card className="glass-card border-0"><CardContent className="p-4 text-center"><div className="text-xs text-muted-foreground">Score</div><div className="text-2xl font-bold">{insights.productivity_score}</div></CardContent></Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2"><Target className="h-4 w-4 text-primary" /><div className="font-medium">Category Distribution</div></div>
                  <div style={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2"><Target className="h-4 w-4 text-accent" /><div className="font-medium">Priority Mix</div></div>
                  <div style={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer>
                      <BarChart data={priorityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#22C55E" radius={[6,6,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            {insights.recommendations?.length > 0 && (
              <Card className="glass-card border-0">
                <CardContent className="p-4">
                  <div className="text-sm font-medium mb-2">Recommendations</div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {insights.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
