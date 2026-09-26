# CoverSmart Application Architecture & Code Explanation

**CoverSmart** is a Next.js (App Router) web application designed specifically for the South African market to help users manage, understand, and optimize their insurance policies. It integrates Firebase for data storage and authentication, and Google's Gemini AI to parse complex legal text, generate legal complaints, and offer an interactive assistant.

## Technology Stack
- **Framework:** Next.js 15.1.0 with React 19 (App Router paradigm).
- **Styling & UI:** Tailwind CSS combined with Radix UI primitives (a `shadcn/ui` style setup), plus `lucide-react` for icons.
- **Backend & Database:** Firebase (Firestore).
- **AI Integration:** Google Generative AI (`@google/generative-ai`) utilizing the `gemini-1.5-flash` model.
- **Form Handling & Validation:** `react-hook-form` coupled with `zod`.
- **Language:** TypeScript.

## Folder Structure & Routing (`/app`)
The application uses the Next.js App Router, separating routes into public, authentication, and protected dashboard areas.

- **`/(auth)`**: Contains the `/login` and `/register` routes.
- **`/dashboard`**: The core application interface, protected by authentication. It contains several sub-modules:
  - `/vault`: A digital vault for storing user insurance policies.
  - `/overview`: A high-level view of the user's coverage.
  - `/spend`: Analytics on monthly insurance premiums.
  - `/decoder`: Interface for AI-powered document simplification.
  - `/complaints`: Tool for generating formal regulatory complaint letters.
  - `/assistant`: The chat interface to interrogate the user's specific policies.
  - `/alerts` & `/renewals`: Reminders and notifications regarding policy updates.
- **`/api/gemini`**: Backend endpoints to securely interface with the Gemini API (preventing key leakage to the frontend).
- **`/setup`**: Likely an onboarding flow for new users.

## Security & Middleware (`middleware.ts`)
The `middleware.ts` file intercepts incoming requests. It checks for a `cs_auth_token` cookie. 
- Unauthorized users attempting to access `/dashboard` routes are immediately redirected to `/login`.
- Authenticated users attempting to view `/login` or `/register` are redirected to `/dashboard/overview`.

## Database Schema (`lib/firestore.ts`)
The app uses Firebase Firestore to persist data, structured into main collections:
1. **`users` (`UserProfile`)**: Stores user demographics (age, marital status, dependents, home owner status).
2. **`policies` (`Policy`)**: Stores individual insurance policies by category (Funeral, Life, Car, Home, Medical, etc.), including benefit amounts and premium details.
3. **`tcf_incidents` (`TcfIncident`)**: Logs "Treating Customers Fairly" incidents/complaints raised against insurers.

### Internal Analytics Logic
`firestore.ts` contains helper functions tailored to South African insurance realities:
- **`calcFuneralCapStatus`**: SA regulations cap funeral cover at R100,000. This function identifies users who are over-insured on funeral policies and calculates the "wasted premium".
- **`detectDuplicateBenefits`**: Analyzes policies to flag overlapping coverage (e.g., paying for roadside assistance on both Car and Home insurance), reporting estimated financial waste.

## AI Integrations (`lib/gemini.ts`)
The application heavily utilizes the Gemini AI model with extremely strict, context-aware prompts preventing the AI from offering illegal financial advice.

It exposes four main AI features:
1. **Policy Decoder (`decodePolicyDocument`)**: Translates dense legal insurance documents into Grade-10 level plain English. It is explicitly programmed to extract exclusions, excesses, and benefit amounts while outputting strict structured JSON.
2. **Complaints Ghostwriter (`generateComplaintLetter`)**: Generates formal, ready-to-send dispute letters against insurers. It uses exact regulatory citations (PPR, TCF, FAIS Act) and references the FSCA Ombud framework.
3. **AI Assistant (`chatWithAssistant`)**: A conversational bot injected with the user's demographic profile AND specific insurance policy texts. It is strictly constrained to answer questions exclusively about the user's uploaded policies and explicitly forbidden from recommending products.
4. **Gap Analysis (`analyseGaps`)**: AI-driven analysis of a user's demographic status versus their current existing cover, logically highlighting blindspots (e.g., missing income protection) without acting as a financial broker.
