"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building,
  Shield,
  Heart,
  BookOpen,
  BarChart3,
  MessageSquare,
  Wifi,
  Cloud,
  Share2,
  ExternalLink,
  Play,
  Star,
  Users,
  Clock,
  Zap
} from "lucide-react"

const demos = [
  {
    id: 'banking-dashboard',
    title: 'Secure Banking Dashboard',
    description: 'Real-time financial monitoring with fraud detection and PCI DSS compliance',
    icon: Building,
    color: 'from-blue-500 to-cyan-500',
    category: 'FinTech',
    difficulty: 'Advanced',
    duration: '5 min demo',
    features: ['Real-time transactions', 'Fraud detection', 'Security monitoring', 'Compliance tracking'],
    stats: { users: '1.2M', transactions: '50M+', uptime: '99.9%' },
    path: '/demos/banking-dashboard'
  },
  {
    id: 'devsecops-pipeline',
    title: 'DevSecOps Pipeline Manager',
    description: 'CI/CD automation with integrated security scanning and compliance reporting',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    category: 'DevOps',
    difficulty: 'Advanced',
    duration: '3 min demo',
    features: ['CI/CD pipeline', 'Security scanning', 'Compliance monitoring', 'Real-time logs'],
    stats: { pipelines: '10K+', scans: '100K+', deployments: '50K+' },
    path: '/demos/devsecops-pipeline'
  },
  {
    id: 'healthcare-system',
    title: 'Healthcare Management System',
    description: 'HIPAA-compliant EHR with telemedicine and patient monitoring',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    category: 'Healthcare',
    difficulty: 'Advanced',
    duration: '4 min demo',
    features: ['Electronic health records', 'Telemedicine', 'Patient monitoring', 'HIPAA compliance'],
    stats: { patients: '50K+', appointments: '200K+', doctors: '1K+' },
    path: '/demos/healthcare-system'
  },
  {
    id: 'e-learning-platform',
    title: 'E-Learning Platform',
    description: 'Interactive learning platform with video streaming and AI recommendations',
    icon: BookOpen,
    color: 'from-purple-500 to-indigo-500',
    category: 'Education',
    difficulty: 'Intermediate',
    duration: '6 min demo',
    features: ['Video streaming', 'Progress tracking', 'AI recommendations', 'Live sessions'],
    stats: { students: '100K+', courses: '500+', hours: '1M+' },
    path: '/demos/e-learning-platform'
  },
  {
    id: 'analytics-dashboard',
    title: 'Real-Time Analytics Dashboard',
    description: 'Business intelligence with live data processing and predictive analytics',
    icon: BarChart3,
    color: 'from-orange-500 to-yellow-500',
    category: 'Analytics',
    difficulty: 'Intermediate',
    duration: '4 min demo',
    features: ['Real-time data', 'Predictive analytics', 'Custom reports', 'Live monitoring'],
    stats: { datapoints: '1B+', reports: '50K+', insights: '100K+' },
    path: '/demos/analytics-dashboard'
  },
  {
    id: 'secure-messaging',
    title: 'Secure Messaging API',
    description: 'Enterprise-grade encrypted messaging with E2E encryption',
    icon: MessageSquare,
    color: 'from-cyan-500 to-blue-500',
    category: 'Security',
    difficulty: 'Advanced',
    duration: '3 min demo',
    features: ['End-to-end encryption', 'Message expiration', 'File sharing', 'API access'],
    stats: { messages: '10M+', users: '500K+', uptime: '99.9%' },
    path: '/demos/secure-messaging'
  },
  {
    id: 'iot-security',
    title: 'IoT Security Monitor',
    description: 'Device security monitoring with ML-based threat detection',
    icon: Wifi,
    color: 'from-green-500 to-teal-500',
    category: 'IoT',
    difficulty: 'Advanced',
    duration: '5 min demo',
    features: ['Device monitoring', 'Threat detection', 'ML analytics', 'Security alerts'],
    stats: { devices: '100K+', threats: '10K+', response: '<1s' },
    path: '/demos/iot-security'
  },
  {
    id: 'cloud-auditor',
    title: 'Cloud Infrastructure Auditor',
    description: 'Multi-cloud security scanning and compliance monitoring',
    icon: Cloud,
    color: 'from-blue-500 to-purple-500',
    category: 'Security',
    difficulty: 'Advanced',
    duration: '4 min demo',
    features: ['Multi-cloud support', 'Compliance scanning', 'Security auditing', 'Risk assessment'],
    stats: { clouds: '3+', resources: '1M+', scans: '100K+' },
    path: '/demos/cloud-auditor'
  },
  {
    id: 'social-analytics',
    title: 'Social Media Analytics',
    description: 'Cross-platform analytics with sentiment analysis',
    icon: Share2,
    color: 'from-pink-500 to-rose-500',
    category: 'Analytics',
    difficulty: 'Intermediate',
    duration: '3 min demo',
    features: ['Cross-platform', 'Sentiment analysis', 'Real-time data', 'Custom reports'],
    stats: { platforms: '5+', posts: '10M+', insights: '1M+' },
    path: '/demos/social-analytics'
  }
]

const categories = ['All', 'FinTech', 'DevOps', 'Healthcare', 'Education', 'Analytics', 'Security', 'IoT']

export default function DemosPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [hoveredDemo, setHoveredDemo] = useState<string | null>(null)

  const filteredDemos = selectedCategory === 'All' 
    ? demos 
    : demos.filter(demo => demo.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isDemoAvailable = (path: string) => {
    return path !== '#'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Play className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Interactive Product Demos
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto mb-8"
          >
            Experience fully functional, production-grade applications showcasing advanced development capabilities, 
            security features, and real-time data processing.
          </motion.p>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="gap-2"
              >
                {category === 'All' && <Star className="w-3 h-3" />}
                {category}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredDemo(demo.id)}
              onMouseLeave={() => setHoveredDemo(null)}
            >
              <Card className={`h-full transition-all duration-300 ${
                hoveredDemo === demo.id ? 'shadow-xl scale-105' : 'shadow-lg'
              } ${!isDemoAvailable(demo.path) ? 'opacity-75' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${demo.color} rounded-xl flex items-center justify-center`}>
                      <demo.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {demo.category}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(demo.difficulty)}`}>
                        {demo.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl mb-2">{demo.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {demo.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700">Key Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {demo.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-lg">
                    {Object.entries(demo.stats).map(([key, value]) => (
                      <div key={key}>
                        <div className="text-lg font-bold text-slate-900">{value}</div>
                        <div className="text-xs text-slate-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {isDemoAvailable(demo.path) ? (
                      <Link href={demo.path} className="flex-1">
                        <Button className="w-full gap-2">
                          <Play className="w-4 h-4" />
                          Launch Demo
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full gap-2">
                        <Clock className="w-4 h-4" />
                        Coming Soon
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="w-3 h-3" />
                      Details
                    </Button>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center justify-center text-sm text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {demo.duration}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Demo Platform Statistics</h2>
              <p className="text-slate-600">Real-time metrics from our interactive demos</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">9</div>
                <div className="text-sm text-slate-600">Production Demos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">100K+</div>
                <div className="text-sm text-slate-600">Demo Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">10M+</div>
                <div className="text-sm text-slate-600">API Calls</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-16 text-center"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <h2 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              These demos showcase advanced development capabilities, security features, and real-time data processing. 
              Let's discuss how we can build similar solutions for your business.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Get Started
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  View All Projects
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}