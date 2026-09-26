"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, FileSearch, Bell, AlertTriangle, TrendingDown, Zap, ChevronRight, Check, ArrowRight, Twitter, Linkedin, Facebook, Instagram, X } from "lucide-react"

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="cs-nav">
      <div className="cs-nav-inner">
        <a href="#" className="cs-logo">COVER<span className="cs-logo-accent">SMART</span></a>
        <ul className="cs-nav-links">
          {["FEATURES", "PRICING", "HOW IT WORKS", "LEGAL"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="cs-nav-link">{item}</a>
            </li>
          ))}
        </ul>
        <div className="cs-nav-actions">
          <Link href="/login" className="cs-nav-link" style={{ fontSize: '.75rem', marginRight: '1rem' }}>SIGN IN</Link>
          <Link href="/register" className="cs-btn cs-btn-primary">GET STARTED</Link>
        </div>
        <button className="cs-hamburger" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <span className="cs-hamburger-lines" />}
        </button>
      </div>
      {open && (
        <div className="cs-mobile-menu">
          {["FEATURES", "PRICING", "HOW IT WORKS", "LEGAL"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`} className="cs-mobile-link" onClick={() => setOpen(false)}>{item}</a>
          ))}
          <a href="#audit" className="cs-btn cs-btn-ghost cs-full">FREE AUDIT</a>
          <a href="#pricing" className="cs-btn cs-btn-primary cs-full">GET STARTED</a>
        </div>
      )}
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="cs-hero">
      <div className="cs-hero-bg" />
      <div className="cs-hero-grid" />
      <div className="cs-hero-orb cs-orb-1" />
      <div className="cs-hero-orb cs-orb-2" />

      <div className="cs-hero-content">
        <div className="cs-hero-eyebrow">
          <span className="cs-pulse-dot" />
          SOUTH AFRICA'S INSURANCE INTELLIGENCE PLATFORM
        </div>
        <h1 className="cs-hero-headline">
          YOUR INSURANCE.<br />
          <span className="cs-headline-accent">FINALLY CLEAR.</span>
        </h1>
        <p className="cs-hero-sub">
          CoverSmart decodes your policies, detects duplicate cover, audits your funeral benefits, and drafts regulatory complaints — without touching a single claim.
        </p>
        <div className="cs-hero-actions">
          <Link href="/register" className="cs-btn cs-btn-primary cs-btn-lg">
            GET STARTED NOW
            <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="cs-btn cs-btn-outline cs-btn-lg">
            SEE HOW IT WORKS
          </a>
        </div>
        <div className="cs-hero-stats">
          {[
            { num: "4.3M", label: "Policies lapsed in H1 2024" },
            { num: "R100K", label: "Legal funeral benefit cap" },
            { num: "63.5%", label: "Complaints from call centres" },
          ].map(({ num, label }) => (
            <div key={num} className="cs-hero-stat">
              <span className="cs-hero-stat-num">{num}</span>
              <span className="cs-hero-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cs-hero-visual">
        <div className="cs-vault-card">
          <div className="cs-vault-header">
            <Shield size={16} />
            <span>INSURANCE VAULT</span>
            <span className="cs-vault-badge">3 POLICIES</span>
          </div>
          {[
            { type: "FUNERAL COVER", insurer: "Old Mutual", amount: "R80,000", premium: "R320/mo", status: "warning" },
            { type: "CAR INSURANCE", insurer: "Discovery", amount: "R250,000", premium: "R1,240/mo", status: "ok" },
            { type: "LIFE COVER", insurer: "Sanlam", amount: "R1,500,000", premium: "R890/mo", status: "ok" },
          ].map((p) => (
            <div key={p.type} className="cs-vault-row">
              <div className="cs-vault-row-left">
                <span className={`cs-status-dot cs-status-${p.status}`} />
                <div>
                  <div className="cs-vault-type">{p.type}</div>
                  <div className="cs-vault-insurer">{p.insurer}</div>
                </div>
              </div>
              <div className="cs-vault-row-right">
                <div className="cs-vault-amount">{p.amount}</div>
                <div className="cs-vault-premium">{p.premium}</div>
              </div>
            </div>
          ))}
          <div className="cs-vault-alert">
            <AlertTriangle size={14} />
            <span>Funeral cap audit: <strong>Check additional policies</strong></span>
          </div>
          <div className="cs-vault-total">
            <span>TOTAL MONTHLY</span>
            <span className="cs-vault-total-num">R2,450</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROBLEM ──────────────────────────────────────────────────────────────────
function Problem() {
  const stats = [
    { num: "4.3M", label: "Insurance policies lapsed in the first half of 2024 alone — mostly because consumers didn't know their alternatives.", accent: true },
    { num: "63.5%", label: "Of all insurance complaints originate from call centre interactions — the highest in any financial services sector in SA.", accent: false },
    { num: "R100K", label: "Is the legal maximum funeral payout per life insured. Millions of South Africans unknowingly pay premiums beyond this cap every month.", accent: true },
    { num: "0", label: "Platforms exist in SA that give consumers a single view of their total cover, spend, gaps, and legal rights. Until now.", accent: false },
  ]
  return (
    <section className="cs-section cs-problem" id="features">
      <div className="cs-container">
        <div className="cs-section-eyebrow">THE PROBLEM WE SOLVE</div>
        <h2 className="cs-section-title">
          SOUTH AFRICA IS SIMULTANEOUSLY<br />
          <span className="cs-accent">OVER-PAYING AND UNDER-PROTECTED.</span>
        </h2>
        <p className="cs-section-sub">
          Insurance in South Africa is deliberately confusing. We exist to undo that — using technology, not expensive advisors.
        </p>
        <div className="cs-stats-grid">
          {stats.map(({ num, label, accent }) => (
            <div key={num} className={`cs-stat-card ${accent ? "cs-stat-card-accent" : ""}`}>
              <div className="cs-stat-num">{num}</div>
              <p className="cs-stat-desc">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      icon: <Shield size={32} />,
      number: "01",
      title: "THE VAULT",
      subtitle: "Data Foundation",
      desc: "Add your policies once. CoverSmart builds your complete insurance picture — every insurer, premium, benefit, and renewal date in one place.",
    },
    {
      icon: <Zap size={32} />,
      number: "02",
      title: "THE INTELLIGENCE ENGINE",
      subtitle: "Analysis Layer",
      desc: "We scan your Vault data for what you can't see alone — cap violations, duplicate cover, waiting period conflicts, coverage gaps, and premium benchmarks.",
    },
    {
      icon: <FileSearch size={32} />,
      number: "03",
      title: "THE ACTION LAYER",
      subtitle: "Tools Layer",
      desc: "Take action with confidence. Decode your policy documents, draft regulatory complaints, and understand your rights — without a broker or lawyer.",
    },
  ]
  return (
    <section className="cs-section cs-how" id="how-it-works">
      <div className="cs-container">
        <div className="cs-section-eyebrow">HOW IT WORKS</div>
        <h2 className="cs-section-title">
          ENTER YOUR POLICIES ONCE.<br />
          <span className="cs-accent">THE PLATFORM DOES THE REST.</span>
        </h2>
        <div className="cs-steps-grid">
          {steps.map((step, i) => (
            <div key={step.number} className="cs-step-card">
              <div className="cs-step-number">{step.number}</div>
              <div className="cs-step-icon">{step.icon}</div>
              <div className="cs-step-eyebrow">{step.subtitle}</div>
              <h3 className="cs-step-title">{step.title}</h3>
              <p className="cs-step-desc">{step.desc}</p>
              {i < steps.length - 1 && <div className="cs-step-arrow"><ChevronRight size={24} /></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function Features() {
  const [activeTab, setActiveTab] = useState(0)

  const tiers = [
    {
      label: "FREE",
      name: "Know What You Have",
      color: "cs-tier-free",
      features: [
        { icon: <Shield size={18} />, title: "Insurance Vault", desc: "Store all your policies in one structured, searchable record." },
        { icon: <TrendingDown size={18} />, title: "Monthly Spend Dashboard", desc: "See your total premium spend by category — life, car, funeral, medical aid." },
        { icon: <Bell size={18} />, title: "Renewal Reminders", desc: "Email and SMS alerts at 60, 30, and 7 days before any policy renewal." },
        { icon: <Check size={18} />, title: "Basic Cover Checklist", desc: "See which major cover types you have — and which you're missing." },
      ],
    },
    {
      label: "MID — R99/mo",
      name: "Understand What You Have",
      color: "cs-tier-mid",
      features: [
        { icon: <FileSearch size={18} />, title: "Policy Decoder", desc: "Upload your policy PDF and get a plain-language breakdown of what's covered, what's excluded, and what your excess is." },
        { icon: <AlertTriangle size={18} />, title: "Cover Gap Analyser", desc: "Based on your profile, see which insurance categories you likely need but don't have." },
        { icon: <Shield size={18} />, title: "Waiting Period Guardian", desc: "Detects when a new insurer is unlawfully imposing a double waiting period." },
        { icon: <Zap size={18} />, title: "Pre-Cancellation Advisor", desc: "Before you cancel, see your alternatives — downgrade, pause, reduce sum insured." },
        { icon: <Check size={18} />, title: "Duplicate Cover Detector", desc: "Identifies overlapping benefits across policies and quantifies your wasted premium in rand." },
        { icon: <FileSearch size={18} />, title: "Complaints Ghostwriter", desc: "Generates legally-structured complaint letters referencing your exact regulatory rights under PPR Rule 17." },
      ],
    },
    {
      label: "PRO — R299/mo",
      name: "Optimise What You Have",
      color: "cs-tier-pro",
      features: [
        { icon: <TrendingDown size={18} />, title: "Premium Benchmarker", desc: "See how your premiums compare to anonymised market data from similar-profile users." },
        { icon: <AlertTriangle size={18} />, title: "Funeral Cap Auditor", desc: "Calculates if your total funeral cover exceeds the R100,000 legal cap — and how much you're wasting monthly." },
        { icon: <Shield size={18} />, title: "TCF Friction Monitor", desc: "Log unreasonable cancellation barriers and generate formal FSCA notification reports." },
        { icon: <Bell size={18} />, title: "Lapse Watchdog", desc: "Connects to your bank data to detect missed premium deductions and alerts you immediately." },
        { icon: <Zap size={18} />, title: "AI Insurance Assistant", desc: "Always-on conversational AI that answers questions about your specific policies — after hours, instantly." },
        { icon: <FileSearch size={18} />, title: "Annual Health Report", desc: "A full PDF summary of your insurance year — spend, gaps, savings found, incidents logged." },
        { icon: <Check size={18} />, title: "Household Mode", desc: "Manage cover for your entire family under one account — each member gets their own Vault." },
        { icon: <TrendingDown size={18} />, title: "Insurer Clarity Score", desc: "Aggregated user feedback on how clearly each major SA insurer communicates." },
      ],
    },
  ]

  return (
    <section className="cs-section cs-features" id="features">
      <div className="cs-container">
        <div className="cs-section-eyebrow">PLATFORM FEATURES</div>
        <h2 className="cs-section-title">
          EVERYTHING YOU NEED TO TAKE<br />
          <span className="cs-accent">CONTROL OF YOUR COVER.</span>
        </h2>
        <div className="cs-tier-tabs">
          {tiers.map((t, i) => (
            <button
              key={t.label}
              className={`cs-tier-tab ${activeTab === i ? "cs-tier-tab-active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="cs-features-panel">
          <div className="cs-features-panel-header">
            <span className={`cs-tier-badge ${tiers[activeTab].color}`}>{tiers[activeTab].label}</span>
            <h3 className="cs-panel-title">{tiers[activeTab].name}</h3>
          </div>
          <div className="cs-features-grid">
            {tiers[activeTab].features.map((f) => (
              <div key={f.title} className="cs-feature-item">
                <div className="cs-feature-icon">{f.icon}</div>
                <div>
                  <div className="cs-feature-title">{f.title}</div>
                  <div className="cs-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FUNERAL CAP AUDITOR ──────────────────────────────────────────────────────
function FuneralCapAuditor() {
  const [policies, setPolicies] = useState([{ id: 1, name: "", amount: "" }])
  const [result, setResult] = useState<null | { total: number; excess: number; waste: number }>(null)

  const CAP = 100000

  const addPolicy = () => {
    setPolicies([...policies, { id: Date.now(), name: "", amount: "" }])
    setResult(null)
  }

  const updatePolicy = (id: number, field: "name" | "amount", value: string) => {
    setPolicies(policies.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
    setResult(null)
  }

  const removePolicy = (id: number) => {
    if (policies.length > 1) {
      setPolicies(policies.filter((p) => p.id !== id))
      setResult(null)
    }
  }

  const runAudit = () => {
    const total = policies.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    if (total === 0) return
    const excess = Math.max(0, total - CAP)
    // Rough estimate: ~3.5% of benefit as annual premium, so /12 for monthly waste
    const waste = excess > 0 ? Math.round((excess * 0.035) / 12) : 0
    setResult({ total, excess, waste })
  }

  return (
    <section className="cs-section cs-auditor" id="audit">
      <div className="cs-container">
        <div className="cs-auditor-grid">
          <div className="cs-auditor-left">
            <div className="cs-section-eyebrow">FREE TOOL — NO SIGNUP REQUIRED</div>
            <h2 className="cs-section-title cs-text-left">
              FUNERAL POLICY<br />
              <span className="cs-accent">CAP AUDITOR</span>
            </h2>
            <p className="cs-section-sub cs-text-left">
              South African law caps funeral insurance payouts at <strong>R100,000 per life insured</strong> — regardless of how many policies you hold. Add your funeral policies below to see if you're paying premiums for cover that can never legally pay out.
            </p>
            <div className="cs-legal-ref">
              <Shield size={14} />
              <span>Based on Prudential Standard GOI 7 — published by the FSCA</span>
            </div>
          </div>

          <div className="cs-auditor-right">
            <div className="cs-auditor-card">
              <div className="cs-auditor-card-header">
                <AlertTriangle size={18} />
                <span>ENTER YOUR FUNERAL POLICIES</span>
              </div>
              <div className="cs-policy-list">
                {policies.map((p, i) => (
                  <div key={p.id} className="cs-policy-row">
                    <input
                      type="text"
                      placeholder={`Policy ${i + 1} — Insurer name`}
                      value={p.name}
                      onChange={(e) => updatePolicy(p.id, "name", e.target.value)}
                      className="cs-input cs-input-flex"
                    />
                    <div className="cs-input-prefix-wrap">
                      <span className="cs-input-prefix">R</span>
                      <input
                        type="number"
                        placeholder="Benefit amount"
                        value={p.amount}
                        onChange={(e) => updatePolicy(p.id, "amount", e.target.value)}
                        className="cs-input cs-input-amount"
                      />
                    </div>
                    {policies.length > 1 && (
                      <button className="cs-remove-btn" onClick={() => removePolicy(p.id)}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button className="cs-add-policy" onClick={addPolicy}>
                + ADD ANOTHER POLICY
              </button>
              <button className="cs-btn cs-btn-primary cs-full cs-btn-lg" onClick={runAudit}>
                RUN CAP AUDIT
              </button>

              {result && (
                <div className={`cs-audit-result ${result.excess > 0 ? "cs-result-warning" : "cs-result-ok"}`}>
                  <div className="cs-result-row">
                    <span>Total funeral cover</span>
                    <strong>R{result.total.toLocaleString()}</strong>
                  </div>
                  <div className="cs-result-row">
                    <span>Legal cap</span>
                    <strong>R100,000</strong>
                  </div>
                  <div className="cs-result-divider" />
                  {result.excess > 0 ? (
                    <>
                      <div className="cs-result-row cs-result-highlight">
                        <span>⚠ Excess cover (unclaimable)</span>
                        <strong>R{result.excess.toLocaleString()}</strong>
                      </div>
                      <div className="cs-result-row cs-result-highlight">
                        <span>Estimated monthly waste</span>
                        <strong>~R{result.waste.toLocaleString()}/mo</strong>
                      </div>
                      <p className="cs-result-cta-text">
                        You are paying premiums for cover your insurer cannot legally pay. Sign up to CoverSmart to understand your options.
                      </p>
                    </>
                  ) : (
                    <div className="cs-result-row cs-result-ok-row">
                      <span>✓ Your funeral cover is within the legal cap.</span>
                    </div>
                  )}
                  <a href="#pricing" className="cs-btn cs-btn-primary cs-full">
                    GET FULL ANALYSIS →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function Pricing() {
  const tiers = [
    {
      name: "FREE",
      price: "R0",
      period: "/month",
      sub: "Start building your insurance picture — no card required.",
      features: [
        "Funeral Cap Auditor (instant, no login)",
        "Insurance Vault (up to 3 policies)",
        "Monthly Spend Dashboard",
        "Basic Cover Checklist",
        "Renewal Reminders (email & SMS)",
      ],
      cta: "START FOR FREE",
      highlight: false,
    },
    {
      name: "ESSENTIAL",
      price: "R49",
      period: "/month",
      sub: "Understand what your policies actually say.",
      annualNote: "R39/mo billed annually — save 20%",
      features: [
        "Everything in Free",
        "Unlimited policy vault",
        "Policy Decoder — AI-powered PDF analysis",
        "Cover Gap Analyser",
        "Waiting Period Guardian",
        "Pre-Cancellation Advisor",
        "Duplicate Cover Detector",
        "Complaints Ghostwriter",
      ],
      cta: "START 14-DAY FREE TRIAL",
      highlight: true,
      badge: "MOST POPULAR",
    },
    {
      name: "PRO",
      price: "R149",
      period: "/month",
      sub: "Optimise every rand you spend on cover.",
      annualNote: "R119/mo billed annually — save 20%",
      features: [
        "Everything in Essential",
        "Premium Benchmarker",
        "Full Funeral Cap Auditor (household)",
        "TCF Friction Monitor & FSCA Report",
        "Lapse Watchdog (open banking)",
        "AI Insurance Assistant — always-on",
        "Annual Insurance Health Report (PDF)",
        "Household Mode — family sub-profiles",
        "Insurer Clarity Score access",
      ],
      cta: "GO PRO",
      highlight: false,
    },
  ]

  return (
    <section className="cs-section cs-pricing" id="pricing">
      <div className="cs-container">
        <div className="cs-section-eyebrow">SIMPLE PRICING</div>
        <h2 className="cs-section-title">
          TRANSPARENCY STARTS<br />
          <span className="cs-accent">WITH OUR OWN PRICES.</span>
        </h2>
        <p className="cs-section-sub">No hidden fees. No insurance premiums. Cancel anytime.</p>
        <div className="cs-pricing-grid">
          {tiers.map((tier) => (
            <div key={tier.name} className={`cs-pricing-card ${tier.highlight ? "cs-pricing-card-highlight" : ""}`}>
              {tier.badge && <div className="cs-pricing-badge">{tier.badge}</div>}
              <div className="cs-pricing-header">
                <div className="cs-pricing-tier">{tier.name}</div>
                <div className="cs-pricing-price">
                  <span className="cs-price-num">{tier.price}</span>
                  <span className="cs-price-period">{tier.period}</span>
                </div>
                {tier.annualNote && <div className="cs-price-annual">{tier.annualNote}</div>}
                <p className="cs-pricing-sub">{tier.sub}</p>
              </div>
              <div className="cs-pricing-features">
                {tier.features.map((f) => (
                  <div key={f} className="cs-pricing-feature">
                    <Check size={14} className="cs-check-icon" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" className={`cs-btn cs-btn-lg cs-full ${tier.highlight ? "cs-btn-primary" : "cs-btn-outline"}`}>
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="cs-pricing-note">
          Employer plans available from R45–R65 per employee per month. Essential or Pro access for your entire team.
          <a href="#" className="cs-inline-link"> Contact us →</a>
        </p>
      </div>
    </section>
  )
}

// ─── LEGAL TRUST BAR ─────────────────────────────────────────────────────────
function LegalBar() {
  const items = [
    "NOT AN FSP",
    "NO CLAIMS HANDLED",
    "NO PREMIUMS TOUCHED",
    "FAIS ACT COMPLIANT",
    "PPR RULE 11.5.2",
    "POPIA COMPLIANT",
    "TCF ALIGNED",
    "GOI 7 REFERENCED",
  ]
  return (
    <div className="cs-legal-bar">
      <div className="cs-legal-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="cs-legal-item">
            <Shield size={12} /> {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="cs-footer">
      <div className="cs-container">
        <div className="cs-footer-grid">
          <div className="cs-footer-brand">
            <div className="cs-logo cs-logo-lg">COVER<span className="cs-logo-accent">SMART</span></div>
            <p className="cs-footer-tagline">Your insurance. Finally clear.</p>
            <div className="cs-social-links">
              {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="cs-social-link"><Icon size={18} /></a>
              ))}
            </div>
          </div>
          <div className="cs-footer-links">
            <div className="cs-footer-col">
              <div className="cs-footer-col-title">PRODUCT</div>
              {["Insurance Vault", "Policy Decoder", "Funeral Cap Auditor", "Complaints Ghostwriter", "AI Assistant", "Pricing"].map((l) => (
                <a key={l} href="#" className="cs-footer-link">{l}</a>
              ))}
            </div>
            <div className="cs-footer-col">
              <div className="cs-footer-col-title">COMPANY</div>
              {["About Us", "How We Work", "For Employers", "Media & Press", "Contact"].map((l) => (
                <a key={l} href="#" className="cs-footer-link">{l}</a>
              ))}
            </div>
            <div className="cs-footer-col">
              <div className="cs-footer-col-title">LEGAL</div>
              {["Privacy Policy", "Terms of Service", "POPIA Notice", "Data Processing", "FSP Disclaimer"].map((l) => (
                <a key={l} href="#" className="cs-footer-link">{l}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="cs-disclaimer">
          <Shield size={14} />
          <p>
            <strong>CoverSmart provides factual information and organisational tools only.</strong> We are not a Financial Services Provider (FSP) as defined under the FAIS Act. Nothing on this platform constitutes financial advice. CoverSmart does not handle insurance claims, premiums, or policy applications. For personalised financial advice, please consult an authorised FSP.
          </p>
        </div>

        <div className="cs-footer-bottom">
          <span>© {new Date().getFullYear()} CoverSmart. All rights reserved.</span>
          <span>Built for South African consumers.</span>
        </div>
      </div>
    </footer>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="cs-root">
      <Nav />
      <Hero />
      <LegalBar />
      <Problem />
      <HowItWorks />
      <Features />
      <FuneralCapAuditor />
      <Pricing />
      <Footer />
    </main>
  )
}
