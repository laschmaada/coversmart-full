"use client"

import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

// ─── MOCK DATA (replace with Firestore calls in production) ───────────────────
const POLICIES = [
  { id:1, category:"FUNERAL",     insurer:"Old Mutual",      product:"iWyze Funeral Plan",       policyNo:"OM-FUN-2019-448821", benefit:50000,  premium:185,  insured:"Themba Nkosi",                status:"critical", tags:["CAP BREACH"] },
  { id:2, category:"FUNERAL",     insurer:"Clientèle Life",  product:"Clientèle Funeral Cover",  policyNo:"CL-FC-2021-009934",  benefit:60000,  premium:245,  insured:"Themba Nkosi",                status:"critical", tags:["CAP BREACH"] },
  { id:3, category:"FUNERAL",     insurer:"1Life",           product:"1Life Family Funeral",     policyNo:"1L-FAM-2022-17743",  benefit:40000,  premium:165,  insured:"Themba Nkosi + Family",       status:"critical", tags:["CAP BREACH"] },
  { id:4, category:"FUNERAL",     insurer:"AVBOB",           product:"AVBOB Funeral Policy",     policyNo:"AVB-2020-FUN-554109",benefit:35000,  premium:142,  insured:"Themba Nkosi",                status:"critical", tags:["CAP BREACH"] },
  { id:5, category:"CAR",         insurer:"Discovery Insure",product:"Classic Car Cover",        policyNo:"DIS-CAR-2023-8812A", benefit:380000, premium:1890, insured:"VW Tiguan 2.0TSI (GP 44 MN)",status:"warning",  tags:["DUPLICATE BENEFIT"] },
  { id:6, category:"HOME",        insurer:"Outsurance",      product:"Home Contents Plus",       policyNo:"OI-HC-2020-330021",  benefit:280000, premium:680,  insured:"22 Acacia Drive, Sandton",    status:"warning",  tags:["DUPLICATE BENEFIT"] },
  { id:7, category:"LIFE",        insurer:"Discovery Life",  product:"Life Plan Gold",           policyNo:"DL-LIFE-2018-229944",benefit:2000000,premium:1450, insured:"Themba Nkosi",                status:"warning",  tags:["DUPLICATE BENEFIT"] },
  { id:8, category:"CREDIT LIFE", insurer:"Old Mutual",      product:"Credit Life Protector",    policyNo:"OM-CL-2021-778833",  benefit:185000, premium:390,  insured:"Themba Nkosi",                status:"warning",  tags:["DUPLICATE BENEFIT","REVIEW"] },
]

const TOTAL_PREMIUM    = POLICIES.reduce((s,p) => s + p.premium, 0)
const FUNERAL_TOTAL    = POLICIES.filter(p => p.category==="FUNERAL").reduce((s,p) => s + p.benefit, 0)
const FUNERAL_EXCESS   = FUNERAL_TOTAL - 100000
const SAVINGS_ESTIMATE = 452

const SPEND = [
  { label:"Funeral",     amount:737,  color:"#ef4444", pct:14 },
  { label:"Car",         amount:1890, color:"#f97316", pct:37 },
  { label:"Life",        amount:1450, color:"#8b5cf6", pct:28 },
  { label:"Home",        amount:680,  color:"#3b82f6", pct:13 },
  { label:"Credit Life", amount:390,  color:"#6b7280", pct:8  },
]

const COVERAGE = [
  { label:"Life Cover",        present:true  },
  { label:"Car Insurance",     present:true  },
  { label:"Home Contents",     present:true  },
  { label:"Funeral Cover",     present:true  },
  { label:"Income Protection", present:false },
  { label:"Medical Aid",       present:false },
  { label:"Disability Cover",  present:false },
]

const CAT_COLORS: Record<string,string> = { FUNERAL:"#ef4444", CAR:"#f97316", HOME:"#3b82f6", LIFE:"#8b5cf6", "CREDIT LIFE":"#6b7280" }

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  Shield:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Alert:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Dollar:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  TrendDn:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  Bell:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Check:    () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Copy:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  File:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
}

