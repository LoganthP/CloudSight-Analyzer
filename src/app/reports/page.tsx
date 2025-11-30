'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import TrafficVolumeChart from '@/components/charts/traffic-volume-chart';
import TrafficSourceChart from '@/components/charts/traffic-source-chart';
import AnomalyList from '@/components/anomalies/anomaly-list';
import { anomalies } from '@/lib/mock-data';

const availableMetrics = [
  { id: 'traffic_volume', label: 'Traffic Volume (AWS, Azure, GCP)' },
  { id: 'traffic_source', label: 'Traffic by Type' },
  { id: 'anomalies_detected', label: 'Anomalies Detected' },
];

export default function ReportsPage() {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleMetricChange = (metricId: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]
    );
  };

  const generateReport = () => {
    if (!date?.from || !date?.to || selectedMetrics.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Configuration Incomplete',
        description: 'Please select a date range and at least one metric.',
      });
      return;
    }
    setReportGenerated(true);
  };

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <Header
        title="Custom Reporting"
        description="Generate and view detailed traffic reports."
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Select your desired parameters.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, 'LLL dd, y')} -{' '}
                          {format(date.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(date.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={1}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Metrics</Label>
              <div className="space-y-3 rounded-md border p-4">
                {availableMetrics.map((metric) => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={metric.id}
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={() => handleMetricChange(metric.id)}
                    />
                    <Label htmlFor={metric.id} className="font-normal">
                      {metric.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={generateReport} className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generated Report</CardTitle>
          </CardHeader>
          <CardContent>
            {reportGenerated && date ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">
                    Network Traffic Report
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {date.from && format(date.from, 'PPP')} to{' '}
                    {date.to && format(date.to, 'PPP')}
                  </p>
                </div>
                <Separator />
                
                <div className="space-y-8">
                  {selectedMetrics.includes('traffic_volume') && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Traffic Volume</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TrafficVolumeChart />
                      </CardContent>
                    </Card>
                  )}
                  {selectedMetrics.includes('traffic_source') && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Traffic by Type</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TrafficSourceChart />
                      </CardContent>
                    </Card>
                  )}
                  {selectedMetrics.includes('anomalies_detected') && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Anomalies Detected</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AnomalyList anomalies={anomalies} />
                      </CardContent>
                    </Card>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12" />
                <p className="mt-4 max-w-sm">
                  Your generated report will appear here once you configure the
                  parameters and click "Generate Report".
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
