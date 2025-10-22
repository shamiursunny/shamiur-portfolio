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
  Users,
  Calendar,
  Video,
  FileText,
  Shield,
  Heart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Phone,
  MessageCircle,
  Stethoscope,
  Pill,
  Syringe,
  Thermometer,
  TrendingUp,
  UserCheck,
  Lock,
  Eye,
  Download
} from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  lastVisit: string
  nextAppointment: string
  status: 'stable' | 'critical' | 'improving'
  riskLevel: 'low' | 'medium' | 'high'
}

interface Appointment {
  id: string
  patientName: string
  doctor: string
  type: string
  time: string
  duration: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  isTelemedicine: boolean
}

interface VitalSign {
  type: string
  value: string
  unit: string
  status: 'normal' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  timestamp: string
}

const generatePatients = (): Patient[] => [
  {
    id: 'P001',
    name: 'John Smith',
    age: 45,
    gender: 'Male',
    condition: 'Hypertension',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-01-22',
    status: 'stable',
    riskLevel: 'medium'
  },
  {
    id: 'P002',
    name: 'Sarah Johnson',
    age: 32,
    gender: 'Female',
    condition: 'Diabetes Type 2',
    lastVisit: '2024-01-14',
    nextAppointment: '2024-01-21',
    status: 'improving',
    riskLevel: 'medium'
  },
  {
    id: 'P003',
    name: 'Michael Chen',
    age: 67,
    gender: 'Male',
    condition: 'Coronary Artery Disease',
    lastVisit: '2024-01-16',
    nextAppointment: '2024-01-20',
    status: 'critical',
    riskLevel: 'high'
  },
  {
    id: 'P004',
    name: 'Emily Davis',
    age: 28,
    gender: 'Female',
    condition: 'Asthma',
    lastVisit: '2024-01-13',
    nextAppointment: '2024-01-27',
    status: 'stable',
    riskLevel: 'low'
  }
]

const generateAppointments = (): Appointment[] => [
  {
    id: 'A001',
    patientName: 'John Smith',
    doctor: 'Dr. Sarah Wilson',
    type: 'Follow-up',
    time: '09:00 AM',
    duration: '30 min',
    status: 'scheduled',
    isTelemedicine: false
  },
  {
    id: 'A002',
    patientName: 'Sarah Johnson',
    doctor: 'Dr. Michael Brown',
    type: 'Consultation',
    time: '10:30 AM',
    duration: '45 min',
    status: 'scheduled',
    isTelemedicine: true
  },
  {
    id: 'A003',
    patientName: 'Michael Chen',
    doctor: 'Dr. Emily Davis',
    type: 'Cardiology Review',
    time: '02:00 PM',
    duration: '60 min',
    status: 'in-progress',
    isTelemedicine: false
  },
  {
    id: 'A004',
    patientName: 'Emily Davis',
    doctor: 'Dr. James Lee',
    type: 'Check-up',
    time: '03:30 PM',
    duration: '30 min',
    status: 'scheduled',
    isTelemedicine: true
  }
]

const generateVitalSigns = (): VitalSign[] => [
  {
    type: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    status: 'normal',
    trend: 'stable',
    timestamp: '2 mins ago'
  },
  {
    type: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    status: 'normal',
    trend: 'stable',
    timestamp: '2 mins ago'
  },
  {
    type: 'Temperature',
    value: '98.6',
    unit: '°F',
    status: 'normal',
    trend: 'stable',
    timestamp: '5 mins ago'
  },
  {
    type: 'Oxygen Saturation',
    value: '98',
    unit: '%',
    status: 'normal',
    trend: 'up',
    timestamp: '2 mins ago'
  },
  {
    type: 'Blood Glucose',
    value: '142',
    unit: 'mg/dL',
    status: 'warning',
    trend: 'up',
    timestamp: '10 mins ago'
  }
]

const complianceMetrics = [
  { name: 'HIPAA Compliance', score: 98, status: 'compliant' },
  { name: 'Data Encryption', score: 100, status: 'compliant' },
  { name: 'Access Control', score: 95, status: 'compliant' },
  { name: 'Audit Logging', score: 92, status: 'compliant' },
  { name: 'Data Backup', score: 88, status: 'in-progress' }
]

