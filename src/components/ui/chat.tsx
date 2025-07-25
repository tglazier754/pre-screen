'use client';

import { Message, useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"
import { useEffect, useRef } from "react"

export default function Chat({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
    const { input, handleInputChange, handleSubmit, messages, isLoading } = useChat({
        id, // use the provided chat ID
        initialMessages, // initial messages if provided
        sendExtraMessageFields: true, // send id and createdAt for each message
    });

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
    }

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollIntoView(false)
        }
    }, [messages])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-lg overflow-hidden">
                <CardHeader className="border-b flex-shrink-0">
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-blue-600" />
                        AI Chat Assistant
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full p-4 space-y-4">
                        <div className="p-4 space-y-4" ref={scrollAreaRef}>
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-8">
                                    <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Start a conversation with the AI assistant!</p>
                                </div>
                            )}

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {message.role === "assistant" && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-blue-100">
                                                <Bot className="h-4 w-4 text-blue-600" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div
                                        className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                                            }`}
                                    >
                                        {message.parts.map((part, i) => {
                                            switch (part.type) {
                                                case "text":
                                                    return (
                                                        <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">
                                                            {part.text}
                                                        </div>
                                                    )
                                                default:
                                                    return null
                                            }
                                        })}
                                    </div>

                                    {message.role === "user" && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-gray-100">
                                                <User className="h-4 w-4 text-gray-600" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-blue-100">
                                            <Bot className="h-4 w-4 text-blue-600" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.1s" }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.2s" }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="border-t p-4 flex-shrink-0">
                    <form onSubmit={handleSubmit} className="flex w-full gap-2">
                        <Input
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="flex-1"
                            autoFocus
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send message</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}
