import AnomalyList from '@/components/anomalies/anomaly-list';
import TrafficSourceChart from '@/components/charts/traffic-source-chart';
import TrafficVolumeChart from '@/components/charts/traffic-volume-chart';
import Header from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cloudServices, anomalies, currentRules } from '@/lib/mock-data';
import type { CloudService } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  BarChart,
  Cloud,
  PieChart,
  Shield,
  ShieldCheck,
  GitFork,
  ShieldAlert,
  Users,
  Activity,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  Icon: LucideIcon;
}

const StatCard = ({ title, value, description, Icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const ServiceStatusCard = ({ service }: { service: CloudService }) => {
  const getStatusIndicator = (status: CloudService['status']) => {
    switch (status) {
      case 'Operational':
        return 'bg-green-500';
      case 'Degraded':
        return 'bg-yellow-500';
      case 'Outage':
        return 'bg-destructive';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
        <Cloud className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full', getStatusIndicator(service.status))}></span>
          <p className="text-2xl font-bold">{service.status}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {(service.traffic / 1000).toFixed(1)}k avg requests
        </p>
      </CardContent>
    </Card>
  );
};

export default function DashboardPage() {
  const overallStatus = 'All Systems Operational';
  const overallStatusColor = 'bg-green-500';

  const statCards: StatCardProps[] = [
    {
      title: 'Total Flows',
      value: '50',
      description: 'Last 24 hours',
      Icon: GitFork,
    },
    {
      title: 'Anomalies Detected',
      value: '7',
      description: '14.0% of total traffic',
      Icon: ShieldAlert,
    },
    {
      title: 'Active Alerts',
      value: '7',
      description: 'Across all severities',
      Icon: Users,
    },
    {
      title: 'Avg. Anomaly Score',
      value: '0.275',
      description: 'Lower is better',
      Icon: Activity,
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <Header title="Dashboard" description="Overview of your cloud network traffic." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/80 to-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
            Overall System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className={cn('h-3 w-3 rounded-full', overallStatusColor)}></span>
            <p className="text-3xl font-bold text-primary-foreground">{overallStatus}</p>
          </div>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Real-time health check across all integrated services.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cloudServices.map((service) => (
          <ServiceStatusCard key={service.name} service={service} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Traffic Volume
            </CardTitle>
            <CardDescription>Last 7 days of traffic across providers.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficVolumeChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Traffic by Type
            </CardTitle>
            <CardDescription>Breakdown of network traffic types.</CardDescription>
          </CardHeader>
          <CardContent>
            <TrafficSourceChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Ruleset
            </CardTitle>
            <CardDescription>A summary of active detection rules.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-code text-xs">
              {currentRules.trim()}
            </pre>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Recent Anomalies
          </CardTitle>
          <CardDescription>Top 5 most recent high-priority anomalies detected.</CardDescription>
        </CardHeader>
        <CardContent>
          <AnomalyList anomalies={anomalies.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
}
