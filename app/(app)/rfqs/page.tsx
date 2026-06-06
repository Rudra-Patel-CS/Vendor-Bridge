import Link from "next/link"
import { Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { RfqTable } from "@/components/rfq/rfq-table"

export default function RfqsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Requests for Quotations (RFQs)"
        description="Manage, track, and create RFQs to send to vendors and collect bids."
      >
        <Button
          nativeButton={false}
          render={
            <Link href="/rfqs/create">
              <Plus data-icon="inline-start" />New RFQ
            </Link>
          }
        />
      </PageHeader>
      <RfqTable />
    </div>
  )
}
