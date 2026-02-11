import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    ShieldAlert,
    Settings,
    Activity,
    List
} from 'lucide-react';
import { appConfig } from '@/config/app.config';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, enabled: true },
    { href: '/logs', label: 'Traffic Logs', icon: List, enabled: true },
    { href: '/anomalies', label: 'Anomalies', icon: ShieldAlert, enabled: appConfig.modules.anomalyDetection.enabled },
    { href: '/reports', label: 'Reports', icon: FileText, enabled: appConfig.modules.visualization.enabled },
    { href: '/settings', label: 'Settings', icon: Settings, enabled: true },
];

export function Sidebar({ className }: { className?: string }) {
    const { pathname } = useLocation();

    return (
        <aside className={cn(
            'w-64 h-screen bg-card/60 backdrop-blur-xl border-r border-border/50 fixed left-0 top-0 overflow-y-auto hidden md:flex flex-col z-20 transition-all duration-300',
            className
        )}>
            <div className="p-8 border-b border-border/30">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                    <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors glow-cyan">
                        <Activity className="text-primary w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        CloudSight
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-6 space-y-1.5 child-transition">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-4 mb-4">
                    Monitoring
                </p>
                {navItems.filter(i => i.enabled).map((item) => (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            'group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden',
                            pathname === item.href
                                ? 'bg-primary/10 text-primary shadow-glass-sm'
                                : 'text-muted-foreground/80 hover:bg-muted/50 hover:text-foreground'
                        )}
                    >
                        {pathname === item.href && (
                            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />
                        )}
                        <item.icon className={cn(
                            "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                            pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )} />
                        {item.label}
                    </Link>
                ))}
            </nav>

        </aside>
    );
}
