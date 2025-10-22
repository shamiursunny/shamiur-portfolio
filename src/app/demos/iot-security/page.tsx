"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Wifi, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Lock,
  Unlock,
  Eye,
  Settings,
  Smartphone,
  Thermometer,
  Camera,
  Router,
  Server,
  Database,
  Cpu,
  HardDrive,
  Zap,
  Radio,
  Globe,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
  Search,
  Bell,
  BellOff
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

export default function IoTSecurityDemo() {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Smart Thermostat",
      type: "Climate Control",
      status: "online",
      security: "secure",
      location: "Living Room",
      lastSeen: new Date(),
      threats: 0,
      firmware: "v2.1.3",
      signal: -45
    },
    {
      id: 2,
      name: "Security Camera",
      type: "Surveillance",
      status: "online",
      security: "warning",
      location: "Front Door",
      lastSeen: new Date(Date.now() - 1000 * 60 * 5),
      threats: 2,
      firmware: "v1.8.2",
      signal: -52
    },
    {
      id: 3,
      name: "Smart Lock",
      type: "Access Control",
      status: "online",
      security: "secure",
      location: "Main Entrance",
      lastSeen: new Date(),
      threats: 0,
      firmware: "v3.0.1",
      signal: -38
    },
    {
      id: 4,
      name: "IoT Gateway",
      type: "Network Infrastructure",
      status: "online",
      security: "critical",
      location: "Network Closet",
      lastSeen: new Date(Date.now() - 1000 * 60 * 2),
      threats: 5,
      firmware: "v1.5.0",
      signal: -28
    },
    {
      id: 5,
      name: "Smart Speaker",
      type: "Audio",
      status: "offline",
      security: "unknown",
      location: "Kitchen",
      lastSeen: new Date(Date.now() - 1000 * 60 * 60),
      threats: 0,
      firmware: "v4.2.1",
      signal: -65
    }
  ])

  const [threats, setThreats] = useState([
    {
      id: 1,
      deviceId: 2,
      deviceName: "Security Camera",
      type: "Unauthorized Access Attempt",
      severity: "high",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: "active",
      description: "Multiple failed login attempts detected"
    },
    {
      id: 2,
      deviceId: 4,
      deviceName: "IoT Gateway",
      type: "Suspicious Network Traffic",
      severity: "critical",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "investigating",
      description: "Unusual data transfer patterns detected"
    },
    {
      id: 3,
      deviceId: 2,
      deviceName: "Security Camera",
      type: "Outdated Firmware",
      severity: "medium",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: "resolved",
      description: "Security patch available"
    }
  ])

  const [activeTab, setActiveTab] = useState("overview")
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [autoResponse, setAutoResponse] = useState(true)

  const threatTrendData = [
    { time: '00:00', threats: 2 },
    { time: '04:00', threats: 1 },
    { time: '08:00', threats: 5 },
    { time: '12:00', threats: 8 },
    { time: '16:00', threats: 6 },
    { time: '20:00', threats: 4 },
    { time: '23:59', threats: 3 }
  ]

  const deviceTypeData = [
    { name: 'Climate Control', value: 25, color: '#3b82f6' },
    { name: 'Surveillance', value: 20, color: '#ef4444' },
    { name: 'Access Control', value: 15, color: '#10b981' },
    { name: 'Network Infrastructure', value: 10, color: '#f59e0b' },
    { name: 'Audio', value: 30, color: '#8b5cf6' }
  ]

  const securityScoreData = [
    { name: 'Encryption', score: 85 },
    { name: 'Authentication', score: 92 },
    { name: 'Network Security', score: 78 },
    { name: 'Physical Security', score: 88 },
    { name: 'Data Privacy', score: 95 }
  ]

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Climate Control': return Thermometer
      case 'Surveillance': return Camera
      case 'Access Control': return Lock
      case 'Network Infrastructure': return Router
      case 'Audio': return Smartphone
      default: return Cpu
    }
  }

  const getSecurityColor = (security) => {
    switch (security) {
      case 'secure': return 'text-green-500 bg-green-50'
      case 'warning': return 'text-yellow-500 bg-yellow-50'
      case 'critical': return 'text-red-500 bg-red-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const resolveThreat = (threatId) => {
    setThreats(threats.map(threat => 
      threat.id === threatId ? { ...threat, status: 'resolved' } : threat
    ))
  }

  const acknowledgeThreat = (threatId) => {
    setThreats(threats.map(threat => 
      threat.id === threatId ? { ...threat, status: 'acknowledged' } : threat
    ))
  }

  const activeThreats = threats.filter(t => t.status === 'active' || t.status === 'investigating')
  const secureDevices = devices.filter(d => d.security === 'secure').length
  const totalDevices = devices.length
  const securityScore = Math.round((secureDevices / totalDevices) * 100)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time threat detection
      if (Math.random() > 0.8) {
        const newThreat = {
          id: threats.length + 1,
          deviceId: devices[Math.floor(Math.random() * devices.length)].id,
          deviceName: devices[Math.floor(Math.random() * devices.length)].name,
          type: "Anomalous Activity",
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          status: "active",
          description: "Unusual device behavior detected"
        }
        setThreats([newThreat, ...threats.slice(0, 9)])
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [devices, threats])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Wifi className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                IoT Security Monitor
              </h1>
              <p className="text-slate-600">Real-time device security monitoring with ML-based threat detection</p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Security Score: {securityScore}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">{devices.filter(d => d.status === 'online').length} Online</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">{activeThreats.length} Active Threats</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">{totalDevices} Devices</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAlertsEnabled(!alertsEnabled)}
              >
                {alertsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ml-detection">ML Detection</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDevices}</div>
                  <p className="text-xs text-slate-500">Connected to network</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
                  <p className="text-xs text-slate-500">Overall security health</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{activeThreats.length}</div>
                  <p className="text-xs text-slate-500">Require attention</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">&lt;1s</div>
                  <p className="text-xs text-slate-500">Average detection</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Threat Trends (24h)</CardTitle>
                  <CardDescription>Security threat detection over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={threatTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="threats" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                  <CardDescription>IoT devices by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deviceTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceTypeData.map((entry, index) => (
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

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Inventory</CardTitle>
                    <CardDescription>Monitor and manage all connected IoT devices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {devices.map((device) => {
                          const Icon = getDeviceIcon(device.type)
                          return (
                            <motion.div
                              key={device.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedDevice(device)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    device.status === 'online' ? 'bg-green-50' : 'bg-gray-50'
                                  }`}>
                                    <Icon className={`w-5 h-5 ${
                                      device.status === 'online' ? 'text-green-600' : 'text-gray-400'
                                    }`} />
                                  </div>
                                  <div>
                                    <div className="font-medium">{device.name}</div>
                                    <div className="text-sm text-slate-500">{device.type}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className={getSecurityColor(device.security)}>
                                    {device.security}
                                  </Badge>
                                  <div className="text-xs text-slate-500 mt-1">
                                    {device.location}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                                <div className="flex items-center gap-4">
                                  <span>Firmware: {device.firmware}</span>
                                  <span>Signal: {device.signal} dBm</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {device.lastSeen.toLocaleTimeString()}
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
                {selectedDevice && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Device Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Device Name</label>
                        <div className="text-sm text-slate-600">{selectedDevice.name}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <div className="text-sm text-slate-600">{selectedDevice.type}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <div className="text-sm text-slate-600">{selectedDevice.location}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Security Status</label>
                        <Badge className={getSecurityColor(selectedDevice.security)}>
                          {selectedDevice.security}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Firmware</label>
                        <div className="text-sm text-slate-600">{selectedDevice.firmware}</div>
                      </div>
                      <div className="pt-4 space-y-2">
                        <Button size="sm" className="w-full gap-2">
                          <Settings className="w-4 h-4" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Activity className="w-4 h-4" />
                          View Logs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                      <Database className="w-4 h-4" />
                      Update Firmware
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Lock className="w-4 h-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Eye className="w-4 h-4" />
                      View Activity
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Threats Tab */}
          <TabsContent value="threats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Threats</CardTitle>
                    <CardDescription>Active and recent security threats</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {threats.map((threat) => (
                          <motion.div
                            key={threat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg border ${
                              threat.status === 'active' ? 'border-red-200 bg-red-50' :
                              threat.status === 'investigating' ? 'border-orange-200 bg-orange-50' :
                              'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-medium">{threat.type}</div>
                                <div className="text-sm text-slate-600">{threat.deviceName}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getSeverityColor(threat.severity)}>
                                  {threat.severity}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {threat.status}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{threat.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-slate-500">
                                {threat.timestamp.toLocaleString()}
                              </div>
                              <div className="flex gap-2">
                                {threat.status !== 'resolved' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => acknowledgeThreat(threat.id)}
                                    >
                                      Acknowledge
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => resolveThreat(threat.id)}
                                    >
                                      Resolve
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Threat Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Threats</span>
                      <span className="font-bold">{threats.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Active</span>
                      <span className="font-bold text-red-600">{activeThreats.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Resolved</span>
                      <span className="font-bold text-green-600">
                        {threats.filter(t => t.status === 'resolved').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Avg Response Time</span>
                      <span className="font-bold text-blue-600">&lt;1s</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Auto-Response</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enable Auto-Response</span>
                      <Button
                        variant={autoResponse ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAutoResponse(!autoResponse)}
                      >
                        {autoResponse ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Automatic threat isolation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Real-time alerting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Device quarantine</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Score Breakdown</CardTitle>
                  <CardDescription>Detailed security metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={securityScoreData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Activity</CardTitle>
                  <CardDescription>Real-time network monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">2.3GB</div>
                        <div className="text-sm text-slate-600">Data Transferred</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">15K</div>
                        <div className="text-sm text-slate-600">API Calls</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">98.5%</div>
                        <div className="text-sm text-slate-600">Uptime</div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">45ms</div>
                        <div className="text-sm text-slate-600">Latency</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ML Detection Tab */}
          <TabsContent value="ml-detection" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ML Model Performance</CardTitle>
                  <CardDescription>Machine learning threat detection accuracy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Detection Accuracy</span>
                        <span>94.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.5%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>False Positive Rate</span>
                        <span>2.1%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '2.1%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Time</span>
                        <span>0.8s</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detection Patterns</CardTitle>
                  <CardDescription>ML model identifying threat patterns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">Anomalous Network Traffic</div>
                      <div className="text-xs text-slate-600">Pattern detected: Unusual data spikes</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">Behavioral Anomaly</div>
                      <div className="text-xs text-slate-600">Device deviating from normal patterns</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">Access Pattern Analysis</div>
                      <div className="text-xs text-slate-600">Unauthorized access attempts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}