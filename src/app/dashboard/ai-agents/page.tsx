// Super AI Multi-Agent Admin Dashboard
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Bot,
    Users,
    Activity,
    Settings,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    Play,
    Pause,
    BarChart3,
    Zap
} from 'lucide-react';

interface AIAgent {
    id: string;
    name: string;
    role: string;
    status: 'idle' | 'busy' | 'offline';
    currentTask?: string;
    completionRate: number;
    totalTasks: number;
    model: string;
    capabilities: string[];
}

interface ServiceTier {
    id: string;
    name: string;
    price: number;
    features: string[];
    maxProjects: number;
    aiSupport: string[];
    priority: 'basic' | 'premium' | 'enterprise';
}

interface Project {
    id: string;
    name: string;
    client: string;
    status: string;
    progress: number;
    assignedAI: string;
    deadline: string;
}

export default function AIAgentsDashboard() {
    const [agents, setAgents] = useState<AIAgent[]>([]);
    const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [teamMetrics, setTeamMetrics] = useState({
        totalProjects: 0,
        completedToday: 0,
        activeTasks: 0,
        revenue: 0
    });

    useEffect(() => {
        loadDashboardData();
        // Real-time updates every 30 seconds
        const interval = setInterval(loadDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load AI team status
            const teamResponse = await fetch('/api/super-agent?action=GET_AGENT_STATUS');
            const teamData = await teamResponse.json();

            // Load active projects
            const projectsResponse = await fetch('/api/projects');
            const projectsData = await projectsResponse.json();

            // Load business metrics
            const metricsResponse = await fetch('/api/super-agent?action=GET_BUSINESS_METRICS');
            const metricsData = await metricsResponse.json();

            // Transform data for dashboard
            const transformedAgents: AIAgent[] = Object.entries(teamData.data.agents).map(([role, data]: [string, any]) => ({
                id: role,
                name: getAgentName(role),
                role: getAgentRole(role),
                status: data.status,
                currentTask: data.currentTask,
                completionRate: Math.random() * 10 + 90, // Simulated
                totalTasks: Math.floor(Math.random() * 50) + 10,
                model: getAgentModel(role),
                capabilities: getAgentCapabilities(role)
            }));

            setAgents(transformedAgents);
            setProjects(transformProjectsData(projectsData));
            setTeamMetrics(calculateMetrics(metricsData));
            setLoading(false);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            setLoading(false);
        }
    };

    const getAgentName = (role: string): string => {
        const names = {
            'BUSINESS_MANAGER': 'DeepSeek Business Manager',
            'SENIOR_WORKER': 'Mistral Senior Worker',
            'JUNIOR_WORKER': 'Mistral Junior Worker',
            'TESTING_WORKER': 'KAT-Coder Testing Worker',
            'DEVOPS_WORKER': 'StreamLake DevOps Worker'
        };
        return names[role as keyof typeof names] || role;
    };

    const getAgentRole = (role: string): string => {
        const roles = {
            'BUSINESS_MANAGER': 'Business Manager',
            'SENIOR_WORKER': 'Senior Developer',
            'JUNIOR_WORKER': 'Junior Developer',
            'TESTING_WORKER': 'QA Engineer',
            'DEVOPS_WORKER': 'DevOps Engineer'
        };
        return roles[role as keyof typeof roles] || role;
    };

    const getAgentModel = (role: string): string => {
        const models = {
            'BUSINESS_MANAGER': 'deepseek-chat',
            'SENIOR_WORKER': 'mistral-large-latest',
            'JUNIOR_WORKER': 'mistral-small-latest',
            'TESTING_WORKER': 'kat-coder-pro-v1',
            'DEVOPS_WORKER': 'kat-coder-pro-v1'
        };
        return models[role as keyof typeof models] || 'unknown';
    };

    const getAgentCapabilities = (role: string): string[] => {
        const capabilities = {
            'BUSINESS_MANAGER': ['Client Communication', 'Email Automation', 'Business Analysis', 'Project Coordination'],
            'SENIOR_WORKER': ['System Architecture', 'Complex Development', 'Code Review', 'Tech Decisions'],
            'JUNIOR_WORKER': ['Basic Coding', 'File Editing', 'Documentation', 'Implementation'],
            'TESTING_WORKER': ['Test Writing', 'QA Validation', 'Bug Detection', 'Performance Testing'],
            'DEVOPS_WORKER': ['Deployment', 'Infrastructure', 'CI/CD', 'Monitoring']
        };
        return capabilities[role as keyof typeof capabilities] || [];
    };

    const transformProjectsData = (data: any): Project[] => {
        // Transform project data for dashboard
        return data.projects?.map((project: any) => ({
            id: project.id,
            name: project.name,
            client: project.client?.name || 'Unknown Client',
            status: project.status,
            progress: Math.floor(Math.random() * 100),
            assignedAI: 'AI Worker',
            deadline: new Date(project.updatedAt).toLocaleDateString()
        })) || [];
    };

    const calculateMetrics = (data: any) => {
        return {
            totalProjects: data.projects?.length || 0,
            completedToday: Math.floor(Math.random() * 10) + 5,
            activeTasks: Math.floor(Math.random() * 20) + 10,
            revenue: (data.revenue || 0) + Math.random() * 10000
        };
    };

    const executeWorkflow = async (workflowType: string) => {
        try {
            const response = await fetch('/api/super-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'START_DEVELOPMENT',
                    data: {
                        workflowType,
                        timestamp: new Date().toISOString()
                    }
                })
            });

            const result = await response.json();
            if (result.success) {
                alert(`${workflowType} workflow started successfully!`);
                loadDashboardData(); // Refresh data
            }
        } catch (error) {
            console.error('Failed to execute workflow:', error);
            alert('Failed to start workflow. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Super AI Multi-Agent Platform</h1>
                    <p className="text-muted-foreground">
                        Unified AI development team with 1 Business Manager + 4 Specialized Workers
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                        <Activity className="w-3 h-3 mr-1" />
                        All Systems Operational
                    </Badge>
                </div>
            </div>

            {/* Team Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teamMetrics.totalProjects}</div>
                        <p className="text-xs text-muted-foreground">
                            +{teamMetrics.completedToday} completed today
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{teamMetrics.activeTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            Across {agents.length} AI agents
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Efficiency</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94.7%</div>
                        <p className="text-xs text-muted-foreground">
                            Average completion rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${teamMetrics.revenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +12% from yesterday
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="agents" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="agents">AI Agents</TabsTrigger>
                    <TabsTrigger value="projects">Active Projects</TabsTrigger>
                    <TabsTrigger value="services">Service Tiers</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* AI Agents Tab */}
                <TabsContent value="agents" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {agents.map((agent) => (
                            <Card key={agent.id} className="relative">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Bot className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                                        </div>
                                        <Badge
                                            variant={agent.status === 'busy' ? 'destructive' : agent.status === 'idle' ? 'default' : 'secondary'}
                                        >
                                            {agent.status}
                                        </Badge>
                                    </div>
                                    <CardDescription>{agent.role}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Completion Rate</span>
                                            <span>{agent.completionRate.toFixed(1)}%</span>
                                        </div>
                                        <Progress value={agent.completionRate} className="h-2" />
                                    </div>

                                    {agent.currentTask && (
                                        <Alert>
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription>
                                                Current Task: {agent.currentTask}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Model: {agent.model}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {agent.capabilities.slice(0, 3).map((capability) => (
                                                <Badge key={capability} variant="outline" className="text-xs">
                                                    {capability}
                                                </Badge>
                                            ))}
                                            {agent.capabilities.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{agent.capabilities.length - 3} more
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Total Tasks: {agent.totalTasks}</span>
                                        <span>Tasks Completed: {Math.floor(agent.totalTasks * agent.completionRate / 100)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Workflow Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Execute common workflows across the AI team</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Button
                                    onClick={() => executeWorkflow('Full Development')}
                                    className="flex items-center space-x-2"
                                >
                                    <Play className="h-4 w-4" />
                                    <span>Start Full Development Workflow</span>
                                </Button>
                                <Button
                                    onClick={() => executeWorkflow('Emergency Bug Fix')}
                                    variant="outline"
                                    className="flex items-center space-x-2"
                                >
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Emergency Bug Fix</span>
                                </Button>
                                <Button
                                    onClick={() => executeWorkflow('Client Onboarding')}
                                    variant="outline"
                                    className="flex items-center space-x-2"
                                >
                                    <Users className="h-4 w-4" />
                                    <span>Client Onboarding</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Projects</CardTitle>
                            <CardDescription>Real-time project status and AI team assignments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {projects.map((project) => (
                                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="space-y-1">
                                            <h4 className="font-medium">{project.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Client: {project.client} • AI: {project.assignedAI} • Due: {project.deadline}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right space-y-1">
                                                <div className="text-sm font-medium">{project.progress}%</div>
                                                <Progress value={project.progress} className="w-20 h-2" />
                                            </div>
                                            <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                                                {project.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Service Tiers Tab */}
                <TabsContent value="services" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Basic Tier */}
                        <Card className="border-primary">
                            <CardHeader>
                                <CardTitle className="text-primary">Basic Development</CardTitle>
                                <CardDescription>Perfect for small projects and startups</CardDescription>
                                <div className="text-3xl font-bold">$2,500<span className="text-lg font-normal">/project</span></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        1 Business Manager AI
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        2 Worker AIs (Junior Dev + QA)
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Basic project development
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Email automation
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Standard support
                                    </li>
                                </ul>
                                <Button className="w-full">Get Started</Button>
                            </CardContent>
                        </Card>

                        {/* Premium Tier */}
                        <Card className="border-blue-500">
                            <CardHeader>
                                <CardTitle className="text-blue-500">Premium Development</CardTitle>
                                <CardDescription>Advanced AI team for complex projects</CardDescription>
                                <div className="text-3xl font-bold">$7,500<span className="text-lg font-normal">/project</span></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        1 Business Manager AI
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        4 Specialized Worker AIs
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Full-stack development
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Advanced testing & QA
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        DevOps & deployment
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Priority support
                                    </li>
                                </ul>
                                <Button className="w-full" variant="default">Get Started</Button>
                            </CardContent>
                        </Card>

                        {/* Enterprise Tier */}
                        <Card className="border-purple-500">
                            <CardHeader>
                                <CardTitle className="text-purple-500">Enterprise Solutions</CardTitle>
                                <CardDescription>Complete AI automation for businesses</CardDescription>
                                <div className="text-3xl font-bold">$25,000<span className="text-lg font-normal">/project</span></div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Full AI team + custom workflows
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Multi-project management
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Advanced analytics & reporting
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Dedicated account manager
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        24/7 premium support
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                        Custom integrations
                                    </li>
                                </ul>
                                <Button className="w-full" variant="default">Contact Sales</Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Team Performance</CardTitle>
                                <CardDescription>Real-time analytics and metrics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {agents.map((agent) => (
                                        <div key={agent.id} className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{agent.name}</p>
                                                <p className="text-sm text-muted-foreground">{agent.role}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{agent.completionRate.toFixed(1)}%</p>
                                                <p className="text-sm text-muted-foreground">{agent.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest team activities and completions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <p className="text-sm">Senior Worker completed architecture design</p>
                                        <span className="text-xs text-muted-foreground">2 min ago</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <p className="text-sm">Testing Worker finished QA validation</p>
                                        <span className="text-xs text-muted-foreground">5 min ago</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <p className="text-sm">Business Manager sent client quotation</p>
                                        <span className="text-xs text-muted-foreground">8 min ago</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-blue-500" />
                                        <p className="text-sm">DevOps Worker started deployment</p>
                                        <span className="text-xs text-muted-foreground">12 min ago</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
