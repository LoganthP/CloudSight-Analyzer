import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Share2, Calendar, FileText, BarChart3, PieChart, Copy } from 'lucide-react';
import TrafficVolumeChart from '@/components/charts/traffic-volume-chart';
import TrafficSourceChart from '@/components/charts/traffic-source-chart';
import { useToast } from '@/hooks/use-toast';
import { triggerPrint } from '@/lib/export-utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Reports() {
    const [dateRange, setDateRange] = useState("30");
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [currentReport, setCurrentReport] = useState("");
    const { toast } = useToast();

    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Preparing your PDF report...",
        });
        setTimeout(() => {
            triggerPrint();
        }, 500);
    };

    const handleShare = (reportName: string) => {
        setCurrentReport(reportName);
        setShareDialogOpen(true);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`https://cloudsight.io/r/${Math.random().toString(36).substring(7)}`);
        toast({
            description: "Link copied to clipboard",
        });
    };

    const handleSendEmail = () => {
        setShareDialogOpen(false);
        toast({
            title: "Report Shared",
            description: `Invitation sent to recipient.`,
        });
    };

    return (
        <div className="space-y-8 animate-fade-in print:animate-none">
            {/* ... (previous JSX remains same, just update the Button onClick) ... */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold tracking-tight">Reports & Insights</h2>
                    <p className="text-muted-foreground">
                        Generate and export detailed analysis of your network traffic and security posture.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px]">
                            <Calendar className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 Days</SelectItem>
                            <SelectItem value="30">Last 30 Days</SelectItem>
                            <SelectItem value="90">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="gap-2" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* High-level Summary Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card shadow-glass-md border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ingestion</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dateRange === '7' ? '1.2 TB' : dateRange === '30' ? '4.2 TB' : '12.5 TB'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {dateRange === '7' ? '+5.2%' : dateRange === '30' ? '+20.1%' : '+15.3%'} from previous period
                        </p>
                        <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary w-[70%]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-glass-md border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dateRange === '7' ? '342' : dateRange === '30' ? '1,204' : '3,521'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            -4% from previous period
                        </p>
                        <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[95%]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-glass-md border-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cost Estimate</CardTitle>
                        <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dateRange === '7' ? '$580' : dateRange === '30' ? '$2,450' : '$7,120'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            projected for this period
                        </p>
                        <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[45%]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="glass-card shadow-premium-lg border-none col-span-2 md:col-span-1">
                    <CardHeader>
                        <CardTitle>Cross-Cloud Traffic Volume</CardTitle>
                        <CardDescription>Comparative analysis of network load across providers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <TrafficVolumeChart days={parseInt(dateRange)} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-card shadow-premium-lg border-none col-span-2 md:col-span-1">
                    <CardHeader>
                        <CardTitle>Protocol Distribution</CardTitle>
                        <CardDescription>Traffic breakdown by application layer protocols.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <TrafficSourceChart />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Scheduled Reports Section */}
            <Card className="glass-card shadow-glass-md border-none">
                <CardHeader>
                    <CardTitle>Scheduled Reports</CardTitle>
                    <CardDescription>Manage automated reporting delivery preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { name: 'Weekly Executive Summary', recipient: 'admin@cloudsight.io', freq: 'Every Monday, 9:00 AM', status: 'Active' },
                            { name: 'Daily Threat Analysis', recipient: 'security@cloudsight.io', freq: 'Daily, 8:00 AM', status: 'Active' },
                            { name: 'Monthly Compliance Report', recipient: 'audit@cloudsight.io', freq: '1st of month, 10:00 AM', status: 'Paused' }
                        ].map((report, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-muted/20 border border-border/20 rounded-xl">
                                <div>
                                    <h4 className="font-semibold text-sm">{report.name}</h4>
                                    <div className="text-xs text-muted-foreground mt-1 flex gap-3">
                                        <span>To: {report.recipient}</span>
                                        <span>•</span>
                                        <span>{report.freq}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${report.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {report.status.toUpperCase()}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleShare(report.name)}
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share Report</DialogTitle>
                        <DialogDescription>
                            Share <strong>{currentReport}</strong> with your team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">Link</Label>
                            <Input id="link" defaultValue="https://cloudsight.io/r/8x92ks" readOnly />
                        </div>
                        <Button type="button" size="sm" className="px-3" onClick={handleCopyLink}>
                            <span className="sr-only">Copy</span>
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" placeholder="colleague@example.com" />
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Close</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleSendEmail}>Send</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
