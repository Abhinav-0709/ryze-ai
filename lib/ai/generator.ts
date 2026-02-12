import { GoogleGenerativeAI } from "@google/generative-ai";
import { componentRegistry } from "@/lib/registry";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
// Using a model capable of good code generation
const generatorModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateCode(plan: any): Promise<string> {
    const registryDocs = Object.values(componentRegistry).map(c => ({
        name: c.name,
        props: "props" in c ? c.props : undefined,
        example: c.example
    }));

    const prompt = `
    You are a UI Generator. Your goal is to convert a UI Plan into valid, executable React code.
    
    UI Plan:
    ${JSON.stringify(plan, null, 2)}
    
    Available Components (Documentation):
    ${JSON.stringify(registryDocs, null, 2)}
    
    Constraints:
    1. Use ONLY the provided components. Do not invent new ones.
    2. Do NOT use standard HTML tags (div, span, etc.) unless absolutely necessary for layout within a Component's children, but prefer using "Container", "Grid", "Flex" from the registry.
    3. You can use standard Tailwind CSS classes for 'className' prop if needed for minor adjustments, but rely on component props (variant, size) first.
    4. The output must be a single functional React component named 'App'.
    5. Do not include imports. Assume all components are available in the scope.
    6. Return ONLY the code, no markdown formatting.
    
    Example Output:
    function App() {
      return (
        <Container>
           <Button>Click Me</Button>
        </Container>
      )
    }
    `;

    try {
        const result = await generatorModel.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Cleanup markdown
        text = text.replace(/```jsx\n|```tsx\n|```javascript\n|```\n|\n```/g, "").trim();

        return text;
    } catch (error) {
        console.error("Generation failed:", error);
        throw new Error("Failed to generate UI code.");
    }
}
