"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"

const step1Schema = z.object({
  displayName: z.string().min(2, "Please enter your full name"),
  email:       z.string().email("Please enter a valid email"),
  password:    z.string().min(6, "Password must be at least 6 characters"),
  confirm:     z.string(),
}).refine(d => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] })

type Step1Data = z.infer<typeof step1Schema>

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const BENEFITS = [
  "Funeral Cap Auditor — find wasted premiums in 60 seconds",
  "Policy Decoder — understand your cover in plain English",
  "Duplicate Cover Detector — stop paying twice",
  "Complaints Ghostwriter — regulated letters in minutes",
  "AI Insurance Assistant — always-on, policy-aware (Pro)",
]

export default function RegisterPage() {
  const { register: registerUser, loginWithGoogle, error, clearError } = useAuth()
  const [loading, setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [agreed, setAgreed]         = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
  })

  const onSubmit = async (data: Step1Data) => {
    if (!agreed) return
    setLoading(true)
    clearError()
    try {
      await registerUser(data.email, data.password, data.displayName)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    clearError()
    try {
      await loginWithGoogle()
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="auth-page" style={{ alignItems: "flex-start", paddingTop: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", maxWidth: "900px", width: "100%" }}>

        {/* LEFT — benefits panel */}
        <div style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "2rem" }}>
          <div>
            <Link href="/" className="auth-logo" style={{ textAlign: "left", marginBottom: "1.5rem" }}>COVER<span>SMART</span></Link>
            <h2 style={{ fontFamily: "var(--font-d)", fontSize: "clamp(1.4rem,2.5vw,1.9rem)", color: "var(--text)", lineHeight: 1.2, textTransform: "uppercase", marginBottom: "1rem" }}>
              YOUR INSURANCE.<br /><span style={{ color: "var(--red)" }}>FINALLY CLEAR.</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text2)", lineHeight: 1.6, fontWeight: 500 }}>
              Join thousands of South Africans who have found hidden waste in their cover — starting with a free funeral cap audit in under 60 seconds.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {BENEFITS.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: ".65rem" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", flexShrink: 0, marginTop: "1px" }}>
                  <CheckIcon />
                </div>
                <span style={{ fontSize: ".9rem", color: "var(--text2)", fontWeight: 500, lineHeight: 1.45 }}>{b}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "var(--r-md)", padding: "1.1rem 1.25rem" }}>
            <div style={{ fontFamily: "var(--font-d)", fontSize: ".55rem", letterSpacing: ".16em", color: "var(--red)", textTransform: "uppercase", marginBottom: ".4rem" }}>Free Plan Includes</div>
            <p style={{ fontSize: ".84rem", color: "var(--text2)", fontWeight: 500, lineHeight: 1.5 }}>Insurance Vault (up to 3 policies), Monthly Spend Dashboard, Renewal Reminders, and Basic Cover Checklist — forever free, no credit card required.</p>
          </div>
        </div>

        {/* RIGHT — form */}
        <div className="auth-card animate-fadeup" style={{ marginTop: 0 }}>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Free forever · Essential from R49/mo · Pro from R149/mo</p>

          {error && (
            <div className="auth-error" style={{ marginBottom: "1rem" }}>
              <span>{error}</span>
            </div>
          )}

          <button className="btn btn-google btn-full" onClick={handleGoogle} disabled={googleLoading} style={{ marginBottom: "1rem" }}>
            {googleLoading ? <div className="btn-spinner" /> : <GoogleIcon />}
            {googleLoading ? "Creating account..." : "Sign up with Google"}
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or email</span>
            <div className="auth-divider-line" />
          </div>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="cs-field">
              <label className="cs-label">Full Name</label>
              <input {...register("displayName")} type="text" placeholder="Themba Nkosi" className={`cs-input ${errors.displayName ? "error" : ""}`} autoComplete="name" />
              {errors.displayName && <span className="cs-field-error">{errors.displayName.message}</span>}
            </div>

            <div className="cs-field">
              <label className="cs-label">Email Address</label>
              <input {...register("email")} type="email" placeholder="you@example.com" className={`cs-input ${errors.email ? "error" : ""}`} autoComplete="email" />
              {errors.email && <span className="cs-field-error">{errors.email.message}</span>}
            </div>

            <div className="cs-field">
              <label className="cs-label">Password</label>
              <input {...register("password")} type="password" placeholder="Min 6 characters" className={`cs-input ${errors.password ? "error" : ""}`} autoComplete="new-password" />
              {errors.password && <span className="cs-field-error">{errors.password.message}</span>}
            </div>

            <div className="cs-field">
              <label className="cs-label">Confirm Password</label>
              <input {...register("confirm")} type="password" placeholder="Repeat password" className={`cs-input ${errors.confirm ? "error" : ""}`} />
              {errors.confirm && <span className="cs-field-error">{errors.confirm.message}</span>}
            </div>

            {/* Terms */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: ".65rem", marginTop: ".25rem" }}>
              <input
                type="checkbox"
                id="agreed"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: "3px", accentColor: "var(--red)", flexShrink: 0 }}
              />
              <label htmlFor="agreed" style={{ fontSize: ".8rem", color: "var(--text2)", lineHeight: 1.55, cursor: "pointer", fontWeight: 500 }}>
                I agree to the <Link href="/terms" className="auth-link">Terms of Service</Link> and <Link href="/privacy" className="auth-link">Privacy Policy</Link>. I understand CoverSmart is not an FSP and does not provide financial advice.
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || !agreed}>
              {loading ? <><div className="btn-spinner" /> Creating account...</> : "CREATE FREE ACCOUNT"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link href="/login" className="auth-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
