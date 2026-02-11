import { useState } from 'react';
import { useLogs } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Cloud, Search, Filter, RefreshCcw, FileJson, AlertTriangle, Download, Plus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { downloadCSV } from '@/lib/export-utils';

import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from "react-day-picker";
import { LogDialog, LogFormValues } from '@/components/log-dialog';
import { CloudLog } from '@/lib/cloud-service'; // Assuming type is here, matching hook import
import { useToast } from '@/hooks/use-toast';

export default function Logs() {
    const [provider, setProvider] = useState<string>('all');
    const [severity, setSeverity] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<CloudLog | null>(null);

    const { toast } = useToast();

    // Pass ISO strings to hook if date range is selected
    const { logs, isLoading, mutate } = useLogs(
        provider,
        1,
        50,
        date?.from?.toISOString(),
        date?.to?.toISOString()
    );

    // Filter logs client-side for search and severity
    const filteredLogs = logs?.filter(log => {
        const matchesSearch =
            log.source_ip.includes(search) ||
            log.destination_ip.includes(search) ||
            log.action.toLowerCase().includes(search.toLowerCase());
        const matchesSeverity = severity === 'all' || log.action.toUpperCase() === severity;
        return matchesSearch && matchesSeverity;
    }) || [];

    const getSeverityColor = (action: string) => {
        switch (action.toUpperCase()) {
            case 'DENY': return 'destructive'; // High severity/blocked
            case 'ALLOW': return 'default';    // Normal traffic
            default: return 'secondary';
        }
    };

    const handleExport = () => {
        if (filteredLogs.length > 0) {
            downloadCSV(filteredLogs, `traffic-logs-${new Date().toISOString().split('T')[0]}`);
        }
    };

    const handleCreate = async (values: LogFormValues) => {
        try {
            const response = await fetch('/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error('Failed to create log');

            await mutate();
            toast({ title: 'Event Created', description: 'Network traffic event logged successfully.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to create event.' });
        }
    };

    const handleUpdate = async (values: LogFormValues) => {
        if (!editingLog) return;
        try {
            const response = await fetch(`/api/logs/${editingLog.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error('Failed to update log');

            await mutate();
            toast({ title: 'Event Updated', description: 'Network traffic event updated successfully.' });
            setEditingLog(null);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update event.' });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/logs/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete log');

            await mutate();
            toast({ title: 'Event Deleted', description: 'Network traffic event removed.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete event.' });
        }
    };

    const openCreateDialog = () => {
        setEditingLog(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (log: CloudLog) => {
        setEditingLog(log);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Traffic Logs</h2>
                <p className="text-muted-foreground">
                    Comprehensive log analysis across all cloud providers.
                </p>
            </div>

            <Card className="glass-card shadow-premium-lg border-none">
                <CardHeader className="border-b border-border/30 pb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div className="flex flex-col gap-1">
                            <CardTitle>Network Traffic Events</CardTitle>
                            <CardDescription>
                                Real-time ingestion from AWS CloudWatch, Azure Monitor, and GCP Operations.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={openCreateDialog} size="sm" className="h-9 gap-2">
                                <Plus className="h-3.5 w-3.5" />
                                Add Event
                            </Button>
                            <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => mutate()}>
                                <RefreshCcw className="h-3.5 w-3.5" />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 gap-2"
                                onClick={handleExport}
                                disabled={isLoading || filteredLogs.length === 0}
                            >
                                <Download className="h-3.5 w-3.5" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {/* Filters Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 rounded-xl bg-muted/20 border border-border/30">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search IP, Protocol, or Status..."
                                className="pl-9 bg-background/50 border-input/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <DatePickerWithRange date={date} setDate={setDate} />
                            <div className="h-8 w-px bg-border/50 mx-2" />
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={provider} onValueChange={setProvider}>
                                <SelectTrigger className="w-[140px] bg-background/50 border-input/50">
                                    <SelectValue placeholder="Provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Providers</SelectItem>
                                    <SelectItem value="aws">AWS</SelectItem>
                                    <SelectItem value="azure">Azure</SelectItem>
                                    <SelectItem value="gcp">GCP</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={severity} onValueChange={setSeverity}>
                                <SelectTrigger className="w-[140px] bg-background/50 border-input/50">
                                    <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Actions</SelectItem>
                                    <SelectItem value="ALLOW">Allow</SelectItem>
                                    <SelectItem value="DENY">Deny</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="rounded-xl border border-border/30 overflow-hidden bg-background/30">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[180px]">Timestamp</TableHead>
                                    <TableHead>Source</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead className="w-[100px]">Protocol</TableHead>
                                    <TableHead className="w-[100px]">Action</TableHead>
                                    <TableHead className="text-right">Size (Bytes)</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-4 w-12 bg-muted rounded animate-pulse" /></TableCell>
                                            <TableCell><div className="h-6 w-16 bg-muted rounded-full animate-pulse" /></TableCell>
                                            <TableCell className="text-right"><div className="h-4 w-12 bg-muted rounded animate-pulse ml-auto" /></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground gap-3">
                                                <div className="p-4 rounded-full bg-muted/30">
                                                    <AlertTriangle className="h-8 w-8 opacity-50" />
                                                </div>
                                                <p>No logs found matching your filters.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="hover:bg-muted/30 transition-colors cursor-pointer group">
                                            <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-sm">{log.source_ip}</span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Cloud className="h-3 w-3" /> {log.source_region}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-mono text-sm">{log.destination_ip}</span>
                                                    <span className="text-[10px] text-muted-foreground">{log.destination_region}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono text-[10px] tracking-widest uppercase">
                                                    {log.protocol}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getSeverityColor(log.action)}>
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm">
                                                {log.bytes.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(log)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(log.id)} className="text-destructive focus:text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!isLoading && filteredLogs.length > 0 && (
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground px-2">
                            <span>Showing {filteredLogs.length} events</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled>Previous</Button>
                                <Button variant="outline" size="sm" disabled>Next</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <LogDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={editingLog}
                onSubmit={editingLog ? handleUpdate : handleCreate}
            />
        </div>
    );
}
