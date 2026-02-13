import { GoogleGenerativeAI } from "@google/generative-ai";
import { componentRegistry } from "@/lib/registry";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
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
    3. **Strict Styling Rules**:
       - **Layout & Spacing**: usage of Tailwind \`className\` is ALLOWED for layout (margins \`m-4\`, padding \`p-6\`, width \`w-full\`, max-width \`max-w-md\`, flex/grid properties \`gap-4\`).
       - **Typography & Colors**: You MAY use Tailwind \`className\` for text colors (e.g., \`text-red-500\`, \`font-bold\`) on generic containers or text elements.
       - **Interactive Elements**: For \`Button\`, you MUST use the \`variant\` prop for the main background color. Do NOT use \`bg-red-500\` on a button; use \`variant='destructive'\` instead.
       - **Strict Rule**: NEVER use \`className\` to override the background color of a \`Button\` or \`Input\`. rely on \`variant\`.
       - **Exception**: You MAY use \`shadow-lg\`, \`border\`, \`bg-muted/10\` on \`Card\` or container elements to create depth.
    4. The output must be a single functional React component named 'App'.
    5. Do not include imports. Assume all components are available in the scope.
    6. Return ONLY the code, no markdown formatting.
    
    Example Output:
    function App() {
      return (
        <Container className="p-8 bg-muted/10 min-h-screen">
           <Card className="max-w-md mx-auto shadow-xl">
             <CardHeader>
               <CardTitle>Welcome</CardTitle>
               <CardDescription>Sign in to your account</CardDescription>
             </CardHeader>
             <CardContent>
                <Flex direction="column" gap="1rem">
                  <Input placeholder="Email" />
                  <Input type="password" placeholder="Password" />
                  <Button size="lg" className="w-full">Get Started</Button>
                </Flex>
             </CardContent>
           </Card>
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
