import { appConfig } from '../config/app.config.js';

export interface CloudLog {
    id: string;
    timestamp: string;
    source_ip: string;
    destination_ip: string;
    source_region: string;
    destination_region: string;
    protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS';
    action: 'ALLOW' | 'DENY';
    bytes: number;
    cloud_provider: 'AWS' | 'AZURE' | 'GCP';
}

export interface CloudServiceStatus {
    service: string;
    status: 'Connected' | 'Failed' | 'Disabled';
    latency?: number;
}

class CloudServiceManager {
    private static instance: CloudServiceManager;
    private logs: CloudLog[] = [];

    private constructor() {
        this.initializeMockData();
    }

    public static getInstance(): CloudServiceManager {
        if (!CloudServiceManager.instance) {
            CloudServiceManager.instance = new CloudServiceManager();
        }
        return CloudServiceManager.instance;
    }

    private initializeMockData() {
        const providers = ['AWS', 'AZURE', 'GCP'];
        const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS'];
        const actions = ['ALLOW', 'ALLOW', 'ALLOW', 'DENY'];
        const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];

        // Generate 200 initial logs
        this.logs = Array.from({ length: 200 }, (_, i) => ({
            id: `log-${Date.now()}-${i}`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(), // Last ~27 hours
            source_ip: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            destination_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            source_region: regions[Math.floor(Math.random() * regions.length)],
            destination_region: regions[Math.floor(Math.random() * regions.length)],
            protocol: protocols[Math.floor(Math.random() * protocols.length)] as any,
            action: actions[Math.floor(Math.random() * actions.length)] as any,
            bytes: Math.floor(Math.random() * 5000) + 100,
            cloud_provider: providers[Math.floor(Math.random() * providers.length)] as any,
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    public async checkConnection(service: 'aws' | 'azure' | 'gcp'): Promise<CloudServiceStatus> {
        // @ts-ignore
        if (!appConfig.modules[service].enabled) {
            return { service, status: 'Disabled' };
        }

        try {
            await this.simulateNetworkDelay(500);
            const isConnected = Math.random() > 0.05; // 95% success rate
            return {
                service,
                status: isConnected ? 'Connected' : 'Failed',
                latency: Math.floor(Math.random() * 150) + 20,
            };
        } catch (error) {
            return { service, status: 'Failed' };
        }
    }

    public async fetchLogs(
        service: 'aws' | 'azure' | 'gcp' | 'all',
        page: number = 1,
        limit: number = 50,
        startDate?: string,
        endDate?: string
    ): Promise<CloudLog[]> {
        await this.simulateNetworkDelay(300); // Reduce delay for snappier feel

        let filteredLogs = this.logs;

        // Filter by Provider
        if (service !== 'all') {
            filteredLogs = filteredLogs.filter(log => log.cloud_provider === service.toUpperCase());
        }

        // Filter by Date
        if (startDate && endDate) {
            const start = new Date(startDate).getTime();
            const end = new Date(endDate).getTime();
            if (!isNaN(start) && !isNaN(end)) {
                filteredLogs = filteredLogs.filter(log => {
                    const time = new Date(log.timestamp).getTime();
                    return time >= start && time <= end;
                });
            }
        }

        // Sort descending
        filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return filteredLogs.slice(startIndex, endIndex);
    }

    public async createLog(logData: Omit<CloudLog, 'id' | 'timestamp'>): Promise<CloudLog> {
        await this.simulateNetworkDelay(300);
        const newLog: CloudLog = {
            ...logData,
            id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString()
        };
        this.logs.unshift(newLog); // Add to top
        return newLog;
    }

    public async updateLog(id: string, updates: Partial<CloudLog>): Promise<CloudLog | null> {
        await this.simulateNetworkDelay(300);
        const index = this.logs.findIndex(l => l.id === id);
        if (index === -1) return null;

        this.logs[index] = { ...this.logs[index], ...updates };
        return this.logs[index];
    }

    public async deleteLog(id: string): Promise<boolean> {
        await this.simulateNetworkDelay(300);
        const initialLength = this.logs.length;
        this.logs = this.logs.filter(l => l.id !== id);
        return this.logs.length !== initialLength;
    }

    private simulateNetworkDelay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const cloudServiceManager = CloudServiceManager.getInstance();
