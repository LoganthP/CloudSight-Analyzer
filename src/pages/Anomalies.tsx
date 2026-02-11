import { useState } from 'react';
import { useAnomalies } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, ExternalLink, Loader2, Activity, Globe, Server, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

export default function Anomalies() {
    const { anomalies, isLoading } = useAnomalies();
    const [isScanning, setIsScanning] = useState(false);
    const [dismissedIds, setDismissedIds] = useState<string[]>([]);
    const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);
    const { toast } = useToast();

    const handleRunScan = () => {
        setIsScanning(true);
        toast({
            title: "Scan Initiated",
            description: "Running deep analysis across all connected cloud environments...",
        });

        setTimeout(() => {
            setIsScanning(false);
            toast({
                title: "Scan Complete",
                description: "Analysis finished. No new threats detected.",
            });
        }, 3000);
    };

    const handleResolve = (id: string) => {
        setDismissedIds(prev => [...prev, id]);
        toast({
            title: "Threat Resolved",
            description: "Security patch has been applied and threat neutralized.",
            variant: "default",
            className: "bg-green-500/10 border-green-500/20 text-green-500",
        });
    };

    const handleDismiss = (id: string) => {
        setDismissedIds(prev => [...prev, id]);
        toast({
            title: "Anomaly Dismissed",
            description: "Marked as false positive.",
        });
    };

    const handleViewDetails = (anomaly: any) => {
        setSelectedAnomaly(anomaly);
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'HIGH':
                return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">CRITICAL</Badge>;
            case 'MEDIUM':
                return <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">WARNING</Badge>;
            default:
                return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">INFO</Badge>;
        }
    };

    const filteredAnomalies = anomalies?.filter((a: any) => !dismissedIds.includes(a.id)) || [];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Anomaly Detection</h2>
                <p className="text-muted-foreground">
                    AI-driven threat detection and behavioral analysis across cloud environments.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card shadow-premium-lg border-none md:col-span-2">
                    <CardHeader className="border-b border-border/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Active Threats</CardTitle>
                                <CardDescription>Detected security events requiring immediate attention.</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRunScan}
                                disabled={isScanning}
                                className={isScanning ? "opacity-80" : ""}
                            >
                                {isScanning ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Scanning...
                                    </>
                                ) : (
                                    <>
                                        <ShieldAlert className="mr-2 h-4 w-4" />
                                        Run Scan
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow>
                                    <TableHead>Severity</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Detected</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading || isScanning ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <span>Running active threat analysis...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredAnomalies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CheckCircle className="h-8 w-8 text-green-500" />
                                                <span>No active threats detected. System is secure.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAnomalies.map((anomaly: any) => (
                                        <TableRow key={anomaly.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>{getSeverityBadge(anomaly.severity)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{anomaly.description}</span>
                                                    <span className="text-xs text-muted-foreground">Source: {anomaly.source_ip || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(anomaly.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-green-500 hover:bg-green-500/10 hover:text-green-600"
                                                        onClick={() => handleResolve(anomaly.id)}
                                                        title="Resolve Threat"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        onClick={() => handleDismiss(anomaly.id)}
                                                        title="Dismiss as False Positive"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-primary hover:bg-primary/10 hover:text-primary/80"
                                                        onClick={() => handleViewDetails(anomaly)}
                                                        title="View Details"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="glass-card shadow-premium-lg border-none h-fit">
                    <CardHeader>
                        <CardTitle>Threat Intelligence</CardTitle>
                        <CardDescription>Global security insights.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-sm text-primary">SSH Brute Force Spike</h4>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Increased activity detected from region: ap-southeast-1. Recommended to enforce key-based auth.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Attack Vectors</h4>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>Port Scanning</span>
                                    <span className="font-mono">45%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary/80 w-[45%]" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>SQL Injection</span>
                                    <span className="font-mono">28%</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary w-[28%]" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!selectedAnomaly} onOpenChange={(open) => !open && setSelectedAnomaly(null)}>
                <DialogContent className="sm:max-w-[600px] glass-card border-border/50">
                    {selectedAnomaly && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3">
                                    {getSeverityBadge(selectedAnomaly.severity)}
                                    <DialogTitle className="text-xl">{selectedAnomaly.description}</DialogTitle>
                                </div>
                                <DialogDescription className="text-base pt-2">
                                    Detailed incident report for security event ID: <span className="font-mono text-primary bg-primary/10 px-1 rounded">{selectedAnomaly.id.substring(0, 8)}</span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-6 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border/20">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Globe className="h-4 w-4" />
                                            <h4 className="text-sm font-medium">Source</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                            <span className="font-mono text-sm">{selectedAnomaly.source_ip || '192.168.1.105'}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Unknown External Device</p>
                                        <Badge variant="outline" className="text-[10px] mt-1">Geo: Unknown</Badge>
                                    </div>
                                    <div className="space-y-2 p-3 rounded-lg bg-muted/20 border border-border/20">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Server className="h-4 w-4" />
                                            <h4 className="text-sm font-medium">Target</h4>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                                            <span className="font-mono text-sm">10.0.5.24</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Production Database</p>
                                        <Badge variant="outline" className="text-[10px] mt-1">Service: PostgreSQL</Badge>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-primary" />
                                        Technical Analysis
                                    </h4>
                                    <div className="rounded-md border p-4 bg-black/20 font-mono text-xs space-y-1 text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span>Protocol:</span>
                                            <span className="text-foreground">TCP</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Port:</span>
                                            <span className="text-foreground">5432 (Database)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Payload Size:</span>
                                            <span className="text-foreground">2.4 KB (Abnormal)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Signature:</span>
                                            <span className="text-red-400">CVE-2024-XXXX-Exploit-Attempt</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-green-500" />
                                        Recommended Action
                                    </h4>
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-600 dark:text-green-400">
                                        <p>Immediate blocking of source IP suggested. Reset database credentials if successful connection logic observed.</p>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="sm:justify-between gap-2">
                                <span className="text-xs text-muted-foreground self-center">
                                    Detected: {new Date(selectedAnomaly.timestamp).toLocaleString()}
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="ghost" onClick={() => setSelectedAnomaly(null)}>Close</Button>
                                    <Button
                                        onClick={() => {
                                            handleResolve(selectedAnomaly.id);
                                            setSelectedAnomaly(null);
                                        }}
                                        className="bg-primary hover:bg-primary/90"
                                    >
                                        <ShieldAlert className="mr-2 h-4 w-4" />
                                        Resolve Threat
                                    </Button>
                                </div>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
