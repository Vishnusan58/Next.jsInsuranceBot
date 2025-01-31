// src/components/Chatbot/index.tsx
"use client"
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface ChatbotResponse {
    type: 'question' | 'recommendations' | 'error';
    message: string;
    options?: string[];
    questionType?: 'text' | 'options' | 'boolean';
    recommendations?: Array<{
        name: string;
        coverage_amount: string;
        monthly_premium: number;
        description: string;
        features: string[];
    }>;
}


interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    options?: string[];
    questionType?: 'text' | 'options' | 'boolean';
    recommendations?: any[];
}

export default function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: uuidv4(),
            sender: 'bot',
            text: "Hi! I'm your insurance assistant. What's your name?",
            questionType: 'text'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userId] = useState(uuidv4());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const addMessage = (message: Message) => {
        setMessages(prev => [...prev, message]);
    };

    const handleChatbotResponse = async (userInput: string) => {
        setIsLoading(true);
        console.log('Sending request to API...', userInput);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userInput,
                    userId: userId
                }),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ChatbotResponse = await response.json();
            console.log('Received data:', data);

            if (data.type === 'recommendations') {
                addMessage({
                    id: uuidv4(),
                    sender: 'bot',
                    text: data.message,
                    recommendations: data.recommendations
                });
            } else {
                addMessage({
                    id: uuidv4(),
                    sender: 'bot',
                    text: data.message,
                    options: data.options,
                    questionType: data.questionType
                });
            }
        } catch (error) {
            console.error('Chat Error:', error);
            addMessage({
                id: uuidv4(),
                sender: 'bot',
                text: 'Sorry, I encountered an error. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = (option: string) => {
        addMessage({
            id: uuidv4(),
            sender: 'user',
            text: option
        });
        handleChatbotResponse(option);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: uuidv4(),
            sender: 'user',
            text: input
        };
        addMessage(userMessage);

        const userInput = input;
        setInput('');
        await handleChatbotResponse(userInput);
    };

    const renderRecommendation = (plan: any, index: number) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium text-gray-800">{plan.name}</h3>
            <p className="text-sm text-gray-600">Coverage: {plan.coverage_amount}</p>
            <p className="text-sm text-gray-600">Premium: ${plan.monthly_premium}/month</p>
            <div className="mt-2">
                {plan.features.map((feature: string, i: number) => (
                    <p key={i} className="text-xs text-gray-500">• {feature}</p>
                ))}
            </div>
        </div>
    );

    const renderOptions = (options: string[], questionType: string) => (
        <div className="mt-4 space-y-2">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`w-full text-left p-3 rounded 
            ${questionType === 'boolean'
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'bg-white hover:bg-gray-50'}
            transition-colors duration-200 shadow-sm text-gray-800`}
                >
                    {option}
                </button>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl">
            <div className="bg-blue-600 p-4 rounded-t-lg">
                <h2 className="text-white text-lg font-semibold">Insurance Assistant</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-lg p-4 ${
                                    message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100'
                                }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                {message.options && message.questionType &&
                                    renderOptions(message.options, message.questionType)}
                                {message.recommendations && (
                                    <div className="mt-4 space-y-4">
                                        {message.recommendations.map((plan, index) =>
                                            renderRecommendation(plan, index)
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex space-x-2 p-4"
                        >
                            <div className="typing-indicator">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg border-gray-300 focus:border-blue-500
                     focus:ring-blue-500 transition-colors duration-200"
                        disabled={isLoading}
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700
                     transition-colors duration-200 disabled:opacity-50"
                    >
                        Send
                    </motion.button>
                </div>
            </form>
        </div>
    );
}