"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Search,
  Download,
  SlidersHorizontal,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  FileText,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { StatusBadge } from "@/components/status-badge"
import { rfqs, formatFullCurrency } from "@/lib/mock-data"

export function RfqTable() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  const filtered = useMemo(() => {
    return rfqs.filter((r) => {
      const matchesQuery =
        !query ||
        r.id.toLowerCase().includes(query.toLowerCase()) ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.product.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = status === "all" || r.status === status
      return matchesQuery && matchesStatus
    })
  }, [query, status])

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-4 md:p-5">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-xs">
            <InputGroup>
              <InputGroupInput
                placeholder="Search by ID, title, product..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download data-icon="inline-start" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>No RFQs found</EmptyTitle>
              <EmptyDescription>
                Try adjusting your search or filters, or create a new RFQ.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[120px]">RFQ ID</TableHead>
                  <TableHead>RFQ Details</TableHead>
                  <TableHead>Target Product</TableHead>
                  <TableHead className="text-right">Estimated Budget</TableHead>
                  <TableHead className="text-center">Quotations</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      {r.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-card-foreground">
                          {r.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Created on {r.createdAt}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{r.product}</span>
                        <span className="text-xs text-muted-foreground">
                          Qty: {r.quantity} {r.unit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {formatFullCurrency(r.budget)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                        {r.quotations}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">
                      {r.deadline}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon-sm" aria-label="Actions">
                            <MoreHorizontal />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem render={<Link href={`/rfqs/create`}><Eye data-icon="inline-start" />View details</Link>} />
                            <DropdownMenuItem><Pencil data-icon="inline-start" />Edit RFQ</DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive"><Trash2 data-icon="inline-start" />Cancel RFQ</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between border-t pt-4 text-sm text-muted-foreground">
        <span>
          Showing {filtered.length} of {rfqs.length} RFQs
        </span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
