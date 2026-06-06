'use client'

import React from 'react'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, Home, Mail } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-md w-full text-center space-y-8 p-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl relative">
        {/* Shield Icon */}
        <div className="mx-auto w-20 h-20 bg-red-950/50 border border-red-500/30 text-red-500 rounded-2xl flex items-center justify-center animate-pulse">
          <ShieldAlert size={44} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Access Denied
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            You do not have the required permissions to view this resource. 
            Please contact your system administrator if you believe this is an error.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition duration-200 border border-slate-700 hover:border-slate-600 font-medium text-sm"
          >
            <Home size={16} />
            Go to Dashboard
          </Link>
          <a
            href="mailto:admin@vendorbridge.com?subject=Access Request"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl transition duration-200 font-medium text-sm shadow-lg shadow-red-600/20"
          >
            <Mail size={16} />
            Contact Admin
          </a>
        </div>

        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
