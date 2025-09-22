import React from 'react';
import { Card } from "../ui/card";
import { 
  FileText, 
  Download, 
  Users, 
  TrendingUp, 
  Globe,
  Calendar,
  BarChart3,
  PieChart
} from "lucide-react";

// Dummy analytics data for USA, UK, and Brazil
const regionalData = {
  usa: {
    name: 'United States',
    flag: '🇺🇸',
    totalDownloads: 45234,
    activeUsers: 12450,
    templatesUsed: 89,
    growth: '+15%',
    topTemplates: [
      { name: 'Email Templates', downloads: 8932, growth: '+12%' },
      { name: 'FDA Submission Guide', downloads: 6547, growth: '+8%' },
      { name: 'Conference Template', downloads: 5321, growth: '+23%' },
      { name: 'Regulatory Compliance', downloads: 4123, growth: '+5%' },
    ]
  },
  uk: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    totalDownloads: 28731,
    activeUsers: 8234,
    templatesUsed: 67,
    growth: '+11%',
    topTemplates: [
      { name: 'MHRA Submission Template', downloads: 5678, growth: '+18%' },
      { name: 'Email template', downloads: 4321, growth: '+9%' },
      { name: 'EU MDR Compliance', downloads: 3987, growth: '+14%' },
      { name: 'Patient Information Sheet', downloads: 2845, growth: '+7%' },
    ]
  },
  brazil: {
    name: 'Brazil',
    flag: '🇧🇷',
    totalDownloads: 19432,
    activeUsers: 5678,
    templatesUsed: 43,
    growth: '+28%',
    topTemplates: [
      { name: 'ANVISA Submission Guide', downloads: 3456, growth: '+35%' },
      { name: 'Clinical Protocol BR', downloads: 2987, growth: '+22%' },
      { name: 'Regulatory Framework', downloads: 2341, growth: '+19%' },
      { name: 'Product Registration', downloads: 1876, growth: '+41%' },
    ]
  }
};

const monthlyTrends = [
  { month: 'Jan', usa: 3200, uk: 2100, brazil: 1400 },
  { month: 'Feb', usa: 3800, uk: 2300, brazil: 1600 },
  { month: 'Mar', usa: 4200, uk: 2650, brazil: 1800 },
  { month: 'Apr', usa: 4600, uk: 2800, brazil: 2100 },
  { month: 'May', usa: 5100, uk: 3200, brazil: 2300 },
  { month: 'Jun', usa: 5500, uk: 3400, brazil: 2500 },
];

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  description?: string;
  region?: string;
  flag?: string;
}> = ({ title, value, change, changeType = 'neutral', icon: Icon, description, region, flag }) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-card border-border hover:shadow-elegant transition-smooth">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {flag && <span className="text-lg">{flag}</span>}
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

const RegionCard: React.FC<{ region: keyof typeof regionalData }> = ({ region }) => {
  const data = regionalData[region];
  
  return (
    <Card className="p-6 bg-gradient-card shadow-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{data.flag}</span>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{data.name}</h3>
          <p className="text-sm text-muted-foreground">Regional Performance</p>
        </div>
        <div className="ml-auto">
          <span className="text-sm font-medium text-green-600">{data.growth}</span>
        </div>
      </div>

      {/* Regional Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">{data.totalDownloads.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Downloads</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">{data.activeUsers.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Active Users</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-foreground">{data.templatesUsed}</div>
          <div className="text-xs text-muted-foreground">Templates</div>
        </div>
      </div>

      {/* Top Templates */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">Top Templates</h4>
        <div className="space-y-2">
          {data.topTemplates.map((template, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground truncate flex-1">{template.name}</span>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-foreground font-medium">{template.downloads.toLocaleString()}</span>
                <span className="text-green-600 text-xs">{template.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

const AnalyticsDashboard: React.FC = () => {
  const totalDownloads = Object.values(regionalData).reduce((sum, region) => sum + region.totalDownloads, 0);
  const totalUsers = Object.values(regionalData).reduce((sum, region) => sum + region.activeUsers, 0);
  const totalTemplates = Object.values(regionalData).reduce((sum, region) => sum + region.templatesUsed, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Global document usage and template performance metrics</p>
      </div>

      {/* Global Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Downloads"
          value={totalDownloads}
          change="+18%"
          changeType="positive"
          icon={Download}
          description="All regions combined"
        />
        <StatsCard
          title="Active Users"
          value={totalUsers}
          change="+12%"
          changeType="positive"
          icon={Users}
          description="Monthly active users"
        />
        <StatsCard
          title="Templates in Use"
          value={totalTemplates}
          change="+8%"
          changeType="positive"
          icon={FileText}
          description="Across all regions"
        />
        <StatsCard
          title="Avg. Engagement"
          value="87%"
          change="+5%"
          changeType="positive"
          icon={TrendingUp}
          description="User engagement rate"
        />
      </div>

      {/* Regional Performance */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">Regional Performance</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RegionCard region="usa" />
          <RegionCard region="uk" />
          <RegionCard region="brazil" />
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <Card className="p-6 bg-gradient-card shadow-card border-border">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Monthly Download Trends</h3>
        </div>
        
        <div className="space-y-4">
          {monthlyTrends.map((month, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 text-sm font-medium text-muted-foreground">{month.month}</div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                    style={{ width: `${(month.usa / 6000) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16">🇺🇸 {month.usa.toLocaleString()}</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    style={{ width: `${(month.uk / 4000) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16">🇬🇧 {month.uk.toLocaleString()}</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                    style={{ width: `${(month.brazil / 3000) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-16">🇧🇷 {month.brazil.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Usage Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card shadow-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Template Categories</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Regulatory Submissions</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="w-4/5 h-full bg-red-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-foreground">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Clinical Protocols</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="w-3/5 h-full bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-foreground">32%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Safety Reports</span>
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
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Usage Patterns</h3>
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
    </div>
  );
};

export default AnalyticsDashboard;