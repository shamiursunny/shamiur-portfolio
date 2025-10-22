"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Play, 
  Copy, 
  Download, 
  Upload, 
  Settings, 
  Terminal,
  FileCode,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe
} from "lucide-react"
import { toast } from "sonner"

interface File {
  id: string
  name: string
  language: string
  content: string
}

const SAMPLE_FILES: File[] = [
  {
    id: "1",
    name: "index.tsx",
    language: "typescript",
    content: `import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: inputValue,
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto p-6"
    >
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Add a new todo..."
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <motion.li
            key={todo.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 p-2 border rounded"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
              {todo.text}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};`
  },
  {
    id: "2",
    name: "styles.css",
    language: "css",
    content: `/* Modern CSS with animations and variables */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --background: #ffffff;
  --surface: #f8fafc;
  --text: #1e293b;
  --text-secondary: #64748b;
  --border: #e2e8f0;
  --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --radius: 0.5rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--background);
  color: var(--text);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--secondary-color);
}

.btn-secondary:hover {
  background: #7c3aed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .card {
    padding: 1rem;
  }
}`
  },
  {
    id: "3",
    name: "server.js",
    language: "javascript",
    content: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Store connected users
const connectedUsers = new Set();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  connectedUsers.add(socket.id);
  
  // Broadcast user count
  io.emit('userCount', connectedUsers.size);
  
  // Handle code collaboration
  socket.on('codeChange', (data) => {
    socket.broadcast.emit('codeUpdate', data);
  });
  
  // Handle cursor position
  socket.on('cursorMove', (data) => {
    socket.broadcast.emit('cursorUpdate', {
      ...data,
      userId: socket.id
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    connectedUsers.delete(socket.id);
    io.emit('userCount', connectedUsers.size);
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    users: connectedUsers.size 
  });
});

app.post('/api/execute', async (req, res) => {
  const { code, language } = req.body;
  
  try {
    // Code execution logic (sandboxed environment)
    const result = await executeCode(code, language);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Sandboxed code execution
async function executeCode(code, language) {
  // This would integrate with a sandboxed execution environment
  // For demo purposes, we'll just return a mock result
  return {
    output: "Code executed successfully!",
    executionTime: Math.random() * 1000,
    memory: Math.floor(Math.random() * 50) + 'MB'
  };
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
  }
]

const LANGUAGE_CONFIG = {
  typescript: { color: "blue", icon: "📘" },
  javascript: { color: "yellow", icon: "📜" },
  css: { color: "purple", icon: "🎨" },
  html: { color: "orange", icon: "🌐" },
  json: { color: "green", icon: "📋" }
}

export default function CodeEditorDemo() {
  const [files, setFiles] = useState<File[]>(SAMPLE_FILES)
  const [activeFileId, setActiveFileId] = useState("1")
  const [code, setCode] = useState(SAMPLE_FILES[0].content)
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState("")
  const [connectedUsers, setConnectedUsers] = useState(3)
  const [executionTime, setExecutionTime] = useState(0)

  const activeFile = files.find(f => f.id === activeFileId)
  const languageConfig = LANGUAGE_CONFIG[activeFile?.language as keyof typeof LANGUAGE_CONFIG]

  useEffect(() => {
    // Simulate real-time collaboration
    const interval = setInterval(() => {
      setConnectedUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput("Compiling...")
    
    // Simulate code execution
    setTimeout(() => {
      const execTime = Math.random() * 2000 + 500
      setExecutionTime(execTime)
      setOutput(`✅ Code executed successfully!
      
Execution Time: ${execTime.toFixed(2)}ms
Memory Usage: ${(Math.random() * 50 + 10).toFixed(2)}MB
Output: Hello, World!
Current Date: ${new Date().toLocaleString()}

Process finished with exit code 0`)
      setIsRunning(false)
    }, 2000)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied to clipboard")
  }

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeFile?.name || 'code.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success("File downloaded")
  }

  const handleFileChange = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (file) {
      setActiveFileId(fileId)
      setCode(file.content)
      setOutput("")
    }
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    // Update file content
    setFiles(prev => prev.map(f => 
      f.id === activeFileId ? { ...f, content: newCode } : f
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <FileCode className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Code Editor Pro
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Advanced code editor with syntax highlighting, real-time collaboration, and instant execution.
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <Badge variant="secondary" className="gap-1">
              <Zap className="w-3 h-3" />
              Live Execution
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Globe className="w-3 h-3" />
              Real-time Sync
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Terminal className="w-3 h-3" />
              {connectedUsers} users online
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* File Explorer */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileCode className="w-5 h-5" />
                  Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {files.map((file) => (
                  <Button
                    key={file.id}
                    variant={activeFileId === file.id ? "default" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => handleFileChange(file.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span>{LANGUAGE_CONFIG[file.language as keyof typeof LANGUAGE_CONFIG]?.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{file.name}</div>
                        <div className="text-xs text-muted-foreground capitalize">{file.language}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={handleCopyCode}
                >
                  <Copy className="w-4 h-4" />
                  Copy Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={handleDownloadCode}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Editor Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Editor */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-${languageConfig?.color}-500`} />
                    <span className="font-medium">{activeFile?.name}</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {activeFile?.language}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {isRunning ? "Running..." : "Run"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/50 border-r text-xs text-muted-foreground p-2 select-none">
                    {code.split('\n').map((_, i) => (
                      <div key={i} className="text-right">{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    className="w-full h-96 pl-14 pr-4 py-3 font-mono text-sm bg-muted/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    spellCheck={false}
                    placeholder="Start typing your code..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Output
                  </CardTitle>
                  {executionTime > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {executionTime.toFixed(2)}ms
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48 w-full rounded-md border p-4 bg-black text-green-400 font-mono text-sm">
                  {output || "Click 'Run' to execute your code..."}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Collaboration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm">{connectedUsers} users editing</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(connectedUsers, 5))].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-white"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}