import Link from "next/link"
import { PackageSearch, ShieldCheck, Workflow, BarChart3 } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0, transparent 35%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 0, transparent 40%)",
          }}
          aria-hidden="true"
        />
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
            <PackageSearch className="size-5" />
          </div>
          <span className="text-lg font-semibold">VendorBridge</span>
        </Link>

        <div className="relative flex flex-col gap-6">
          <h2 className="max-w-md text-3xl font-semibold leading-tight text-balance">
            Streamline procurement from RFQ to payment.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-primary-foreground/80 text-pretty">
            VendorBridge unifies vendor management, quotations, approvals, and
            invoicing into a single enterprise workspace.
          </p>
          <ul className="flex flex-col gap-4">
            {[
              { icon: Workflow, label: "Automated approval workflows" },
              { icon: BarChart3, label: "Real-time spend analytics" },
              { icon: ShieldCheck, label: "Role-based access & audit logs" },
            ].map((f) => (
              <li key={f.label} className="flex items-center gap-3 text-sm">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <f.icon className="size-4" />
                </span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          © 2026 VendorBridge. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
