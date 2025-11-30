'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/header';
import AnomalyList from '@/components/anomalies/anomaly-list';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AnomalyAnalysis from '@/components/anomalies/anomaly-analysis';
import AddAnomalyDialog from '@/components/anomalies/add-anomaly-dialog';
import { anomalies } from '@/lib/mock-data';
import type { Anomaly } from '@/lib/types';

const severities: Anomaly['severity'][] = ['Low', 'Medium', 'High', 'Critical'];

export default function AlertsPage() {
  const [textFilter, setTextFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((anomaly) => {
      const matchesText =
        textFilter === '' ||
        anomaly.description.toLowerCase().includes(textFilter.toLowerCase()) ||
        anomaly.sourceIp.toLowerCase().includes(textFilter.toLowerCase());

      const matchesSeverity =
        severityFilter === 'all' || anomaly.severity === severityFilter;

      return matchesText && matchesSeverity;
    });
  }, [textFilter, severityFilter]);

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <Header
        title="Anomaly Alerts"
        description="Monitor, investigate, and analyze all detected anomalies."
      />
      <AnomalyAnalysis />
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Anomalies</CardTitle>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <Input
                placeholder="Filter by description or IP..."
                className="w-full sm:w-64"
                value={textFilter}
                onChange={(e) => setTextFilter(e.target.value)}
              />
              <Select
                value={severityFilter}
                onValueChange={setSeverityFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  {severities.map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {severity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AddAnomalyDialog />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnomalyList anomalies={filteredAnomalies} />
        </CardContent>
      </Card>
    </div>
  );
}
