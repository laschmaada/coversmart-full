"use client"

import { useState, useRef } from "react"

const Ico = {
  Upload: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  File:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Alert:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Check:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Shield: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
}

interface DecodeResult {
  policyType?: string
  insurer?: string
  summary?: string
  mainCover?: string[]
  exclusions?: string[]
  excess?: string
  premiumDetails?: string
  keyConditions?: string[]
  waitingPeriods?: string[]
  benefitAmounts?: Record<string, string>
  error?: string
}

export default function DecoderPage() {
  const [file, setFile]           = useState<File | null>(null)
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState<DecodeResult | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [dragOver, setDragOver]   = useState(false)
  const fileRef                   = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    if (f.type !== "application/pdf") { setError("Please upload a PDF file."); return }
    if (f.size > 10 * 1024 * 1024)   { setError("File size must be under 10MB."); return }
    setFile(f); setError(null); setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const decode = async () => {
    if (!file) return
    setLoading(true); setError(null); setResult(null)

    try {
      // Read file as text (PDF text extraction)
      const text = await file.text()

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decode", policyText: text }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Decode failed")
      setResult(data.result)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Policy Decoder</div>
          <div className="topbar-sub">Upload any policy document — we translate it into plain English</div>
        </div>
        <div className="topbar-right">
          <div style={{ display:"flex",alignItems:"center",gap:".5rem",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"var(--r-sm)",padding:".45rem .9rem",fontSize:".76rem",color:"#fca5a5",fontWeight:500 }}>
            <Ico.Shield /> Factual extraction only — no advice rendered
          </div>
        </div>
      </div>

      <div className="dash-content">
        <div style={{ display:"grid",gridTemplateColumns:"400px 1fr",gap:"1.5rem",alignItems:"start" }}>

          {/* UPLOAD PANEL */}
          <div style={{ display:"flex",flexDirection:"column",gap:"1.25rem" }}>
            <div className="cs-card">
              <div className="cs-card-head"><Ico.File /><span className="cs-card-title">Upload Policy PDF</span></div>
              <div className="cs-card-body">
                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{ border:`2px dashed ${dragOver ? "var(--red)" : file ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.15)"}`,borderRadius:"var(--r-md)",padding:"2rem 1.5rem",textAlign:"center",cursor:"pointer",transition:"all .2s",background:dragOver?"rgba(239,68,68,0.05)":file?"rgba(34,197,94,0.04)":"rgba(255,255,255,0.02)" }}
                >
                  <div style={{ color:file?"var(--green)":"rgba(255,255,255,0.3)",marginBottom:".75rem",display:"flex",justifyContent:"center" }}>
                    {file ? <Ico.Check /> : <Ico.Upload />}
                  </div>
                  {file ? (
                    <>
                      <div style={{ fontWeight:700,color:"var(--green)",marginBottom:".25rem" }}>{file.name}</div>
                      <div style={{ fontSize:".8rem",color:"var(--text3)" }}>{(file.size/1024).toFixed(0)} KB · PDF</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight:600,color:"var(--text2)",marginBottom:".4rem" }}>Drop your PDF here</div>
                      <div style={{ fontSize:".82rem",color:"var(--text3)" }}>or click to browse · Max 10MB</div>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf" style={{ display:"none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

                {error && (
                  <div style={{ marginTop:".75rem",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:"var(--r-sm)",padding:".65rem .9rem",fontSize:".82rem",color:"#fca5a5",display:"flex",gap:".5rem" }}>
                    <Ico.Alert />{error}
                  </div>
                )}

                <button
                  onClick={decode}
                  disabled={!file || loading}
                  className="btn btn-primary btn-full"
                  style={{ marginTop:"1rem" }}
                >
                  {loading ? <><div className="btn-spinner" /> Analysing...</> : "DECODE POLICY"}
                </button>

                {file && !loading && (
                  <button onClick={() => { setFile(null); setResult(null); setError(null) }} className="btn btn-ghost btn-full" style={{ marginTop:".5rem" }}>
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="cs-card">
              <div className="cs-card-head"><Ico.Shield /><span className="cs-card-title">How This Works</span></div>
              <div className="cs-card-body">
                {[
                  { step:"01", title:"Upload your PDF", desc:"Your policy schedule or cover document. We process it securely and never store it beyond your session." },
                  { step:"02", title:"AI extracts the facts", desc:"Our AI reads the document and extracts exactly what is written — no interpretation, no advice." },
                  { step:"03", title:"Plain language output", desc:"You receive a clear breakdown of cover, exclusions, excess amounts, and key conditions." },
                ].map(s => (
                  <div key={s.step} style={{ display:"flex",gap:".8rem",marginBottom:"1rem" }}>
                    <div style={{ fontFamily:"var(--font-d)",fontSize:"1.1rem",color:"rgba(255,255,255,0.08)",lineHeight:1,flexShrink:0,width:"28px" }}>{s.step}</div>
                    <div>
                      <div style={{ fontWeight:700,fontSize:".88rem",color:"var(--text)",marginBottom:".25rem" }}>{s.title}</div>
                      <div style={{ fontSize:".8rem",color:"var(--text2)",lineHeight:1.55 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
                <div className="cs-disclaimer" style={{ marginTop:".5rem" }}>
                  <Ico.Shield />
                  <p>This tool restates factual content from your document only. It does not constitute financial advice under FAIS Section 3(a)(i)(bb).</p>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS PANEL */}
          <div>
            {!result && !loading && (
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"400px",flexDirection:"column",gap:"1rem",color:"var(--text3)" }}>
                <Ico.File />
                <div style={{ fontFamily:"var(--font-d)",fontSize:".65rem",letterSpacing:".16em",textTransform:"uppercase" }}>Upload a policy PDF to see the decoded output</div>
              </div>
            )}

            {loading && (
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"400px",flexDirection:"column",gap:"1rem" }}>
                <div style={{ width:"40px",height:"40px",border:"2px solid rgba(255,255,255,0.08)",borderTopColor:"var(--red)",borderRadius:"50%",animation:"spin .8s linear infinite" }} />
                <div style={{ fontFamily:"var(--font-d)",fontSize:".65rem",letterSpacing:".14em",color:"var(--text2)",textTransform:"uppercase" }}>Analysing your policy...</div>
                <div style={{ fontSize:".82rem",color:"var(--text3)",fontWeight:500 }}>This usually takes 10–20 seconds</div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {result && !result.error && (
              <div style={{ display:"flex",flexDirection:"column",gap:"1.25rem" }}>
                {/* Summary */}
                <div className="cs-card">
                  <div className="cs-card-head">
                    <span className="cs-card-title">{result.insurer || "Policy"} — {result.policyType || "Insurance Policy"}</span>
                    <span className="badge badge-green">DECODED</span>
                  </div>
                  <div className="cs-card-body">
                    <p style={{ fontSize:".95rem",color:"var(--text2)",lineHeight:1.65,fontWeight:500 }}>{result.summary}</p>
                  </div>
                </div>

                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem" }}>
                  {/* What's covered */}
                  {result.mainCover && result.mainCover.length > 0 && (
                    <div className="cs-card">
                      <div className="cs-card-head"><Ico.Check /><span className="cs-card-title">What Is Covered</span></div>
                      <div className="cs-card-body">
                        {result.mainCover.map((item, i) => (
                          <div key={i} style={{ display:"flex",gap:".65rem",marginBottom:".65rem",alignItems:"flex-start" }}>
                            <div style={{ color:"var(--green)",flexShrink:0,marginTop:"2px" }}><Ico.Check /></div>
                            <span style={{ fontSize:".88rem",color:"var(--text2)",lineHeight:1.55,fontWeight:500 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exclusions */}
                  {result.exclusions && result.exclusions.length > 0 && (
                    <div className="cs-card" style={{ borderColor:"rgba(239,68,68,0.2)" }}>
                      <div className="cs-card-head" style={{ borderBottomColor:"rgba(239,68,68,0.15)" }}><Ico.Alert /><span className="cs-card-title" style={{ color:"var(--red)" }}>Exclusions</span><span className="badge badge-red">{result.exclusions.length}</span></div>
                      <div className="cs-card-body">
                        {result.exclusions.map((item, i) => (
                          <div key={i} style={{ display:"flex",gap:".65rem",marginBottom:".65rem",alignItems:"flex-start" }}>
                            <div style={{ color:"var(--red)",flexShrink:0,marginTop:"2px" }}><Ico.Alert /></div>
                            <span style={{ fontSize:".88rem",color:"#fca5a5",lineHeight:1.55,fontWeight:500 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Key details */}
                <div className="cs-card">
                  <div className="cs-card-head"><Ico.File /><span className="cs-card-title">Key Policy Details</span></div>
                  <div className="cs-card-body" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem" }}>
                    {[
                      { label:"Excess / Deductible", value:result.excess },
                      { label:"Premium Details",     value:result.premiumDetails },
                    ].filter(d => d.value).map(d => (
                      <div key={d.label}>
                        <div style={{ fontFamily:"var(--font-d)",fontSize:".5rem",letterSpacing:".16em",color:"var(--text3)",textTransform:"uppercase",marginBottom:".3rem" }}>{d.label}</div>
                        <div style={{ fontSize:".9rem",color:"var(--text2)",fontWeight:500,lineHeight:1.5 }}>{d.value}</div>
                      </div>
                    ))}
                    {result.waitingPeriods && result.waitingPeriods.length > 0 && (
                      <div>
                        <div style={{ fontFamily:"var(--font-d)",fontSize:".5rem",letterSpacing:".16em",color:"var(--text3)",textTransform:"uppercase",marginBottom:".3rem" }}>Waiting Periods</div>
                        {result.waitingPeriods.map((w,i) => <div key={i} style={{ fontSize:".88rem",color:"var(--orange)",fontWeight:500,marginBottom:".25rem" }}>⏱ {w}</div>)}
                      </div>
                    )}
                    {result.benefitAmounts && Object.keys(result.benefitAmounts).length > 0 && (
                      <div>
                        <div style={{ fontFamily:"var(--font-d)",fontSize:".5rem",letterSpacing:".16em",color:"var(--text3)",textTransform:"uppercase",marginBottom:".3rem" }}>Benefit Amounts</div>
                        {Object.entries(result.benefitAmounts).map(([k,v]) => (
                          <div key={k} style={{ display:"flex",justifyContent:"space-between",fontSize:".84rem",fontWeight:600,marginBottom:".2rem" }}>
                            <span style={{ color:"var(--text2)" }}>{k}</span>
                            <span style={{ color:"var(--text)",fontFamily:"var(--font-d)",fontSize:".78rem" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {result?.error && (
              <div className="cs-card" style={{ padding:"2rem",textAlign:"center" }}>
                <div style={{ color:"var(--red)",marginBottom:".75rem",fontSize:"1.5rem" }}>⚠</div>
                <div style={{ fontWeight:700,color:"var(--text)",marginBottom:".5rem" }}>Could not decode this document</div>
                <div style={{ fontSize:".88rem",color:"var(--text2)" }}>{result.error}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
