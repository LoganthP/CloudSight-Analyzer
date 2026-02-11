import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Anomaly } from '@/lib/types';
import { cn } from '@/lib/utils';
import { type VariantProps } from 'class-variance-authority';
import { badgeVariants } from '../ui/badge';

export const getSeverityBadge = (
  severity: Anomaly['severity']
): VariantProps<typeof badgeVariants>['variant'] => {
  switch (severity) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'secondary';
    case 'Low':
      return 'outline';
    default:
      return 'default';
  }
};

const getStatusClasses = (status: Anomaly['status']) => {
  switch (status) {
    case 'New':
      return 'bg-destructive/20 text-destructive-foreground';
    case 'Investigating':
      return 'bg-yellow-500/20 text-yellow-700';
    case 'Resolved':
      return 'bg-green-500/20 text-green-700';
  }
};

export default function AnomalyList({
  anomalies: displayAnomalies,
}: {
  anomalies: Anomaly[];
}) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Severity</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Source IP</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayAnomalies.map((anomaly) => (
            <TableRow key={anomaly.id}>
              <TableCell>
                <Badge variant={getSeverityBadge(anomaly.severity)}>
                  {anomaly.severity}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">
                {anomaly.timestamp}
              </TableCell>
              <TableCell>{anomaly.description}</TableCell>
              <TableCell className="font-mono text-xs">
                {anomaly.sourceIp}
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  className={cn('font-medium', getStatusClasses(anomaly.status))}
                >
                  {anomaly.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
