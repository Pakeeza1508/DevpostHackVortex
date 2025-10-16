import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  X,
  Send,
  MessageCircle,
  Sparkles,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AIChatBot = ({ onClose, user, lessonContext = null }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: `Hello there, space cadet! I'm Dr. Rabbit, your friendly AI dental tutor. I'm here to help you learn about dental health and answer any questions you might have. ${
        lessonContext
          ? `I see you're working on "${lessonContext.title}" - feel free to ask me anything about it!`
          : "What would you like to know about dental health today?"
      }`,
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    "How often should I brush my teeth?",
    "What foods are bad for teeth?",
    "Why do we need fluoride?",
    "How do cavities form?",
    "What's the best way to floss?",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (messageText = currentMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const context = lessonContext
        ? `Current lesson: ${lessonContext.title}. Lesson content: ${lessonContext.description}`
        : "";

      const response = await axios.post(`${API}/ai/ask`, {
        question: messageText,
        context: context,
        user_id: user?.id,
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.response,
        timestamp: new Date(),
        suggestions: response.data.suggestions || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content:
          "I'm having some technical difficulties right now, but I'm still here to help! Try asking me about basic dental care, and I'll do my best to assist you.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(
        "Dr. Rabbit is having some technical issues, but still wants to help!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-2xl h-[80vh] flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <Card className="glass-card border-0 h-full flex flex-col">
          {/* Header */}
          <CardHeader className="pb-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-white font-orbitron">
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mr-3"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <img
                    src="https://img.freepik.com/free-vector/cute-rabbit-waving-hand-cartoon-vector-icon-illustration-animal-nature-icon-isolated-flat-vector_138676-13891.jpg"
                    alt="Dr. Rabbit"
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      e.target.innerHTML = "🐰";
                      e.target.className = "text-lg";
                    }}
                  />
                </motion.div>
                Dr. Rabbit - AI Dental Tutor
              </CardTitle>
              <Button
                onClick={onClose}
                className="neon-button p-2"
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-cyan-400 font-space text-sm ml-13">
              Your friendly AI companion for dental health questions
            </p>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-hidden p-0">
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.type === "user" ? "order-2" : "order-1"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-2xl font-space text-sm ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-100 ml-auto"
                              : "bg-black/30 text-gray-100 border border-white/10"
                          }`}
                        >
                          {message.type === "ai" && (
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mr-2">
                                <img
                                  src="https://img.freepik.com/free-vector/cute-rabbit-waving-hand-cartoon-vector-icon-illustration-animal-nature-icon-isolated-flat-vector_138676-13891.jpg"
                                  alt="Dr. Rabbit"
                                  className="w-4 h-4 object-contain"
                                  onError={(e) => {
                                    e.target.innerHTML = "🐰";
                                    e.target.className = "text-xs";
                                  }}
                                />
                              </div>
                              <span className="text-cyan-400 font-orbitron text-xs font-semibold">
                                Dr. Rabbit
                              </span>
                            </div>
                          )}
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {message.content}
                            </ReactMarkdown>
                          </div>

                          {/* AI Suggestions */}
                          {message.type === "ai" &&
                            message.suggestions &&
                            message.suggestions.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <p className="text-xs text-gray-400 mb-2 flex items-center">
                                  <Lightbulb className="w-3 h-3 mr-1" />
                                  You might also ask:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {message.suggestions
                                    .slice(0, 2)
                                    .map((suggestion, index) => (
                                      <Button
                                        key={index}
                                        onClick={() =>
                                          handleQuickQuestion(suggestion)
                                        }
                                        className="text-xs px-2 py-1 h-auto bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                        variant="outline"
                                        size="sm"
                                      >
                                        {suggestion}
                                      </Button>
                                    ))}
                                </div>
                              </div>
                            )}

                          <div className="text-xs text-gray-400 mt-2 text-right">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading Animation */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/10 max-w-[80%]">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mr-2">
                          <span className="text-xs">🐰</span>
                        </div>
                        <span className="text-cyan-400 font-orbitron text-xs font-semibold">
                          Dr. Rabbit
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <motion.div
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="border-t border-white/10 p-3">
                <p className="text-xs text-gray-400 mb-2 flex items-center">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.slice(0, 3).map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      disabled={isLoading}
                      className="text-xs px-3 py-1 h-auto bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      variant="outline"
                      size="sm"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-white/10 p-4">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && !e.shiftKey && handleSendMessage()
                    }
                    placeholder="Ask Dr. Rabbit about dental health..."
                    disabled={isLoading}
                    className="flex-1 bg-black/20 border-white/20 text-white placeholder-gray-400 font-space"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!currentMessage.trim() || isLoading}
                    className="neon-button px-4"
                    variant="outline"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AIChatBot;
