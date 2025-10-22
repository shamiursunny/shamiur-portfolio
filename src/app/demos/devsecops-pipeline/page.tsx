"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Shield,
  AlertTriangle,
  GitBranch,
  Package,
  Server,
  Code,
  Bug,
  Lock,
  Zap,
  Activity,
  TrendingUp,
  Download
} from "lucide-react"

interface PipelineStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failed'
  duration?: number
  logs?: string[]
}

interface Pipeline {
  id: string
  name: string
  branch: string
  commit: string
  author: string
  status: 'pending' | 'running' | 'success' | 'failed'
  stages: PipelineStage[]
  startTime: Date
  duration?: number
  securityScore: number
}

const generatePipeline = (): Pipeline => {
  const stages: PipelineStage[] = [
    { id: 'checkout', name: 'Code Checkout', status: 'success', duration: 12 },
    { id: 'lint', name: 'Code Quality', status: 'success', duration: 8 },
    { id: 'test', name: 'Unit Tests', status: 'success', duration: 45 },
    { id: 'security-scan', name: 'Security Scan', status: Math.random() > 0.2 ? 'success' : 'failed', duration: 120 },
    { id: 'build', name: 'Build Application', status: 'success', duration: 180 },
    { id: 'container-scan', name: 'Container Security', status: Math.random() > 0.1 ? 'success' : 'failed', duration: 90 },
    { id: 'deploy-staging', name: 'Deploy to Staging', status: 'success', duration: 60 },
    { id: 'integration-test', name: 'Integration Tests', status: Math.random() > 0.15 ? 'success' : 'failed', duration: 240 },
    { id: 'deploy-production', name: 'Deploy to Production', status: 'success', duration: 45 }
  ]

  const hasFailure = stages.some(stage => stage.status === 'failed')
  
  return {
    id: `pipeline-${Date.now()}`,
    name: 'Main Application Pipeline',
    branch: 'main',
    commit: 'a7f2c9d',
    author: 'Shamiur Rashid',
    status: hasFailure ? 'failed' : 'success',
    stages,
    startTime: new Date(Date.now() - 10 * 60 * 1000),
    duration: stages.reduce((acc, stage) => acc + (stage.duration || 0), 0),
    securityScore: Math.floor(Math.random() * 20) + 80
  }
}

const securityVulnerabilities = [
  { id: 'CVE-2024-001', severity: 'High', package: 'express', version: '4.18.2', fixed: false },
  { id: 'CVE-2024-002', severity: 'Medium', package: 'lodash', version: '4.17.21', fixed: true },
  { id: 'CVE-2024-003', severity: 'Low', package: 'axios', version: '1.6.0', fixed: true },
  { id: 'CVE-2024-004', severity: 'Critical', package: 'moment', version: '2.29.4', fixed: false }
]

const complianceChecks = [
  { name: 'OWASP Top 10', status: 'passed', score: 95 },
  { name: 'SOC 2 Type II', status: 'passed', score: 88 },
  { name: 'ISO 27001', status: 'in-progress', score: 76 },
  { name: 'GDPR Compliance', status: 'passed', score: 92 },
  { name: 'HIPAA Compliance', status: 'passed', score: 89 }
]

