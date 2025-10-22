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
  ResponsiveContainer 
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  CreditCard, 
  DollarSign,
  Activity,
  Users,
  Lock,
  Eye,
  Download,
  RefreshCw
} from "lucide-react"

// Mock real-time data generation
const generateTransactionData = () => {
  const transactions = []
  const now = new Date()
  
  for (let i = 0; i < 50; i++) {
    const time = new Date(now.getTime() - i * 60000) // Every minute for last 50 minutes
    const amount = Math.floor(Math.random() * 10000) + 1000
    const type = Math.random() > 0.5 ? 'credit' : 'debit'
    const risk = Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low'
    
    transactions.push({
      id: `TXN${String(1000000 + i).padStart(7, '0')}`,
      time: time.toLocaleTimeString(),
      amount: type === 'credit' ? amount : -amount,
      type,
      risk,
      merchant: ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Starbucks', 'McDonald\'s'][Math.floor(Math.random() * 6)],
      location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]
    })
  }
  
  return transactions.reverse()
}

const generateChartData = () => {
  const data = []
  const now = new Date()
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      transactions: Math.floor(Math.random() * 5000) + 2000,
      fraud: Math.floor(Math.random() * 100) + 10,
      revenue: Math.floor(Math.random() * 100000) + 50000
    })
  }
  
  return data
}

const riskDistribution = [
  { name: 'Low Risk', value: 65, color: '#10b981' },
  { name: 'Medium Risk', value: 25, color: '#f59e0b' },
  { name: 'High Risk', value: 10, color: '#ef4444' }
]

const performanceMetrics = [
  { metric: 'Transaction Success Rate', value: 99.8, target: 99.5 },
  { metric: 'Fraud Detection Accuracy', value: 94.2, target: 90 },
  { metric: 'System Uptime', value: 99.9, target: 99.5 },
  { metric: 'Response Time', value: 98.5, target: 95 }
]

export default function BankingDashboard() {
  const [transactions, setTransactions] = useState(generateTransactionData())
  const [chartData, setChartData] = useState(generateChartData())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [totalBalance, setTotalBalance] = useState(2847532.89)
  const [dailyChange, setDailyChange] = useState(2.34)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTransactions(prev => {
        const newTransaction = {
          id: `TXN${String(Math.floor(Math.random() * 9000000) + 1000000).padStart(7, '0')}`,
          time: new Date().toLocaleTimeString(),
          amount: Math.random() > 0.5 ? Math.floor(Math.random() * 10000) + 1000 : -(Math.floor(Math.random() * 10000) + 1000),
          type: Math.random() > 0.5 ? 'credit' : 'debit',
          risk: Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
          merchant: ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Starbucks', 'McDonald\'s'][Math.floor(Math.random() * 6)],
          location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]
        }
        return [newTransaction, ...prev.slice(0, 49)]
      })
      
      setTotalBalance(prev => prev + (Math.random() - 0.5) * 1000)
      setDailyChange(prev => prev + (Math.random() - 0.5) * 0.1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setTransactions(generateTransactionData())
    setChartData(generateChartData())
    setIsRefreshing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Secure Banking Dashboard</h1>
            <p className="text-slate-600">Real-time financial monitoring and fraud detection system</p>
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
                  <CardTitle className="text-sm font-medium text-slate-600">Total Balance</CardTitle>
                  <DollarSign className="w-4 h-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {formatCurrency(totalBalance)}
                </div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{dailyChange.toFixed(2)}%
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
                  <CardTitle className="text-sm font-medium text-slate-600">Transactions Today</CardTitle>
                  <Activity className="w-4 h-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">3,847</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% from yesterday
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Fraud Alerts</CardTitle>
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">47</div>
                <div className="flex items-center text-sm text-yellow-600 mt-1">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  -8.2% from last week
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Security Score</CardTitle>
                  <Shield className="w-4 h-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">94.2</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <Lock className="w-3 h-3 mr-1" />
                  Excellent
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="fraud-detection">Fraud Detection</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume (30 Days)</CardTitle>
                <CardDescription>Daily transaction trends and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="transactions" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Transactions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Transaction risk level breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Fraud Detection Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection Timeline</CardTitle>
              <CardDescription>Real-time fraud detection and prevention</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="fraud" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Fraud Attempts"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Live Transactions</CardTitle>
                  <CardDescription>Real-time transaction monitoring</CardDescription>
                </div>
                <Badge variant="outline" className="gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {transactions.slice(0, 10).map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.risk === 'high' ? 'bg-red-500' : 
                        transaction.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <div className="font-medium">{transaction.merchant}</div>
                        <div className="text-sm text-slate-500">
                          {transaction.id} • {transaction.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                      <div className="text-sm text-slate-500">{transaction.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fraud-detection" className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Advanced Fraud Detection</AlertTitle>
            <AlertDescription>
              Our AI-powered fraud detection system analyzes patterns in real-time to identify and prevent fraudulent activities.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Fraud Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'FD001', amount: 12500, risk: 'High', location: 'New York', time: '2 min ago' },
                    { id: 'FD002', amount: 8300, risk: 'Medium', location: 'Los Angeles', time: '15 min ago' },
                    { id: 'FD003', amount: 2100, risk: 'High', location: 'Chicago', time: '1 hour ago' },
                    { id: 'FD004', amount: 5600, risk: 'Medium', location: 'Houston', time: '2 hours ago' }
                  ].map((alert, index) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-4 h-4 ${
                          alert.risk === 'High' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div>
                          <div className="font-medium">{alert.id}</div>
                          <div className="text-sm text-slate-500">{alert.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(alert.amount)}</div>
                        <div className="text-sm text-slate-500">{alert.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.metric}</span>
                        <span className="font-medium">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                      <div className="text-xs text-slate-500">Target: {metric.target}%</div>
                    </div>
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
                  <div className="flex justify-between items-center">
                    <span>CPU Usage</span>
                    <span className="text-2xl font-bold">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Memory Usage</span>
                    <span className="text-2xl font-bold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Network I/O</span>
                    <span className="text-2xl font-bold">125 MB/s</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Compliance</CardTitle>
                <CardDescription>PCI DSS compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { requirement: 'Data Encryption', status: 'Compliant', color: 'text-green-600' },
                    { requirement: 'Access Control', status: 'Compliant', color: 'text-green-600' },
                    { requirement: 'Network Security', status: 'Compliant', color: 'text-green-600' },
                    { requirement: 'Vulnerability Testing', status: 'In Progress', color: 'text-yellow-600' },
                    { requirement: 'Monitoring', status: 'Compliant', color: 'text-green-600' }
                  ].map((req, index) => (
                    <div key={req.requirement} className="flex justify-between items-center p-2">
                      <span className="text-sm">{req.requirement}</span>
                      <Badge variant="outline" className={req.color}>
                        {req.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}