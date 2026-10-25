# Madhur Kumar - Personal Portfolio

A sleek, responsive personal portfolio website showcasing projects, skills, education, and an intelligent AI assistant.

Live: [ADD LINK]

## Description

This portfolio highlights the software development projects, technical capabilities, and background of Madhur Kumar, a Computer Science Engineering student at JECRC University. It features an integrated serverless AI assistant that answers visitor questions about projects, experience, skills, and background.

## Technologies

- **Frontend:** HTML5, Modern Vanilla CSS (Variables, Flexbox, Grid, Glassmorphism), Vanilla JavaScript (ES6+)
- **Backend / Serverless:** Vercel Serverless Functions (Node.js)
- **AI Integrations:** Groq (Llama 3.3 70B), Google Gemini (Gemini 1.5 Flash), or OpenAI (GPT-4o Mini)
- **Deployment & Hosting:** Vercel

## Features

- **Dynamic Project Showcase:** Automatically renders project cards with tags, descriptions, GitHub links, and live previews.
- **Instant Search & Filtering:** Real-time search across project titles, descriptions, and technology tags.
- **Dark / Light Mode:** Sleek theme switcher with state persistence via `localStorage`.
- **Responsive Navigation:** Smooth scrolling and mobile-friendly hamburger menu.
- **AI Portfolio Assistant:** Powered by `/api/chat` with strict guardrails to answer queries strictly about Madhur's portfolio, projects, bug fixes, and reading list.

## Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/madhurk781-arch/portfolio.git
   cd portfolio
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   # Provide your API key from Groq, Google Gemini, or OpenAI
   API_KEY=your_api_key_here

   # (Optional) Explicitly set provider: groq | gemini | openai
   AI_PROVIDER=groq
   ```

3. **Run Locally with Vercel CLI:**
   Install the Vercel CLI globally if you haven't already:
   ```bash
   npm i -g vercel
   ```
   Run the local development server:
   ```bash
   vercel dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Deploy to Vercel:**
   - Push your code to GitHub.
   - Import the repository into your [Vercel Dashboard](https://vercel.com).
   - Add `API_KEY` (and optional `AI_PROVIDER`) under **Project Settings > Environment Variables**.
   - Deploy!
