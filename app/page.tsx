"use client";

import React, { useState, useEffect } from "react";
import { Chat } from "@/components/Chat";
import { CodePreview } from "@/components/CodePreview";

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

  // Load state from localStorage on mount
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

    // Crucial: Initialize history and index correctly
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      // If index is saved, use it. Otherwise, set to end.
      if (savedHistoryIndex !== null) {
        setHistoryIndex(parseInt(savedHistoryIndex));
      } else {
        setHistoryIndex(parsedHistory.length - 1);
      }
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    // Only save if we have some state to save, to avoid wiping on initial render race conditions
    if (messages.length > 1 || code.length > 200 || history.length > 0) {
      localStorage.setItem("ryze_messages", JSON.stringify(messages));
      localStorage.setItem("ryze_code", code);
      if (currentPlan) localStorage.setItem("ryze_plan", JSON.stringify(currentPlan));
      localStorage.setItem("ryze_history", JSON.stringify(history));
      localStorage.setItem("ryze_historyIndex", historyIndex.toString());
    }
  }, [messages, code, currentPlan, history, historyIndex]);

  const addToHistory = (newCode: string, newPlan: any, explanation: string) => {
    // Prevent adding duplicates to history
    if (history.length > 0 && history[historyIndex]?.code === newCode) {
      return;
    }

    const newEntry = { code: newCode, plan: newPlan, explanation };
    // If we are in the middle of history (undid something), slice it
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

    // Create a placeholder assistant message for streaming
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
      
      // Track final state for history
      let finalCode = "";
      let finalPlan = null;
      let finalExplanation = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE events
        // Simple parser for "event: type\ndata: ...\n\n"
        const parts = buffer.split("\n\n");
        // Keep the last part if incomplete
        buffer = parts.pop() || "";

        for (const part of parts) {
          const lines = part.split("\n");
          const eventLine = lines.find(l => l.startsWith("event: "));
          const dataLine = lines.find(l => l.startsWith("data: "));

          if (eventLine && dataLine) {
            const event = eventLine.replace("event: ", "").trim();
            const dataStr = dataLine.replace("data: ", "");

            try {
              // Check if data is just a string or JSON
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

      // Add to history after completion
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

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground md:flex-row">
      {/* Left Panel: Chat */}
      <div className="w-full border-r md:w-1/3 lg:w-1/4">
        <Chat messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Right Panel: Preview & Code */}
      <div className="flex-1 flex flex-col overflow-hidden bg-muted/20">
        <div className="flex items-center justify-between border-b bg-background px-4 py-2">
          <h3 className="text-sm font-semibold">Workspace</h3>
          <div className="flex gap-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="rounded px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
            >
              Undo
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="rounded px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
            >
              Redo
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-4">
          <CodePreview code={code} onCodeChange={setCode} />
        </div>
      </div>
    </main>
  );
}