const s = {
  kpiGrid:    "display:grid;grid-template-columns:repeat(4,1fr);gap:1rem",
  grid2:      "display:grid;grid-template-columns:1fr 1fr;gap:1.25rem",
  grid3:      "display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem",
}

export default function OverviewPage() {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(" ")[0] ?? "there"
  const criticalCount = POLICIES.filter(p => p.status === "critical").length
  const warningCount  = POLICIES.filter(p => p.status === "warning").length

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div>
          <div className="topbar-title">Insurance Overview</div>
          <div className="topbar-sub">Welcome back, {firstName} — {criticalCount + warningCount} issues need your attention</div>
        </div>
        <div className="topbar-right">
          <Link href="/dashboard/decoder" className="topbar-btn"><Ico.File /> Decode Policy</Link>
          <Link href="/dashboard/vault" className="topbar-btn" style={{ background:"var(--red)",borderColor:"var(--red)",color:"#fff" }}>
            <Ico.Shield /> + Add Policy
          </Link>
          <div className="notif-btn"><Ico.Bell /><div className="notif-dot" /></div>
        </div>
      </div>

      <div className="dash-content">

        {/* CRITICAL BANNER */}
        <div style={{ background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.28)",borderRadius:"var(--r-lg)",padding:"1.1rem 1.4rem",display:"flex",alignItems:"flex-start",gap:"1rem" }}>
          <div style={{ color:"var(--red)",flexShrink:0,marginTop:"2px",animation:"pulseglow 2.5s ease-in-out infinite" }}><Ico.Alert /></div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"var(--font-d)",fontSize:".7rem",letterSpacing:".06em",color:"var(--red)",textTransform:"uppercase",marginBottom:".3rem" }}>
              ⚠ 2 Critical Issues — Estimated Waste: R{SAVINGS_ESTIMATE.toLocaleString()}/month
            </div>
            <div style={{ fontSize:".9rem",color:"rgba(240,236,255,0.7)",fontWeight:500,lineHeight:1.5 }}>
              Your funeral cover totals <strong style={{ color:"#fff" }}>R{FUNERAL_TOTAL.toLocaleString()}</strong> across 4 policies — R{FUNERAL_EXCESS.toLocaleString()} above the legal R100,000 cap (GOI 7). You are also paying for <strong style={{ color:"#fff" }}>duplicate roadside assist and accidental death cover</strong>. Estimated total waste: <strong style={{ color:"var(--red)" }}>R{SAVINGS_ESTIMATE}/mo · R{SAVINGS_ESTIMATE*12}/year</strong>.
            </div>
            <div style={{ display:"flex",gap:".65rem",marginTop:".75rem",flexWrap:"wrap" }}>
              {["View Cap Audit","Draft Complaint","Download Report"].map(a => (
                <div key={a} style={{ display:"inline-flex",alignItems:"center",gap:".35rem",background:"rgba(239,68,68,0.14)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:"20px",padding:".25rem .8rem",fontFamily:"var(--font-d)",fontSize:".52rem",letterSpacing:".1em",color:"var(--red)",cursor:"pointer",textTransform:"uppercase" }}>{a}</div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1rem" }}>
          {[
            { label:"Total Monthly Spend", value:`R${TOTAL_PREMIUM.toLocaleString()}`,  sub:`${POLICIES.length} active policies`,     sub2:"↑ R327 since Jul 2024",              icon:<Ico.Dollar />, cls:"" },
            { label:"Issues Found",        value:"5",                                    sub:"2 critical · 2 warnings · 1 info",       sub2:"Requires your attention",            icon:<Ico.Alert />,  cls:"kpi-red"    },
            { label:"Est. Monthly Savings",value:`R${SAVINGS_ESTIMATE}`,                sub:`R${SAVINGS_ESTIMATE*12} / year potential`,sub2:"Without losing effective cover",     icon:<Ico.TrendDn/>, cls:"kpi-green"  },
            { label:"Funeral Cap Status",  value:"185%",                                sub:`R${FUNERAL_EXCESS.toLocaleString()} over cap`,sub2:"GOI 7 — R100,000 maximum",     icon:<Ico.Alert />,  cls:"kpi-orange" },
          ].map(k => (
            <div key={k.label} style={{ background:k.cls==="kpi-red"?"rgba(239,68,68,0.05)":k.cls==="kpi-green"?"rgba(34,197,94,0.05)":k.cls==="kpi-orange"?"rgba(249,115,22,0.05)":"rgba(255,255,255,0.03)",border:`1px solid ${k.cls==="kpi-red"?"rgba(239,68,68,0.28)":k.cls==="kpi-green"?"rgba(34,197,94,0.25)":k.cls==="kpi-orange"?"rgba(249,115,22,0.28)":"rgba(255,255,255,0.09)"}`,borderRadius:"var(--r-lg)",padding:"1.25rem 1.4rem" }}>
              <div style={{ display:"flex",alignItems:"center",gap:".4rem",fontFamily:"var(--font-d)",fontSize:".5rem",letterSpacing:".18em",color:"var(--text3)",textTransform:"uppercase",marginBottom:".5rem" }}>{k.icon}{k.label}</div>
              <div style={{ fontFamily:"var(--font-d)",fontSize:"1.75rem",color:k.cls==="kpi-red"?"var(--red)":k.cls==="kpi-green"?"var(--green)":k.cls==="kpi-orange"?"var(--orange)":"var(--text)",lineHeight:1,marginBottom:".4rem",textShadow:k.cls==="kpi-red"?"0 0 20px rgba(239,68,68,0.4)":k.cls==="kpi-green"?"0 0 20px rgba(34,197,94,0.3)":"none" }}>{k.value}</div>
              <div style={{ fontSize:".8rem",color:"var(--text2)",fontWeight:500 }}>{k.sub}</div>
              <div style={{ fontSize:".74rem",color:"var(--text3)",fontWeight:500,marginTop:".2rem" }}>{k.sub2}</div>
            </div>
          ))}
        </div>

        {/* POLICY TABLE */}
        <div className="cs-card">
          <div className="cs-card-head">
            <Ico.Shield />
            <span className="cs-card-title">Policy Vault</span>
            <span className="badge badge-red">{criticalCount} CRITICAL</span>
            <span className="badge badge-orange" style={{ marginLeft:"4px" }}>{warningCount} WARNINGS</span>
            <Link href="/dashboard/vault" style={{ marginLeft:"auto",fontFamily:"var(--font-d)",fontSize:".52rem",letterSpacing:".1em",color:"var(--text2)",textDecoration:"none",display:"flex",alignItems:"center",gap:".3rem" }}>
              VIEW ALL →
            </Link>
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse" }}>
              <thead>
                <tr>
                  {["Insurer / Product","Category","Insured","Benefit","Premium/mo","Status"].map(h => (
                    <th key={h} style={{ fontFamily:"var(--font-d)",fontSize:".48rem",letterSpacing:".16em",color:"var(--text3)",textTransform:"uppercase",padding:".6rem .9rem",textAlign:h==="Benefit"||h==="Premium/mo"?"right":"left",borderBottom:"1px solid var(--border)",whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POLICIES.map(p => (
                  <tr key={p.id} style={{ borderBottom:"1px solid var(--border)" }}>
                    <td style={{ padding:".75rem .9rem" }}>
                      <div style={{ display:"flex",alignItems:"center",gap:".65rem" }}>
                        <div style={{ width:"28px",height:"28px",borderRadius:"6px",background:`${CAT_COLORS[p.category]}20`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                          <span style={{ color:CAT_COLORS[p.category],fontSize:"10px" }}>◆</span>
                        </div>
                        <div>
                          <div style={{ fontWeight:700,fontSize:".88rem",color:"var(--text)" }}>{p.insurer}</div>
                          <div style={{ fontSize:".76rem",color:"var(--text3)" }}>{p.product}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:".75rem .9rem" }}>
                      <span style={{ fontFamily:"var(--font-d)",fontSize:".55rem",letterSpacing:".1em",color:CAT_COLORS[p.category],textTransform:"uppercase" }}>{p.category}</span>
                    </td>
                    <td style={{ padding:".75rem .9rem",fontSize:".82rem",color:"var(--text2)",fontWeight:500,maxWidth:"160px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.insured}</td>
                    <td style={{ padding:".75rem .9rem",textAlign:"right" }}>
                      <span style={{ fontFamily:"var(--font-d)",fontSize:".8rem",color:"var(--text)" }}>R{p.benefit.toLocaleString()}</span>
                    </td>
                    <td style={{ padding:".75rem .9rem",textAlign:"right" }}>
                      <span style={{ fontFamily:"var(--font-d)",fontSize:".8rem",color:p.status==="critical"?"var(--red)":"var(--text2)" }}>R{p.premium.toLocaleString()}</span>
                    </td>
                    <td style={{ padding:".75rem .9rem" }}>
                      {p.tags.map(t => (
                        <span key={t} className={`badge ${p.status==="critical"?"badge-red":"badge-orange"}`} style={{ marginRight:"3px" }}>{t}</span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"1.25rem" }}>

          {/* FUNERAL CAP */}
          <div className="cs-card">
            <div className="cs-card-head"><Ico.Alert /><span className="cs-card-title">Funeral Cap Audit</span><span className="badge badge-red">BREACH</span></div>
            <div style={{ padding:"1.25rem" }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:".5rem" }}>
                <div><div style={{ fontFamily:"var(--font-d)",fontSize:".48rem",letterSpacing:".14em",color:"var(--text3)",textTransform:"uppercase",marginBottom:".25rem" }}>Your Total</div><div style={{ fontFamily:"var(--font-d)",fontSize:"1.35rem",color:"var(--red)",textShadow:"0 0 16px rgba(239,68,68,0.5)" }}>R{FUNERAL_TOTAL.toLocaleString()}</div></div>
                <div style={{ textAlign:"right" }}><div style={{ fontFamily:"var(--font-d)",fontSize:".48rem",letterSpacing:".14em",color:"var(--text3)",textTransform:"uppercase",marginBottom:".25rem" }}>Legal Cap (GOI 7)</div><div style={{ fontFamily:"var(--font-d)",fontSize:"1.35rem",color:"var(--text2)" }}>R100,000</div></div>
              </div>
              <div style={{ height:"10px",background:"rgba(255,255,255,0.07)",borderRadius:"5px",overflow:"hidden",marginBottom:".9rem",position:"relative" }}>
                <div style={{ height:"100%",background:"linear-gradient(90deg, #22c55e 0%, #22c55e 54%, #ef4444 54%, #ef4444 100%)",borderRadius:"5px" }} />
                <div style={{ position:"absolute",top:"-2px",bottom:"-2px",width:"2px",background:"rgba(255,255,255,0.5)",borderRadius:"2px",left:"54%" }} />
              </div>
              {POLICIES.filter(p => p.category==="FUNERAL").map((p,i) => {
                const colors=["#22c55e","#f97316","#ef4444","#dc2626"]
                const pct = (p.benefit/FUNERAL_TOTAL)*100
                return (
                  <div key={p.id} style={{ display:"flex",alignItems:"center",gap:".65rem",marginBottom:".5rem" }}>
                    <span style={{ fontSize:".8rem",color:"var(--text2)",fontWeight:600,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{p.insurer}</span>
                    <div style={{ flex:1,height:"6px",background:"rgba(255,255,255,0.06)",borderRadius:"3px",overflow:"hidden" }}>
                      <div style={{ height:"100%",borderRadius:"3px",width:`${pct}%`,background:colors[i] }} />
                    </div>
                    <span style={{ fontFamily:"var(--font-d)",fontSize:".6rem",color:"var(--text2)",width:"52px",textAlign:"right" }}>R{(p.benefit/1000).toFixed(0)}k</span>
                  </div>
                )
              })}
              <div style={{ marginTop:".9rem",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:"var(--r-sm)",padding:".9rem" }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:".84rem",fontWeight:600,marginBottom:".3rem" }}>
                  <span style={{ color:"var(--text2)" }}>Excess (unclaimable)</span>
                  <span style={{ fontFamily:"var(--font-d)",fontSize:".8rem",color:"var(--red)" }}>R{FUNERAL_EXCESS.toLocaleString()}</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:".84rem",fontWeight:600 }}>
                  <span style={{ color:"var(--text2)" }}>Est. monthly waste</span>
                  <span style={{ fontFamily:"var(--font-d)",fontSize:".8rem",color:"var(--red)" }}>~R247/mo</span>
                </div>
                <p style={{ fontSize:".75rem",color:"rgba(240,236,255,0.45)",marginTop:".5rem",lineHeight:1.55 }}>Insurer is legally barred from paying above R100,000 regardless of how many policies you hold.</p>
              </div>
            </div>
          </div>

          {/* SPEND + COVERAGE */}
          <div style={{ display:"flex",flexDirection:"column",gap:"1.25rem" }}>
            <div className="cs-card">
              <div className="cs-card-head"><Ico.Dollar /><span className="cs-card-title">Spend Breakdown</span></div>
              <div style={{ padding:"1.1rem 1.25rem",display:"flex",flexDirection:"column",gap:".7rem" }}>
                {SPEND.map(c => (
                  <div key={c.label} style={{ display:"flex",alignItems:"center",gap:".8rem" }}>
                    <span style={{ fontSize:".8rem",fontWeight:600,color:"var(--text2)",width:"75px",flexShrink:0 }}>{c.label}</span>
                    <div style={{ flex:1,height:"8px",background:"rgba(255,255,255,0.06)",borderRadius:"4px",overflow:"hidden" }}>
                      <div style={{ height:"100%",borderRadius:"4px",width:`${c.pct}%`,background:c.color,opacity:.82 }} />
                    </div>
                    <span style={{ fontFamily:"var(--font-d)",fontSize:".65rem",color:"var(--text2)",width:"52px",textAlign:"right" }}>R{c.amount}</span>
                  </div>
                ))}
                <div style={{ borderTop:"1px solid var(--border)",paddingTop:".75rem",display:"flex",justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"var(--font-d)",fontSize:".5rem",letterSpacing:".16em",color:"var(--text3)",textTransform:"uppercase" }}>Total Monthly</span>
                  <span style={{ fontFamily:"var(--font-d)",fontSize:"1.1rem",color:"var(--text)" }}>R{TOTAL_PREMIUM.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="cs-card">
              <div className="cs-card-head"><Ico.Check /><span className="cs-card-title">Coverage Checklist</span><span className="badge badge-red">3 GAPS</span></div>
              <div style={{ padding:".9rem 1.25rem",display:"flex",flexDirection:"column",gap:".55rem" }}>
                {COVERAGE.map(c => (
                  <div key={c.label} style={{ display:"flex",alignItems:"center",gap:".65rem" }}>
                    <div style={{ width:"22px",height:"22px",borderRadius:"5px",background:c.present?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.09)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c.present?"var(--green)":"rgba(239,68,68,0.55)" }}>
                      {c.present ? <Ico.Check /> : <span style={{ fontSize:"9px",fontWeight:700 }}>✕</span>}
                    </div>
                    <span style={{ fontSize:".86rem",fontWeight:600,flex:1,color:c.present?"var(--text2)":"var(--text3)",textDecoration:c.present?"none":"line-through" }}>{c.label}</span>
                    <span style={{ fontFamily:"var(--font-d)",fontSize:".46rem",letterSpacing:".1em",textTransform:"uppercase",color:c.present?"var(--green)":"rgba(239,68,68,0.55)" }}>{c.present?"Active":"Missing"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DUPLICATE DETECTOR */}
          <div className="cs-card">
            <div className="cs-card-head"><Ico.Copy /><span className="cs-card-title">Duplicate Benefits</span><span className="badge badge-orange">2 FOUND</span></div>
            {[
              { title:"Roadside Assist", waste:"~R120/mo", desc:"Discovery Insure (car) and Outsurance (home) both include roadside assist. You're paying for this benefit twice — you can only call one provider.", policies:["Discovery Insure","Outsurance"] },
              { title:"Accidental Death", waste:"~R85/mo", desc:"R500k on Discovery Life + R185k on Old Mutual Credit Life. Both include accidental death cover. Insurers won't pay both claims simultaneously.", policies:["Discovery Life","Old Mutual Credit Life"] },
            ].map(d => (
              <div key={d.title} style={{ padding:".95rem 1.25rem",borderBottom:"1px solid var(--border)" }}>
                <div style={{ display:"flex",alignItems:"center",gap:".6rem",marginBottom:".45rem" }}>
                  <div style={{ color:"var(--orange)" }}><Ico.Alert /></div>
                  <span style={{ fontFamily:"var(--font-d)",fontSize:".6rem",letterSpacing:".06em",color:"var(--text)",textTransform:"uppercase",flex:1 }}>{d.title}</span>
                  <span style={{ fontFamily:"var(--font-d)",fontSize:".7rem",color:"var(--orange)" }}>{d.waste}</span>
                </div>
                <p style={{ fontSize:".78rem",color:"var(--text2)",marginBottom:".5rem",lineHeight:1.5 }}>{d.desc}</p>
                <div style={{ display:"flex",gap:".4rem",flexWrap:"wrap" }}>
                  {d.policies.map(p => (
                    <span key={p} style={{ background:"rgba(255,255,255,0.05)",border:"1px solid var(--border)",borderRadius:"4px",padding:".22rem .6rem",fontSize:".76rem",color:"var(--text2)",fontWeight:600 }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ margin:"1rem 1.25rem",background:"linear-gradient(135deg,rgba(34,197,94,0.07),rgba(34,197,94,0.03))",border:"1px solid rgba(34,197,94,0.2)",borderRadius:"var(--r-md)",padding:"1rem" }}>
              <div style={{ fontFamily:"var(--font-d)",fontSize:".52rem",letterSpacing:".14em",color:"rgba(34,197,94,0.7)",textTransform:"uppercase",marginBottom:".4rem" }}>Total Savings Potential</div>
              <div style={{ fontFamily:"var(--font-d)",fontSize:"1.5rem",color:"var(--green)",textShadow:"0 0 18px rgba(34,197,94,0.3)",lineHeight:1,marginBottom:".25rem" }}>R{SAVINGS_ESTIMATE}/mo</div>
              <div style={{ fontSize:".78rem",color:"var(--text2)",fontWeight:500 }}>R{SAVINGS_ESTIMATE*12} per year without losing effective cover</div>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="cs-disclaimer">
          <Ico.Shield />
          <p><strong>CoverSmart provides factual information and organisational tools only.</strong> We are not a Financial Services Provider (FSP) as defined under the FAIS Act. Nothing on this platform constitutes financial advice. For personalised advice, consult an authorised FSP.</p>
        </div>

      </div>

      <style>{`
        @keyframes pulseglow{0%,100%{box-shadow:0 0 8px rgba(239,68,68,0.4)}50%{box-shadow:0 0 22px rgba(239,68,68,0.8),0 0 44px rgba(239,68,68,0.3)}}
        .notif-dot{position:absolute;top:6px;right:7px;width:7px;height:7px;border-radius:50%;background:var(--red);border:1.5px solid var(--bg);animation:pulsedot 2s ease-in-out infinite}
      `}</style>
    </>
  )
}
