"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, UploadCloud, FileText, X } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { vendorCategories } from "@/lib/mock-data"

export default function AddVendorPage() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast.success("Vendor created successfully")
    router.push("/vendors")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PageHeader title="Add Vendor" description="Onboard a new supplier to your directory.">
        <Button variant="outline" nativeButton={false} render={<Link href="/vendors"><ArrowLeft data-icon="inline-start" />Cancel</Link>} />
        <Button type="submit">
          <Save data-icon="inline-start" />
          Save Vendor
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Primary contact and company details.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="vname">Vendor Name</FieldLabel>
                    <Input id="vname" placeholder="Contact person name" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="company">Company Name</FieldLabel>
                    <Input id="company" placeholder="Registered company name" required />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" placeholder="vendor@company.com" required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                    <Input id="phone" placeholder="+91 98765 43210" required />
                  </Field>
                </div>
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {vendorCategories.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Textarea id="address" placeholder="Full registered address" rows={3} />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax & Compliance</CardTitle>
              <CardDescription>Statutory identification numbers.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="gst">GST Number</FieldLabel>
                    <Input id="gst" placeholder="27AABCA1234F1Z5" className="font-mono" />
                    <FieldDescription>15-character GSTIN.</FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="pan">PAN Number</FieldLabel>
                    <Input id="pan" placeholder="AABCA1234F" className="font-mono uppercase" />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Upload verification documents.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center transition-colors hover:bg-muted/60">
                <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="size-5" />
                </span>
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</span>
                <input type="file" className="hidden" multiple />
              </label>

              <div className="flex flex-col gap-2">
                {["GST_Certificate.pdf", "PAN_Card.pdf"].map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2"
                  >
                    <FileText className="size-4 text-primary" />
                    <span className="flex-1 truncate text-sm">{doc}</span>
                    <Button type="button" variant="ghost" size="icon-xs" aria-label="Remove">
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
