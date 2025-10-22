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
  Play,
  Pause,
  BookOpen,
  Users,
  Award,
  Clock,
  CheckCircle,
  Star,
  TrendingUp,
  Video,
  FileText,
  MessageCircle,
  Download,
  BarChart3,
  Target,
  Brain,
  Zap,
  Globe,
  Certificate,
  Calendar
} from "lucide-react"

interface Course {
  id: string
  title: string
  instructor: string
  category: string
  duration: string
  enrolled: number
  rating: number
  progress: number
  thumbnail: string
  description: string
  modules: number
  completedModules: number
  lastAccessed: string
}

interface Student {
  id: string
  name: string
  email: string
  enrolledCourses: number
  completedCourses: number
  totalHours: number
  certificates: number
  joinDate: string
  lastActive: string
  avatar: string
}

interface LiveSession {
  id: string
  title: string
  instructor: string
  startTime: string
  duration: string
  attendees: number
  status: 'live' | 'upcoming' | 'ended'
  category: string
}

const generateCourses = (): Course[] => [
  {
    id: 'C001',
    title: 'Advanced React Development',
    instructor: 'Dr. Sarah Johnson',
    category: 'Web Development',
    duration: '12 weeks',
    enrolled: 1234,
    rating: 4.8,
    progress: 75,
    thumbnail: '/api/placeholder/300/200',
    description: 'Master advanced React concepts including hooks, context, and performance optimization',
    modules: 12,
    completedModules: 9,
    lastAccessed: '2 hours ago'
  },
  {
    id: 'C002',
    title: 'Machine Learning Fundamentals',
    instructor: 'Prof. Michael Chen',
    category: 'Data Science',
    duration: '16 weeks',
    enrolled: 892,
    rating: 4.9,
    progress: 45,
    thumbnail: '/api/placeholder/300/200',
    description: 'Learn the fundamentals of machine learning and build predictive models',
    modules: 16,
    completedModules: 7,
    lastAccessed: '1 day ago'
  },
  {
    id: 'C003',
    title: 'Cloud Architecture with AWS',
    instructor: 'Emily Rodriguez',
    category: 'Cloud Computing',
    duration: '10 weeks',
    enrolled: 756,
    rating: 4.7,
    progress: 90,
    thumbnail: '/api/placeholder/300/200',
    description: 'Design and deploy scalable cloud solutions using AWS services',
    modules: 10,
    completedModules: 9,
    lastAccessed: '3 hours ago'
  },
  {
    id: 'C004',
    title: 'Cybersecurity Essentials',
    instructor: 'James Wilson',
    category: 'Security',
    duration: '8 weeks',
    enrolled: 1456,
    rating: 4.6,
    progress: 30,
    thumbnail: '/api/placeholder/300/200',
    description: 'Essential cybersecurity concepts and best practices for modern applications',
    modules: 8,
    completedModules: 2,
    lastAccessed: '5 days ago'
  }
]

const generateStudents = (): Student[] => [
  {
    id: 'S001',
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    enrolledCourses: 4,
    completedCourses: 2,
    totalHours: 156,
    certificates: 2,
    joinDate: '2024-01-15',
    lastActive: '2 hours ago',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 'S002',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    enrolledCourses: 3,
    completedCourses: 1,
    totalHours: 89,
    certificates: 1,
    joinDate: '2024-01-20',
    lastActive: '1 day ago',
    avatar: '/api/placeholder/40/40'
  },
  {
    id: 'S003',
    name: 'David Kim',
    email: 'david.kim@email.com',
    enrolledCourses: 5,
    completedCourses: 3,
    totalHours: 234,
    certificates: 3,
    joinDate: '2024-01-10',
    lastActive: '30 minutes ago',
    avatar: '/api/placeholder/40/40'
  }
]

const generateLiveSessions = (): LiveSession[] => [
  {
    id: 'L001',
    title: 'React Hooks Deep Dive',
    instructor: 'Dr. Sarah Johnson',
    startTime: '2:00 PM EST',
    duration: '90 minutes',
    attendees: 234,
    status: 'live',
    category: 'Web Development'
  },
  {
    id: 'L002',
    title: 'Neural Networks Workshop',
    instructor: 'Prof. Michael Chen',
    startTime: '4:00 PM EST',
    duration: '120 minutes',
    attendees: 156,
    status: 'upcoming',
    category: 'Data Science'
  },
  {
    id: 'L003',
    title: 'AWS Security Best Practices',
    instructor: 'Emily Rodriguez',
    startTime: '6:00 PM EST',
    duration: '60 minutes',
    attendees: 89,
    status: 'upcoming',
    category: 'Cloud Computing'
  }
]

const learningPaths = [
  {
    name: 'Full Stack Development',
    courses: 8,
    duration: '6 months',
    enrolled: 2341,
    completion: 68
  },
  {
    name: 'Data Science Specialization',
    courses: 10,
    duration: '8 months',
    enrolled: 1876,
    completion: 72
  },
  {
    name: 'Cloud Engineering',
    courses: 6,
    duration: '4 months',
    enrolled: 1234,
    completion: 81
  }
]

