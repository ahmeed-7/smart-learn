# Student Assistant - Frontend

A modern, responsive web application built with React, TypeScript, and TailwindCSS to help students organize their academic week and master their subjects with AI-powered insights.

## Features

- **Real Organic Tree**: A stunning, animated organic tree on the landing page that visualizes subjects as leaves and branches.
- **AI Flashcard Deck**: 3D interactive flashcards auto-generated from your study logs to help you master any subject.
- **Knowledge Tree**: Interactive visualization of your week and subjects using React Flow.
- **Weekly Schedule**: Full CRUD for university subjects and classes.
- **AI Study Logs**: Add notes, voice recordings, or files and get AI-generated summaries, key points, and review questions.
- **Weekend Mode**: Automatic weekend theme with tasks focused on career growth and XP rewards.
- **Auth & Onboarding**: Complete login, registration, and profile setup flow.

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **Styling**: TailwindCSS (Custom Premium Theme)
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **Visualization**: React Flow

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Set up environment variables**:
    Rename `.env.example` to `.env` and adjust the `VITE_API_BASE_URL`.

3.  **Run development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## Project Structure

- `/src/api`: Axios client and service definitions.
- `/src/components`: Reusable UI and Layout components.
- `/src/features`: Feature-specific logic (auth, tree, logs, etc.).
- `/src/pages`: Main application routes.
- `/src/store`: Zustand stores for state management.
- `/src/types`: TypeScript interfaces and types.

## Contributors

- **Samer** - Lead Developer & Visionary
- **AI Assistant** - Design & Implementation Support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ for students everywhere.
