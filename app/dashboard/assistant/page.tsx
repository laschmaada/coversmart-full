"use client"

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"

interface Message { role: "user" | "model"; parts: string; ts?: Date }

const SUGGESTIONS = [
  "What exactly does my Discovery Life policy cover?",
  "Am I affected by the funeral cap rule?",
  "What is a waiting period and does mine apply?",
  "How do I cancel a policy without losing all my premiums?",
  "What is TCF Outcome 6 and how does it protect me?",
  "Explain the difference between my funeral policies",
]

const Ico = {
  Zap:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Shield: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Send:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  User:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
}

const MOCK_POLICIES_CONTEXT = `
User has 8 active policies:
1. Old Mutual iWyze Funeral Plan - R50,000 benefit - R185/mo
2. Clientèle Life Funeral Cover - R60,000 benefit - R245/mo
3. 1Life Family Funeral - R40,000 benefit - R165/mo (covers family too)
4. AVBOB Funeral Policy - R35,000 benefit - R142/mo
Total funeral cover: R185,000 (R85,000 over the R100,000 GOI 7 cap)
5. Discovery Insure Classic Car Cover - R380,000 - R1,890/mo (includes roadside assist)
6. Outsurance Home Contents Plus - R280,000 - R680/mo (includes roadside assist - DUPLICATE)
7. Discovery Life Plan Gold - R2,000,000 life + R500,000 accidental death - R1,450/mo
8. Old Mutual Credit Life Protector - R185,000 - R390/mo (includes R185k accidental death - DUPLICATE)
`

const MOCK_PROFILE_CONTEXT = `
Name: Themba Nkosi, Age: 38, Location: Sandton Gauteng, Married with 2 dependants, Home owner, Employed full-time
Total monthly premiums: R5,147
Key issues: Funeral cap breach (GOI 7), duplicate roadside assist, duplicate accidental death cover
`

