'use client';
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
  ...trafficSources.reduce((acc, cur) => {
    acc[cur.name] = { label: cur.name, color: cur.fill };
    return acc;
  }, {}),
} satisfies ChartConfig;

export default function TrafficSourceChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full max-h-[300px]"
    >
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={trafficSources}
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