export default function DevSecOpsPipeline() {
  const [pipeline, setPipeline] = useState<Pipeline>(generatePipeline())
  const [isRunning, setIsRunning] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning && currentStage < pipeline.stages.length) {
        const newLog = `[${new Date().toLocaleTimeString()}] Executing stage: ${pipeline.stages[currentStage].name}`
        setLogs(prev => [...prev.slice(-9), newLog])
        
        setTimeout(() => {
          setCurrentStage(prev => prev + 1)
        }, 2000)
      } else if (isRunning && currentStage >= pipeline.stages.length) {
        setIsRunning(false)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isRunning, currentStage, pipeline.stages])

  const runPipeline = () => {
    setIsRunning(true)
    setCurrentStage(0)
    setLogs([])
    setPipeline(generatePipeline())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'running':
        return <Play className="w-5 h-5 text-blue-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500 text-white'
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">DevSecOps Pipeline Manager</h1>
            <p className="text-slate-600">Automated CI/CD pipeline with integrated security scanning</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={runPipeline}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Pipeline
                </>
              )}
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Logs
            </Button>
          </div>
        </div>

        {/* Pipeline Status */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(pipeline.status)}
                  {pipeline.name}
                </CardTitle>
                <CardDescription>
                  Branch: {pipeline.branch} • Commit: {pipeline.commit} • Author: {pipeline.author}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="gap-2">
                  <GitBranch className="w-3 h-3" />
                  {pipeline.branch}
                </Badge>
                <Badge variant="outline" className="gap-2">
                  <Shield className="w-3 h-3" />
                  Security: {pipeline.securityScore}/100
                </Badge>
                <Badge className={getStatusColor(pipeline.status)}>
                  {pipeline.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>Started: {pipeline.startTime.toLocaleTimeString()}</span>
              <span>•</span>
              <span>Duration: {pipeline.duration}s</span>
              <span>•</span>
              <span>Stages: {currentStage}/{pipeline.stages.length}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pipeline Stages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Stages</CardTitle>
            <CardDescription>Real-time pipeline execution progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline.stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(index < currentStage ? 'success' : index === currentStage && isRunning ? 'running' : 'pending')}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{stage.name}</h3>
                      <span className="text-sm text-slate-500">
                        {stage.duration ? `${stage.duration}s` : 'Pending'}
                      </span>
                    </div>
                    <Progress 
                      value={index < currentStage ? 100 : index === currentStage && isRunning ? 50 : 0} 
                      className="h-2"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    {stage.id.includes('security') && <Shield className="w-4 h-4 text-blue-500" />}
                    {stage.id.includes('test') && <Bug className="w-4 h-4 text-green-500" />}
                    {stage.id.includes('deploy') && <Server className="w-4 h-4 text-purple-500" />}
                    {stage.id.includes('build') && <Package className="w-4 h-4 text-orange-500" />}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="logs">Live Logs</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Vulnerabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Vulnerabilities
                </CardTitle>
                <CardDescription>Detected security issues and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityVulnerabilities.map((vuln, index) => (
                    <div key={vuln.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-4 h-4 ${
                          vuln.severity === 'Critical' ? 'text-red-500' :
                          vuln.severity === 'High' ? 'text-red-400' :
                          vuln.severity === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div>
                          <div className="font-medium">{vuln.id}</div>
                          <div className="text-sm text-slate-500">
                            {vuln.package}@{vuln.version}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(vuln.severity)}>
                          {vuln.severity}
                        </Badge>
                        {vuln.fixed && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Score */}
            <Card>
              <CardHeader>
                <CardTitle>Security Score Breakdown</CardTitle>
                <CardDescription>Overall security assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {pipeline.securityScore}/100
                    </div>
                    <div className="text-sm text-slate-500">Overall Security Score</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Code Security</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dependency Security</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Infrastructure Security</span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Runtime Security</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Regulatory compliance and audit status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complianceChecks.map((check, index) => (
                  <motion.div
                    key={check.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{check.name}</h3>
                        <Badge variant={check.status === 'passed' ? 'default' : 'secondary'}>
                          {check.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Score</span>
                          <span className="font-medium">{check.score}%</span>
                        </div>
                        <Progress value={check.score} className="h-2" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Live Logs</CardTitle>
                  <CardDescription>Real-time pipeline execution logs</CardDescription>
                </div>
                <Badge variant="outline" className="gap-2">
                  <Activity className="w-3 h-3" />
                  {isRunning ? 'Live' : 'Idle'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-slate-500">Waiting for pipeline to start...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
                {isRunning && (
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Processing...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Average Build Time</span>
                    </div>
                    <span className="text-2xl font-bold">3m 24s</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>Success Rate</span>
                    </div>
                    <span className="text-2xl font-bold">94.2%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span>Daily Deployments</span>
                    </div>
                    <span className="text-2xl font-bold">47</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-purple-500" />
                      <span>Security Scans</span>
                    </div>
                    <span className="text-2xl font-bold">128</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
                <CardDescription>System resource consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span className="font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Disk Usage</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network I/O</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}