export default function AssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState("")
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (text?: string) => {
    const content = text || input.trim()
    if (!content || loading) return
    setInput("")

    const userMsg: Message = { role: "user", parts: content, ts: new Date() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setLoading(true)

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:      "chat",
          messages:    updated.map(m => ({ role: m.role, parts: m.parts })),
          userPolicies: MOCK_POLICIES_CONTEXT,
          userProfile:  MOCK_PROFILE_CONTEXT,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages(prev => [...prev, { role: "model", parts: data.reply, ts: new Date() }])
    } catch (e: unknown) {
      setMessages(prev => [...prev, { role: "model", parts: "I couldn't process that request. Please try again.", ts: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const firstName = user?.displayName?.split(" ")[0] ?? "there"

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">AI Insurance Assistant</div>
          <div className="topbar-sub">Ask anything about your policies — available 24/7</div>
        </div>
        <div className="topbar-right">
          <div style={{ display:"flex",alignItems:"center",gap:".5rem",background:"rgba(139,92,246,0.1)",border:"1px solid rgba(139,92,246,0.25)",borderRadius:"var(--r-sm)",padding:".45rem .9rem",fontSize:".76rem",color:"#c4b5fd",fontWeight:500 }}>
            <Ico.Zap /> Powered by Gemini · Factual info only
          </div>
        </div>
      </div>

      <div style={{ display:"flex",flexDirection:"column",height:"calc(100vh - 65px)" }}>

        {/* CHAT AREA */}
        <div style={{ flex:1,overflowY:"auto",padding:"1.5rem 1.75rem",display:"flex",flexDirection:"column",gap:"1rem" }}>

          {/* Welcome state */}
          {messages.length === 0 && (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,gap:"1.5rem",paddingTop:"2rem" }}>
              <div style={{ width:"56px",height:"56px",borderRadius:"50%",background:"linear-gradient(135deg,#4a2d8a,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <Ico.Zap />
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-d)",fontSize:".9rem",color:"var(--text)",marginBottom:".5rem",textTransform:"uppercase" }}>AI Insurance Assistant</div>
                <div style={{ fontSize:".95rem",color:"var(--text2)",maxWidth:"420px",lineHeight:1.6,fontWeight:500 }}>
                  Hi {firstName}! Ask me anything about your insurance policies. I have access to your full vault and can explain your cover in plain English.
                </div>
              </div>

              <div className="cs-disclaimer" style={{ maxWidth:"480px" }}>
                <Ico.Shield />
                <p>I provide <strong>factual information</strong> about your existing policies only. I do not give financial advice or recommend products. For personalised advice, consult an authorised FSP.</p>
              </div>

              {/* Suggestions */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:".65rem",maxWidth:"600px",width:"100%" }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"var(--r-md)",padding:".75rem 1rem",fontSize:".84rem",color:"var(--text2)",fontWeight:500,cursor:"pointer",textAlign:"left",lineHeight:1.5,transition:"all .2s" }}
                    onMouseOver={e => { e.currentTarget.style.borderColor="rgba(139,92,246,0.4)"; e.currentTarget.style.color="var(--text)" }}
                    onMouseOut={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"; e.currentTarget.style.color="var(--text2)" }}
                  >{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex",gap:".75rem",justifyContent:msg.role==="user"?"flex-end":"flex-start",alignItems:"flex-start" }}>
              {msg.role === "model" && (
                <div style={{ width:"30px",height:"30px",borderRadius:"50%",background:"linear-gradient(135deg,#4a2d8a,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px" }}>
                  <Ico.Zap />
                </div>
              )}
              <div style={{ maxWidth:"680px",background:msg.role==="user"?"rgba(239,68,68,0.12)":"rgba(255,255,255,0.04)",border:`1px solid ${msg.role==="user"?"rgba(239,68,68,0.25)":"rgba(255,255,255,0.08)"}`,borderRadius:msg.role==="user"?"var(--r-lg) var(--r-sm) var(--r-lg) var(--r-lg)":"var(--r-sm) var(--r-lg) var(--r-lg) var(--r-lg)",padding:".9rem 1.1rem" }}>
                <div style={{ fontSize:".92rem",color:msg.role==="user"?"rgba(255,255,255,0.9)":"var(--text2)",lineHeight:1.65,fontWeight:500,whiteSpace:"pre-wrap" }}>{msg.parts}</div>
                <div style={{ fontSize:".7rem",color:"var(--text3)",marginTop:".4rem",fontWeight:500 }}>
                  {msg.ts?.toLocaleTimeString("en-ZA",{ hour:"2-digit",minute:"2-digit" })}
                </div>
              </div>
              {msg.role === "user" && (
                <div style={{ width:"30px",height:"30px",borderRadius:"50%",background:"linear-gradient(135deg,#2d1f6e,#ef4444)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:"2px" }}>
                  <Ico.User />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display:"flex",gap:".75rem",alignItems:"flex-start" }}>
              <div style={{ width:"30px",height:"30px",borderRadius:"50%",background:"linear-gradient(135deg,#4a2d8a,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Ico.Zap />
              </div>
              <div style={{ background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"var(--r-sm) var(--r-lg) var(--r-lg) var(--r-lg)",padding:".9rem 1.2rem",display:"flex",gap:".4rem",alignItems:"center" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:"6px",height:"6px",borderRadius:"50%",background:"rgba(255,255,255,0.3)",animation:`bounce .8s ease-in-out ${i*0.15}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={{ padding:"1rem 1.75rem",borderTop:"1px solid var(--border)",background:"rgba(9,5,26,0.8)",backdropFilter:"blur(12px)" }}>
          <div style={{ display:"flex",gap:".75rem",maxWidth:"900px",margin:"0 auto" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about your policies... (Enter to send)"
              rows={1}
              className="cs-textarea"
              style={{ flex:1,minHeight:"44px",maxHeight:"120px",resize:"none",padding:".625rem 1rem" }}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="btn btn-primary" style={{ padding:".625rem 1.25rem",flexShrink:0,alignSelf:"flex-end" }}>
              <Ico.Send />
            </button>
          </div>
          <div style={{ textAlign:"center",fontSize:".72rem",color:"var(--text3)",marginTop:".6rem",fontWeight:500 }}>
            Responses are factual only and do not constitute financial advice · Not an FSP
          </div>
        </div>
      </div>

      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
    </>
  )
}
