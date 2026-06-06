"use client"

import {
  BarChart3,
  Download,
  Calendar,
  IndianRupee,
  Activity,
  Award,
  TrendingUp,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ProcurementTrendChart,
  MonthlySpendingChart,
  VendorPerformanceChart,
  RfqStatsChart,
} from "@/components/dashboard/charts"
import { toast } from "sonner"

export default function ReportsPage() {
  const handleExportReport = (format: string) => {
    toast.success(`Procurement Analytics report successfully exported as ${format}!`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports & Analytics"
        description="Monitor spending trends, analyze supplier onboarding cycles, and track performance metrics."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExportReport("CSV")}>
            <Download className="size-4 mr-2" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => handleExportReport("PDF")}>
            <Download className="size-4 mr-2" /> Export PDF
          </Button>
        </div>
      </PageHeader>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              TOTAL PROCUREMENT SPEND
              <IndianRupee className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-2xl">₹1.88 Cr</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-success font-medium flex items-center gap-1">
              <TrendingUp className="size-3" /> +14.2% from last month
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              AVG ON-TIME DELIVERY
              <Calendar className="size-4 text-warning-foreground dark:text-warning" />
            </CardDescription>
            <CardTitle className="text-2xl">91.8%</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-success font-medium flex items-center gap-1">
              <TrendingUp className="size-3" /> +2.1% improvement
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              ACTIVE RFQ PIPELINE
              <Activity className="size-4 text-info" />
            </CardDescription>
            <CardTitle className="text-2xl">12 RFQs</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-muted-foreground">Currently collecting quotes</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold flex items-center justify-between">
              SUPPLIER COMPLIANCE
              <Award className="size-4 text-success" />
            </CardDescription>
            <CardTitle className="text-2xl">96.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xs text-success font-medium flex items-center gap-1">
              Perfect framework matches
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Charts Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Monthly Procurement Volume</CardTitle>
            <CardDescription>Total spending and purchase order releases monthly (₹Cr vs count).</CardDescription>
          </CardHeader>
          <CardContent>
            <ProcurementTrendChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Monthly Spending Breakdown</CardTitle>
            <CardDescription>Aggregate payout volumes calculated on subtotal amounts (INR).</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlySpendingChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Vendor Quality & On-Time Scores</CardTitle>
            <CardDescription>Rankings based on delivery reliability, compliance audits, and feedback ratings.</CardDescription>
          </CardHeader>
          <CardContent>
            <VendorPerformanceChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">RFQ Pipelines by Status</CardTitle>
            <CardDescription>Visual breakdown of current Requests for Quotations.</CardDescription>
          </CardHeader>
          <CardContent>
            <RfqStatsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
