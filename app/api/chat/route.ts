import { NextResponse } from "next/server";
import { planUI } from "@/lib/ai/planner";
import { generateCode } from "@/lib/ai/generator";
import { explainChangesStream } from "@/lib/ai/explainer";

export async function POST(req: Request) {
    try {
        const { message, previousCode, previousPlan } = await req.json();

        // 1. Plan
        console.log("Planning UI for:", message);
        const plan = await planUI(message, previousPlan);

        // 2. Generate
        console.log("Generating code...");
        const code = await generateCode(plan);

        // 3. Explain (Stream)
        console.log("Explaining changes...");
        // For MVP, we'll use a simple approach: Send the plan and code first, then stream the explanation?
        // Actually, Next.js App Router API routes can return a stream. 
        // We will stream a custom format:
        // PART:PLAN:{json}\n
        // PART:CODE:{code}\n
        // PART:EXPLANATION_CHUNK:{text}\n

        // Let's use a simpler approach for now to avoid complexity:
        // We will just verify streaming works for explanation. 
        // But since we need to send JSON first (Plan/Code), typical streaming is hard without a custom protocol.

        // Strategy: 
        // We will use the Vercel AI SDK concept manually.
        // We will return a stream that pushes the Plan and Code as initial data events,
        // followed by the explanation chunks.

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                // Send Plan
                controller.enqueue(encoder.encode(`event: plan\ndata: ${JSON.stringify(plan)}\n\n`));

                // Send Code
                // We need to escape newlines in code for SSE to be safe, or just JSON stringify it
                controller.enqueue(encoder.encode(`event: code\ndata: ${JSON.stringify(code)}\n\n`));

                // Stream Explanation
                const explanationStream = await explainChangesStream(plan, message);

                if (explanationStream instanceof ReadableStream) {
                    // If it's a simple stream (fallback)
                    const reader = explanationStream.getReader();
                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;
                            const text = new TextDecoder().decode(value);
                            controller.enqueue(encoder.encode(`event: explanation\ndata: ${JSON.stringify(text)}\n\n`));
                        }
                    } finally {
                        reader.releaseLock();
                    }
                } else {
                    // It's a Groq AsyncIterable
                    for await (const chunk of explanationStream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            controller.enqueue(encoder.encode(`event: explanation\ndata: ${JSON.stringify(content)}\n\n`));
                        }
                    }
                }

                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Failed to process request." },
            { status: 500 }
        );
    }
}
