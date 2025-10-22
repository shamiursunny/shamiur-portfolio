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
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  DollarSign,
  ShoppingCart,
  Eye,
  MousePointer,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  RefreshCw,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface RealTimeData {
  timestamp: string
  users: number
  revenue: number
  conversions: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
}

interface TrafficSource {
  source: string
  visitors: number
  percentage: number
  revenue: number
  conversionRate: number
}

interface ProductPerformance {
  name: string
  sales: number
  revenue: number
  growth: number
  rating: number
}

const generateRealTimeData = (): RealTimeData[] => {
  const data = []
  const now = new Date()
  
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      timestamp: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      users: Math.floor(Math.random() * 500) + 200,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      conversions: Math.floor(Math.random() * 50) + 10,
      pageViews: Math.floor(Math.random() * 2000) + 1000,
      bounceRate: Math.random() * 30 + 20,
      avgSessionDuration: Math.floor(Math.random() * 300) + 120
    })
  }
  
  return data
}

const generateTrafficSources = (): TrafficSource[] => [
  { source: 'Organic Search', visitors: 45234, percentage: 42.3, revenue: 234567, conversionRate: 3.2 },
  { source: 'Direct', visitors: 23456, percentage: 21.9, revenue: 189234, conversionRate: 4.1 },
  { source: 'Social Media', visitors: 18765, percentage: 17.5, revenue: 123456, conversionRate: 2.8 },
  { source: 'Email', visitors: 12345, percentage: 11.5, revenue: 98765, conversionRate: 5.2 },
  { source: 'Referral', visitors: 7890, percentage: 7.4, revenue: 67890, conversionRate: 3.9 },
  { source: 'Paid Ads', visitors: 5678, percentage: 5.3, revenue: 45678, conversionRate: 2.1 }
]

const generateProductPerformance = (): ProductPerformance[] => [
  { name: 'Premium Plan', sales: 1234, revenue: 246800, growth: 12.5, rating: 4.8 },
  { name: 'Professional Plan', sales: 2345, revenue: 234500, growth: 8.3, rating: 4.6 },
  { name: 'Basic Plan', sales: 3456, revenue: 103680, growth: -2.1, rating: 4.2 },
  { name: 'Enterprise Plan', sales: 456, revenue: 228000, growth: 23.7, rating: 4.9 },
  { name: 'Starter Plan', sales: 5678, revenue: 56780, growth: 5.4, rating: 4.1 }
]

const deviceData = [
  { name: 'Desktop', value: 45.2, color: '#3b82f6' },
  { name: 'Mobile', value: 38.7, color: '#10b981' },
  { name: 'Tablet', value: 16.1, color: '#f59e0b' }
]

const performanceMetrics = [
  { metric: 'Page Load Time', value: 1.2, unit: 's', target: 2.0, status: 'good' },
  { metric: 'Server Response', value: 145, unit: 'ms', target: 200, status: 'good' },
  { metric: 'Database Query', value: 23, unit: 'ms', target: 50, status: 'good' },
  { metric: 'API Response', value: 89, unit: 'ms', target: 100, status: 'good' }
]

