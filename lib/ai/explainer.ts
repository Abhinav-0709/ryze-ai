import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key_if_missing" });

export async function explainChangesStream(plan: any, userIntent: string) {
    const prompt = `
    You are a UI Explainer. Your goal is to briefly explain the UI changes based on the user's request.
    
    User Intent: "${userIntent}"
    
    UI Plan Summary:
    Layout: ${plan.layout}
    Reasoning: ${plan.reasoning}
    
    Instructions:
    1. If this is a modification (e.g., changing color, size), ONLY explain the specific change.
    2. Do NOT list all components or layout details unless they are new or complex.
    3. Keep it extremely concise (max 2-3 sentences).
    4. Speak directly to the user (e.g., "I've updated the button color...").
    `;

    try {
        if (!process.env.GROQ_API_KEY) {
            // Return a simple readable stream if no key
            const encoder = new TextEncoder();
            return new ReadableStream({
                start(controller) {
                    controller.enqueue(encoder.encode(plan.reasoning || "Generated based on your request."));
                    controller.close();
                }
            });
        }

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            stream: true,
        });

        return completion;
    } catch (error) {
        console.error("Explanation failed:", error);
        const encoder = new TextEncoder();
        return new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode("Could not generate explanation at this time."));
                controller.close();
            }
        });
    }
}
