import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import DashboardLayout from '@/layouts/DashboardLayout';

// Placeholder components for other routes with styled design
const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="p-8 rounded-3xl bg-card/50 backdrop-blur-lg border border-border/30 shadow-premium-lg">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-muted-foreground">This feature is coming soon.</p>
        </div>
    </div>
);

import Logs from '@/pages/Logs';
import Anomalies from '@/pages/Anomalies';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';

import { AuthProvider, useAuth } from '@/contexts/auth-context';

function RequireAuth({ children }: { children: JSX.Element }) {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <ThemeProvider defaultTheme="dark" storageKey="cloudsight-theme">
                    <Routes>
                        <Route path="/auth" element={<Auth />} />

                        <Route path="/" element={
                            <RequireAuth>
                                <DashboardLayout />
                            </RequireAuth>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="logs" element={<Logs />} />
                            <Route path="anomalies" element={<Anomalies />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
                        </Route>
                    </Routes>
                    <Toaster />
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
