"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push("/dashboard"), 700)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Get started with VendorBridge in minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input id="name" placeholder="Jane Cooper" />
          </Field>

          <Field>
            <FieldLabel htmlFor="company">Company name</FieldLabel>
            <Input id="company" placeholder="Acme Manufacturing" />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Work email</FieldLabel>
            <Input id="email" type="email" placeholder="you@company.com" />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="••••••••" />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm">Confirm</FieldLabel>
              <Input id="confirm" type="password" placeholder="••••••••" />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="srole">Role</FieldLabel>
            <Select defaultValue="procurement">
              <SelectTrigger id="srole">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="procurement">Procurement Manager</SelectItem>
                  <SelectItem value="approver">Approver</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              You can change roles later from the admin panel.
            </FieldDescription>
          </Field>

          <Button type="submit" disabled={loading}>
            <UserPlus data-icon="inline-start" />
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
