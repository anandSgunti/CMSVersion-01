import React, { useState } from "react";
import { FileText, Users, Eye, TrendingUp, BarChart3, Activity } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import AnalyticsDashboard from "../components/dashboard/AnalyticsDashboard";

// Mock data for dashboard - replace with real hooks later
const mockStats = {
  total: 156,
  published: 89,
  views: 12450,
  drafts: 23,
};

const recentContent = [
  { id: 1, title: "Email Template", status: "published", views: 1234, date: "2 hours ago" },
  { id: 2, title: "Regulatory Submission Guidelines", status: "draft", views: 0, date: "1 day ago" },
  { id: 3, title: "Patient Safety Report Framework", status: "published", views: 856, date: "3 days ago" },
  { id: 4, title: "FDA Compliance Checklist", status: "review", views: 0, date: "1 week ago" },
];

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  description?: string;
  loading?: boolean;
}> = ({ title, value, change, changeType = 'neutral', icon: Icon, description, loading = false }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card border-border animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card border-border hover:shadow-elegant transition-smooth">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-foreground">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {change && (
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [isLoading] = useState(false); // Set to false since we're using mock data

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's what's happening with your healthcare innovation platform.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'overview' ? 'default' : 'outline'}
                onClick={() => setActiveTab('overview')}
                className="h-9"
              >
                <Activity className="w-4 h-4 mr-2" />
                Overview
              </Button>
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'outline'}
                onClick={() => setActiveTab('analytics')}
                className="h-9"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>

          {activeTab === 'analytics' ? (
            <AnalyticsDashboard />
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Documents"
                  value={mockStats.total}
                  change="+12%"
                  changeType="positive"
                  icon={FileText}
                  description="Research documents"
                  loading={isLoading}
                />
                <StatsCard
                  title="Published Content"
                  value={mockStats.published}
                  change="+8%"
                  changeType="positive"
                  icon={Users}
                  description="Live documents"
                  loading={isLoading}
                />
                <StatsCard
                  title="Total Views"
                  value={mockStats.views.toLocaleString()}
                  change="+23%"
                  changeType="positive"
                  icon={Eye}
                  description="This month"
                  loading={isLoading}
                />
                <StatsCard
                  title="Drafts"
                  value={mockStats.drafts}
                  change="+5%"
                  changeType="neutral"
                  icon={TrendingUp}
                  description="In progress"
                  loading={isLoading}
                />
              </div>

              {/* Recent Content */}
              <Card className="p-6 bg-gradient-card shadow-card border-border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Recent Healthcare Documents</h2>
                  <button className="text-primary hover:text-primary-glow transition-smooth text-sm font-medium">
                    View All
                  </button>
                </div>
                
                <div className="overflow-hidden">
                  <div className="space-y-4">
                    {recentContent.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-background border border-border hover:shadow-card transition-smooth">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'published' ? 'bg-green-100 text-green-800' :
                              item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-muted-foreground text-sm">{item.views} views</span>
                            <span className="text-muted-foreground text-sm">{item.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-muted-foreground hover:text-primary transition-smooth">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Healthcare Innovation Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-card shadow-card border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Research Areas</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Email Templates</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="w-4/5 h-full bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Regulatory Compliance</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="w-3/5 h-full bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">32%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Paitent Reports</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="w-1/5 h-full bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-foreground">23%</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-card shadow-card border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Platform Activity</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Peak Usage Hours</span>
                        <span className="text-sm font-medium text-foreground">9 AM - 3 PM</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Highest activity during business hours</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Most Active Day</span>
                        <span className="text-sm font-medium text-foreground">Tuesday</span>
                      </div>
                      <div className="text-xs text-muted-foreground">38% higher usage than average</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Avg. Session Duration</span>
                        <span className="text-sm font-medium text-foreground">24 minutes</span>
                      </div>
                      <div className="text-xs text-muted-foreground">+12% increase from last month</div>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;