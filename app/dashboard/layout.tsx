"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"

// Icons
const I = {
  Home:       () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Shield:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Alert:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Chart:      () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  File:       () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Zap:        () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Copy:       () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Bell:       () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Settings:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Logout:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
}

const NAV = [
  { section: "MAIN",    items: [
    { href: "/dashboard/overview",   label: "Overview",       icon: I.Home,     badge: null },
    { href: "/dashboard/vault",      label: "Policy Vault",   icon: I.Shield,   badge: null },
    { href: "/dashboard/alerts",     label: "Alerts",         icon: I.Alert,    badge: "5"  },
    { href: "/dashboard/spend",      label: "Spend Analysis", icon: I.Chart,    badge: null },
  ]},
  { section: "TOOLS",   items: [
    { href: "/dashboard/decoder",    label: "Policy Decoder", icon: I.File,     badge: null },
    { href: "/dashboard/complaints", label: "Complaints",     icon: I.Copy,     badge: null },
    { href: "/dashboard/assistant",  label: "AI Assistant",   icon: I.Zap,      badge: null },
  ]},
  { section: "ACCOUNT", items: [
    { href: "/dashboard/renewals",   label: "Renewals",       icon: I.Bell,     badge: "1"  },
    { href: "/dashboard/settings",   label: "Settings",       icon: I.Settings, badge: null },
  ]},
]

function Spinner() {
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"var(--bg)" }}>
      <div style={{ width:"32px",height:"32px",border:"2px solid rgba(255,255,255,0.1)",borderTopColor:"var(--red)",borderRadius:"50%",animation:"spin .8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  if (loading || !user) return <Spinner />

  const initials = user.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()
    : user.email?.[0]?.toUpperCase() ?? "U"

  const firstName = user.displayName?.split(" ")[0] ?? "there"

  return (
    <div className="dash-root">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <Link href="/dashboard/overview" className="sb-logo">COVER<span>SMART</span></Link>

        <div className="sb-scroll">
          {NAV.map(group => (
            <div key={group.section}>
              <div className="sb-section">{group.section}</div>
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sb-item ${pathname === item.href || pathname.startsWith(item.href + "/") ? "active" : ""}`}
                >
                  <item.icon />
                  {item.label}
                  {item.badge && <span className="sb-badge">{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="sb-divider" />

        <div className="sb-user">
          <div className="sb-user-inner">
            <div className="sb-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="sb-user-name" style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                {user.displayName || user.email}
              </div>
              <div className="sb-user-plan">PRO PLAN</div>
            </div>
            <button
              onClick={logout}
              style={{ background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:"4px",transition:"color .2s",flexShrink:0 }}
              onMouseOver={e => (e.currentTarget.style.color = "var(--red)")}
              onMouseOut={e => (e.currentTarget.style.color = "var(--text3)")}
              title="Sign out"
            >
              <I.Logout />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        {children}
      </main>
    </div>
  )
}
