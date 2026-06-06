"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [role, setRole] = useState("procurement")
  const [email, setEmail] = useState("rohit@vendorbridge.com")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields.")
      return
    }
    setLoading(true)
    setTimeout(() => router.push("/dashboard"), 1200)
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Welcome back</h2>
        <p className="text-[#6B7280] text-sm mt-1.5">Sign in to your workspace to continue.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 mb-5 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[#111827]">Sign in as</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "procurement", label: "Procurement" },
              { value: "admin", label: "Administrator" },
              { value: "approver", label: "Approver" },
              { value: "vendor", label: "Vendor" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  role === r.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#111827]">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="size-4 text-[#9CA3AF]" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#111827]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="size-4 text-[#9CA3AF]" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 pl-9 pr-10 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9CA3AF] hover:text-[#6B7280]"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="checkbox"
            aria-checked={remember}
            onClick={() => setRemember(!remember)}
            className={`size-4 rounded flex items-center justify-center border transition-all ${
              remember
                ? "bg-indigo-600 border-indigo-600"
                : "bg-white border-[#D1D5DB]"
            }`}
          >
            {remember && (
              <svg className="size-3 text-white" fill="none" viewBox="0 0 12 12">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <span className="text-sm text-[#6B7280]">Remember me for 30 days</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#F8FAFC] px-3 text-xs text-[#9CA3AF]">Trusted by leading enterprises</span>
        </div>
      </div>

      {/* Trust logos placeholder */}
      <div className="flex items-center justify-center gap-6">
        {["Tata", "Infosys", "Wipro"].map((co) => (
          <div key={co} className="h-6 px-3 rounded bg-white border border-[#E5E7EB] flex items-center">
            <span className="text-[10px] font-semibold text-[#9CA3AF] tracking-widest uppercase">{co}</span>
          </div>
        ))}
      </div>

      {/* Signup link */}
      <p className="text-center text-sm text-[#6B7280] mt-8">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
          Create one free
        </Link>
      </p>
    </>
  )
}
