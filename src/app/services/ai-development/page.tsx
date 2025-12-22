// AI Development Services - Client-Facing Platform
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Bot,
    Users,
    Zap,
    CheckCircle,
    Star,
    Clock,
    DollarSign,
    Shield,
    TrendingUp,
    MessageCircle,
    Send,
    Sparkles,
    Code,
    TestTube,
    Rocket,
    BarChart3
} from 'lucide-react';

interface ServiceTier {
    id: string;
    name: string;
    price: number;
    features: string[];
    aiSupport: string[];
    timeline: string;
    priority: 'basic' | 'premium' | 'enterprise';
    description: string;
}

interface ProjectRequest {
    name: string;
    email: string;
    company?: string;
    projectType: string;
    description: string;
    budget: string;
    timeline: string;
    requirements: string;
}

export default function AIDevelopmentServices() {
    const [selectedTier, setSelectedTier] = useState<string>('premium');
    const [projectRequest, setProjectRequest] = useState<ProjectRequest>({
        name: '',
        email: '',
        company: '',
        projectType: '',
        description: '',
        budget: '',
        timeline: '',
        requirements: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const serviceTiers: ServiceTier[] = [
        {
            id: 'basic',
            name: 'Basic AI Development',
            price: 2500,
            description: 'Perfect for startups and small businesses',
            features: [
                'Business Manager AI for coordination',
                'Junior Developer AI for implementation',
                'QA Testing AI for quality assurance',
                'Basic project management',
                'Email automation',
                'Standard support'
            ],
            aiSupport: ['Business Manager', 'Junior Dev', 'QA Tester'],
            timeline: '2-4 weeks',
            priority: 'basic'
        },
        {
            id: 'premium',
            name: 'Premium AI Development',
            price: 7500,
            description: 'Advanced AI team for complex projects',
            features: [
                'Complete AI team (5 specialists)',
                'Senior Developer AI for architecture',
                'Advanced DevOps AI for deployment',
                'Full-stack development',
                'Priority support',
                'Real-time project tracking'
            ],
            aiSupport: ['Business Manager', 'Senior Dev', 'Junior Dev', 'QA Tester', 'DevOps'],
            timeline: '4-8 weeks',
            priority: 'premium'
        },
        {
            id: 'enterprise',
            name: 'Enterprise AI Solutions',
            price: 25000,
            description: 'Complete AI automation for businesses',
            features: [
                'Full AI team + custom workflows',
                'Multi-project management',
                'Advanced analytics & reporting',
                'Dedicated account manager',
                '24/7 premium support',
                'Custom integrations'
            ],
            aiSupport: ['All AI Team + Custom', 'Analytics AI', 'Integration AI'],
            timeline: '8-16 weeks',
            priority: 'enterprise'
        }
    ];

    const handleInputChange = (field: keyof ProjectRequest, value: string) => {
        setProjectRequest(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmitRequest = async () => {
        setIsSubmitting(true);

        try {
            // Submit to Super Agent API
            const response = await fetch('/api/super-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'CREATE_CLIENT',
                    data: {
                        ...projectRequest,
                        selectedTier,
                        source: 'website',
                        timestamp: new Date().toISOString()
                    }
                })
            });

            if (response.ok) {
                setShowSuccess(true);
                setProjectRequest({
                    name: '',
                    email: '',
                    company: '',
                    projectType: '',
                    description: '',
                    budget: '',
                    timeline: '',
                    requirements: ''
                });
            }
        } catch (error) {
            console.error('Failed to submit request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedTierData = serviceTiers.find(tier => tier.id === selectedTier);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-12">
                <div className="text-center space-y-6 mb-16">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Sparkles className="h-8 w-8 text-blue-600" />
                        <Badge variant="outline" className="text-blue-600 border-blue-600 px-3 py-1">
                            World's First AI Development Team
                        </Badge>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        AI-Powered Development
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the future of software development with our revolutionary Multi-AI team.
                        1 Business Manager + 4 Specialized Workers delivering enterprise-grade solutions 10x faster.
                    </p>

                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>94.7% Success Rate</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>24/7 Development</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-purple-500" />
                            <span>Enterprise Security</span>
                        </div>
                    </div>
                </div>

                {/* AI Team Showcase */}
                <Card className="mb-16 border-none shadow-xl bg-white/80 backdrop-blur">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Meet Your AI Development Team</CardTitle>
                        <CardDescription>Five specialized AI agents working in perfect harmony</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-semibold">Business Manager</h3>
                                <p className="text-sm text-gray-600">Client communication & coordination</p>
                                <Badge variant="secondary" className="text-xs">DeepSeek AI</Badge>
                            </div>

                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                                    <Code className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-semibold">Senior Developer</h3>
                                <p className="text-sm text-gray-600">Architecture & complex development</p>
                                <Badge variant="secondary" className="text-xs">Mistral Large</Badge>
                            </div>

                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                                    <Code className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-semibold">Junior Developer</h3>
                                <p className="text-sm text-gray-600">Implementation & coding</p>
                                <Badge variant="secondary" className="text-xs">Mistral Small</Badge>
                            </div>

                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                                    <TestTube className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-semibold">QA Engineer</h3>
                                <p className="text-sm text-gray-600">Testing & quality assurance</p>
                                <Badge variant="secondary" className="text-xs">KAT-Coder AI</Badge>
                            </div>

                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                                    <Rocket className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="font-semibold">DevOps Engineer</h3>
                                <p className="text-sm text-gray-600">Deployment & infrastructure</p>
                                <Badge variant="secondary" className="text-xs">StreamLake AI</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Service Tiers */}
                <Tabs value={selectedTier} onValueChange={setSelectedTier} className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Choose Your AI Development Plan</h2>
                        <p className="text-gray-600">Transparent pricing with no hidden fees</p>
                    </div>

                    <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="premium">Premium</TabsTrigger>
                        <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                    </TabsList>

                    {serviceTiers.map((tier) => (
                        <TabsContent key={tier.id} value={tier.id} className="space-y-6">
                            <Card className={`${tier.priority === 'premium' ? 'border-blue-500 shadow-xl' : ''} transition-all duration-300`}>
                                <CardHeader className="text-center">
                                    <div className="flex items-center justify-center space-x-2 mb-2">
                                        <CardTitle className="text-2xl">{tier.name}</CardTitle>
                                        {tier.priority === 'premium' && (
                                            <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                                        )}
                                    </div>
                                    <CardDescription className="text-lg">{tier.description}</CardDescription>
                                    <div className="text-4xl font-bold">
                                        ${tier.price.toLocaleString()}
                                        <span className="text-lg font-normal text-gray-500">/project</span>
                                    </div>
                                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{tier.timeline}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Bot className="h-4 w-4" />
                                            <span>{tier.aiSupport.length} AI Specialists</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold mb-3">What's Included:</h4>
                                        <ul className="space-y-2">
                                            {tier.features.map((feature, index) => (
                                                <li key={index} className="flex items-center space-x-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">AI Team Support:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {tier.aiSupport.map((ai, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {ai}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        className={`w-full ${tier.priority === 'premium' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                        size="lg"
                                    >
                                        Get Started with {tier.name}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>

                {/* Project Request Form */}
                <Card className="mt-16 border-none shadow-xl bg-white/80 backdrop-blur">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">Start Your AI Development Project</CardTitle>
                        <CardDescription>Tell us about your project and get a custom quote</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {showSuccess && (
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    Thank you! Your project request has been submitted. Our AI Business Manager will contact you within 24 hours.
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name *</label>
                                <Input
                                    placeholder="Your full name"
                                    value={projectRequest.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email *</label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={projectRequest.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company</label>
                                <Input
                                    placeholder="Your company name"
                                    value={projectRequest.company}
                                    onChange={(e) => handleInputChange('company', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Type *</label>
                                <Input
                                    placeholder="e.g., Web App, Mobile App, API"
                                    value={projectRequest.projectType}
                                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Budget Range</label>
                                <Input
                                    placeholder="e.g., $5,000 - $10,000"
                                    value={projectRequest.budget}
                                    onChange={(e) => handleInputChange('budget', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Timeline</label>
                                <Input
                                    placeholder="e.g., 4-6 weeks"
                                    value={projectRequest.timeline}
                                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Project Description *</label>
                            <Textarea
                                placeholder="Describe your project requirements, goals, and any specific features you need..."
                                rows={4}
                                value={projectRequest.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Additional Requirements</label>
                            <Textarea
                                placeholder="Any specific technologies, integrations, or special requirements..."
                                rows={3}
                                value={projectRequest.requirements}
                                onChange={(e) => handleInputChange('requirements', e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <div>
                                <p className="font-medium">Selected Plan: {selectedTierData?.name}</p>
                                <p className="text-sm text-gray-600">Starting at ${selectedTierData?.price.toLocaleString()}/project</p>
                            </div>
                            <Button
                                onClick={handleSubmitRequest}
                                disabled={isSubmitting || !projectRequest.name || !projectRequest.email || !projectRequest.projectType || !projectRequest.description}
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Submitting...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Send className="h-4 w-4" />
                                        <span>Submit Project Request</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
