import Link from "next/link"
import {
  PackageSearch,
  CheckCircle2,
  Building2,
  Users2,
  ShieldCheck,
} from "lucide-react"

const trustBadges = [
  { icon: Users2, value: "500+", label: "Companies" },
  { icon: Building2, value: "10K+", label: "Vendors" },
  { icon: ShieldCheck, value: "99.9%", label: "Uptime" },
]

const features = [
  "Automated RFQ to PO workflows",
  "Real-time spend analytics & reporting",
  "Role-based access control & audit logs",
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ─── LEFT BRAND PANEL ─────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col bg-[#0F0E1A] relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Radial glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/30">
              <PackageSearch className="size-5 text-indigo-400" />
            </div>
            <span className="text-white font-semibold text-lg">VendorBridge</span>
          </Link>

          {/* Hero content */}
          <div className="flex-1 flex flex-col justify-center gap-8 py-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1">
                <div className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-indigo-300 text-xs font-medium">Enterprise Procurement Platform</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight">
                Smarter<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  Procurement.
                </span>
                <br />
                Stronger Vendor<br />Relationships.
              </h1>
              <p className="text-white/55 text-base leading-relaxed max-w-sm">
                Manage vendors, RFQs, quotations, approvals and invoices from one intelligent platform.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 text-indigo-400 shrink-0" />
                  <span className="text-white/70 text-sm">{f}</span>
                </li>
              ))}
            </ul>

            {/* Dashboard preview mockup */}
            <div className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 space-y-3">
              {/* Mock topbar */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-red-500/60" />
                  <div className="size-2.5 rounded-full bg-yellow-500/60" />
                  <div className="size-2.5 rounded-full bg-green-500/60" />
                </div>
                <div className="h-2 w-24 rounded-full bg-white/10" />
                <div className="flex gap-2">
                  <div className="size-5 rounded-full bg-white/10" />
                  <div className="size-5 rounded-full bg-indigo-500/40" />
                </div>
              </div>
              {/* Mock KPI row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Vendors", val: "248", trend: "+12" },
                  { label: "Active RFQs", val: "14", trend: "+3" },
                  { label: "Spend", val: "₹41.2L", trend: "+13.9%" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-white/[0.06] p-2.5">
                    <div className="h-1.5 w-10 rounded-full bg-white/20 mb-1.5" />
                    <div className="text-white font-semibold text-sm">{item.val}</div>
                    <div className="text-emerald-400 text-[10px] font-medium mt-0.5">{item.trend}</div>
                  </div>
                ))}
              </div>
              {/* Mock chart bar */}
              <div className="flex items-end gap-1 h-10 px-1">
                {[40, 65, 52, 80, 70, 90, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 5
                        ? "rgba(99,102,241,0.8)"
                        : "rgba(255,255,255,0.1)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6">
            {trustBadges.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-white/[0.07] border border-white/10">
                  <Icon className="size-3.5 text-indigo-300" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-none">{value}</p>
                  <p className="text-white/50 text-xs mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── RIGHT LOGIN PANEL ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] p-6 sm:p-10">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
              <PackageSearch className="size-4 text-white" />
            </div>
            <span className="font-semibold text-[#111827]">VendorBridge</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
