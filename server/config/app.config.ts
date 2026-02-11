export const appConfig = {
    appName: 'CloudSight Analyzer',
    version: '1.0.0',
    modules: {
        aws: {
            enabled: true,
            label: 'AWS Ingestion',
        },
        azure: {
            enabled: true,
            label: 'Azure Ingestion',
        },
        gcp: {
            enabled: true,
            label: 'GCP Ingestion',
        },
        anomalyDetection: {
            enabled: true,
            label: 'Anomaly Detection',
        },
        visualization: {
            enabled: true,
            label: 'Visualization',
        },
    },
    api: {
        baseUrl: process.env.API_URL || '/api',
        timeout: 5000,
        retries: 3,
    },
};
