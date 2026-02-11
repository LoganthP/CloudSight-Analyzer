import { Bell, Search, User, Moon, Sun, Cloud, Settings, LogOut, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { appConfig } from '@/config/app.config';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
    type: 'alert' | 'warning' | 'info';
    link: string;
}

export function Topbar() {
    const { setTheme, theme } = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentCloud = searchParams.get('cloud') || 'all';

    // Search State
    const [searchQuery, setSearchQuery] = useState('');

    // Notification State
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'High Latency Alert',
            description: 'US-East-1 region experiencing 300ms+ latency.',
            time: '2m ago',
            read: false,
            type: 'alert',
            link: '/anomalies'
        },
        {
            id: '2',
            title: 'New Anomaly Detected',
            description: 'Unusual traffic spike from IP 192.168.1.105.',
            time: '1h ago',
            read: false,
            type: 'warning',
            link: '/logs?search=192.168.1.105'
        },
        {
            id: '3',
            title: 'System Update',
            description: 'CloudSight Analyzer updated to v2.1.0.',
            time: '2h ago',
            read: true,
            type: 'info',
            link: '/settings'
        }
    ]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleCloudChange = (cloud: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (cloud === 'all') {
            newParams.delete('cloud');
        } else {
            newParams.set('cloud', cloud);
        }
        setSearchParams(newParams);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/logs?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const handleNotificationClick = (notification: Notification) => {
        // Mark as read
        setNotifications(notifications.map(n =>
            n.id === notification.id ? { ...n, read: true } : n
        ));
        // Navigate
        navigate(notification.link);
        setIsNotificationsOpen(false);
    };

    const enabledClouds = ['all', ...Object.keys(appConfig.modules).filter(
        (key) => ['aws', 'azure', 'gcp'].includes(key) && appConfig.modules[key as keyof typeof appConfig.modules].enabled
    )];

    const { logout, user } = useAuth();

    return (
        <header className="h-20 border-b border-border/30 bg-card/40 backdrop-blur-lg flex items-center justify-between px-8 sticky top-0 z-10 w-full transition-all duration-300">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-2xl border border-border/40 shadow-glass-sm">
                    {enabledClouds.map((cloud) => (
                        <Button
                            key={cloud}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCloudChange(cloud)}
                            className={cn(
                                "capitalize rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200",
                                currentCloud === cloud
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            )}
                        >
                            {cloud === 'all' && <Cloud className="mr-2 h-3.5 w-3.5" />}
                            {cloud}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="hidden lg:flex items-center gap-4 w-full max-w-md mx-8 group">
                <div className="relative w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                    <Input
                        type="search"
                        placeholder="Search infrastructure logs..."
                        className="w-full h-11 pl-10 bg-background/50 border-border/40 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 mr-2 bg-muted/20 p-1 rounded-xl border border-border/20">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-10 h-10 rounded-lg hover:bg-muted/60 transition-colors"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                        <Sun className="h-[1.1rem] w-[1.1rem] scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                    <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg relative hover:bg-muted/60 transition-colors">
                                <Bell className="h-[1.1rem] w-[1.1rem]" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-slow-pulse glow-cyan" />
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="end">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h4 className="font-semibold leading-none">Notifications</h4>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" title="Mark all as read" onClick={markAllRead}>
                                        <Check className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" title="Clear all" onClick={clearAllNotifications}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No notifications
                                    </div>
                                ) : (
                                    <div className="grid">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b last:border-0",
                                                    !notification.read && "bg-muted/20"
                                                )}
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                <div className={cn(
                                                    "h-2 w-2 mt-2 rounded-full",
                                                    notification.type === 'alert' ? "bg-destructive" :
                                                        notification.type === 'warning' ? "bg-yellow-500" : "bg-blue-500"
                                                )} />
                                                <div className="grid gap-1">
                                                    <p className={cn("text-sm font-medium", !notification.read && "font-bold")}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground text-pretty">
                                                        {notification.description}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground/70">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="h-8 w-[1px] bg-border/40 mx-1" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-all active:scale-95 focus:ring-2 focus:ring-primary/20">
                            <User className="h-4.5 w-4.5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name || 'Admin User'}</p>
                                <p className="text-xs leading-none text-muted-foreground capitalize">
                                    {user?.role || 'tester'}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => {
                                logout();
                                navigate('/auth');
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
