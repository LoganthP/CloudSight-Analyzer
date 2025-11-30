export type TrafficData = {
  time: string;
  aws: number;
  azure: number;
  gcp: number;
};

export type TrafficSource = {
  name: string;
  value: number;
  fill: string;
};

export type Anomaly = {
  id: string;
  timestamp: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  sourceIp: string;
  status: 'New' | 'Investigating' | 'Resolved';
};

export type CloudService = {
  name: 'AWS' | 'Azure' | 'GCP';
  status: 'Operational' | 'Degraded' | 'Outage';
  traffic: number;
};
