"use client";

import React, { useState, useEffect } from "react";
import { Chat } from "@/components/Chat";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { scope } from "@/components/Scope";
import { themes } from "prism-react-renderer";
import { Maximize2, X, Undo2, Redo2, MessageSquare, Code, Eye } from "lucide-react";

export default function Home() {
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [history, setHistory] = useState<Array<{ code: string; plan: any; explanation: string }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hello! I'm Ryze-AI. Describe the UI you want to build, and I'll generate it for you using our deterministic component system." }
  ]);
  const [code, setCode] = useState<string>(`// Your generated code will appear here
function App() {
  return (
    <div className="flex h-full items-center justify-center p-10 text-center text-muted-foreground">
      Waiting for your command...
    </div>
  )
}`);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "code" | "preview">("chat");

  // Load state from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("ryze_messages");
    const savedCode = localStorage.getItem("ryze_code");
    const savedPlan = localStorage.getItem("ryze_plan");
    const savedHistory = localStorage.getItem("ryze_history");
    const savedHistoryIndex = localStorage.getItem("ryze_historyIndex");

    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedCode) setCode(savedCode);
    if (savedPlan) setCurrentPlan(JSON.parse(savedPlan));

    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      if (savedHistoryIndex !== null) {
        setHistoryIndex(parseInt(savedHistoryIndex));
      } else {
        setHistoryIndex(parsedHistory.length - 1);
      }
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    if (messages.length > 1 || code.length > 200 || history.length > 0) {
      localStorage.setItem("ryze_messages", JSON.stringify(messages));
      localStorage.setItem("ryze_code", code);
      if (currentPlan) localStorage.setItem("ryze_plan", JSON.stringify(currentPlan));
      localStorage.setItem("ryze_history", JSON.stringify(history));
      localStorage.setItem("ryze_historyIndex", historyIndex.toString());
    }
  }, [messages, code, currentPlan, history, historyIndex]);

  const addToHistory = (newCode: string, newPlan: any, explanation: string) => {
    if (history.length > 0 && history[historyIndex]?.code === newCode) {
      return;
    }
    const newEntry = { code: newCode, plan: newPlan, explanation };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newEntry);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const prevEntry = history[prevIndex];
      setCode(prevEntry.code);
      setCurrentPlan(prevEntry.plan);
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const nextEntry = history[nextIndex];
      setCode(nextEntry.code);
      setCurrentPlan(nextEntry.plan);
      setHistoryIndex(nextIndex);
    }
  };

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          previousPlan: currentPlan
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");
      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalCode = "";
      let finalPlan = null;
      let finalExplanation = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          const eventLine = lines.find(l => l.startsWith("event: "));
          const dataLine = lines.find(l => l.startsWith("data: "));

          if (eventLine && dataLine) {
            const event = eventLine.replace("event: ", "").trim();
            const dataStr = dataLine.replace("data: ", "");

            try {
              const data = event === "explanation" ? JSON.parse(dataStr) : JSON.parse(dataStr);

              if (event === "plan") {
                setCurrentPlan(data);
                finalPlan = data;
              } else if (event === "code") {
                setCode(data);
                finalCode = data;
              } else if (event === "explanation") {
                finalExplanation += data;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsgIndex = newMessages.length - 1;
                  const lastMsg = newMessages[lastMsgIndex];
                  if (lastMsg.role === "assistant") {
                    newMessages[lastMsgIndex] = {
                      ...lastMsg,
                      content: lastMsg.content + data
                    };
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      if (finalCode || finalPlan) {
        addToHistory(finalCode || code, finalPlan || currentPlan, finalExplanation);
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the chat and clear history?")) {
      setMessages([
        { role: "assistant", content: "Hello! I'm Ryze-AI. Describe the UI you want to build, and I'll generate it for you using our deterministic component system." }
      ]);
      setCode(`// Your generated code will appear here
function App() {
  return (
    <div className="flex h-full items-center justify-center p-10 text-center text-muted-foreground">
      Waiting for your command...
    </div>
  )
}`);
      setCurrentPlan(null);
      setHistory([]);
      setHistoryIndex(-1);
      localStorage.removeItem("ryze_messages");
      localStorage.removeItem("ryze_code");
      localStorage.removeItem("ryze_plan");
      localStorage.removeItem("ryze_history");
      localStorage.removeItem("ryze_historyIndex");
    }
  };

  return (
    <LiveProvider code={code} scope={scope} theme={themes.vsDark}>
      <main className="fixed inset-0 flex flex-col w-full bg-background text-foreground font-sans md:grid md:grid-cols-3 md:overflow-hidden">

        {/* Mobile Tab Navigation */}
        <div className="flex shrink-0 items-center justify-around border-b border-border bg-card p-2 md:hidden">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors ${
              activeTab === "chat" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <MessageSquare size={18} />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors ${
              activeTab === "code" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Code size={18} />
            <span>Code</span>
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors ${
              activeTab === "preview" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Eye size={18} />
            <span>Preview</span>
          </button>
        </div>

        {/* Column 1: Chat Interface */}
        <div className={`flex flex-col overflow-hidden border-r border-border bg-card md:flex h-full ${activeTab === "chat" ? "flex" : "hidden"}`}>
          <div className="flex h-12 shrink-0 items-center justify-center border-b border-border bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider">
            Chat with AI
          </div>
          <div className="flex-1 overflow-hidden min-h-0 relative">
            <Chat messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} onReset={handleReset} />
          </div>
        </div>

        {/* Column 2: Code Editor */}
        <div className={`flex flex-col border-r border-border bg-[#1e1e1e] text-[#d4d4d4] md:flex h-full overflow-hidden ${activeTab === "code" ? "flex" : "hidden"}`}>
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#2b2b2b] bg-[#1e1e1e] px-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#969696] uppercase">Generated Component</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="flex items-center gap-1 rounded bg-[#333333] px-3 py-1.5 text-xs text-white hover:bg-[#444444] disabled:opacity-30 transition-colors"
                title="Undo"
              >
                <Undo2 size={14} /> Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="flex items-center gap-1 rounded bg-[#333333] px-3 py-1.5 text-xs text-white hover:bg-[#444444] disabled:opacity-30 transition-colors"
                title="Redo"
              >
                <Redo2 size={14} /> Redo
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto font-mono text-sm">
            <LiveEditor onChange={setCode} className="min-h-full" />
          </div>
        </div>

        {/* Column 3: Live Preview */}
        <div className={`flex flex-col bg-background relative md:flex h-full overflow-hidden ${activeTab === "preview" ? "flex" : "hidden"}`}>
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Live Preview (Better Viewed When On Full Screen)</span>
            <button
                onClick={() => setIsFullScreen(true)}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Full Screen Preview"
            >
                <Maximize2 size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4 md:p-6 bg-neutral-900/50">
            <div className="min-h-[300px] h-full w-full rounded-lg border border-border bg-card shadow-2xl overflow-hidden flex flex-col">
               <div className="w-full h-full text-foreground overflow-auto">
                  <LivePreview />
               </div>
            </div>
          </div>

          {/* Error Console */}
          <div className="shrink-0 max-h-32 overflow-auto border-t border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive font-mono">
            <LiveError />
          </div>
        </div>
        
        {/* Full Screen Modal Overlay */}
        {isFullScreen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-200">
                <div className="relative w-full h-full max-w-[95vw] md:max-w-[90vw] max-h-[90vh] bg-background rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
                        <span className="text-sm font-bold uppercase text-muted-foreground">Full Screen Preview</span>
                        <button 
                            onClick={() => setIsFullScreen(false)}
                            className="p-1 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {/* Modal Content */}
                    <div className="flex-1 overflow-auto p-4 md:p-8 bg-neutral-900/10">
                         <div className="min-h-full w-full bg-card shadow-sm rounded-lg border border-border/50 overflow-hidden text-foreground">
                            <LivePreview />
                         </div>
                    </div>
                </div>
            </div>
        )}

      </main>
    </LiveProvider>
  );
}
