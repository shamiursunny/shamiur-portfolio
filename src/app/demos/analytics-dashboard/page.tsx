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
  const data: RealTimeData[] = []
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