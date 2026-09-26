// Server-side only — uses GEMINI_API_KEY (no NEXT_PUBLIC prefix)
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.warn("[Gemini] GEMINI_API_KEY is missing in environment variables.")
}

const genAI = new GoogleGenerativeAI(apiKey || "")

// Use gemini-1.5-flash — fastest, generous free tier
// Note: prepend models/ if the SDK doesn't do it automatically in certain versions
const MODEL = "gemini-1.5-flash"

// ─── POLICY DECODER ───────────────────────────────────────────────────────────

export async function decodePolicyDocument(policyText: string) {
  const model = genAI.getGenerativeModel({ model: MODEL })

  const prompt = `You are a plain-language translation tool for South African insurance policy documents.

TASK: Extract and restate in simple English exactly what is written in this policy document.

RULES:
- Do NOT add interpretation or opinion
- Do NOT suggest alternatives or recommend any product
- Do NOT make any recommendations
- Flag ALL exclusions explicitly with "⚠ EXCLUSION:" prefix
- If you cannot determine something from the document, say "Not specified in document"
- Use rand amounts (R) for all monetary values
- Keep language accessible to someone with Grade 10 literacy

OUTPUT FORMAT — respond with valid JSON only, no markdown:
{
  "policyType": "string",
  "insurer": "string", 
  "mainCover": ["what is covered point by point"],
  "exclusions": ["each exclusion as a plain statement"],
  "excess": "string describing excess/deductible",
  "premiumDetails": "string",
  "keyConditions": ["important conditions the policyholder must meet"],
  "waitingPeriods": ["any waiting periods mentioned"],
  "benefitAmounts": {"benefit name": "amount"},
  "summary": "2-sentence plain English summary of what this policy does and does not cover"
}

POLICY DOCUMENT:
${policyText.slice(0, 15000)}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const clean = text.replace(/```json|```/g, "").trim()
    return JSON.parse(clean)
  } catch (error: any) {
    console.error("[Gemini Decode Error]", {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    })
    return { error: "Could not parse policy document. Please try again.", raw: "" }
  }
}

// ─── COMPLAINTS GHOSTWRITER ────────────────────────────────────────────────────

export async function generateComplaintLetter(data: {
  userName: string
  insurer: string
  policyNumber: string
  complaintType: string
  incidentDescription: string
  dateOfIncident: string
  desiredOutcome: string
}) {
  const model = genAI.getGenerativeModel({ model: MODEL })

  const prompt = `You are a South African insurance consumer rights assistant. Generate a formal complaint letter.

RULES:
- Reference the specific South African regulation that applies
- Use precise regulatory language from PPR (Policyholder Protection Rules), TCF (Treating Customers Fairly), or FAIS Act
- Be firm but professional
- Do NOT give legal advice — only state factual regulatory requirements
- Include reference to the FSCA Ombud if the insurer does not respond within 30 days
- Format as a proper business letter

COMPLAINT DETAILS:
- Complainant: ${data.userName}
- Insurer: ${data.insurer}
- Policy Number: ${data.policyNumber}
- Complaint Type: ${data.complaintType}
- Incident: ${data.incidentDescription}
- Date: ${data.dateOfIncident}
- Desired Outcome: ${data.desiredOutcome}

Generate the complete, ready-to-send complaint letter. Include date, reference numbers placeholder, and regulatory citations.`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error: any) {
    console.error("[Gemini Complaint Error]", {
      message: error.message,
      status: error.status,
      statusText: error.statusText
    })
    return "Error generating complaint letter. Please try again."
  }
}

// ─── AI ASSISTANT (CHAT) ──────────────────────────────────────────────────────

export async function chatWithAssistant(
  messages: { role: "user" | "model"; parts: string }[],
  userPolicies: string,
  userProfile: string
) {
  const model = genAI.getGenerativeModel({ model: MODEL })

  const systemContext = `You are the CoverSmart AI Insurance Assistant — a helpful, factual South African insurance information tool.

YOUR STRICT RULES:
1. Only answer questions about the user's specific policies provided below
2. NEVER recommend a specific insurance product or provider
3. NEVER advise on whether to claim — direct users to their insurer
4. NEVER give legal advice — provide factual regulatory information only
5. When a question requires personalised financial advice, say: "For personalised advice on this, I recommend speaking with an authorised Financial Services Provider (FSP)."
6. Always cite the relevant South African regulation when referencing rules (PPR, FAIS, TCF, GOI 7, etc.)
7. Keep responses clear and conversational — no jargon
8. You are NOT an FSP. You provide factual information only.

USER'S INSURANCE PROFILE:
${userProfile}

USER'S CURRENT POLICIES:
${userPolicies}

Answer based only on the above information. If the user asks about a policy not listed, say you don't have that information in their Vault.`

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemContext }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I'm ready to help you understand your insurance policies. What would you like to know?" }],
      },
      ...messages.slice(0, -1).map(m => ({
        role: m.role,
        parts: [{ text: m.parts }],
      })),
    ],
  })

  try {
    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.parts)
    return result.response.text()
  } catch (error: any) {
    console.error("[Gemini Chat Error]", {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      model: MODEL
    })
    return "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again later."
  }
}

// ─── GAP ANALYSIS ─────────────────────────────────────────────────────────────

export async function analyseGaps(profile: {
  age: number
  maritalStatus: string
  dependants: number
  homeOwner: boolean
  employmentStatus: string
  existingCover: string[]
}) {
  const model = genAI.getGenerativeModel({ model: MODEL })

  const prompt = `You are a South African insurance information tool. Based on the profile below, identify insurance coverage gaps.

RULES:
- Do NOT recommend specific insurers or products
- Only identify categories of cover that are typically relevant for this profile
- Reference South African context (e.g., funeral cover, income protection, medical aid)
- Be factual, not alarmist
- Do NOT give financial advice

USER PROFILE:
- Age: ${profile.age}
- Status: ${profile.maritalStatus}
- Dependants: ${profile.dependants}
- Home Owner: ${profile.homeOwner}
- Employment: ${profile.employmentStatus}
- Existing Cover Types: ${profile.existingCover.join(", ")}

Respond with valid JSON only:
{
  "gaps": [
    {
      "category": "cover type name",
      "reason": "why this is relevant for their profile",
      "regulation": "any relevant SA regulation or standard",
      "priority": "high | medium | low"
    }
  ],
  "summary": "2-sentence overview"
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim())
  } catch {
    return { gaps: [], summary: "Unable to analyse at this time." }
  }
}
