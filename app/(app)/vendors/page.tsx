import Link from "next/link"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { VendorTable } from "@/components/vendors/vendor-table"

export default function VendorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Vendors" description="Manage your supplier directory and vendor relationships.">
        <Button nativeButton={false} render={<Link href="/vendors/add"><Plus data-icon="inline-start" />Add Vendor</Link>} />
      </PageHeader>
      <VendorTable />
    </div>
  )
}
