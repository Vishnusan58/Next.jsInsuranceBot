"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';

interface Message {
    type: 'user' | 'bot';
    content: string;
    options?: string[];
    recommendations?: any[];
    summary?: string;
}

const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        { type: 'bot', content: "Hey Alex , How can I help you?. I am your personalized insurance assistant." }

    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const userId = useRef(Math.random().toString(36).substring(7));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setInputValue('');
        setLoading(true);

        // Add user message to chat
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, userId: userId.current }),
            });

            const data = await response.json();

            // Handle different response types
            let botMessage: Message = { type: 'bot', content: data.message };

            if (data.type === 'question' && data.options) {
                botMessage.options = data.options;
            } else if (data.type === 'recommendations') {
                botMessage.recommendations = data.recommendations;
            } else if (data.type === 'plan_selected') {
                // Display the personalized summary
                botMessage.content = data.message;
                botMessage.summary = data.summary;
            }

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'Sorry, there was an error processing your request.'
            }]);
        }

        setLoading(false);
    };

    const renderMessage = (message: Message, index: number) => {
        if (message.type === 'user') {
            return (
                <div key={index} className="flex justify-end mb-4">
                    <div className="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-[70%]">
                        {message.content}
                    </div>
                </div>
            );
        }

        return (
            <div key={index} className="flex flex-col mb-4">
                <div className="bg-gray-100 rounded-lg py-2 px-4 max-w-[70%]">
                    <div className="mb-2">{message.content}</div>

                    {/* Display options if available */}
                    {message.options && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {message.options.map((option, i) => (
                                <Button
                                    key={i}
                                    variant="outline"
                                    className="text-sm"
                                    onClick={() => {
                                        setInputValue(option);
                                        handleSubmit(new Event('submit') as any);
                                    }}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Display recommendations if available */}
                    {message.recommendations && (
                        <div className="mt-4 space-y-4">
                            {message.recommendations.map((plan, i) => (
                                <Card key={i} className="p-4">
                                    <h3 className="font-bold mb-2">{plan.name}</h3>
                                    <div className="text-sm space-y-1">
                                        {plan.features.map((feature: string, j: number) => (
                                            <div key={j}>{feature}</div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Display personalized summary if available */}
                    {message.summary && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-bold mb-2">Your Personalized Plan Summary</h3>
                            <div className="text-sm whitespace-pre-wrap">{message.summary}</div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 bg-blue-500 text-white">
                <h1 className="text-xl font-bold">Insurance Assistant</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => renderMessage(message, index))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
