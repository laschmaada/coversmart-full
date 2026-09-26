export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cs-root">
      <div className="cs-bg" />
      <div className="cs-grid" />
      <div className="cs-orb1" />
      <div className="cs-orb2" />
      {children}
    </div>
  )
}
