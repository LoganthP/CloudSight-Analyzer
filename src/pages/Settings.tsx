import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
    const { user, login, updateProfile } = useAuth();
    const { toast } = useToast();

    // Local state for forms
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    // Sync local state with user context
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSaveProfile = () => {
        updateProfile({ name, email });
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved successfully.",
        });
    };

    const handleSwitchUser = (role: 'admin' | 'tester') => {
        login(role);
        toast({
            title: `Switched to ${role === 'admin' ? 'Admin' : 'Tester'}`,
            description: `You are now logged in as ${role === 'admin' ? 'Admin User' : 'Tester Account'}.`,
        });
    };

    // Mock Notifications State
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Critical Anomalies', desc: 'Immediate alerts for high-severity threats', email: true, push: true },
        { id: 2, title: 'System Health', desc: 'Weekly reports on infrastructure status', email: true, push: false },
        { id: 3, title: 'New Integrations', desc: 'When a new cloud provider is connected', email: false, push: true },
    ]);

    const handleToggleNotification = (id: number, type: 'email' | 'push') => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, [type]: !n[type] } : n
        ));
    };

    const saveNotifications = () => {
        toast({
            title: "Preferences Saved",
            description: "Your notification preferences have been updated.",
        });
    };

    // Mock Integrations State
    const [integrations, setIntegrations] = useState([
        { name: 'AWS', id: 'aws-account-1', status: 'Connected', icon: Cloud },
        { name: 'Azure', id: 'azure-sub-main', status: 'Connected', icon: Cloud },
        { name: 'GCP', id: '', status: 'Disconnected', icon: Cloud },
    ]);

    const toggleIntegration = (name: string) => {
        setIntegrations(integrations.map(int => {
            if (int.name === name) {
                const newStatus = int.status === 'Connected' ? 'Disconnected' : 'Connected';
                toast({
                    title: newStatus === 'Connected' ? 'Integration Connected' : 'Integration Disconnected',
                    description: `${name} has been ${newStatus.toLowerCase()}.`,
                });
                return { ...int, status: newStatus };
            }
            return int;
        }));
    };

    // Security
    const handleUpdatePassword = () => {
        toast({
            title: "Password Updated",
            description: "Your password has been changed successfully.",
        });
    };

    if (!user) return null;

    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account, notifications, and cloud integrations.
                </p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="integrations">Integrations</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Account Settings */}
                <TabsContent value="account" className="mt-6 space-y-6">
                    <Card className="glass-card border-none shadow-glass-md">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <div className="text-lg font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground capitalize">{user.role} Role</div>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <div className="flex gap-2">
                                    <Label className="text-sm text-muted-foreground self-center mr-2">Switch Account:</Label>
                                    <Button
                                        variant={user.role === 'admin' ? 'secondary' : 'outline'}
                                        size="sm"
                                        onClick={() => handleSwitchUser('admin')}
                                        disabled={user.role === 'admin'}
                                    >
                                        Admin
                                    </Button>
                                    <Button
                                        variant={user.role === 'tester' ? 'secondary' : 'outline'}
                                        size="sm"
                                        onClick={() => handleSwitchUser('tester')}
                                        disabled={user.role === 'tester'}
                                    >
                                        Tester
                                    </Button>
                                </div>
                                <Button onClick={handleSaveProfile}>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="mt-6 space-y-6">
                    <Card className="glass-card border-none shadow-glass-md">
                        <CardHeader>
                            <CardTitle>Alert Preferences</CardTitle>
                            <CardDescription>Configure how you receive security alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {notifications.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/20">
                                    <div className="space-y-0.5">
                                        <h4 className="font-medium text-sm">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={item.email}
                                                onCheckedChange={() => handleToggleNotification(item.id, 'email')}
                                            />
                                            <Label className="text-xs">Email</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={item.push}
                                                onCheckedChange={() => handleToggleNotification(item.id, 'push')}
                                            />
                                            <Label className="text-xs">Push</Label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end pt-2">
                                <Button onClick={saveNotifications} variant="outline">Save Preferences</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Integrations Settings */}
                <TabsContent value="integrations" className="mt-6 space-y-6">
                    <Card className="glass-card border-none shadow-glass-md">
                        <CardHeader>
                            <CardTitle>Cloud Providers</CardTitle>
                            <CardDescription>Manage your connected cloud environments.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {integrations.map((provider) => (
                                <div key={provider.name} className="flex items-center justify-between p-4 rounded-xl border border-border/40 bg-card/40">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${provider.status === 'Connected' ? 'bg-primary/10' : 'bg-muted'}`}>
                                            <provider.icon className={`h-5 w-5 ${provider.status === 'Connected' ? 'text-primary' : 'text-muted-foreground'}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{provider.name}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {provider.status === 'Connected' ? `ID: ${provider.id}` : 'Not configured'}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant={provider.status === 'Connected' ? 'outline' : 'default'}
                                        size="sm"
                                        onClick={() => toggleIntegration(provider.name)}
                                    >
                                        {provider.status === 'Connected' ? 'Disconnect' : 'Connect'}
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="mt-6 space-y-6">
                    <Card className="glass-card border-none shadow-glass-md">
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password and authentication methods.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new">New Password</Label>
                                <Input id="new" type="password" />
                            </div>
                            <div className="pt-4 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    <span>2FA is currently enabled</span>
                                </div>
                                <Button onClick={handleUpdatePassword}>Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