export default function ELearningPlatform() {
  const [courses, setCourses] = useState<Course[]>(generateCourses())
  const [students, setStudents] = useState<Student[]>(generateStudents())
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>(generateLiveSessions())
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [watchTime, setWatchTime] = useState(0)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setWatchTime(prev => prev + 1)
      }
      
      // Update live session attendees
      setLiveSessions(prev => prev.map(session => 
        session.status === 'live' 
          ? { ...session, attendees: session.attendees + Math.floor(Math.random() * 3) }
          : session
      ))
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ended':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 30) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">E-Learning Platform</h1>
            <p className="text-slate-600">Interactive learning platform with video streaming and AI-powered recommendations</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </Button>
            <Button className="gap-2">
              <BookOpen className="w-4 h-4" />
              Browse Courses
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
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">12,847</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% this month
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Courses</CardTitle>
                  <BookOpen className="w-4 h-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">156</div>
                <div className="flex items-center text-sm text-blue-600 mt-1">
                  <Video className="w-3 h-3 mr-1" />
                  24 live now
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-600">Certificates Issued</CardTitle>
                  <Award className="w-4 h-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">3,421</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  +142 this week
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
                  <CardTitle className="text-sm font-medium text-slate-600">Completion Rate</CardTitle>
                  <Target className="w-4 h-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">87.3%</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2% improvement
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="live">Live Sessions</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured Course */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Featured Course</CardTitle>
                <CardDescription>Currently trending and highly rated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-2" />
                        <p className="text-lg font-semibold">Advanced React Development</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 gap-2"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? 'Pause' : 'Play'} Preview
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Resources
                      </Button>
                    </div>
                    {isPlaying && (
                      <div className="bg-slate-900 text-white p-3 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span>{formatTime(watchTime)}</span>
                          <span>5:00</span>
                        </div>
                        <Progress value={(watchTime / 300) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Advanced React Development</h3>
                      <p className="text-slate-600 mb-4">
                        Master advanced React concepts including hooks, context, and performance optimization
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">4.8</span>
                          <span className="text-sm text-slate-500">(1,234 reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">1,234 enrolled</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Duration:</span>
                        <span className="ml-2 font-medium">12 weeks</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Modules:</span>
                        <span className="ml-2 font-medium">9/12 completed</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Instructor:</span>
                        <span className="ml-2 font-medium">Dr. Sarah Johnson</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Last accessed:</span>
                        <span className="ml-2 font-medium">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course List */}
            {courses.slice(1).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {course.instructor} • {course.category}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Star className="w-3 h-3" />
                        {course.rating}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 mb-4">{course.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.enrolled}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {course.completedModules}/{course.modules}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-6">
          <Alert>
            <Video className="h-4 w-4" />
            <AlertTitle>Live Learning Sessions</AlertTitle>
            <AlertDescription>
              Interactive live sessions with real-time Q&A and screen sharing capabilities.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {session.title}
                          {session.status === 'live' && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                              <Badge className="bg-red-100 text-red-800">LIVE</Badge>
                            </div>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {session.instructor} • {session.category}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(session.status)}>
                        {session.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.startTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {session.attendees} attending
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">{session.duration}</span>
                      </div>
                      <div className="flex gap-2">
                        {session.status === 'live' ? (
                          <Button className="flex-1 gap-2">
                            <Video className="w-4 h-4" />
                            Join Now
                          </Button>
                        ) : session.status === 'upcoming' ? (
                          <Button variant="outline" className="flex-1 gap-2">
                            <Calendar className="w-4 h-4" />
                            Set Reminder
                          </Button>
                        ) : (
                          <Button variant="outline" className="flex-1 gap-2">
                            <Play className="w-4 h-4" />
                            Watch Recording
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageCircle className="w-3 h-3" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>Track student progress and engagement</CardDescription>
                </div>
                <Button className="gap-2">
                  <Users className="w-4 h-4" />
                  Add Student
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-slate-600">{student.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                          <span>Joined: {student.joinDate}</span>
                          <span>Last active: {student.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Enrolled:</span>
                          <span className="ml-2 font-medium">{student.enrolledCourses}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Completed:</span>
                          <span className="ml-2 font-medium">{student.completedCourses}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Hours:</span>
                          <span className="ml-2 font-medium">{student.totalHours}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Certificates:</span>
                          <span className="ml-2 font-medium">{student.certificates}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">View Profile</Button>
                        <Button variant="outline" size="sm">Message</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Analytics</CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Course Completion</span>
                    <span className="text-2xl font-bold">87.3%</span>
                  </div>
                  <Progress value={87.3} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Student Engagement Rate</span>
                    <span className="text-2xl font-bold">92.1%</span>
                  </div>
                  <Progress value={92.1} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satisfaction Score</span>
                    <span className="text-2xl font-bold">4.7/5</span>
                  </div>
                  <Progress value={94} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Retention Rate</span>
                    <span className="text-2xl font-bold">78.9%</span>
                  </div>
                  <Progress value={78.9} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Personalized learning suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium">Advanced TypeScript</div>
                      <div className="text-sm text-slate-600">Based on your React progress</div>
                    </div>
                    <Badge variant="outline">Recommended</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Performance Optimization</div>
                      <div className="text-sm text-slate-600">Improve your web development skills</div>
                    </div>
                    <Badge variant="outline">Trending</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Global Deployment</div>
                      <div className="text-sm text-slate-600">Learn cloud deployment strategies</div>
                    </div>
                    <Badge variant="outline">Popular</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="paths" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Paths</CardTitle>
              <CardDescription>Structured learning journeys for career development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {learningPaths.map((path, index) => (
                  <motion.div
                    key={path.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{path.name}</CardTitle>
                        <CardDescription>
                          {path.courses} courses • {path.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completion Rate</span>
                              <span className="font-medium">{path.completion}%</span>
                            </div>
                            <Progress value={path.completion} className="h-2" />
                          </div>
                          <div className="text-sm text-slate-600">
                            <div className="flex justify-between">
                              <span>Enrolled Students</span>
                              <span className="font-medium">{path.enrolled.toLocaleString()}</span>
                            </div>
                          </div>
                          <Button className="w-full">
                            Start Learning Path
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}