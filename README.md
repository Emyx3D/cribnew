# CribDirect - Direct Rentals Platform

CribDirect connects tenants directly with verified landlords, eliminating agency fees and streamlining the rental process.

## Technology Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** ShadCN UI
*   **AI Integration:** Genkit (Optional, if GenAI features are used)
*   **Hosting/Backend:** Firebase (Implied, common choice with Firebase Studio)
*   **Package Manager:** npm

## Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (usually comes with Node.js)
*   VS Code (Recommended Editor)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Emyx3D/cribdirect.git
    cd cribdirect-app # Or your project directory name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root of the project. If you plan to use Google AI features with Genkit, add your API key:
    ```plaintext
    GOOGLE_GENAI_API_KEY=YOUR_GOOGLE_API_KEY
    ```
    *Note: For basic functionality without AI, this might not be strictly necessary initially.*

4.  **VS Code Setup (Recommended):**
    *   Install recommended extensions:
        *   ESLint
        *   Prettier - Code formatter
        *   Tailwind CSS IntelliSense
    *   Configure VS Code settings (`.vscode/settings.json` is included):
        *   Enable Format on Save (Optional but recommended): Add `"editor.formatOnSave": true` to your user or workspace settings.
        *   Set Prettier as the default formatter (Optional): Add `"editor.defaultFormatter": "esbenp.prettier-vscode"`

### Running the Development Server

1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    This command starts the Next.js app (usually on `http://localhost:9002` as per your `package.json`).

2.  **(Optional) Start the Genkit development server (if using AI features):**
    Open a *separate terminal* and run:
    ```bash
    npm run genkit:dev
    ```
    This command starts the Genkit flow server, allowing you to test AI flows locally (usually on `http://localhost:4000`).

3.  **Open the application:**
    Navigate to `http://localhost:9002` (or the specified port) in your browser.

## Key Project Structure

*   `src/app/`: Contains the Next.js App Router pages and layouts.
*   `src/components/`: Reusable UI components (including `ui/` for ShadCN).
*   `src/lib/`: Utility functions.
*   `src/hooks/`: Custom React hooks.
*   `src/ai/`: Genkit AI integration files (flows, prompts).
*   `public/`: Static assets.
*   `styles/`: Global styles (`globals.css`).

## Available Scripts

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server.
*   `npm run lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck`: Runs TypeScript type checking.
*   `npm run genkit:dev`: Starts the Genkit flow server for local development.
*   `npm run genkit:watch`: Starts the Genkit flow server with file watching.
