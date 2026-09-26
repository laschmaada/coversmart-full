import { NextRequest, NextResponse } from "next/server"
import { decodePolicyDocument, generateComplaintLetter, chatWithAssistant, analyseGaps } from "@/lib/gemini"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 })
    }

    switch (action) {

      // ─── DECODE POLICY DOCUMENT ──────────────────────────────────────────────
      case "decode": {
        const { policyText } = body
        if (!policyText) return NextResponse.json({ error: "Missing policyText" }, { status: 400 })
        const result = await decodePolicyDocument(policyText)
        return NextResponse.json({ result })
      }

      // ─── GENERATE COMPLAINT LETTER ───────────────────────────────────────────
      case "complaint": {
        const { userName, insurer, policyNumber, complaintType, incidentDescription, dateOfIncident, desiredOutcome } = body
        if (!userName || !insurer || !complaintType || !incidentDescription) {
          return NextResponse.json({ error: "Missing required complaint fields" }, { status: 400 })
        }
        const letter = await generateComplaintLetter({ userName, insurer, policyNumber, complaintType, incidentDescription, dateOfIncident, desiredOutcome })
        return NextResponse.json({ letter })
      }

      // ─── AI ASSISTANT CHAT ────────────────────────────────────────────────────
      case "chat": {
        const { messages, userPolicies, userProfile } = body
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
          return NextResponse.json({ error: "Missing or invalid messages" }, { status: 400 })
        }
        const reply = await chatWithAssistant(messages, userPolicies || "No policies loaded", userProfile || "No profile data")
        return NextResponse.json({ reply })
      }

      // ─── GAP ANALYSIS ─────────────────────────────────────────────────────────
      case "gaps": {
        const { profile } = body
        if (!profile) return NextResponse.json({ error: "Missing profile" }, { status: 400 })
        const result = await analyseGaps(profile)
        return NextResponse.json({ result })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (error) {
    console.error("[Gemini API Error]", error)
    return NextResponse.json({ error: "AI service error. Please try again." }, { status: 500 })
  }
}