export default function HealthcareSystem() {
  const [patients, setPatients] = useState<Patient[]>(generatePatients())
  const [appointments, setAppointments] = useState<Appointment[]>(generateAppointments())
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>(generateVitalSigns())
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update vital signs
      setVitalSigns(prev => prev.map(vital => ({
        ...vital,
        value: vital.type === 'Heart Rate' 
          ? String(Math.floor(Math.random() * 20) + 65)
          : vital.type === 'Blood Pressure'
          ? `${Math.floor(Math.random() * 20) + 110}/${Math.floor(Math.random() * 10) + 75}`
          : vital.value,
        timestamp: 'Just now',
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
      case 'normal':
      case 'completed':
      case 'compliant':
        return 'text-green-600 bg-green-100'
      case 'critical':
      case 'warning':
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100'
      case 'improving':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-green-500" />
      case 'down':
        return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Healthcare Management System</h1>
            <p className="text-slate-600">HIPAA-compliant electronic health records and telemedicine platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              Emergency
            </Button>
            <Button className="gap-2">
              <Video className="w-4 h-4" />
              Start Telemedicine
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
                  <CardTitle className="text-sm font-medium text-slate-600">Total Patients</CardTitle>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">1,247</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12 this week
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
                  <CardTitle className="text-sm font-medium text-slate-600">Appointments Today</CardTitle>
                  <Calendar className="w-4 h-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">24</div>
                <div className="flex items-center text-sm text-blue-600 mt-1">
                  <Video className="w-3 h-3 mr-1" />
                  8 telemedicine
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
                  <CardTitle className="text-sm font-medium text-slate-600">Critical Cases</CardTitle>
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">3</div>
                <div className="flex items-center text-sm text-yellow-600 mt-1">
                  <Heart className="w-3 h-3 mr-1" />
                  Requires attention
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
                  <CardTitle className="text-sm font-medium text-slate-600">HIPAA Score</CardTitle>
                  <Shield className="w-4 h-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">98.5</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <Lock className="w-3 h-3 mr-1" />
                  Fully compliant
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="telemedicine">Telemedicine</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Patients */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>Latest patient updates and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patients.slice(0, 4).map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-sm text-slate-500">
                            {patient.age}y • {patient.condition}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                        <Badge className={getRiskColor(patient.riskLevel)}>
                          {patient.riskLevel} risk
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vital Signs Monitor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Live Vital Signs Monitor
                </CardTitle>
                <CardDescription>Real-time patient vital signs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vitalSigns.map((vital, index) => (
                    <motion.div
                      key={vital.type}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                          {vital.type === 'Heart Rate' && <Heart className="w-4 h-4 text-red-500" />}
                          {vital.type === 'Blood Pressure' && <Activity className="w-4 h-4 text-blue-500" />}
                          {vital.type === 'Temperature' && <Thermometer className="w-4 h-4 text-orange-500" />}
                          {vital.type === 'Oxygen Saturation' && <Activity className="w-4 h-4 text-cyan-500" />}
                          {vital.type === 'Blood Glucose' && <Activity className="w-4 h-4 text-purple-500" />}
                        </div>
                        <div>
                          <div className="font-medium">{vital.type}</div>
                          <div className="text-sm text-slate-500">{vital.timestamp}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {vital.value} <span className="text-sm text-slate-500">{vital.unit}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(vital.trend)}
                            <Badge className={getStatusColor(vital.status)}>
                              {vital.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Patient Management</CardTitle>
                  <CardDescription>Comprehensive patient records and management</CardDescription>
                </div>
                <Button className="gap-2">
                  <Users className="w-4 h-4" />
                  Add Patient
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {patients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-slate-600">
                            <div>Age: {patient.age} years</div>
                            <div>Gender: {patient.gender}</div>
                            <div>Condition: {patient.condition}</div>
                            <div>Last Visit: {patient.lastVisit}</div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="gap-2">
                              <FileText className="w-3 h-3" />
                              View Records
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Calendar className="w-3 h-3" />
                              Schedule
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                              <MessageCircle className="w-3 h-3" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                        <Badge className={getRiskColor(patient.riskLevel)}>
                          {patient.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>Manage patient appointments and schedules</CardDescription>
                </div>
                <Button className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Appointment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {appointment.isTelemedicine ? (
                          <Video className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{appointment.patientName}</h3>
                        <div className="text-sm text-slate-600">
                          {appointment.doctor} • {appointment.type}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-sm">{appointment.time} • {appointment.duration}</span>
                          {appointment.isTelemedicine && (
                            <Badge variant="outline" className="gap-1">
                              <Video className="w-3 h-3" />
                              Telemedicine
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        {appointment.status === 'scheduled' ? 'Start' : 'View'}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="telemedicine" className="space-y-6">
          <Alert>
            <Video className="h-4 w-4" />
            <AlertTitle>Secure Telemedicine Platform</AlertTitle>
            <AlertDescription>
              HIPAA-compliant video consultations with end-to-end encryption and screen sharing capabilities.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Consultations</CardTitle>
                <CardDescription>Currently ongoing telemedicine sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.filter(a => a.isTelemedicine && a.status === 'in-progress').map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h3 className="font-medium">{appointment.patientName}</h3>
                          <p className="text-sm text-slate-600">{appointment.doctor}</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                          Live
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-2">
                          <Video className="w-3 h-3" />
                          Join Session
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageCircle className="w-3 h-3" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Telemedicine Features</CardTitle>
                <CardDescription>Available telemedicine capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">End-to-End Encryption</div>
                      <div className="text-sm text-slate-600">256-bit encryption for all consultations</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Screen Sharing</div>
                      <div className="text-sm text-slate-600">Share medical records and test results</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileText className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium">Digital Prescriptions</div>
                      <div className="text-sm text-slate-600">E-prescribe with pharmacy integration</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Lock className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-medium">Secure Recordings</div>
                      <div className="text-sm text-slate-600">Encrypted session recordings with consent</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>HIPAA Compliance Dashboard</CardTitle>
              <CardDescription>Real-time compliance monitoring and audit trails</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complianceMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{metric.name}</h3>
                        <Badge variant={metric.status === 'compliant' ? 'default' : 'secondary'}>
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Compliance Score</span>
                          <span className="font-medium">{metric.score}%</span>
                        </div>
                        <Progress value={metric.score} className="h-2" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
                <CardDescription>Implemented security measures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Multi-factor authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Role-based access control</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Audit logging and monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Data encryption at rest and in transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Business continuity and disaster recovery</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Activities</CardTitle>
                <CardDescription>Latest security and compliance events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">Access Log Review</div>
                      <div className="text-xs text-slate-500">2 hours ago</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">Encryption Key Rotation</div>
                      <div className="text-xs text-slate-500">1 day ago</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">Vulnerability Scan</div>
                      <div className="text-xs text-slate-500">3 days ago</div>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">Backup Verification</div>
                      <div className="text-xs text-slate-500">1 week ago</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500" />
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