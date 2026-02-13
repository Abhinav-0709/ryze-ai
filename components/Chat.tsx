"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Send, Loader2, Bot, User, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onReset: () => void;
}

export function Chat({ messages, onSendMessage, isLoading, onReset }: ChatProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col relative bg-card overflow-hidden">
      {/* Header Reset Button - Absolute Top Right */}
      <div className="absolute top-2 right-4 z-20">
        <Button variant="ghost" size="icon" onClick={onReset} title="Reset Chat" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-50 hover:opacity-100 transition-opacity">
          <RefreshCw size={16} />
        </Button>
      </div>

      {/* Messages - Takes full height, with bottom padding for input area */}
      <div className="h-full overflow-y-auto p-4 pb-24 space-y-4 scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex w-full gap-2",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "flex max-w-[85%] flex-col gap-1 rounded-lg px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              <div className="flex items-center gap-2 border-b border-black/10 pb-1 mb-1 opacity-50 text-xs uppercase font-bold">
                {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                {msg.role === "user" ? "You" : "Ryze"}
              </div>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[85%] items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Absolute Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border z-20">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'Create a dark mode login card'"
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
