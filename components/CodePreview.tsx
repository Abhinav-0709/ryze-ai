"use client";

import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { scope } from "@/components/Scope";
import { cn } from "@/lib/utils";
import { themes } from "prism-react-renderer";

interface CodePreviewProps {
  code: string;
  onCodeChange?: (newCode: string) => void;
}

export function CodePreview({ code, onCodeChange }: CodePreviewProps) {
  return (
    <LiveProvider code={code} scope={scope} theme={themes.vsDark}>
      <div className="grid h-full w-full grid-rows-2 gap-4 lg:grid-cols-2 lg:grid-rows-1">
        
        {/* Preview Panel */}
        <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
           <div className="border-b bg-muted px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
             Live Preview
           </div>
           <div className="flex-1 overflow-auto bg-white p-4 text-black dark:bg-black dark:text-white">
             <LivePreview />
           </div>
           <div className="max-h-32 overflow-auto border-t bg-destructive/10 p-2 text-xs text-destructive">
             <LiveError />
           </div>
        </div>

        {/* Editor Panel */}
        <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-slate-950 text-slate-50 shadow-sm">
           <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase text-slate-400">
             React Code
           </div>
           <div className="flex-1 overflow-auto font-mono text-sm">
             <LiveEditor onChange={onCodeChange} className="min-h-full" />
           </div>
        </div>

      </div>
    </LiveProvider>
  );
}
