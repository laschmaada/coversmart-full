"use client"

import { useEffect, useState } from "react"

export default function SetupPage() {
  const [checks, setChecks] = useState<{label:string, ok:boolean, detail:string}[]>([])

  useEffect(() => {
    const vars = [
      { key: "NEXT_PUBLIC_FIREBASE_API_KEY",            label: "Firebase API Key" },
      { key: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",        label: "Firebase Auth Domain" },
      { key: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",         label: "Firebase Project ID" },
      { key: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",     label: "Firebase Storage Bucket" },
      { key: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",label: "Firebase Messaging Sender ID" },
      { key: "NEXT_PUBLIC_FIREBASE_APP_ID",             label: "Firebase App ID" },
    ]
    setChecks(vars.map(v => ({
      label: v.label,
      ok: !!process.env[v.key],
      detail: process.env[v.key] ? `✓ Set (${process.env[v.key]!.slice(0,6)}...)` : `✗ Missing — add ${v.key} to .env.local`,
    })))
  }, [])

  const allOk = checks.every(c => c.ok)

  return (
    <div style={{ minHeight:"100vh", background:"#09051a", color:"#f0ecff", padding:"3rem 2rem", fontFamily:"sans-serif" }}>
      <div style={{ maxWidth:"600px", margin:"0 auto" }}>
        <div style={{ fontSize:".7rem", letterSpacing:".2em", color:"#ef4444", textTransform:"uppercase", marginBottom:"1rem" }}>COVERSMART — SETUP CHECKER</div>
        <h1 style={{ fontSize:"1.5rem", marginBottom:".5rem" }}>Firebase Configuration</h1>
        <p style={{ color:"rgba(240,236,255,0.6)", marginBottom:"2rem", fontSize:".9rem" }}>
          This page checks your .env.local config. Remove it from production.
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:".75rem", marginBottom:"2rem" }}>
          {checks.map(c => (
            <div key={c.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".9rem 1.25rem", background: c.ok ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", border:`1px solid ${c.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, borderRadius:"8px" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:".9rem" }}>{c.label}</div>
                <div style={{ fontSize:".75rem", color:"rgba(240,236,255,0.5)", marginTop:".2rem" }}>{c.detail}</div>
              </div>
              <div style={{ fontSize:"1.2rem" }}>{c.ok ? "✅" : "❌"}</div>
            </div>
          ))}
        </div>

        {allOk ? (
          <div style={{ padding:"1.25rem", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.25)", borderRadius:"10px", marginBottom:"1.5rem" }}>
            <strong style={{ color:"#22c55e" }}>✓ All environment variables are set.</strong>
            <p style={{ fontSize:".85rem", color:"rgba(240,236,255,0.6)", marginTop:".4rem" }}>
              If signup still fails, check your Firebase Console: <br/>
              1. Authentication → Sign-in methods → Email/Password must be Enabled<br/>
              2. Firestore Database must exist (not Realtime Database)<br/>
              3. Firestore rules must allow writes (use test mode during development)
            </p>
          </div>
        ) : (
          <div style={{ padding:"1.25rem", background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:"10px", marginBottom:"1.5rem" }}>
            <strong style={{ color:"#ef4444" }}>✗ Missing environment variables.</strong>
            <p style={{ fontSize:".85rem", color:"rgba(240,236,255,0.6)", marginTop:".4rem" }}>
              Copy .env.local.example to .env.local and fill in all Firebase values, then restart npm run dev.
            </p>
          </div>
        )}

        <div style={{ padding:"1.25rem", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:"10px" }}>
          <div style={{ fontSize:".7rem", letterSpacing:".15em", color:"rgba(240,236,255,0.4)", textTransform:"uppercase", marginBottom:".75rem" }}>Firebase Console Checklist</div>
          {[
            "Authentication → Sign-in methods → Email/Password → Enabled",
            "Authentication → Sign-in methods → Google → Enabled (for Google login)",
            "Firestore Database → Created (choose europe-west1 or us-central1)",
            "Firestore Database → Rules → Start in test mode (allow read, write: if true)",
            "Authentication → Settings → Authorised domains → localhost added",
          ].map((item,i) => (
            <div key={i} style={{ display:"flex", gap:".6rem", marginBottom:".5rem", fontSize:".85rem", color:"rgba(240,236,255,0.7)" }}>
              <span>☐</span><span>{item}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop:"1.5rem", fontSize:".75rem", color:"rgba(240,236,255,0.3)" }}>
          Delete app/setup/page.tsx before going to production.
        </p>
      </div>
    </div>
  )
}
