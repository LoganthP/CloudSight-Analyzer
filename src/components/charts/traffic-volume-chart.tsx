'use client';

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { TrafficData } from '@/lib/types';
import { generateTrafficData } from '@/lib/mock-data';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = {
  aws: { label: 'AWS', color: 'hsl(var(--chart-1))' },
  azure: { label: 'Azure', color: 'hsl(var(--chart-2))' },
  gcp: { label: 'GCP', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

export default function TrafficVolumeChart() {
  const data = useMemo(() => generateTrafficData(7), []);

  if (data.length === 0) {
    return <Skeleton className="h-[300px] w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="aws"
          type="natural"
          fill="var(--color-aws)"
          fillOpacity={0.4}
          stroke="var(--color-aws)"
          stackId="a"
        />
        <Area
          dataKey="azure"
          type="natural"
          fill="var(--color-azure)"
          fillOpacity={0.4}
          stroke="var(--color-azure)"
          stackId="a"
        />
        <Area
          dataKey="gcp"
          type="natural"
          fill="var(--color-gcp)"
          fillOpacity={0.4}
          stroke="var(--color-gcp)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
