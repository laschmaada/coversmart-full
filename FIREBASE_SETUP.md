# CoverSmart — Backend Setup Guide
## Firebase + Gemini AI Configuration

---

## STEP 1 — Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add project"**
3. Name it `coversmart` (or your preferred name)
4. Disable Google Analytics (optional for now)
5. Click **"Create project"**

---

## STEP 2 — Enable Firebase Authentication

1. In Firebase Console → **Authentication** → **Get started**
2. Under **Sign-in method**, enable:
   - **Email/Password** → Toggle on → Save
   - **Google** → Toggle on → Enter your project support email → Save
3. Under **Authorized domains**, add:
   - `localhost` (already there)
   - Your production domain when you deploy (e.g. `coversmart.co.za`)

---

## STEP 3 — Create Firestore Database

1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **Start in production mode** (we'll set rules next)
3. Select region: **europe-west1** (closest to South Africa)
4. Click **Enable**

### Set Firestore Security Rules

Go to **Firestore → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only access their own policies
    match /policies/{policyId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Users can only access their own TCF incidents
    match /tcf_incidents/{incidentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

Click **Publish**.

---

## STEP 4 — Get Your Firebase Config Keys

1. Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **"Web"** icon (`</>`)
3. Register app name: `CoverSmart Web`
4. **Do NOT** tick Firebase Hosting for now
5. Click **Register app**
6. Copy the `firebaseConfig` object — you'll need these values

---

## STEP 5 — Get Your Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API key"**
3. Select your Google Cloud project (or create a new one)
4. Copy the API key

> **Free Tier:** Gemini 1.5 Flash has a generous free tier:
> - 15 requests per minute
> - 1 million tokens per minute  
> - 1,500 requests per day
> This is sufficient for development and early users.

---

## STEP 6 — Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=coversmart-xxxxx.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=coversmart-xxxxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=coversmart-xxxxx.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
   
   GEMINI_API_KEY=AIzaSy...
   
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

> ⚠️ **CRITICAL:** `GEMINI_API_KEY` has NO `NEXT_PUBLIC_` prefix. It is server-side only. Never expose this in client code.

---

## STEP 7 — Install Dependencies & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000

---

## STEP 8 — Test the Integration

### Test Auth:
1. Go to http://localhost:3000/register
2. Create an account
3. Check Firebase Console → Authentication → Users — your user should appear

### Test Firestore:
1. After registering, check Firestore → `users` collection — your profile doc should be there
2. Add a test policy via the vault
3. Check Firestore → `policies` collection

### Test Gemini:
1. Go to http://localhost:3000/dashboard/decoder
2. Upload any PDF (even a non-policy PDF to test connectivity)
3. You should see an analysis result

### Test AI Assistant:
1. Go to http://localhost:3000/dashboard/assistant
2. Ask: "What funeral policies do I have?"
3. The AI should respond using the mock policy context

---

## STEP 9 — Firebase Hosting (Free Deployment)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialise in your project directory
firebase init hosting

# Build your Next.js app
npm run build

# Deploy
firebase deploy --only hosting
```

> **Note:** Firebase Hosting works well with Next.js static export. For full Next.js SSR (API routes, server components), use **Vercel** (also free tier) which is purpose-built for Next.js.

### Recommended: Deploy to Vercel (Easier for Next.js)
```bash
npm install -g vercel
vercel
```
Then add your environment variables in the Vercel dashboard.

---

## STEP 10 — Connecting the Dashboard to Live Firestore Data

Currently, the dashboard overview uses **mock data** (`POLICIES` array in `overview/page.tsx`).

To connect to real Firestore data, replace the mock data with:

```typescript
// In overview/page.tsx — add at the top:
import { getUserPolicies } from "@/lib/firestore"
import { useEffect, useState } from "react"

// Inside the component:
const { user } = useAuth()
const [policies, setPolicies] = useState([])

useEffect(() => {
  if (user) {
    getUserPolicies(user.uid).then(setPolicies)
  }
}, [user])
```

The `firestore.ts` helper functions are already built and ready.

---

## SWITCHING FROM GEMINI TO ANTHROPIC (CLAUDE)

When you're ready to switch the AI backend to Claude:

1. Install the Anthropic SDK:
   ```bash
   npm install @anthropic-ai/sdk
   ```

2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. In `lib/gemini.ts`, replace the Gemini calls with Claude:
   ```typescript
   import Anthropic from "@anthropic-ai/sdk"
   const client = new Anthropic()
   
   // Replace each function's generateContent call with:
   const message = await client.messages.create({
     model: "claude-sonnet-4-5",
     max_tokens: 1024,
     messages: [{ role: "user", content: yourPrompt }]
   })
   return message.content[0].text
   ```

4. Update the model name in `app/api/gemini/route.ts` and rename to `app/api/ai/route.ts`

The system prompts are already written to the same strict standards — they work identically with both providers.

---

## PROJECT STRUCTURE

```
coversmart/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx         ← Login page
│   │   └── register/page.tsx      ← Registration page
│   ├── (dashboard)/
│   │   ├── layout.tsx             ← Sidebar + auth guard
│   │   ├── overview/page.tsx      ← Main dashboard
│   │   ├── decoder/page.tsx       ← Policy PDF decoder
│   │   ├── assistant/page.tsx     ← AI chat assistant
│   │   └── complaints/page.tsx    ← Complaint letter generator
│   ├── api/gemini/route.ts        ← Server-side Gemini endpoint
│   ├── globals.css                ← Full design system
│   ├── layout.tsx                 ← Root layout + AuthProvider
│   └── page.tsx                   ← Marketing site
├── context/AuthContext.tsx        ← Firebase auth state + hooks
├── lib/
│   ├── firebase.ts                ← Firebase initialisation
│   ├── firestore.ts               ← Firestore CRUD helpers + types
│   ├── gemini.ts                  ← Gemini AI functions
│   └── utils.ts                   ← Shared utilities
├── middleware.ts                   ← Route protection
├── .env.local.example             ← Environment variable template
└── FIREBASE_SETUP.md              ← This file
```

---

## SUPPORT

If you run into issues:
- Firebase Auth errors → Check Authorized Domains in Firebase Console
- Firestore permission errors → Check Security Rules
- Gemini API errors → Check your GEMINI_API_KEY has no NEXT_PUBLIC_ prefix
- Build errors → Run `npm install` and ensure Node.js 18+
