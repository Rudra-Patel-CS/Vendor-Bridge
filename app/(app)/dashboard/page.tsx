import Link from "next/link"
import {
  Users,
  FileText,
  CheckSquare,
  ShoppingCart,
  ReceiptText,
  Wallet,
  Plus,
  Download,
  ArrowRight,
  CircleDot,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import {
  ProcurementTrendChart,
  MonthlySpendingChart,
  VendorPerformanceChart,
  RfqStatsChart,
} from "@/components/dashboard/charts"
import { activities, pendingTasks } from "@/lib/mock-data"

const quickActions = [
  { label: "New RFQ", href: "/rfqs/create", icon: FileText },
  { label: "Add Vendor", href: "/vendors/add", icon: Users },
  { label: "Create PO", href: "/purchase-orders", icon: ShoppingCart },
  { label: "Generate Invoice", href: "/invoices/generate", icon: ReceiptText },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Welcome back, Rohit. Here's your procurement overview.">
        <Button variant="outline" size="sm">
          <Download data-icon="inline-start" />
          Export
        </Button>
        <Button size="sm" nativeButton={false} render={<Link href="/rfqs/create"><Plus data-icon="inline-start" />New RFQ</Link>} />
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Vendors" value="248" icon={Users} trend="+12" trendUp hint="this quarter" accent="primary" />
        <StatCard title="Active RFQs" value="14" icon={FileText} trend="+3" trendUp hint="vs last week" accent="primary" />
        <StatCard title="Pending Approvals" value="9" icon={CheckSquare} trend="+2" trendUp hint="needs action" accent="warning" />
        <StatCard title="Purchase Orders" value="186" icon={ShoppingCart} trend="+8%" trendUp hint="this month" accent="primary" />
        <StatCard title="Open Invoices" value="32" icon={ReceiptText} trend="-4" hint="overdue: 3" accent="danger" />
        <StatCard title="Monthly Spending" value="₹41.2L" icon={Wallet} trend="+13.9%" trendUp hint="vs last month" accent="success" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Procurement Trends</CardTitle>
            <CardDescription>Monthly procurement spend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ProcurementTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>RFQ Statistics</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <RfqStatsChart />
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Total spend per month</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlySpendingChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
            <CardDescription>Top vendors by performance score</CardDescription>
          </CardHeader>
          <CardContent>
            <VendorPerformanceChart />
          </CardContent>
        </Card>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across your workspace</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {activities.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/60">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    {a.user.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm">
                    <span className="font-medium">{a.user}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium text-primary">{a.target}</span>
                  </p>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending tasks + quick actions */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Items needing your attention</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {pendingTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-start gap-2.5">
                  <CircleDot className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm leading-snug">{t.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{t.due}</span>
                      <StatusBadge status={t.priority} className="text-[10px]" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {quickActions.map((q) => (
                <Button
                  key={q.label}
                  variant="outline"
                  nativeButton={false}
                  className="h-auto flex-col gap-2 py-4"
                  render={
                    <Link href={q.href}>
                      <q.icon className="size-5 text-primary" />
                      <span className="text-xs font-medium">{q.label}</span>
                    </Link>
                  }
                />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
