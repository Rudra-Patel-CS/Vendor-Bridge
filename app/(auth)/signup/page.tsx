'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Building2,
  Layers,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  signupStep1Schema,
  signupStep2Schema,
  signupStep3Schema,
} from '@/lib/validations/auth'
import { UserRole } from '@/lib/types/auth'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    company_name: '',
    department: '',
    gst_number: '',
    role: 'procurement_officer' as UserRole,
    password: '',
    confirm_password: '',
  })

  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const validateStep1 = () => {
    const result = signupStep1Schema.safeParse({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
    })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  const validateStep2 = () => {
    const result = signupStep2Schema.safeParse({
      company_name: formData.company_name,
      department: formData.department,
      gst_number: formData.gst_number,
    })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    const result = signupStep3Schema.safeParse({
      role: formData.role,
      password: formData.password,
      confirm_password: formData.confirm_password,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            phone: formData.phone || null,
            company_name: formData.company_name,
            department: formData.department,
            gst_number: formData.gst_number || null,
            role: formData.role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.toLowerCase().includes('rate limit') || error.status === 429) {
          setSubmitError('Supabase email rate limit exceeded. To fix this, log in to your Supabase Dashboard, go to Auth > Providers > Email, and turn OFF "Confirm email". This will allow instant signups without sending verification emails.')
        } else {
          setSubmitError(error.message)
        }
        setLoading(false)
        return
      }

      setSuccess(true)
      toast.success('Registration successful! You can now log in.')
    } catch (err: any) {
      console.error('Signup exception:', err)
      setSubmitError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle2 size={36} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Registration Successful!</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            Your account has been created successfully. You can now log in with your credentials.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition duration-200 font-medium text-sm shadow-lg shadow-indigo-600/10"
          >
            Go to Login
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>
        <p className="text-slate-500 text-sm mt-1">Get started with VendorBridge in minutes.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-1.5">
            <div
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
          </div>
        ))}
        <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">Step {step} of 3</span>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 mb-5 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          {submitError}
        </div>
      )}

      {/* Forms by Step */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="full_name" className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="size-4 text-slate-400" />
                </div>
                <input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  placeholder="John Doe"
                  className={`w-full h-10 pl-9 pr-4 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                    errors.full_name ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300'
                  }`}
                  required
                />
              </div>
              {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>}
            </div>

            {/* Work Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="size-4 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@company.com"
                  className={`w-full h-10 pl-9 pr-4 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                    errors.email ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300'
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="size-4 text-slate-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+919876543210"
                  className={`w-full h-10 pl-9 pr-4 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                    errors.phone ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm mt-6"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Company Name */}
            <div className="space-y-1.5">
              <label htmlFor="company_name" className="text-sm font-medium text-slate-700">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Building2 className="size-4 text-slate-400" />
                </div>
                <input
                  id="company_name"
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => updateField('company_name', e.target.value)}
                  placeholder="Acme Corporation"
                  className={`w-full h-10 pl-9 pr-4 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                    errors.company_name ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300'
                  }`}
                  required
                />
              </div>
              {errors.company_name && <p className="text-xs text-red-600 mt-1">{errors.company_name}</p>}
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label htmlFor="department" className="text-sm font-medium text-slate-700">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Layers className="size-4 text-slate-400" />
                </div>
                <input
                  id="department"
                  type="text"
                  value={formData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  placeholder="Procurement / Finance"
                  className={`w-full h-10 pl-9 pr-4 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                    errors.department ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300'
                  }`}
                  required
                />
              </div>
              {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
            </div>

            {/* GST Number (Optional) */}
            <div className="space-y-1.5">
              <label htmlFor="gst_number" className="text-sm font-medium text-slate-700">
                GST Number (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FileText className="size-4 text-slate-400" />
                </div>
                <input
                  id="gst_number"
                  type="text"
                  value={formData.gst_number}
                  onChange={(e) => updateField('gst_number', e.target.value.toUpperCase())}
                  placeholder="22AAAAA0000A1Z5"
                  className={`w-full h-10 pl-9 pr-4 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                    errors.gst_number ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.gst_number && <p className="text-xs text-red-600 mt-1">{errors.gst_number}</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 h-10 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-all"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Role Cards Selection */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Select your Role</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    value: 'procurement_officer',
                    label: 'Procurement Officer',
                    desc: 'Manage RFQs, compare bids, issue purchase orders.',
                    icon: Briefcase,
                  },
                  {
                    value: 'vendor',
                    label: 'Vendor Partner',
                    desc: 'View assigned RFQs, submit quotes, track POs.',
                    icon: Building2,
                  },
                  {
                    value: 'manager',
                    label: 'Manager / Approver',
                    desc: 'Approve procurement workflows and view reports.',
                    icon: UserCheck,
                  },
                ].map((roleCard) => {
                  const Icon = roleCard.icon
                  const isSelected = formData.role === roleCard.value
                  return (
                    <button
                      key={roleCard.value}
                      type="button"
                      onClick={() => updateField('role', roleCard.value)}
                      className={`flex items-start text-left p-3.5 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg mr-3 ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                          {roleCard.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{roleCard.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="size-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-10 pl-9 pr-10 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                    errors.password ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm_password" className="text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="size-4 text-slate-400" />
                </div>
                <input
                  id="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => updateField('confirm_password', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full h-10 pl-9 pr-10 rounded-lg border bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all ${
                    errors.confirm_password ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500' : 'border-slate-300'
                  }`}
                  required
                />
              </div>
              {errors.confirm_password && (
                <p className="text-xs text-red-600 mt-1">{errors.confirm_password}</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="flex-1 h-10 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    Register
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Signin link */}
      <p className="text-center text-sm text-slate-500 mt-8">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Sign in
        </Link>
      </p>
    </div>
  )
}
