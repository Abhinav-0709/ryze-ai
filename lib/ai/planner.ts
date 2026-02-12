import { GoogleGenerativeAI } from "@google/generative-ai";
import { componentRegistry, getAllowedTags } from "@/lib/registry";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

const plannerModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export interface UIPlan {
    layout: string;
    components: Array<{
        name: string;
        props?: Record<string, any>;
        children?: any;
    }>;
    reasoning: string;
}

export async function planUI(userIntent: string, previousPlan?: UIPlan): Promise<UIPlan> {
    const registrySummary = Object.values(componentRegistry).map(c => ({
        name: c.name,
        description: c.description,
        props: "props" in c ? Object.keys(c.props) : [],
    }));

    let contextPrompt = "";
    if (previousPlan) {
        contextPrompt = `
        Current UI Plan:
        ${JSON.stringify(previousPlan, null, 2)}
        
        User Change Request: "${userIntent}"
        
        Your task is to MODIFY the Current UI Plan based on the User Change Request.
        - Keep existing components unless the user explicitly asks to remove or change them.
        - Add new components where requested.
        - Update props if requested (e.g., "make button red" -> variant="destructive").
        `;
    } else {
        contextPrompt = `
        User Intent: "${userIntent}"
        
        Your task is to create a NEW UI Plan based on the User Intent.
        `;
    }

    const prompt = `
    You are a UI Planner. Your goal is to create or modify a high-level layout plan for a user interface.
    
    ${contextPrompt}
    
    Available Components (Strictly Limited):
    ${JSON.stringify(registrySummary, null, 2)}
    
    Output Format (JSON Only):
    {
      "layout": "Description of the layout",
      "reasoning": "Why you chose these components and layout",
      "structure": [
        // Recursive structure of components
        {
          "component": "ComponentName",
          "props": { ... },
          "children": [ ... ]
        }
      ]
    }
    
    Do not include any explanations outside the JSON.
  `;

    try {
        const result = await plannerModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Simple cleanup to handle potential markdown code blocks
        const jsonString = text.replace(/```json\n|\n```/g, "").trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Planning failed:", error);
        throw new Error("Failed to generate UI plan.");
    }
}
