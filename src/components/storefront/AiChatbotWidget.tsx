"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Loader2,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: "🍓 Fresh Fruits in stock", prompt: "What fresh fruits are currently available and in stock?" },
  { label: "🥗 Organic Veggies under ৳100", prompt: "Show me organic vegetables in stock under ৳100." },
  { label: "🇧🇩 কম খরচে শাকসবজি", prompt: "কম খরচে কোন কোন তাজা শাকসবজি এবং ফল পাওয়া যাবে?" },
  { label: "🍳 Healthy Dinner Ideas", prompt: "Suggest a healthy dinner recipe using ingredients available at Grocify." },
];

export const AiChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputMessage("");

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Prepare previous conversation history (last 8 messages)
      const history = newMessages.slice(-9, -1).map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("model" as const),
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to receive response from assistant.");
      }

      const assistantMessage: ChatMessage = {
        id: "msg-ai-" + Date.now(),
        role: "assistant",
        content: data.data?.reply || "I couldn't generate a response. Please try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      setErrorMessage(
        error.message || "Something went wrong while connecting to Grocify AI. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setErrorMessage(null);
  };

  // Helper to format basic markdown-style text (bold **text**, bullets * or •)
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Process bold markers **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-semibold text-emerald-950">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      const isBullet = line.trim().startsWith("•") || line.trim().startsWith("*") || line.trim().startsWith("-");
      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 my-1">
            <span className="text-emerald-700 font-bold leading-none mt-1">•</span>
            <span className="flex-1 text-[13px] leading-relaxed">
              {renderedParts.slice(1).length ? renderedParts : line.replace(/^[\s•*-]+/, "")}
            </span>
          </div>
        );
      }

      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-[13px] leading-relaxed my-0.5">
          {renderedParts}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Grocify AI Shopping Assistant"
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-600/30"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <span className="font-medium text-sm tracking-wide hidden sm:inline">
              Ask Grocify AI
            </span>
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        )}

        {/* Chatbot Window */}
        {isOpen && (
          <div
            role="dialog"
            aria-label="Grocify AI Shopping Assistant Chat"
            className="w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#14532D] to-[#1e6f3d] text-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm tracking-tight text-white">Grocify Assistant</h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                      AI Powered
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    Live MongoDB Catalog • Bangla / English
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    title="Clear Chat"
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/60">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/60 rounded-xl p-3.5 text-emerald-950 text-xs shadow-sm">
                <div className="flex items-center gap-2 mb-1 text-emerald-800 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Welcome to Grocify Shopping Assistant!
                </div>
                <p className="text-[12px] leading-relaxed text-emerald-900/90 mb-2">
                  Ask me in <strong>English</strong> or <strong>বাংলা</strong> for product recommendations, prices in ৳, budget advice, or recipe ideas based on our real in-stock groceries.
                </p>

                {/* Quick Prompts */}
                {messages.length === 0 && (
                  <div className="mt-2.5 pt-2 border-t border-emerald-200/50">
                    <p className="text-[11px] font-medium text-emerald-800/80 mb-1.5">Quick questions to try:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_PROMPTS.map((qp, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(qp.prompt)}
                          disabled={isLoading}
                          className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-full shadow-2xs transition text-left active:scale-95"
                        >
                          {qp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Messages */}
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs shadow-2xs ${
                        isUser
                          ? "bg-emerald-800 text-white"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      }`}
                    >
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-2xs ${
                        isUser
                          ? "bg-[#14532D] text-white rounded-tr-none text-[13px] leading-relaxed"
                          : "bg-white text-stone-800 border border-stone-200 rounded-tl-none text-[13px] leading-relaxed"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none">
                          {renderFormattedText(m.content)}
                        </div>
                      )}
                      <span
                        className={`block text-[10px] mt-1 ${
                          isUser ? "text-emerald-200/80 text-right" : "text-stone-400"
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                    <span className="text-[12px] text-stone-500 font-medium">Checking live catalog...</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs shadow-2xs flex items-center justify-between gap-2">
                  <p>{errorMessage}</p>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="text-rose-600 hover:text-rose-800 font-medium shrink-0"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input Area */}
            <div className="p-3 bg-white border-t border-stone-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask in English or বাংলা (e.g. fresh fruits)..."
                  maxLength={500}
                  disabled={isLoading}
                  className="flex-1 bg-stone-100 hover:bg-stone-50 focus:bg-white text-stone-900 placeholder-stone-400 text-xs sm:text-[13px] px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20 transition disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  aria-label="Send Message"
                  className="bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white p-2.5 rounded-xl transition duration-200 shadow-sm flex items-center justify-center shrink-0 active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>

              <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-stone-400">
                <span>Real-time BDT (৳) pricing</span>
                <span>{inputMessage.length}/500</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
