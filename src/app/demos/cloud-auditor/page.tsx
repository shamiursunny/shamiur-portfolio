"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Cloud, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Lock,
  Unlock,
  Eye,
  Settings,
  Server,
  Database,
  Globe,
  Cpu,
  HardDrive,
  Zap,
  BarChart3,
  Filter,
  Search,
  Download,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  Users,
  Key,
  Wifi,
  CloudRain,
  CloudSnow,
  CloudDrizzle
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function CloudAuditorDemo() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCloud, setSelectedCloud] = useState("all")
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  const [resources, setResources] = useState([
    {
      id: 1,
      name: "Production Database",
      type: "Database",
      cloud: "AWS",
      region: "us-east-1",
      status: "compliant",
      risk: "low",
      lastScan: new Date(),
      issues: 0,
      score: 95
    },
    {
      id: 2,
      name: "Web Server Cluster",
      type: "Compute",
      cloud: "Azure",
      region: "eastus",
      status: "warning",
      risk: "medium",
      lastScan: new Date(Date.now() - 1000 * 60 * 30),
      issues: 3,
      score: 78
    },
    {
      id: 3,
      name: "Storage Bucket",
      type: "Storage",
      cloud: "GCP",
      region: "us-central1",
      status: "non-compliant",
      risk: "high",
      lastScan: new Date(Date.now() - 1000 * 60 * 60),
      issues: 7,
      score: 62
    },
    {
      id: 4,
      name: "API Gateway",
      type: "Network",
      cloud: "AWS",
      region: "us-west-2",
      status: "compliant",
      risk: "low",
      lastScan: new Date(),
      issues: 0,
      score: 92
    },
    {
      id: 5,
      name: "Kubernetes Cluster",
      type: "Container",
      cloud: "Azure",
      region: "westeurope",
      status: "warning",
      risk: "medium",
      lastScan: new Date(Date.now() - 1000 * 60 * 15),
      issues: 2,
      score: 84
    }
  ])

  const [complianceFrameworks, setComplianceFrameworks] = useState([
    {
      name: "SOC 2",
      score: 88,
      status: "compliant",
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 11),
      requirements: 45,
      passed: 40
    },
    {
      name: "ISO 27001",
      score: 92,
      status: "compliant",
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 10),
      requirements: 114,
      passed: 105
    },
    {
      name: "GDPR",
      score: 85,
      status: "warning",
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 9),
      requirements: 99,
      passed: 84
    },
    {
      name: "HIPAA",
      score: 90,
      status: "compliant",
      lastAudit: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      nextAudit: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 8),
      requirements: 78,
      passed: 70
    }
  ])

  const [securityIssues, setSecurityIssues] = useState([
    {
      id: 1,
      resourceId: 3,
      resourceName: "Storage Bucket",
      type: "Public Access",
      severity: "high",
      description: "S3 bucket is publicly accessible",
      recommendation: "Enable bucket-level blocking of public access",
      status: "open",
      discovered: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: 2,
      resourceId: 2,
      resourceName: "Web Server Cluster",
      type: "Outdated SSL",
      severity: "medium",
      description: "SSL certificate expires in 7 days",
      recommendation: "Renew SSL certificate immediately",
      status: "open",
      discovered: new Date(Date.now() - 1000 * 60 * 60 * 4)
    },
    {
      id: 3,
      resourceId: 5,
      resourceName: "Kubernetes Cluster",
      type: "RBAC Misconfiguration",
      severity: "medium",
      description: "Overly permissive service account roles",
      recommendation: "Implement principle of least privilege",
      status: "investigating",
      discovered: new Date(Date.now() - 1000 * 60 * 60 * 6)
    }
  ])

  const complianceTrendData = [
    { date: '2024-01', score: 82 },
    { date: '2024-02', score: 85 },
    { date: '2024-03', score: 83 },
    { date: '2024-04', score: 88 },
    { date: '2024-05', score: 91 },
    { date: '2024-06', score: 89 }
  ]

  const cloudDistributionData = [
    { name: 'AWS', value: 45, color: '#ff9900' },
    { name: 'Azure', value: 30, color: '#0078d4' },
    { name: 'GCP', value: 25, color: '#4285f4' }
  ]

  const riskAssessmentData = [
    { subject: 'Security', A: 85, fullMark: 100 },
    { subject: 'Compliance', A: 88, fullMark: 100 },
    { subject: 'Performance', A: 92, fullMark: 100 },
    { subject: 'Reliability', A: 90, fullMark: 100 },
    { subject: 'Cost', A: 78, fullMark: 100 },
    { subject: 'Scalability', A: 85, fullMark: 100 }
  ]

  const getCloudIcon = (cloud) => {
    switch (cloud) {
      case 'AWS': return CloudRain
      case 'Azure': return CloudSnow
      case 'GCP': return CloudDrizzle
      default: return Cloud
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'non-compliant': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-50'
      case 'medium': return 'text-yellow-500 bg-yellow-50'
      case 'high': return 'text-red-500 bg-red-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      case 'critical': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const filteredResources = selectedCloud === 'all' 
    ? resources 
    : resources.filter(r => r.cloud === selectedCloud)

  const totalResources = resources.length
  const compliantResources = resources.filter(r => r.status === 'compliant').length
  const averageScore = Math.round(resources.reduce((acc, r) => acc + r.score, 0) / totalResources)
  const openIssues = securityIssues.filter(i => i.status === 'open').length

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setResources(prev => prev.map(resource => ({
        ...resource,
        score: Math.max(60, Math.min(100, resource.score + (Math.random() - 0.5) * 2))
      })))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Cloud className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cloud Infrastructure Auditor
              </h1>
              <p className="text-slate-600">Multi-cloud security scanning and compliance monitoring</p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Compliance: {averageScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">{totalResources} Resources</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">{compliantResources} Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">{openIssues} Issues</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button 
                onClick={startScan} 
                disabled={isScanning}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? `Scanning ${scanProgress}%` : 'Start Scan'}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="issues">Security Issues</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalResources}</div>
                  <p className="text-xs text-slate-500">Across 3 clouds</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{averageScore}%</div>
                  <p className="text-xs text-slate-500">Overall compliance</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{openIssues}</div>
                  <p className="text-xs text-slate-500">Require attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Cloud Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <p className="text-xs text-slate-500">AWS, Azure, GCP</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Trend</CardTitle>
                  <CardDescription>6-month compliance history</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={complianceTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cloud Distribution</CardTitle>
                  <CardDescription>Resources by cloud provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={cloudDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {cloudDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Cloud:</label>
                <select 
                  value={selectedCloud}
                  onChange={(e) => setSelectedCloud(e.target.value)}
                  className="px-3 py-1 border rounded-md"
                >
                  <option value="all">All Clouds</option>
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="GCP">GCP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Cloud Resources</CardTitle>
                    <CardDescription>Security and compliance status of all resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {filteredResources.map((resource) => {
                          const CloudIcon = getCloudIcon(resource.cloud)
                          return (
                            <motion.div
                              key={resource.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <CloudIcon className="w-5 h-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{resource.name}</div>
                                    <div className="text-sm text-slate-500">{resource.type} • {resource.region}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className={getStatusColor(resource.status)}>
                                    {resource.status}
                                  </Badge>
                                  <div className="text-sm text-slate-500 mt-1">Score: {resource.score}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                  <Badge className={getRiskColor(resource.risk)}>
                                    {resource.risk} risk
                                  </Badge>
                                  <span className="text-slate-500">{resource.issues} issues</span>
                                </div>
                                <div className="text-slate-500">
                                  Last scan: {resource.lastScan.toLocaleTimeString()}
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={riskAssessmentData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Shield className="w-4 h-4" />
                      Security Scan
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <FileText className="w-4 h-4" />
                      Generate Report
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Settings className="w-4 h-4" />
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {complianceFrameworks.map((framework) => (
                <Card key={framework.name}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{framework.name}</CardTitle>
                      <Badge className={getStatusColor(framework.status)}>
                        {framework.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Compliance Score</span>
                        <span>{framework.score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${framework.score}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Requirements</span>
                        <div className="font-medium">{framework.passed}/{framework.requirements}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Last Audit</span>
                        <div className="font-medium">{framework.lastAudit.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Issues</CardTitle>
                <CardDescription>Detected security vulnerabilities and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {securityIssues.map((issue) => (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border ${
                          issue.severity === 'high' ? 'border-red-200 bg-red-50' :
                          issue.severity === 'medium' ? 'border-orange-200 bg-orange-50' :
                          'border-yellow-200 bg-yellow-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium">{issue.type}</div>
                            <div className="text-sm text-slate-600">{issue.resourceName}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {issue.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
                        <div className="p-3 bg-blue-50 rounded-lg mb-3">
                          <div className="text-sm font-medium text-blue-800 mb-1">Recommendation</div>
                          <div className="text-sm text-blue-700">{issue.recommendation}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-500">
                            Discovered: {issue.discovered.toLocaleString()}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Investigate
                            </Button>
                            <Button variant="outline" size="sm">
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create comprehensive compliance and security reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full gap-2">
                    <FileText className="w-4 h-4" />
                    Compliance Report
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Shield className="w-4 h-4" />
                    Security Assessment
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Risk Analysis
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Trend Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Previously generated reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">Monthly Compliance Report</div>
                        <div className="text-xs text-slate-500">Generated: June 1, 2024</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">Security Assessment</div>
                        <div className="text-xs text-slate-500">Generated: May 28, 2024</div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="font-medium text-sm">Risk Analysis</div>
                        <div className="text-xs text-slate-500">Generated: May 15, 2024</div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}