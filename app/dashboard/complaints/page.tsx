"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"

const COMPLAINT_TYPES = [
  { value:"waiting_period",        label:"Illegal waiting period applied" },
  { value:"cancellation_barrier",  label:"Unreasonable cancellation barrier (TCF Outcome 6)" },
  { value:"claim_repudiation",     label:"Unfair claim repudiation" },
  { value:"funeral_cap",           label:"Funeral policy cap violation (GOI 7)" },
  { value:"premium_increase",      label:"Unreasonable premium increase without notice" },
  { value:"non_disclosure",        label:"Material information not disclosed at sale" },
  { value:"cooling_off",           label:"Cooling-off period not honoured" },
  { value:"other",                 label:"Other regulatory complaint" },
]

const Ico = {
  Copy:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Shield: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert:  () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
}

export default function ComplaintsPage() {
  const { user } = useAuth()
  const [form, setForm]       = useState({ insurer:"", policyNumber:"", complaintType:"", incidentDescription:"", dateOfIncident:"", desiredOutcome:"" })
  const [letter, setLetter]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [copied, setCopied]   = useState(false)

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const generate = async () => {
    if (!form.insurer || !form.complaintType || !form.incidentDescription) { setError("Please complete all required fields."); return }
    setLoading(true); setError(null); setLetter(null)
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:              "complaint",
          userName:            user?.displayName || "Policyholder",
          insurer:             form.insurer,
          policyNumber:        form.policyNumber,
          complaintType:       COMPLAINT_TYPES.find(c => c.value===form.complaintType)?.label || form.complaintType,
          incidentDescription: form.incidentDescription,
          dateOfIncident:      form.dateOfIncident,
          desiredOutcome:      form.desiredOutcome,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLetter(data.letter)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not generate letter. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copyLetter = () => {
    if (!letter) return
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Complaints Ghostwriter</div>
          <div className="topbar-sub">Generate a legally-structured complaint letter with regulatory citations</div>
        </div>
        <div className="topbar-right">
          <div style={{ display:"flex",alignItems:"center",gap:".5rem",background:"rgba(255,255,255,0.04)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:".45rem .9rem",fontSize:".76rem",color:"var(--text2)",fontWeight:500 }}>
            <Ico.Shield /> PPR Rule 17 · COFI Ch.42 · TCF
          </div>
        </div>
      </div>

      <div className="dash-content">
        <div style={{ display:"grid",gridTemplateColumns:"480px 1fr",gap:"1.5rem",alignItems:"start" }}>

          {/* FORM */}
          <div style={{ display:"flex",flexDirection:"column",gap:"1.25rem" }}>
            <div className="cs-card">
              <div className="cs-card-head"><Ico.Copy /><span className="cs-card-title">Complaint Details</span></div>
              <div className="cs-card-body" style={{ display:"flex",flexDirection:"column",gap:"1rem" }}>
                <div className="cs-field">
                  <label className="cs-label">Insurer *</label>
                  <input type="text" className="cs-input" placeholder="e.g. Old Mutual, Discovery, Clientèle" value={form.insurer} onChange={e => update("insurer",e.target.value)} />
                </div>
                <div className="cs-field">
                  <label className="cs-label">Policy Number</label>
                  <input type="text" className="cs-input" placeholder="Your policy reference number" value={form.policyNumber} onChange={e => update("policyNumber",e.target.value)} />
                </div>
                <div className="cs-field">
                  <label className="cs-label">Complaint Type *</label>
                  <select className="cs-select" value={form.complaintType} onChange={e => update("complaintType",e.target.value)}>
                    <option value="">Select complaint type...</option>
                    {COMPLAINT_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="cs-field">
                  <label className="cs-label">Date of Incident</label>
                  <input type="date" className="cs-input" value={form.dateOfIncident} onChange={e => update("dateOfIncident",e.target.value)} />
                </div>
                <div className="cs-field">
                  <label className="cs-label">Describe What Happened *</label>
                  <textarea className="cs-textarea" placeholder="Describe the incident, what the insurer did, and how it affected you..." value={form.incidentDescription} onChange={e => update("incidentDescription",e.target.value)} style={{ minHeight:"110px" }} />
                </div>
                <div className="cs-field">
                  <label className="cs-label">Desired Outcome</label>
                  <input type="text" className="cs-input" placeholder="e.g. Full refund, policy reinstated, written apology" value={form.desiredOutcome} onChange={e => update("desiredOutcome",e.target.value)} />
                </div>

                {error && (
                  <div style={{ background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:"var(--r-sm)",padding:".65rem .9rem",fontSize:".84rem",color:"#fca5a5",display:"flex",gap:".5rem" }}>
                    <Ico.Alert />{error}
                  </div>
                )}

                <button onClick={generate} disabled={loading} className="btn btn-primary btn-full btn-lg">
                  {loading ? <><div className="btn-spinner" /> Generating letter...</> : "GENERATE COMPLAINT LETTER"}
                </button>
              </div>
            </div>

            <div className="cs-card">
              <div className="cs-card-head"><Ico.Shield /><span className="cs-card-title">Legal Basis</span></div>
              <div className="cs-card-body">
                {[
                  { reg:"PPR Rule 17",      desc:"Mandates a formal complaints process every insurer must follow" },
                  { reg:"COFI Chapter 42",  desc:"Governs conduct of financial institutions toward customers" },
                  { reg:"TCF Outcome 6",    desc:"Prohibits unreasonable post-sale barriers to switching or cancelling" },
                  { reg:"FAIS Act S3",      desc:"Governs fair financial advice and intermediary services" },
                ].map(r => (
                  <div key={r.reg} style={{ display:"flex",gap:".8rem",marginBottom:".9rem",paddingBottom:".9rem",borderBottom:"1px solid var(--border)" }}>
                    <span style={{ fontFamily:"var(--font-d)",fontSize:".6rem",letterSpacing:".06em",color:"var(--red)",flexShrink:0,paddingTop:"2px" }}>{r.reg}</span>
                    <span style={{ fontSize:".84rem",color:"var(--text2)",fontWeight:500,lineHeight:1.5 }}>{r.desc}</span>
                  </div>
                ))}
                <div className="cs-disclaimer">
                  <Ico.Shield />
                  <p>This tool generates letter templates only. CoverSmart is not a legal service. The letter should be reviewed before sending. CoverSmart does not manage complaints on your behalf.</p>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT */}
          <div>
            {!letter && !loading && (
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"500px",flexDirection:"column",gap:".9rem",color:"var(--text3)" }}>
                <Ico.Copy />
                <div style={{ fontFamily:"var(--font-d)",fontSize:".62rem",letterSpacing:".15em",textTransform:"uppercase" }}>Your complaint letter will appear here</div>
              </div>
            )}

            {loading && (
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"500px",flexDirection:"column",gap:"1rem" }}>
                <div style={{ width:"36px",height:"36px",border:"2px solid rgba(255,255,255,0.08)",borderTopColor:"var(--red)",borderRadius:"50%",animation:"spin .8s linear infinite" }} />
                <div style={{ fontFamily:"var(--font-d)",fontSize:".62rem",letterSpacing:".14em",color:"var(--text2)",textTransform:"uppercase" }}>Drafting your complaint letter...</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {letter && (
              <div className="cs-card">
                <div className="cs-card-head">
                  <Ico.Copy /><span className="cs-card-title">Your Complaint Letter</span>
                  <span className="badge badge-green">READY TO SEND</span>
                  <button onClick={copyLetter} className="btn btn-ghost btn-sm" style={{ marginLeft:"auto" }}>
                    {copied ? <><Ico.Check /> Copied</> : <><Ico.Copy /> Copy Letter</>}
                  </button>
                </div>
                <div className="cs-card-body">
                  <div style={{ background:"rgba(255,255,255,0.025)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",padding:"1.5rem 1.75rem",whiteSpace:"pre-wrap",fontFamily:"Georgia, serif",fontSize:".88rem",lineHeight:1.8,color:"var(--text2)" }}>
                    {letter}
                  </div>
                  <div style={{ display:"flex",gap:".75rem",marginTop:"1.1rem" }}>
                    <button onClick={copyLetter} className="btn btn-primary">
                      {copied ? "✓ COPIED" : "COPY LETTER"}
                    </button>
                    <button onClick={() => { const blob = new Blob([letter], {type:"text/plain"}); const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="complaint_letter.txt"; a.click() }} className="btn btn-outline">
                      DOWNLOAD .TXT
                    </button>
                  </div>
                  <div style={{ marginTop:"1rem",padding:".75rem",background:"rgba(239,68,68,0.05)",border:"1px solid rgba(239,68,68,0.12)",borderRadius:"var(--r-sm)",fontSize:".78rem",color:"var(--text3)",lineHeight:1.6 }}>
                    <strong style={{ color:"var(--text2)" }}>Before sending:</strong> Review the letter for accuracy. Fill in any placeholder fields marked [BRACKETS]. CoverSmart generates templates only and does not manage correspondence on your behalf.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
