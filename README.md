# Ryze-AI: AI-Powered UI Agent

Ryze-AI is an intelligent agent that converts natural language UI intent into working React code with a live preview. It enforces a **deterministic component system** to ensure safety, consistency, and reproducibility.

## Features

- **Natural Language to UI**: Describe your desired interface, and Ryze-AI generates the code.
- **Deterministic Components**: Uses a strictly defined library (Card, Button, Input, Table, etc.) to prevent hallucinations and maintain design consistency.
- **3-Stage AI Pipeline**:
  1.  **Planner (Gemini)**: Analyzes intent and structures the layout.
  2.  **Generator (Gemini)**: Converts the plan into valid React code using only allowed components.
  3.  **Explainer (Groq)**: Explains the design choices in plain English.
- **Live Preview**: See the generated UI instantly alongside the code.
- **Interactive Chat**: Iterate on designs through conversation.

## Architecture

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **Backend API**: Next.js API Routes (`/api/chat`).
- **AI Models**:
    -   Google Gemini 1.5 Pro (Planning & Code Generation).
    -   Groq Llama 3 (Explanation).
- **State Management**: React State (MVP).
- **Component Library**: Custom implementation using Radix UI primitives and Tailwind CSS variables.

## Getting Started

### Prerequisites

- Node.js 18+
- API Keys for Google Generative AI and Groq.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/ryze-ai.git
    cd ryze-ai
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env.local` file in the root directory:
    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
    GROQ_API_KEY=your_groq_key
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Component System

Ryze-AI uses a fixed set of components to ensure reliability. The AI cannot create new components or use arbitrary HTML tags widely.

**Available Components:**
- `Layout`: Container, Grid, Flex
- `Structure`: Card, Sidebar, Navbar, Modal (Dialog)
- `Data Display`: Table, Chart (Mock)
- `Form`: Input, Button

## Known Limitations

- **State Persistence**: Chat history and generated code are not persisted to a database in this version; they reset on refresh.
- **Complex Logic**: The generated code is primarily for UI layout and simple interactions. Complex application logic is limited.
- **Mock Data**: Charts and Tables use placeholder data unless specific data is provided in the prompt.

## Future Improvements

- **Authentication**: User accounts to save projects.
- **Database Integration**: Store history and versions in a database.
- **Advanced Editing**: Visual drag-and-drop editor for the generated components.
- **Theme Customization**: AI-driven theme generation (colors, fonts).

## License

MIT
