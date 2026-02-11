import type { TrafficData, TrafficSource, Anomaly, CloudService } from './types';

export const generateTrafficData = (days = 7): TrafficData[] => {
  const data: TrafficData[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      aws: Math.floor(Math.random() * 2000) + 1000,
      azure: Math.floor(Math.random() * 1800) + 900,
      gcp: Math.floor(Math.random() * 1500) + 800,
    });
  }
  return data;
};

export const trafficSources: TrafficSource[] = [
  { name: 'Web Traffic', value: 45, fill: 'hsl(var(--chart-1))' },
  { name: 'API Calls', value: 25, fill: 'hsl(var(--chart-2))' },
  { name: 'Database Queries', value: 15, fill: 'hsl(var(--chart-3))' },
  { name: 'Internal Services', value: 10, fill: 'hsl(var(--chart-4))' },
  { name: 'Other', value: 5, fill: 'hsl(var(--chart-5))' },
];

export const anomalies: Anomaly[] = [
  { id: 'ANO-001', timestamp: '2024-07-29 14:30:15', severity: 'Critical', description: 'Unusual outbound traffic from production DB', sourceIp: '192.168.1.100', status: 'New' },
  { id: 'ANO-002', timestamp: '2024-07-29 11:05:42', severity: 'High', description: 'Multiple failed login attempts from unknown IP', sourceIp: '203.0.113.55', status: 'Investigating' },
  { id: 'ANO-003', timestamp: '2024-07-28 22:15:00', severity: 'Medium', description: 'Sudden spike in API error rates', sourceIp: 'N/A', status: 'Resolved' },
  { id: 'ANO-004', timestamp: '2024-07-28 18:45:23', severity: 'Low', description: 'DNS queries to a known malicious domain', sourceIp: '172.16.0.5', status: 'Resolved' },
  { id: 'ANO-005', timestamp: '2024-07-29 15:00:00', severity: 'Medium', description: 'Large data upload to unexpected S3 bucket', sourceIp: '10.0.0.23', status: 'New' },
  { id: 'ANO-006', timestamp: '2024-07-29 16:10:00', severity: 'High', description: 'Anomalous port scanning activity detected', sourceIp: '104.28.22.90', status: 'New' },
];

const totalAwsTraffic = generateTrafficData().reduce((acc, cur) => acc + cur.aws, 0);
const totalAzureTraffic = generateTrafficData().reduce((acc, cur) => acc + cur.azure, 0);
const totalGcpTraffic = generateTrafficData().reduce((acc, cur) => acc + cur.gcp, 0);

export const cloudServices: CloudService[] = [
    { name: 'AWS', status: 'Operational', traffic: totalAwsTraffic },
    { name: 'Azure', status: 'Degraded', traffic: totalAzureTraffic },
    { name: 'GCP', status: 'Operational', traffic: totalGcpTraffic },
];

export const currentRules = `
1. BLOCK all inbound traffic from IPs on the 'Threat-Intel-Feed-A' list.
2. ALERT on any outbound SSH connection from non-bastion hosts.
3. RATE-LIMIT API requests to /login to 5 attempts per minute per IP.
4. ALLOW inbound HTTPS traffic to all web servers.
`;
