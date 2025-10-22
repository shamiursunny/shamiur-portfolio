// Simple in-memory message storage for demo purposes
// In production, this would be handled by the database

interface Message {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  isRead: boolean
}

class MessageStorage {
  private messages: Message[] = [
    {
      id: '1',
      name: 'Sarah Williams',
      email: 'sarah@designstudio.com',
      message: 'Your DevSecOps expertise is exactly what our team needs. Let\'s talk about a potential partnership.',
      createdAt: '2025-10-22T06:33:50.000Z',
      isRead: false
    },
    {
      id: '2',
      name: 'David Chen',
      email: 'david@fintech.com',
      message: 'Impressive work on the cryptocurrency trading dashboard! We\'d like to feature it in our next conference.',
      createdAt: '2025-10-22T06:33:50.000Z',
      isRead: false
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@techcorp.io',
      message: 'Your e-commerce platform project is exactly what we need. Can we schedule a call?',
      createdAt: '2025-10-22T06:33:50.000Z',
      isRead: false
    },
    {
      id: '4',
      name: 'Jane Smith',
      email: 'jane@company.com',
      message: 'We\'re looking for a full-stack developer for our startup. Would love to discuss opportunities.',
      createdAt: '2025-10-22T06:33:50.000Z',
      isRead: false
    },
    {
      id: '5',
      name: 'John Doe',
      email: 'john@example.com',
      message: 'I\'m interested in collaborating on a security project. Your portfolio looks impressive!',
      createdAt: '2025-10-22T06:33:50.000Z',
      isRead: false
    }
  ]

  private listeners: (() => void)[] = []

  getMessages(): Message[] {
    return this.messages
  }

  addMessage(message: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Message {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false
    }
    
    this.messages.unshift(newMessage)
    this.notifyListeners()
    
    return newMessage
  }

  updateMessage(id: string, updates: Partial<Message>): void {
    const index = this.messages.findIndex(m => m.id === id)
    if (index !== -1) {
      this.messages[index] = { ...this.messages[index], ...updates }
      this.notifyListeners()
    }
  }

  deleteMessage(id: string): void {
    this.messages = this.messages.filter(m => m.id !== id)
    this.notifyListeners()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener())
  }
}

export const messageStorage = new MessageStorage()
export type { Message }