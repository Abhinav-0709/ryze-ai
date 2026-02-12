"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Send, Loader2, Bot, User } from "lucide-react";
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
}

export function Chat({ messages, onSendMessage, isLoading }: ChatProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col border-r bg-muted/10">
      {/* Header */}
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold tracking-tight">Ryze AI Agent</h2>
        <p className="text-xs text-muted-foreground">Describe your UI intent</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
      </div>

      {/* Input */}
      <div className="border-t p-4">
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