export default function AnalyticsDashboard() {
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>(generateRealTimeData())
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>(generateTrafficSources())
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>(generateProductPerformance())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [liveStats, setLiveStats] = useState({
    activeUsers: 1847,
    totalRevenue: 892347,
    conversionRate: 3.4,
    avgOrderValue: 127.89
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => {
        const newData = [...prev.slice(1)]
        const now = new Date()
        newData.push({
          timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          users: Math.floor(Math.random() * 500) + 200,
          revenue: Math.floor(Math.random() * 10000) + 5000,
          conversions: Math.floor(Math.random() * 50) + 10,
          pageViews: Math.floor(Math.random() * 2000) + 1000,
          bounceRate: Math.random() * 30 + 20,
          avgSessionDuration: Math.floor(Math.random() * 300) + 120
        })
        return newData
      })

      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        totalRevenue: prev.totalRevenue + Math.floor(Math.random() * 1000),
        conversionRate: Math.max(0, prev.conversionRate + (Math.random() - 0.5) * 0.1),
        avgOrderValue: Math.max(0, prev.avgOrderValue + (Math.random() - 0.5) * 5)
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRealTimeData(generateRealTimeData())
    setTrafficSources(generateTrafficSources())
    setProductPerformance(generateProductPerformance())
    setIsRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Real-Time Analytics Dashboard</h1>
            <p className="text-slate-600">Business intelligence with live data processing and predictive analytics</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {formatNumber(liveStats.activeUsers)}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from last hour
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                  <DollarSign className="w-4 h-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(liveStats.totalRevenue)}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.3% from yesterday
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
                  <Target className="w-4 h-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {liveStats.conversionRate.toFixed(1)}%
                </div>
                <div className="flex items-center text-sm text-yellow-600 mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -0.2% from last week
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Avg Order Value</CardTitle>
                  <ShoppingCart className="w-4 h-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(liveStats.avgOrderValue)}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.7% growth
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Users (24 Hours)</CardTitle>
                <CardDescription>Real-time revenue and user activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={realTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Revenue ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Active Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Visitor distribution by source</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ source, percentage }) => `${source}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>User journey through conversion stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: 'Visitors', count: 45234, conversion: 100, color: 'bg-blue-500' },
                  { stage: 'Sign-ups', count: 12456, conversion: 27.5, color: 'bg-green-500' },
                  { stage: 'Product Views', count: 8234, conversion: 66.1, color: 'bg-yellow-500' },
                  { stage: 'Add to Cart', count: 3456, conversion: 42.0, color: 'bg-orange-500' },
                  { stage: 'Checkout', count: 1234, conversion: 35.7, color: 'bg-red-500' },
                  { stage: 'Purchase', count: 892, conversion: 72.3, color: 'bg-purple-500' }
                ].map((stage, index) => (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-32 text-sm font-medium">{stage.stage}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{formatNumber(stage.count)}</span>
                        <span>{stage.conversion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${stage.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${stage.conversion}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources Analysis</CardTitle>
              <CardDescription>Detailed breakdown of traffic sources and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSources.map((source, index) => (
                  <motion.div
                    key={source.source}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{source.source}</h3>
                        <p className="text-sm text-slate-600">
                          {formatNumber(source.visitors)} visitors ({source.percentage}%)
                        </p>
                      </div>
                      <Badge variant="outline">
                        {source.conversionRate}% conversion
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Revenue:</span>
                        <span className="ml-2 font-medium">{formatCurrency(source.revenue)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Conversion Rate:</span>
                        <span className="ml-2 font-medium">{source.conversionRate}%</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={source.percentage} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Visitor distribution by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {deviceData.map((device) => (
                    <div key={device.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: device.color }}
                        />
                        <span className="text-sm">{device.name}</span>
                      </div>
                      <span className="text-sm font-medium">{device.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Top countries by visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: 'United States', visitors: 45234, percentage: 35.2 },
                    { country: 'United Kingdom', visitors: 23456, percentage: 18.3 },
                    { country: 'Canada', visitors: 18765, percentage: 14.6 },
                    { country: 'Germany', visitors: 12345, percentage: 9.6 },
                    { country: 'France', visitors: 9876, percentage: 7.7 },
                    { country: 'Australia', visitors: 7654, percentage: 6.0 }
                  ].map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{country.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">{formatNumber(country.visitors)}</span>
                        <span className="text-sm font-medium">{country.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Sales and revenue metrics by product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-slate-600">({product.rating})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                        <div className={`text-sm flex items-center gap-1 ${
                          product.growth > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.growth > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {Math.abs(product.growth)}%
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Sales:</span>
                        <span className="ml-2 font-medium">{formatNumber(product.sales)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Avg Price:</span>
                        <span className="ml-2 font-medium">
                          {formatCurrency(product.revenue / product.sales)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertTitle>Live Data Stream</AlertTitle>
            <AlertDescription>
              Real-time data processing with sub-second latency. Processing millions of data points daily.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Live User Activity</CardTitle>
                  <Badge variant="outline" className="gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={realTimeData.slice(-12)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name="Active Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="pageViews"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      name="Page Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Events</CardTitle>
                <CardDescription>Real-time user events and actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {[
                    { event: 'Page View', user: 'User_1234', page: '/products/premium', time: '2 seconds ago' },
                    { event: 'Add to Cart', user: 'User_5678', product: 'Professional Plan', time: '5 seconds ago' },
                    { event: 'Sign Up', user: 'User_9012', method: 'Google OAuth', time: '8 seconds ago' },
                    { event: 'Purchase', user: 'User_3456', amount: '$127.89', time: '12 seconds ago' },
                    { event: 'Page View', user: 'User_7890', page: '/pricing', time: '15 seconds ago' },
                    { event: 'Download', user: 'User_2345', file: 'Whitepaper.pdf', time: '18 seconds ago' },
                    { event: 'Video Play', user: 'User_6789', video: 'Product Tour', time: '22 seconds ago' },
                    { event: 'Form Submit', user: 'User_0123', form: 'Contact Us', time: '25 seconds ago' }
                  ].map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 border rounded text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-blue-500" />
                        <span className="font-medium">{event.event}</span>
                        <span className="text-slate-500">by {event.user}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-600">
                          {event.page || event.product || event.method || event.amount || event.file || event.video || event.form}
                        </div>
                        <div className="text-xs text-slate-400">{event.time}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system metrics and health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">
                            {metric.value}{metric.unit}
                          </span>
                          {metric.status === 'good' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(metric.value / metric.target) * 100} 
                          className="flex-1 h-2" 
                        />
                        <span className="text-xs text-slate-500">
                          Target: {metric.target}{metric.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Server Health</CardTitle>
                <CardDescription>Infrastructure status and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-medium">Web Server</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">99.9% uptime</div>
                      <div className="text-xs text-slate-500">Healthy</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-medium">Database</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">99.7% uptime</div>
                      <div className="text-xs text-slate-500">Healthy</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="font-medium">Cache Server</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">98.5% uptime</div>
                      <div className="text-xs text-slate-500">Warning</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-medium">CDN</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">100% uptime</div>
                      <div className="text-xs text-slate-500">Healthy</div>
                    </div>
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