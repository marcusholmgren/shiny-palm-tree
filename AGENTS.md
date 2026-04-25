# AGENTS.md

## Purpose

Probality is a React + TypeScript learning app for introductory probability counting, inspired by Joe Blitzstein's
*Introduction to Probability*, Stat 110, MITx probability courses, and story-proof style explanations.

The app should teach beginners how to recognize and solve counting problems, especially the four sampling-table cases:

1. ordered with replacement
2. ordered without replacement
3. unordered without replacement
4. unordered with replacement

Keep the product **intuition-first, beginner-friendly, and mathematically correct**.

## Product expectations

- Prefer concrete metaphors like ice cream scoops, passwords, races, committees, poker hands, stars and bars.
- Help users decide **whether order matters** and **whether replacement is allowed** before introducing formulas.
- Explanations should feel like a patient probability tutor: clear, rigorous, encouraging, and not overly formal.
- Preserve the educational framing around **sampling tables** and **story proofs** rather than turning the app into a
  generic quiz shell.

## Current architecture

- `App.tsx`: single-screen app shell, topic list, main content, quiz embedding, tutor overlay.
- `components/SamplingTable.tsx`: core interactive visualization and formula/result logic for the four counting modes.
- `components/Quiz.tsx`: Gemini-generated multiple-choice practice problems.
- `components/Tutor.tsx`: floating tutor chat UI.
- `components/MathRenderer.tsx`: KaTeX-based renderer for inline and block LaTeX embedded in plain text.
- `services/geminiService.ts`: quiz generation and tutor chat calls through `@google/genai`.
- `types.ts`: shared enums and interfaces.

This is currently a **single-page app without routing**. Prefer extending existing components over adding
framework-heavy structure unless the product clearly needs it.

## Math and content conventions

- For rendered math, wrap inline expressions with `$...$` and block expressions with `$$...$$`.
- `MathRenderer` expects mixed plain text + LaTeX strings; do not pass raw JSX math fragments when a string is enough.
- When adding formulas, optimize for notation students will recognize from intro probability/combinatorics.
- If you change sampling logic, make sure the formula, numerical result, and intuition text all stay aligned.
- Favor exact combinatorics over simulation unless a feature explicitly teaches approximation.

## AI integration conventions

- Gemini is used for:
    - generating practice problems
    - answering tutor questions
- Keep strong fallbacks when AI calls fail; the app already uses fallback quiz/chat responses.
- Tutor/quiz prompts should reinforce the app's teaching voice: intuitive, counting-focused, and Stat 110 style.
- If you change AI output formatting, keep it compatible with `MathRenderer`.

## UI conventions

- Styling is utility-class based and currently depends on Tailwind loaded from `index.html`.
- Maintain the current visual direction: clean, academic, light, and approachable.
- The sampling table is the flagship interaction. Changes there should prioritize clarity over visual cleverness.

## Run/build expectations

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm run test`

## Known repo gotchas

- `MathRenderer` is intentionally simple and regex-based. Be careful with changes that could break mixed prose + LaTeX
  rendering.

## Guidance for future agents

- Prefer small, coherent additions that deepen the counting-learning experience.
- Do not add unrelated infrastructure just because it is common in React apps.
- When introducing new probability topics, connect them back to the existing sampling-table mental model whenever
  possible.
