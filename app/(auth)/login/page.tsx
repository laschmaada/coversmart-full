"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"

const schema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
type FormData = z.infer<typeof schema>

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

export default function LoginPage() {
  const { login, loginWithGoogle, error, clearError } = useAuth()
  const [loading, setLoading]     = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const { resetPassword } = useAuth()
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    clearError()
    try {
      await login(data.email, data.password)
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

  const handleReset = async () => {
    if (!resetEmail) return
    try {
      await resetPassword(resetEmail)
      setResetSent(true)
    } catch {}
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-fadeup">
        <Link href="/" className="auth-logo">
          COVER<span>SMART</span>
        </Link>

        {!showReset ? (
          <>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-sub">Sign in to your insurance intelligence dashboard</p>

            {error && (
              <div className="auth-error" style={{ marginBottom: "1rem" }}>
                <ShieldIcon />
                <span>{error}</span>
              </div>
            )}

            {/* Google */}
            <button className="btn btn-google btn-full" onClick={handleGoogle} disabled={googleLoading} style={{ marginBottom: "1rem" }}>
              {googleLoading ? <div className="btn-spinner" /> : <GoogleIcon />}
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <div className="auth-divider">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">or email</span>
              <div className="auth-divider-line" />
            </div>

            <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="cs-field">
                <label className="cs-label">Email Address</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`cs-input ${errors.email ? "error" : ""}`}
                  autoComplete="email"
                />
                {errors.email && <span className="cs-field-error">{errors.email.message}</span>}
              </div>

              <div className="cs-field">
                <label className="cs-label">Password</label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Your password"
                  className={`cs-input ${errors.password ? "error" : ""}`}
                  autoComplete="current-password"
                />
                {errors.password && <span className="cs-field-error">{errors.password.message}</span>}
              </div>

              <button type="button" onClick={() => setShowReset(true)} className="auth-link" style={{ fontSize: ".82rem", textAlign: "right", marginTop: "-.5rem" }}>
                Forgot password?
              </button>

              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? <><div className="btn-spinner" /> Signing in...</> : "SIGN IN"}
              </button>
            </form>

            <div className="auth-footer">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="auth-link">Create one free</Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-sub">Enter your email and we&apos;ll send a reset link</p>
            {!resetSent ? (
              <div className="auth-form">
                <div className="cs-field">
                  <label className="cs-label">Email Address</label>
                  <input type="email" placeholder="you@example.com" className="cs-input" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
                </div>
                <button className="btn btn-primary btn-full" onClick={handleReset}>SEND RESET LINK</button>
                <button className="btn btn-ghost btn-full" onClick={() => setShowReset(false)}>BACK TO LOGIN</button>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "var(--green)", fontSize: ".95rem", fontWeight: 600, marginBottom: "1.25rem" }}>✓ Reset email sent! Check your inbox.</p>
                <button className="btn btn-outline btn-full" onClick={() => { setShowReset(false); setResetSent(false) }}>BACK TO LOGIN</button>
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--r-sm)", border: "1px solid var(--border)" }}>
          <p style={{ fontSize: ".72rem", color: "var(--text3)", lineHeight: 1.6, fontWeight: 500 }}>
            <strong style={{ color: "var(--text2)" }}>CoverSmart is not an FSP.</strong> We provide factual insurance information and organisational tools only. Nothing here constitutes financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}
