import { PageHeader } from "@/components/page-header"
import { QuotationTable } from "@/components/quotations/quotation-table"

export default function QuotationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vendor Quotations"
        description="Receive, evaluate, and manage submitted quotations from your suppliers."
      />
      <QuotationTable />
    </div>
  )
}
