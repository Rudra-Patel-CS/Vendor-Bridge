import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Pencil,
  Wallet,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { StatusBadge } from "@/components/status-badge"
import { RatingStars } from "@/components/rating-stars"
import {
  vendors,
  rfqs,
  quotations,
  purchaseOrders,
  formatFullCurrency,
} from "@/lib/mock-data"

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vendor = vendors.find((v) => v.id === id)
  if (!vendor) notFound()

  const vendorPOs = purchaseOrders.filter((p) => p.vendorId === vendor.id)
  const vendorQuotes = quotations.filter((q) => q.vendorId === vendor.id)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={vendor.company} description={`Vendor ID: ${vendor.id}`}>
        <Button variant="outline" nativeButton={false} render={<Link href="/vendors"><ArrowLeft data-icon="inline-start" />Back</Link>} />
        <Button>
          <Pencil data-icon="inline-start" />
          Edit Vendor
        </Button>
      </PageHeader>

      {/* Summary header */}
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {vendor.company.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{vendor.company}</h2>
                <StatusBadge status={vendor.status} />
              </div>
              <p className="text-sm text-muted-foreground">{vendor.name} · {vendor.category}</p>
              <RatingStars value={vendor.rating} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Wallet className="size-3.5" />Total Spend</span>
              <span className="text-lg font-semibold">{formatFullCurrency(vendor.spend)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShoppingCart className="size-3.5" />Orders</span>
              <span className="text-lg font-semibold">{vendor.orders}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><TrendingUp className="size-3.5" />On-time</span>
              <span className="text-lg font-semibold">{vendor.onTimeDelivery}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="pos">Purchase Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <DetailRow icon={Mail} label="Email" value={vendor.email} />
              <DetailRow icon={Phone} label="Phone" value={vendor.phone} />
              <DetailRow icon={Building2} label="GST Number" value={vendor.gst} mono />
              <DetailRow icon={Building2} label="PAN Number" value={vendor.pan} mono />
              <div className="sm:col-span-2">
                <DetailRow icon={MapPin} label="Address" value={vendor.address} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfqs" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>RFQ ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rfqs.slice(0, 3).map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.title}</TableCell>
                      <TableCell>{r.deadline}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotations" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Quote ID</TableHead>
                    <TableHead>RFQ</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorQuotes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No quotations submitted yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendorQuotes.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell className="font-medium">{q.id}</TableCell>
                        <TableCell>{q.rfqTitle}</TableCell>
                        <TableCell>{formatFullCurrency(q.price)}</TableCell>
                        <TableCell>{q.deliveryDays} days</TableCell>
                        <TableCell><StatusBadge status={q.status} /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>PO Number</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorPOs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        No purchase orders yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    vendorPOs.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.id}</TableCell>
                        <TableCell>{p.items} items</TableCell>
                        <TableCell>{formatFullCurrency(p.amount)}</TableCell>
                        <TableCell><StatusBadge status={p.status} /></TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Key vendor performance indicators.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <PerfBar label="On-time Delivery" value={vendor.onTimeDelivery} />
              <PerfBar label="Quality Score" value={Math.round(vendor.rating * 20)} />
              <PerfBar label="Quote Competitiveness" value={84} />
              <PerfBar label="Communication" value={91} />
              <Separator />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <PerfStat label="Avg. Response" value="4.2 hrs" />
                <PerfStat label="Fulfilled Orders" value={`${vendor.orders}`} />
                <PerfStat label="Disputes" value="2" />
                <PerfStat label="Since" value={vendor.joinedAt.slice(0, 4)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={mono ? "font-mono text-sm" : "text-sm"}>{value}</span>
      </div>
    </div>
  )
}

function PerfBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  )
}

function PerfStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-base font-semibold">{value}</span>
    </div>
  )
}
