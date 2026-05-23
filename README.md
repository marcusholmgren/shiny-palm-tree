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


---


## 💡 What is Missing? (Four Proposals)

To elevate this application from a solid prototype to a premium, deeply interactive learning platform, I recommend addressing the following areas:

### ✅ Option 1: In-App LLM Configuration & Connection Panel (Hybrid Control)
Since you value the ability to switch between hosted Google models and local Gemma models, we can introduce a **Model & Connection Settings Panel** directly in the sidebar or a dedicated modal:
*   **Dynamic Swapping**: Allow students to toggle between `Hosted Gemini` and `Local Gemma (Ollama)` in the UI. We can save this preference in `localStorage`.
*   **Health Checks & Status Indicators**: A green/red status light next to Ollama showing if the local server at `http://127.0.0.1:11434` is active, and checking if the model `gemma4:latest` is loaded.
*   **API Key Settings**: Allow users to paste a Gemini API Key directly into the UI if they don't have it configured in their `.env` file (stored securely in session/local storage).
*   **Dynamic Footer**: Dynamically update the footer branding (e.g., "Powered by Gemma via Ollama" with an active local ping versus "Powered by Gemini 3.5 Flash via Google AI Studio").

### ✅ Option 2: Interactive Playgrounds for the Other 5 Topics
Replace the generic static placeholders with high-fidelity interactive visualizers for each topic, matching the standard set by the Sampling Table:
*   **Naive Definition (Bag-of-Marbles Visualizer)**: Let students customize a virtual bag of marbles (e.g., 4 Red, 3 Blue, 2 Green). They can select an event (e.g., "Draw a Red or Green marble") and visually see the subset $|A|$ highlighted inside the sample space $|S|$, updating the fraction $P(A) = \frac{|A|}{|S|}$ in real-time.
*   **Multiplication Rule (Interactive Tree Builder)**: A multi-stage choice tree visualizer (e.g., building a meal combo: 3 mains $\times$ 2 sides $\times$ 4 drinks). Students adjust sliders for each category and see a dynamic branching tree show how the possibilities multiply out to $3 \times 2 \times 4 = 24$.
*   **Story Proofs (The Committee Chair Animator)**: Create an interactive visual proof for the identity $k\binom{n}{k} = n\binom{n-1}{k-1}$. Let students adjust $n$ (total people) and $k$ (committee size), and animate the two equivalent ways of counting:
    1. Choose a committee of size $k$ first, then choose a captain from them.
    2. Choose a captain first from all $n$ people, then fill the remaining $k-1$ spots from the remaining $n-1$ people.
*   **Inclusion-Exclusion (Interactive Venn Diagram)**: A beautiful Venn diagram with overlapping circles $A$ and $B$. Adjusting sliders for the size of $A$, $B$, and the intersection $A \cap B$ updates the diagram and the formula dynamically, visually demonstrating why we must subtract the overlap to avoid double counting.

### ✅ Option 3: Contextual Quiz-Tutor Integration ("Dr. B Socratic Hints")
Currently, the Tutor overlay is a generic chat drawer, unaware of the student's active quiz progress. We can integrate them:
*   **"Ask Dr. B for a Hint" Button**: Inside the Quiz card, add a button that passes the current question's text and options to the Tutor behind the scenes.
*   **Socratic Interventions**: Dr. B will open up and prompt the student with a highly targeted question about the specific problem (e.g., *"We want to form a committee. Does the order of members matter? Are we allowed to pick the same person twice?"*) rather than giving away the formula or numerical answer.

### Option 4: Gamified Practice Stats & Streak Tracking
To keep students motivated and encourage consistent practice:
*   **Topic Masteries**: Track practice stats per topic (e.g., "Naive Definition: 4/5 Correct", "Sampling Table: 3/3 Correct") in `localStorage`.
*   **Streak Tracking**: Implement a "First-Try Streak" counter that rewards students with subtle confetti or micro-animations when they answer consecutive questions correctly without seeing the solution first.
*   **Session Summary**: A dashboard showing a card-based summary of active mastery status for each core topic.

---

