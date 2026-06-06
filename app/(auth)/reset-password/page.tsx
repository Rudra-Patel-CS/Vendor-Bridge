"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Lock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push("/login"), 700)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Your new password must be different from previous passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <Input id="password" type="password" placeholder="••••••••" />
            <FieldDescription>
              At least 8 characters with one number and one symbol.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm">Confirm new password</FieldLabel>
            <Input id="confirm" type="password" placeholder="••••••••" />
          </Field>
          <Button type="submit" disabled={loading}>
            <Lock data-icon="inline-start" />
            {loading ? "Updating..." : "Reset password"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
