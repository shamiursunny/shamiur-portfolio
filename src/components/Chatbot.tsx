"use client"

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    // @ts-ignore - useChat types might mismatch in some environments but are correct at runtime
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Only render after client-side mount to prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Don't render until mounted on client
    if (!mounted) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[400px]"
                    >
                        <Card className="shadow-2xl border-primary/20 bg-background/95 backdrop-blur-md">
                            <CardHeader className="p-4 border-b bg-primary/5">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary rounded-lg">
                                            <Bot className="w-5 h-5 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-bold">Sunny's AI Agent</CardTitle>
                                            <div className="flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Online</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                                    <div className="space-y-4">
                                        {messages.length === 0 && (
                                            <div className="text-center py-8 space-y-4">
                                                <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                                                    <Sparkles className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium">Welcome! I'm Sunny's AI Assistant.</p>
                                                    <p className="text-xs text-muted-foreground px-4">
                                                        I can help you build your next project. Tell me what you have in mind!
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {messages.map((m: any) => (
                                            <div
                                                key={m.id}
                                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user'
                                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                        : 'bg-muted text-foreground rounded-tl-none border border-border'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1 opacity-70">
                                                        {m.role === 'user' ? (
                                                            <User className="w-3 h-3" />
                                                        ) : (
                                                            <Bot className="w-3 h-3" />
                                                        )}
                                                        <span className="text-[10px] font-bold uppercase">
                                                            {m.role === 'user' ? 'You' : 'Agent'}
                                                        </span>
                                                    </div>
                                                    <div className="whitespace-pre-wrap leading-relaxed">
                                                        {m.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-muted p-3 rounded-2xl rounded-tl-none border border-border">
                                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="p-4 border-t bg-muted/5">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex w-full items-center space-x-2"
                                >
                                    <Input
                                        value={input || ''}
                                        onChange={handleInputChange}
                                        placeholder="Describe your project..."
                                        className="flex-1 bg-background border-primary/10 focus-visible:ring-primary"
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading || !input?.trim()}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-all duration-300"
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <MessageSquare className="h-6 w-6" />
                    )}
                </Button>
            </motion.div>
        </div>
    );
}
