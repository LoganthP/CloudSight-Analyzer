import { appConfig } from '@/config/app.config';

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

    private constructor() { }

    public static getInstance(): CloudServiceManager {
        if (!CloudServiceManager.instance) {
            CloudServiceManager.instance = new CloudServiceManager();
        }
        return CloudServiceManager.instance;
    }

    public async checkConnection(service: 'aws' | 'azure' | 'gcp'): Promise<CloudServiceStatus> {
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

    public async fetchLogs(service: 'aws' | 'azure' | 'gcp' | 'all', _page: number = 1, limit: number = 50): Promise<CloudLog[]> {
        await this.simulateNetworkDelay(600);

        const providers = service === 'all' ? ['AWS', 'AZURE', 'GCP'] : [service.toUpperCase()];
        const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS'];
        const actions = ['ALLOW', 'ALLOW', 'ALLOW', 'DENY']; // 75% allow
        const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];

        return Array.from({ length: limit }, (_, i) => ({
            id: `log-${Date.now()}-${i}`,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
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

    private simulateNetworkDelay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export const cloudServiceManager = CloudServiceManager.getInstance();
