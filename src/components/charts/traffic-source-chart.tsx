
import { useMemo } from 'react';
import { Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { trafficSources } from '@/lib/mock-data';
import { ChartConfig } from '../ui/chart';

const chartConfig = {
  value: {
    label: 'Value',
  },
  ...trafficSources.reduce((acc: Record<string, any>, cur) => {
    acc[cur.name] = { label: cur.name, color: cur.fill };
    return acc;
  }, {}),
} satisfies ChartConfig;

export default function TrafficSourceChart({ provider = 'all' }: { provider?: string }) {
  // Simulate different data distributions based on provider
  const data = useMemo(() => {
    if (provider === 'aws') {
      return [
        { name: 'Web Traffic', value: 60, fill: 'hsl(var(--chart-1))' },
        { name: 'API Calls', value: 20, fill: 'hsl(var(--chart-2))' },
        { name: 'Database Queries', value: 10, fill: 'hsl(var(--chart-3))' },
        { name: 'Internal Services', value: 5, fill: 'hsl(var(--chart-4))' },
        { name: 'Other', value: 5, fill: 'hsl(var(--chart-5))' },
      ];
    }
    if (provider === 'azure') {
      return [
        { name: 'Web Traffic', value: 30, fill: 'hsl(var(--chart-1))' },
        { name: 'API Calls', value: 40, fill: 'hsl(var(--chart-2))' },
        { name: 'Database Queries', value: 20, fill: 'hsl(var(--chart-3))' },
        { name: 'Internal Services', value: 5, fill: 'hsl(var(--chart-4))' },
        { name: 'Other', value: 5, fill: 'hsl(var(--chart-5))' },
      ];
    }
    if (provider === 'gcp') {
      return [
        { name: 'Web Traffic', value: 20, fill: 'hsl(var(--chart-1))' },
        { name: 'API Calls', value: 30, fill: 'hsl(var(--chart-2))' },
        { name: 'Database Queries', value: 40, fill: 'hsl(var(--chart-3))' },
        { name: 'Internal Services', value: 5, fill: 'hsl(var(--chart-4))' },
        { name: 'Other', value: 5, fill: 'hsl(var(--chart-5))' },
      ];
    }
    return trafficSources;
  }, [provider]);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="60%"
          strokeWidth={5}
          stroke="hsl(var(--background))"
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
