"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  User,
  Bot,
  AlertCircle,
  Rocket,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { TextStreamChatTransport } from "ai";

const QUICK_ACTIONS = [
  {
    label: "🚀 Launch Product",
    value: "How do I launch my product on Products Hunt?",
    icon: Rocket,
    color: "from-[#FF5E3A] to-[#E5532D]",
  },
  {
    label: "📈 Trending",
    value: "What are the top trending products this week?",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
  },
  {
    label: "🏆 Leaderboard",
    value: "How does the product leaderboard work?",
    icon: Award,
    color: "from-yellow-500 to-amber-500",
  },
  {
    label: "✨ Upvote Tips",
    value: "What are the best tips to get more upvotes?",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
  },
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new TextStreamChatTransport({
      api: "/api/v1/chat",
    }),
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

  const handleQuickAction = (value: string) => {
    if (isLoading) return;
    sendMessage({ text: value });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, x: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-3 sm:mb-4 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] max-w-[400px] bg-white dark:bg-[#0F172A] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col h-[480px] sm:h-[520px] md:h-[550px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF5E3A] to-[#E5532D] dark:from-[#FF5E3A] dark:to-[#E5532D] p-3 sm:p-4 flex justify-between items-center text-white rounded-t-2xl">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Rocket size={16} className="sm:w-5 sm:h-5 text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-[#FF5E3A] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm leading-tight">Product Hunter AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                    <span className="text-[8px] sm:text-[10px] text-orange-100 uppercase tracking-widest font-semibold">
                      Ready to Help
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X size={16} className="sm:w-[18px] sm:h-[18px]" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50/50 dark:bg-gray-950/50 custom-scrollbar">
              {messages.length === 0 && !isLoading && (
                <div className="space-y-4 sm:space-y-5">
                  <div className="text-center py-3 sm:py-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#FF5E3A]/10 to-[#E5532D]/10 dark:from-[#FF5E3A]/20 dark:to-[#E5532D]/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Rocket className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF5E3A]" />
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                      Ready to Launch! 🚀
                    </h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 px-3 sm:px-4 leading-relaxed">
                      Your AI product expert. Ask me about launching, upvotes, trending products, and growth strategies!
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase text-gray-400 tracking-widest mb-2 sm:mb-2.5 ml-1">
                      Quick Questions
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.label}
                            onClick={() => handleQuickAction(action.value)}
                            className="group relative flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#FF5E3A] dark:hover:border-[#FF5E3A] transition-all duration-200 hover:shadow-md text-left"
                          >
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}
                            >
                              <Icon size={12} className="sm:w-[14px] sm:h-[14px] text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] sm:text-[11px] font-semibold text-gray-700 dark:text-gray-200 block truncate">
                                {action.label}
                              </span>
                            </div>
                            <ChevronRight
                              size={10}
                              className="sm:w-3 sm:h-3 text-gray-300 dark:text-gray-600 group-hover:text-[#FF5E3A] group-hover:translate-x-0.5 transition-all shrink-0"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start gap-1.5 sm:gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full flex items-center justify-center ${m.role === "user"
                          ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          : "bg-[#FF5E3A]/10 dark:bg-[#FF5E3A]/20 text-[#FF5E3A]"
                        }`}
                    >
                      {m.role === "user" ? (
                        <User size={12} className="sm:w-[13px] sm:h-[13px]" />
                      ) : (
                        <Bot size={12} className="sm:w-[13px] sm:h-[13px]" />
                      )}
                    </div>
                    <div
                      className={`p-2 sm:p-3 rounded-2xl text-[12px] sm:text-sm leading-relaxed ${m.role === "user"
                          ? "bg-[#FF5E3A] text-white rounded-tr-none shadow-sm"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm"
                        }`}
                    >
                      {m.parts
                        ? m.parts
                          .filter((p: any) => p.type === "text")
                          .map((p: any, i: number) => (
                            <span key={i}>{p.text}</span>
                          ))
                        : (m as any).content}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading &&
                messages.length > 0 &&
                messages[messages.length - 1].role === "user" && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-1.5 sm:gap-2 max-w-[85%]">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full flex items-center justify-center bg-[#FF5E3A]/10 dark:bg-[#FF5E3A]/20 text-[#FF5E3A]">
                        <Bot size={12} className="sm:w-[13px] sm:h-[13px]" />
                      </div>
                      <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700 flex items-center gap-1 sm:gap-1.5 shadow-sm">
                        <span
                          className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#FF5E3A] rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#FF5E3A] rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></span>
                        <span
                          className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#FF5E3A] rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}

              {error && (
                <div className="flex flex-col gap-1 p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] sm:text-xs rounded-xl border border-red-200 dark:border-red-800/30">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                    <span>Failed to send message. Please try again.</span>
                  </div>
                  {error.message && (
                    <span className="text-[9px] opacity-80 pl-5">{error.message}</span>
                  )}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-2.5 sm:p-3 bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-gray-800"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about products, launches..."
                  className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full py-2 sm:py-2.5 pl-3 sm:pl-4 pr-10 sm:pr-12 text-[12px] sm:text-sm focus:ring-2 focus:ring-[#FF5E3A]/30 outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 w-7 h-7 sm:w-8 sm:h-8 bg-[#FF5E3A] hover:bg-[#E5532D] text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all active:scale-95 shadow-sm"
                >
                  <Send
                    size={12}
                    className="sm:w-[14px] sm:h-[14px]"
                  />
                </button>
              </div>
              <p className="text-[8px] sm:text-[9px] text-center text-gray-400 mt-1.5 font-medium">
                AI can make mistakes. Verify important info.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher - Left Side */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group ${
          isOpen
            ? "bg-gray-800 dark:bg-gray-200"
            : "bg-gradient-to-br from-[#FF5E3A] to-[#E5532D]"
        }`}
      >
        {isOpen ? (
          <X className="text-white dark:text-gray-800 group-hover:rotate-90 transition-transform duration-300 w-5 h-5 sm:w-[22px] sm:h-[22px]" />
        ) : (
          <div className="relative">
            <MessageCircle className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#FF5E3A] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-[#FF5E3A]" />
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