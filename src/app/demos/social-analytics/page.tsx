"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Share2, 
  TrendingUp, 
  MessageCircle, 
  Heart, 
  Users,
  Eye,
  BarChart3,
  Filter,
  Search,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  ThumbsUp,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Smile,
  Frown,
  Meh,
  Zap,
  Target,
  Globe,
  Hash,
  AtSign,
  Link,
  Play,
  Pause
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function SocialAnalyticsDemo() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPlatform, setSelectedPlatform] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [isLive, setIsLive] = useState(true)

  const [engagementData, setEngagementData] = useState([
    { date: 'Mon', likes: 1200, shares: 340, comments: 89, reach: 5400 },
    { date: 'Tue', likes: 1450, shares: 420, comments: 120, reach: 6200 },
    { date: 'Wed', likes: 1680, shares: 510, comments: 145, reach: 7100 },
    { date: 'Thu', likes: 1890, shares: 580, comments: 167, reach: 7800 },
    { date: 'Fri', likes: 2100, shares: 650, comments: 189, reach: 8500 },
    { date: 'Sat', likes: 2350, shares: 720, comments: 210, reach: 9200 },
    { date: 'Sun', likes: 2200, shares: 680, comments: 195, reach: 8800 }
  ])

  const [platforms, setPlatforms] = useState([
    {
      name: "Twitter",
      icon: Twitter,
      followers: 45000,
      engagement: 4.2,
      posts: 156,
      reach: 125000,
      color: "#1DA1F2",
      growth: 12.5
    },
    {
      name: "Facebook",
      icon: Facebook,
      followers: 78000,
      engagement: 3.8,
      posts: 89,
      reach: 195000,
      color: "#1877F2",
      growth: 8.3
    },
    {
      name: "Instagram",
      icon: Instagram,
      followers: 62000,
      engagement: 5.1,
      posts: 234,
      reach: 186000,
      color: "#E4405F",
      growth: 15.7
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      followers: 34000,
      engagement: 2.9,
      posts: 67,
      reach: 89000,
      color: "#0077B5",
      growth: 6.2
    },
    {
      name: "YouTube",
      icon: Youtube,
      followers: 28000,
      engagement: 3.5,
      posts: 45,
      reach: 145000,
      color: "#FF0000",
      growth: 18.9
    }
  ])

  const [sentimentData, setSentimentData] = useState([
    { sentiment: 'Positive', value: 65, color: '#10b981' },
    { sentiment: 'Neutral', value: 25, color: '#6b7280' },
    { sentiment: 'Negative', value: 10, color: '#ef4444' }
  ])

  const [topPosts, setTopPosts] = useState([
    {
      id: 1,
      platform: "Instagram",
      content: "🚀 Excited to announce our latest product launch! #innovation #tech",
      engagement: 8900,
      likes: 5600,
      shares: 2100,
      comments: 1200,
      reach: 45000,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      sentiment: "positive"
    },
    {
      id: 2,
      platform: "Twitter",
      content: "Join us for an amazing webinar on AI and machine learning! 🤖",
      engagement: 6700,
      likes: 4200,
      shares: 1800,
      comments: 700,
      reach: 32000,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      sentiment: "positive"
    },
    {
      id: 3,
      platform: "LinkedIn",
      content: "Proud to share our company's achievements this quarter! 📈",
      engagement: 5400,
      likes: 3200,
      shares: 1500,
      comments: 700,
      reach: 28000,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      sentiment: "positive"
    }
  ])

  const [hashtags, setHashtags] = useState([
    { tag: "#innovation", mentions: 12500, reach: 89000, engagement: 4.2 },
    { tag: "#technology", mentions: 10800, reach: 76000, engagement: 3.8 },
    { tag: "#AI", mentions: 9200, reach: 65000, engagement: 5.1 },
    { tag: "#startup", mentions: 7800, reach: 54000, engagement: 3.5 },
    { tag: "#future", mentions: 6500, reach: 43000, engagement: 4.0 }
  ])

  const performanceMetrics = [
    { metric: 'Engagement Rate', value: 4.2, target: 5.0 },
    { metric: 'Reach Growth', value: 12.5, target: 10.0 },
    { metric: 'Content Quality', value: 8.7, target: 8.0 },
    { metric: 'Audience Growth', value: 15.3, target: 12.0 },
    { metric: 'Brand Awareness', value: 7.8, target: 8.5 }
  ]

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return Smile
      case 'negative': return Frown
      default: return Meh
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500 bg-green-50'
      case 'negative': return 'text-red-500 bg-red-50'
      default: return 'text-gray-500 bg-gray-50'
    }
  }

  const totalFollowers = platforms.reduce((acc, p) => acc + p.followers, 0)
  const avgEngagement = (platforms.reduce((acc, p) => acc + p.engagement, 0) / platforms.length).toFixed(1)
  const totalReach = platforms.reduce((acc, p) => acc + p.reach, 0)
  const totalPosts = platforms.reduce((acc, p) => acc + p.posts, 0)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setEngagementData(prev => {
        const newData = [...prev]
        const lastIndex = newData.length - 1
        newData[lastIndex] = {
          ...newData[lastIndex],
          likes: newData[lastIndex].likes + Math.floor(Math.random() * 50),
          shares: newData[lastIndex].shares + Math.floor(Math.random() * 20),
          comments: newData[lastIndex].comments + Math.floor(Math.random() * 10),
          reach: newData[lastIndex].reach + Math.floor(Math.random() * 100)
        }
        return newData
      })

      setPlatforms(prev => prev.map(platform => ({
        ...platform,
        followers: platform.followers + Math.floor(Math.random() * 10),
        reach: platform.reach + Math.floor(Math.random() * 50)
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Social Media Analytics
              </h1>
              <p className="text-slate-600">Cross-platform analytics with sentiment analysis</p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 p-4 bg-white rounded-xl shadow-sm border">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">{totalFollowers.toLocaleString()} Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">{avgEngagement}% Engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">{totalReach.toLocaleString()} Reach</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">{totalPosts} Posts</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className="gap-2"
              >
                {isLive ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isLive ? "Live" : "Paused"}
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
                  <p className="text-xs text-slate-500">Across all platforms</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{avgEngagement}%</div>
                  <p className="text-xs text-slate-500">Last 7 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{totalReach.toLocaleString()}</div>
                  <p className="text-xs text-slate-500">Impressions</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">+12.5%</div>
                  <p className="text-xs text-slate-500">This month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Trends</CardTitle>
                  <CardDescription>Weekly engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="likes" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                      <Area type="monotone" dataKey="shares" stackId="1" stroke="#10b981" fill="#10b981" />
                      <Area type="monotone" dataKey="comments" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Overall sentiment distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
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

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {platforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * platforms.indexOf(platform) }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${platform.color}20` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: platform.color }} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{platform.name}</CardTitle>
                              <CardDescription>Social Media Platform</CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            +{platform.growth}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold">{platform.followers.toLocaleString()}</div>
                            <div className="text-sm text-slate-500">Followers</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{platform.engagement}%</div>
                            <div className="text-sm text-slate-500">Engagement</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-lg font-semibold">{platform.posts}</div>
                            <div className="text-sm text-slate-500">Posts</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold">{(platform.reach / 1000).toFixed(0)}K</div>
                            <div className="text-sm text-slate-500">Reach</div>
                          </div>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            View Analytics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Posts</CardTitle>
                    <CardDescription>Most engaging content across platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {topPosts.map((post) => {
                          const PlatformIcon = platforms.find(p => p.name === post.platform)?.icon || Share2
                          const SentimentIcon = getSentimentIcon(post.sentiment)
                          return (
                            <motion.div
                              key={post.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="p-4 rounded-lg border hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <PlatformIcon className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{post.platform}</div>
                                    <div className="text-xs text-slate-500">
                                      {post.timestamp.toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getSentimentColor(post.sentiment)}>
                                    <SentimentIcon className="w-3 h-3 mr-1" />
                                    {post.sentiment}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {post.engagement.toLocaleString()} engagement
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">{post.content}</p>
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  {post.likes.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Share2 className="w-3 h-3" />
                                  {post.shares.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {post.comments.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {post.reach.toLocaleString()} reach
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
                    <CardTitle>Trending Hashtags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {hashtags.map((hashtag, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{hashtag.tag}</span>
                              <Badge variant="secondary" className="text-xs">
                                {hashtag.engagement}% engagement
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-500">
                              {hashtag.mentions.toLocaleString()} mentions • {hashtag.reach.toLocaleString()} reach
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart data={performanceMetrics}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 10]} />
                        <Radar name="Current" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Sentiment Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Breakdown</CardTitle>
                  <CardDescription>Detailed sentiment analysis by platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon
                    return (
                      <div key={platform.name} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="w-5 h-5" style={{ color: platform.color }} />
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Positive</span>
                            <span className="text-green-600">68%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Neutral</span>
                            <span className="text-gray-600">24%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Negative</span>
                            <span className="text-red-600">8%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Trends</CardTitle>
                  <CardDescription>Sentiment changes over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="likes" stroke="#10b981" strokeWidth={2} name="Positive" />
                      <Line type="monotone" dataKey="comments" stroke="#6b7280" strokeWidth={2} name="Neutral" />
                      <Line type="monotone" dataKey="shares" stroke="#ef4444" strokeWidth={2} name="Negative" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create comprehensive social media reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Performance Report
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Growth Analysis
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Users className="w-4 h-4" />
                    Audience Insights
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Engagement Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Download your analytics data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Excel
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      JSON
                    </Button>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Schedule Reports
                    </Button>
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