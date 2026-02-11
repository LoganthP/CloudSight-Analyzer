import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ShieldAlert, GitFork, Cloud, Server, Database, Bell } from 'lucide-react';
import TrafficVolumeChart from '@/components/charts/traffic-volume-chart';
import TrafficSourceChart from '@/components/charts/traffic-source-chart';
import { useAnomalies } from '@/hooks/use-dashboard-data';
import AnomalyList from '@/components/anomalies/anomaly-list';

export default function Dashboard() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentCloud = searchParams.get('cloud') || 'all';
    const { anomalies, isLoading: isLoadingAnomalies } = useAnomalies();

    const filteredStats = useMemo(() => {
        const baseStats = {
            flows: 1250,
            anomalies: 12,
            alerts: 8,
            score: 0.12
        };

        if (currentCloud === 'aws') {
            return { flows: 540, anomalies: 5, alerts: 3, score: 0.15 };
        }
        if (currentCloud === 'azure') {
            return { flows: 416, anomalies: 6, alerts: 4, score: 0.08 };
        }
        if (currentCloud === 'gcp') {
            return { flows: 294, anomalies: 1, alerts: 1, score: 0.05 };
        }
        return baseStats;
    }, [currentCloud]);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Security Overview</h2>
                <p className="text-muted-foreground">
                    Real-time network traffic analysis and anomaly detection for {currentCloud === 'all' ? 'all cloud environments' : `${currentCloud.toUpperCase()} infrastructure`}.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Total Flows", value: filteredStats.flows.toLocaleString(), icon: GitFork, description: `Active flows in ${currentCloud}` },
                    { title: "Anomalies", value: filteredStats.anomalies, icon: ShieldAlert, description: "High risk detections" },
                    { title: "Active Alerts", value: filteredStats.alerts, icon: Bell, description: "Requiring attention" },
                    { title: "Avg. Score", value: filteredStats.score, icon: Activity, description: "Current security health" },
                ].map((stat, i) => (
                    <Card key={i} className="glass-card hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{stat.title}</CardTitle>
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                <stat.icon className="h-4 w-4 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                            <p className="text-[11px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                                <span className="text-green-500 font-bold">↑ 12%</span> {stat.description}
                            </p>
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card border-none shadow-premium-lg">
                    <CardHeader className="border-b border-border/30 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Traffic Overview</CardTitle>
                                <CardDescription className="mt-1">
                                    Network ingestion volume across {currentCloud === 'all' ? 'active providers' : currentCloud.toUpperCase()}
                                </CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl h-9"
                                onClick={() => navigate('/reports')}
                            >
                                View Full Report
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[350px]">
                            <TrafficVolumeChart provider={currentCloud} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 glass-card border-none shadow-premium-lg">
                    <CardHeader className="border-b border-border/30 pb-6">
                        <CardTitle>Resource Distribution</CardTitle>
                        <CardDescription className="mt-1">By Protocol / Service utilization</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[350px]">
                            <TrafficSourceChart provider={currentCloud} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 glass-card border-none shadow-premium-lg overflow-hidden">
                    <CardHeader className="border-b border-border/30 pb-6 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Recent Anomalies</CardTitle>
                            <CardDescription className="mt-1">Latest security events requiring verification.</CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => navigate('/anomalies')}
                        >
                            See all
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoadingAnomalies ? (
                            <div className="flex flex-col items-center justify-center p-20 gap-4">
                                <Activity className="h-10 w-10 animate-spin text-primary/40" />
                                <p className="text-sm text-muted-foreground animate-pulse">Analyzing traffic patterns...</p>
                            </div>
                        ) : (
                            <div className="px-6 py-2">
                                <AnomalyList anomalies={anomalies || []} />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3 glass-card border-none shadow-premium-lg overflow-hidden">
                    <CardHeader className="border-b border-border/30 pb-6">
                        <CardTitle>System Connectivity</CardTitle>
                        <CardDescription className="mt-1">Cloud provider ingestion status.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {[
                            { name: 'aws', icon: Cloud, label: 'AWS CloudWatch' },
                            { name: 'azure', icon: Server, label: 'Azure Monitor' },
                            { name: 'gcp', icon: Database, label: 'GCP Operations' }
                        ].map((cloud) => (
                            <div key={cloud.name} className="group flex items-center justify-between p-4 bg-muted/30 border border-border/20 rounded-2xl hover:bg-muted/50 transition-all duration-200">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-background border border-border/30 group-hover:border-primary/30 transition-colors">
                                        <cloud.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold capitalize">{cloud.name}</span>
                                        <span className="text-[10px] text-muted-foreground">{cloud.label}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-slow-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Healthy</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
