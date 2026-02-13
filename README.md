# Ryze-AI: AI-Powered UI Agent

Ryze-AI is an intelligent, deterministic UI generator that converts natural language into working, styled React code. It uses a specialized **multi-agent system** to plan, generate, and explain UI components, enforcing a strict component registry to ensure design consistency and prevent hallucinations.

## 🏗️ Architecture Overview

Ryze-AI is built on a modern, robust stack designed for speed and reliability:

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **State Management**: React `useState` & `useEffect` for local state, with `localStorage` persistence for session recovery.
- **AI Orchestration**:
    - **Planner Agent**: Google **Gemini 2.5 Flash** (Structures the intent).
    - **Generator Agent**: Google **Gemini 2.5 Flash** (Writes the strict React code).
    - **Explainer Agent**: **Groq Llama 3** (Provides high-speed, natural language explanations).
- **Live Preview**: `react-live` engine for real-time, in-browser compilation and rendering of generated code.
- **Styling System**: CSS Variables + Tailwind CSS (configured for a standard "VSCode Dark" theme).

### System Data Flow

![alt text](<public/system arch.png>)

## 🤖 Agent Design & Prompts

The core intelligence of Ryze-AI is split into three specialized agents:

### 1. The Planner Agent
*   **Goal**: Understand *what* to build, not *how* to write code.
*   **Prompt Strategy**: "Chain of Thought" prompting. The agent is instructed to break down a user request (e.g., "Login Page") into a hierarchical JSON structure defining layout containers, components, and content.
*   **Output**: Pure JSON Plan.

### 2. The Generator Agent
*   **Goal**: Translate the JSON Plan into executable React code.
*   **Strict Constraints**: 
    *   **Whitelist Only**: Can strictly ONLY use components from the `ComponentRegistry` (`Card`, `Button`, `Input`, etc.).
    *   **No Standard HTML**: Forbidden from using `<div>`, `<span>`, etc., unless absolutely necessary for layout. Must use `Layout.Flex` or `Layout.Grid`.
    *   **Separation of Concerns**: Allowed to use Tailwind classes for *layout* (margin, padding) but FORBIDDEN from using them for *visuals* (colors, rounding) on primitive components, forcing reliance on the Design System's `variant` props.

### 3. The Explainer Agent
*   **Goal**: Inform the user what happened.
*   **Prompt Strategy**: Concise, friendly, and non-technical. Focuses on design decisions ("I chose a 2-column layout...") rather than implementation details ("I used flex-row...").

---

## 🧩 Component System Design

Ryze-AI avoids "AI Hallucinations" by refusing to let the AI invent components. It uses a **Deterministic Component Registry**:

*   **Registry Map**: A central object in `lib/registry.ts` defines every allowed component, its props, and usage examples.
*   **Primitives**:
    *   `Layout`: `Container`, `Grid`, `Flex`
    *   `Surfaces`: `Card` (Header, Content, Footer), `Sidebar`, `Navbar`
    *   `Inputs`: `Button` (variants: default, destructive, outline, ghost), `Input`
    *   `Data`: `Table`, `Chart` (Mock data wrapper)
*   **Theming**: All components consume CSS variables (`--primary`, `--muted`, `--destructive`) defined in `globals.css`. This allows global theme switching without rewriting component code.

---

## ⚠️ Known Limitations

1.  **Complex Logic**: The generator is optimized for *UI Layout* and *Static Content*. It does not currently generate complex React state (e.g., multi-step forms, real API integrations) within the generated code.
2.  **Context Retention**: While the "Plan" is updated iteratively, very long conversational contexts may occasionally confuse the Planner regarding the current state of the UI.
3.  **Mobile Preview**: The *application itself* is fully responsive (mobile tabs), but the *generated UI code* inside the preview window depends on the AI correctly applying responsive Tailwind classes (e.g., `md:grid-cols-2`), which it sometimes misses.

---

## 🚀 Future Roadmap & Improvements

With more time, here is how Ryze-AI would evolve:

*   **Database Integration**: Move from `localStorage` to a Postgres/Supabase backend to persist user projects, history, and shared designs.
*   **Hybrid Editor**: Implement a visual "Drag-and-Drop" editor that sits on top of the AI generator, allowing users to manually tweak margins/padding without writing code.
*   **Theme Generator**: Add a new "Designer Agent" that can rewrite `globals.css` on the fly, allowing users to ask for "Cyberpunk Theme" or "Pastel Theme" and see the entire app update instantly.
*   **Component Learning**: Allow users to "teach" the AI new components by pasting in code, which gets added to the Registry dynamically.

---

## License

MIT
