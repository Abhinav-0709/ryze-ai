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
    
    Design Principles:
    1. **Modern & Clean**: Use ample whitespace (gaps), logical grouping, and visual hierarchy.
    2. **Component Usage**: 
       - Always use 'Card' to group related content (forms, stats, profiles). 
       - Use 'CardHeader' for titles and 'CardContent' for the body.
       - Use 'Grid' or 'Flex' for layout, never just pile things up.
    3. **Professional Feel**: Align items properly (center or start), use appropriate spacing.
    
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

    const startIndex = text.indexOf("{");
    const endIndex = text.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("No JSON found in response");
    }

    const jsonString = text.substring(startIndex, endIndex + 1);

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      // Fallback cleanup
      const cleaned = jsonString.replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f");
      return JSON.parse(cleaned);
    }
  } catch (error) {
    console.error("Planning failed:", error);
    throw new Error("Failed to generate UI plan.");
  }
}
