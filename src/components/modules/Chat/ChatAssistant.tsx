"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  User,
  Bot,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { TextStreamChatTransport } from "ai";

const QUICK_ACTIONS = [
  { label: "🔥 Trending Products", value: "What are the trending products today?" },
  { label: "🚀 Launch a Product", value: "How can I launch my product on Products Hunt?" },
  { label: "📊 Upvote System", value: "How does the upvote system work?" },
  { label: "🏆 Leaderboard", value: "How to get on the weekly leaderboard?" },
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new TextStreamChatTransport({ api: "/api/v1/chat" }),
    onFinish: () => scrollToBottom(),
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  // Log error for debugging
  useEffect(() => {
    if (error) {
      console.error("Chat error details:", error);
    }
  }, [error]);

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleQuickAction = (value: string) => {
    setInput(value);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              height: isMinimized ? "auto" : "550px",
              width: "380px"
            }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            className="mb-4 bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF5E3A] to-[#E5532D] dark:from-[#FF5E3A] dark:to-[#E5532D] p-4 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-md">
                  <Sparkles className="w-5 h-5 text-[#FF5E3A]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Products Hunt AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                    <span className="text-[10px] text-orange-100 uppercase tracking-widest font-black">Live</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950/50 custom-scrollbar"
                >
                  {messages.length === 0 && (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-16 h-16 bg-[#FF5E3A]/10 dark:bg-[#FF5E3A]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-8 h-8 text-[#FF5E3A]" />
                      </div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">Hey Product Hunter! 👋</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 px-6">
                        I'm your AI assistant. Ask me about product launches, upvotes, trending products, and more!
                      </p>
                    </div>
                  )}

                  {messages.map((m: any) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${m.role === 'user'
                          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                          : 'bg-[#FF5E3A] text-white'
                          }`}>
                          {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                          ? 'bg-[#FF5E3A] text-white rounded-tr-none shadow-md'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700'
                          }`}>
                          {m.parts ? m.parts.filter((p: any) => p.type === "text").map((p: any, i: number) => (
                            <span key={i}>{p.text}</span>
                          )) : (m as any).content}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-[#FF5E3A] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Bot size={16} />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {messages.length === 0 && (
                  <div className="p-4 bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-3 ml-1">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => handleQuickAction(action.value)}
                          className="text-[10px] font-bold py-1.5 px-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-[#FF5E3A] hover:text-white transition-all border border-gray-200 dark:border-gray-700 flex items-center gap-1 group"
                        >
                          {action.label}
                          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <form
                  onSubmit={handleSubmit}
                  className="p-4 bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-gray-800"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask about products, launches..."
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 pl-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#FF5E3A]/20 focus:border-[#FF5E3A] transition-all text-gray-700 dark:text-gray-200"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#FF5E3A] text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:grayscale transition-all hover:bg-[#E5532D] active:scale-95 shadow-md"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                  <p className="text-[9px] text-center text-gray-400 mt-2 font-medium italic">
                    AI can make mistakes. Verify important info.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group ${isOpen ? 'bg-gray-900 dark:bg-gray-100' : 'bg-[#FF5E3A]'
          }`}
      >
        {isOpen ? (
          <X className="text-white dark:text-gray-900 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <div className="relative">
            <MessageCircle className="text-white w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#FF5E3A] animate-ping" />
          </div>
        )}
      </motion.button>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
        }
      `}</style>
    </div>
  );
}