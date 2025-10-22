"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  User, 
  Flag,
  Filter,
  Search,
  LayoutGrid,
  List,
  CheckCircle,
  Circle,
  AlertCircle,
  Archive,
  Trash2,
  Edit,
  Copy,
  Star
} from "lucide-react"
import { toast } from "sonner"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  assignee: string
  dueDate: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create a modern, responsive landing page with hero section and feature highlights",
    status: "in-progress",
    priority: "high",
    assignee: "John Doe",
    dueDate: "2024-01-20",
    tags: ["design", "frontend"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Add JWT-based authentication with refresh tokens and social login options",
    status: "todo",
    priority: "urgent",
    assignee: "Jane Smith",
    dueDate: "2024-01-18",
    tags: ["backend", "security"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12")
  },
  {
    id: "3",
    title: "Optimize database queries",
    description: "Review and optimize slow queries, add proper indexing",
    status: "review",
    priority: "medium",
    assignee: "Bob Johnson",
    dueDate: "2024-01-22",
    tags: ["database", "performance"],
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16")
  },
  {
    id: "4",
    title: "Write API documentation",
    description: "Create comprehensive API documentation with examples and testing guides",
    status: "done",
    priority: "low",
    assignee: "Alice Brown",
    dueDate: "2024-01-15",
    tags: ["documentation"],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-14")
  },
  {
    id: "5",
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions with automated testing and deployment",
    status: "in-progress",
    priority: "high",
    assignee: "Charlie Wilson",
    dueDate: "2024-01-25",
    tags: ["devops", "automation"],
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-15")
  }
]

const TEAM_MEMBERS = [
  "John Doe", "Jane Smith", "Bob Johnson", "Alice Brown", "Charlie Wilson", "Diana Prince"
]

const COLUMNS = [
  { id: "todo", title: "To Do", color: "gray" },
  { id: "in-progress", title: "In Progress", color: "blue" },
  { id: "review", title: "Review", color: "yellow" },
  { id: "done", title: "Done", color: "green" }
]

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
}

export default function TaskManagerDemo() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    assignee: "",
    dueDate: "",
    tags: ""
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => ({
        ...task,
        updatedAt: new Date()
      })))
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required")
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      assignee: newTask.assignee || "Unassigned",
      dueDate: newTask.dueDate,
      tags: newTask.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setTasks(prev => [...prev, task])
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      dueDate: "",
      tags: ""
    })
    setIsCreateDialogOpen(false)
    toast.success("Task created successfully")
  }

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus, updatedAt: new Date() }
        : task
    ))
    toast.success("Task status updated")
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success("Task deleted")
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    return matchesSearch && matchesPriority
  })

  const getTasksByStatus = (status: Task["status"]) => {
    return filteredTasks.filter(task => task.status === status)
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "todo": return <Circle className="w-4 h-4" />
      case "in-progress": return <Clock className="w-4 h-4" />
      case "review": return <AlertCircle className="w-4 h-4" />
      case "done": return <CheckCircle className="w-4 h-4" />
    }
  }

  const TaskCard = ({ task }: { task: Task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg border p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          <h3 className="font-medium text-sm">{task.title}</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between mb-3">
        <Badge className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </Badge>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {task.dueDate}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs">
            {task.assignee.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
        
        <div className="flex gap-1">
          {task.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  )

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
              Task Manager Pro
            </h1>
            <p className="text-muted-foreground">Collaborative task management with real-time updates</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Add a new task to your project board
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={newTask.priority} onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Assignee</label>
                      <Select value={newTask.assignee} onValueChange={(value) => setNewTask(prev => ({ ...prev, assignee: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEAM_MEMBERS.map(member => (
                            <SelectItem key={member} value={member}>{member}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <Input
                      value={newTask.tags}
                      onChange={(e) => setNewTask(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask}>
                      Create Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Tasks", value: tasks.length, color: "blue" },
            { label: "In Progress", value: getTasksByStatus("in-progress").length, color: "yellow" },
            { label: "Review", value: getTasksByStatus("review").length, color: "orange" },
            { label: "Completed", value: getTasksByStatus("done").length, color: "green" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                      <Flag className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {COLUMNS.map((column) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: COLUMNS.indexOf(column) * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(column.id as Task["status"])}
                      {column.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {getTasksByStatus(column.id as Task["status"]).length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AnimatePresence>
                    {getTasksByStatus(column.id as Task["status"]).map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </AnimatePresence>
                  
                  {getTasksByStatus(column.id as Task["status"]).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="text-sm">No tasks in {column.title}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}