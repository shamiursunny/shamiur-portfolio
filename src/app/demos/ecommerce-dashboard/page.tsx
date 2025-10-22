"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clicks,
  Cart,
  CreditCard,
  Activity,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Search,
  Bell,
  Settings
} from "lucide-react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"

const SALES_DATA = [
  { date: "Jan", sales: 4000, orders: 240, visitors: 4000 },
  { date: "Feb", sales: 3000, orders: 198, visitors: 3000 },
  { date: "Mar", sales: 5000, orders: 290, visitors: 5000 },
  { date: "Apr", sales: 4500, orders: 280, visitors: 4500 },
  { date: "May", sales: 6000, orders: 390, visitors: 6000 },
  { date: "Jun", sales: 5500, orders: 380, visitors: 5500 },
  { date: "Jul", sales: 7000, orders: 430, visitors: 7000 }
]

const CATEGORY_DATA = [
  { name: "Electronics", value: 35, color: "#3b82f6" },
  { name: "Clothing", value: 25, color: "#8b5cf6" },
  { name: "Home & Garden", value: 20, color: "#10b981" },
  { name: "Sports", value: 12, color: "#f59e0b" },
  { name: "Books", value: 8, color: "#ef4444" }
]

const RECENT_ORDERS = [
  { id: "ORD-001", customer: "John Doe", amount: 299.99, status: "completed", date: "2024-01-15" },
  { id: "ORD-002", customer: "Jane Smith", amount: 149.99, status: "processing", date: "2024-01-15" },
  { id: "ORD-003", customer: "Bob Johnson", amount: 89.99, status: "pending", date: "2024-01-14" },
  { id: "ORD-004", customer: "Alice Brown", amount: 449.99, status: "completed", date: "2024-01-14" },
  { id: "ORD-005", customer: "Charlie Wilson", amount: 199.99, status: "shipped", date: "2024-01-13" }
]

const TOP_PRODUCTS = [
  { name: "Wireless Headphones", sales: 1234, revenue: 61700, trend: "up" },
  { name: "Smart Watch", sales: 892, revenue: 44600, trend: "up" },
  { name: "Laptop Stand", sales: 756, revenue: 22680, trend: "down" },
  { name: "USB-C Hub", sales: 623, revenue: 18690, trend: "up" },
  { name: "Mechanical Keyboard", sales: 512, revenue: 35840, trend: "up" }
]

export default function EcommerceDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [totalRevenue, setTotalRevenue] = useState(28450)
  const [totalOrders, setTotalOrders] = useState(189)
  const [totalCustomers, setTotalCustomers] = useState(1247)
  const [conversionRate, setConversionRate] = useState(3.2)
  const [liveVisitors, setLiveVisitors] = useState(47)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTotalRevenue(prev => prev + (Math.random() - 0.3) * 100)
      setTotalOrders(prev => prev + Math.floor(Math.random() * 3))
      setTotalCustomers(prev => prev + Math.floor(Math.random() * 2))
      setConversionRate(prev => Math.max(0, prev + (Math.random() - 0.5) * 0.1))
      setLiveVisitors(prev => Math.max(10, prev + Math.floor(Math.random() * 5) - 2))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "processing": return "bg-blue-100 text-blue-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "shipped": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              E-Commerce Dashboard
            </h1>
            <p className="text-muted-foreground">Real-time business analytics and insights</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {liveVisitors} live visitors
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Revenue",
              value: formatCurrency(totalRevenue),
              change: "+12.5%",
              trend: "up",
              icon: DollarSign,
              color: "blue"
            },
            {
              title: "Total Orders",
              value: totalOrders.toLocaleString(),
              change: "+8.2%",
              trend: "up",
              icon: ShoppingCart,
              color: "green"
            },
            {
              title: "Total Customers",
              value: totalCustomers.toLocaleString(),
              change: "+15.3%",
              trend: "up",
              icon: Users,
              color: "purple"
            },
            {
              title: "Conversion Rate",
              value: `${conversionRate.toFixed(1)}%`,
              change: "-2.1%",
              trend: "down",
              icon: TrendingUp,
              color: "orange"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${
                          stat.trend === "up" ? "text-green-500" : "text-red-500"
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Sales Overview
                  </CardTitle>
                  <CardDescription>Revenue and orders over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                      <Area type="monotone" dataKey="orders" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Sales by Category
                  </CardTitle>
                  <CardDescription>Revenue distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReChartsPieChart>
                      <Pie
                        data={CATEGORY_DATA}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {CATEGORY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </ReChartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best performing products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TOP_PRODUCTS.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(product.revenue)}</p>
                        <div className="flex items-center gap-1">
                          {product.trend === "up" ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {product.trend === "up" ? "Growing" : "Declining"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RECENT_ORDERS.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium">{order.id}</h4>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.amount)}</p>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{order.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">New Customers</span>
                    <span className="font-medium">+127 this month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Returning Customers</span>
                    <span className="font-medium">68.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Order Value</span>
                    <span className="font-medium">{formatCurrency(156.32)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Customer Lifetime Value</span>
                    <span className="font-medium">{formatCurrency(1245.67)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"].map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {customer.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium">{customer}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(Math.random() * 2000 + 500)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}