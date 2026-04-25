[![Deploy static content to Pages](https://github.com/marcusholmgren/shiny-palm-tree/actions/workflows/deploy.yml/badge.svg)](https://github.com/marcusholmgren/shiny-palm-tree/actions/workflows/deploy.yml)

# Interactive Counting

This is a simple React app that demonstrates how to use a language model (LLM) to create an interactive counting game.
The app allows users to input a number, and the LLM will respond with the next number in the sequence.
The app supports both Ollama (for local models) and Gemini (for cloud-based models).

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Configure an LLM provider in `.env.local`

   **Ollama (local Gemma 4 example)**

   ```env
   VITE_LLM_PROVIDER=ollama
   VITE_OLLAMA_BASE_URL=http://127.0.0.1:11434
   VITE_OLLAMA_MODEL=gemma4:latest
   ```

   **Gemini**

   ```env
   VITE_LLM_PROVIDER=gemini
   VITE_GEMINI_API_KEY=your_api_key_here
   VITE_GEMINI_MODEL=gemini-3.1-flash-lite-preview
   ```

   If `VITE_LLM_PROVIDER` is omitted, the app will prefer Gemini when `VITE_GEMINI_API_KEY` is set, otherwise it will
   fall back to Ollama.

3. Run the app:
   `npm run dev`
