import express from 'express';
import cors from 'cors';
import { appConfig } from './config/app.config.js';
import { cloudServiceManager } from './services/cloud-service.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes

// Get Logs
app.get('/api/logs/:provider', async (req, res) => {
    const { provider } = req.params;
    const page = parseInt(req.query.page as string || '1');
    const limit = parseInt(req.query.limit as string || '50');

    if (provider !== 'all' && !['aws', 'azure', 'gcp'].includes(provider)) {
        return res.status(400).json({ error: 'Invalid provider' });
    }

    // @ts-ignore
    if (provider !== 'all' && !appConfig.modules[provider]?.enabled) {
        return res.status(403).json({ error: `Module ${provider} is disabled` });
    }

    try {
        const logs = await cloudServiceManager.fetchLogs(
            provider as any,
            page,
            limit,
            req.query.from as string,
            req.query.to as string
        );
        res.json({
            data: logs,
            meta: { page, limit, provider }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Create Log
app.post('/api/logs', async (req, res) => {
    try {
        const newLog = await cloudServiceManager.createLog(req.body);
        res.status(201).json({ data: newLog });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create log' });
    }
});

// Update Log
app.put('/api/logs/:id', async (req, res) => {
    try {
        const updatedLog = await cloudServiceManager.updateLog(req.params.id, req.body);
        if (!updatedLog) {
            return res.status(404).json({ error: 'Log not found' });
        }
        res.json({ data: updatedLog });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update log' });
    }
});

// Delete Log
app.delete('/api/logs/:id', async (req, res) => {
    try {
        const success = await cloudServiceManager.deleteLog(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Log not found' });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete log' });
    }
});

// Get Anomalies
app.get('/api/anomalies', async (req, res) => {
    if (!appConfig.modules.anomalyDetection.enabled) {
        return res.status(403).json({ error: 'Anomaly detection module is disabled' });
    }

    // Simulate async processing
    await new Promise((resolve) => setTimeout(resolve, 600));

    const anomalies = [
        { id: '1', severity: 'HIGH', description: 'Unusual outbound traffic detected', timestamp: new Date().toISOString() },
        { id: '2', severity: 'MEDIUM', description: 'Repeated login failures', timestamp: new Date().toISOString() },
    ];

    res.json({ data: anomalies });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: appConfig.version });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
