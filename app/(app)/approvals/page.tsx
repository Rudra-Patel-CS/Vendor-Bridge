"use client"

import { useMemo, useState } from "react"
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  AlertTriangle,
  History,
  FileText,
  UserCheck,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/status-badge"
import { approvals as initialApprovals, formatFullCurrency } from "@/lib/mock-data"
import { toast } from "sonner"

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(initialApprovals)
  const [activeTab, setActiveTab] = useState("pending")

  // Modal State
  const [selectedApproval, setSelectedApproval] = useState<any | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject">("approve")
  const [remarks, setRemarks] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Timeline mock logs per item
  const [approvalLogs, setApprovalLogs] = useState<Record<string, Array<{ action: string; user: string; time: string; remarks?: string }>>>({
    "APR-7701": [
      { action: "Created Document", user: "Priya Sharma", time: "2026-06-05 10:30" },
      { action: "Submitted for Approval", user: "Priya Sharma", time: "2026-06-05 11:08" },
    ],
    "APR-7702": [
      { action: "Initiated Onboarding", user: "Amit Verma", time: "2026-06-04 14:00" },
    ],
    "APR-7703": [
      { action: "Drafted Invoice", user: "Neha Gupta", time: "2026-06-05 09:00" },
      { action: "Awaiting Finance Review", user: "Neha Gupta", time: "2026-06-05 09:14" },
    ],
    "APR-7704": [
      { action: "Created RFQ", user: "Rohit Mehta", time: "2026-06-02 08:30" },
      { action: "Approved", user: "Amit Verma", time: "2026-06-05 09:51", remarks: "Approved, price matches framework contract." },
    ],
  })

  const pendingList = useMemo(() => approvals.filter((a) => a.status === "pending"), [approvals])
  const historyList = useMemo(() => approvals.filter((a) => a.status !== "pending"), [approvals])

  const handleOpenAction = (approval: any, type: "approve" | "reject") => {
    setSelectedApproval(approval)
    setActionType(type)
    setRemarks("")
    setIsDialogOpen(true)
  }

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApproval) return

    const statusValue = actionType === "approve" ? ("approved" as const) : ("rejected" as const)
    setApprovals((prev) =>
      prev.map((a) => (a.id === selectedApproval.id ? { ...a, status: statusValue } : a))
    )

    // Add log entry
    const newLog = {
      action: actionType === "approve" ? "Approved" : "Rejected",
      user: "Rohit Mehta (You)",
      time: new Date().toISOString().replace("T", " ").substring(0, 16),
      remarks: remarks || undefined,
    }

    setApprovalLogs((prev) => ({
      ...prev,
      [selectedApproval.id]: [...(prev[selectedApproval.id] || []), newLog],
    }))

    toast.success(`Request ${selectedApproval.id} has been ${statusValue}.`)
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Approvals Workflow"
        description="Review, verify, and approve procurement workflows, vendor onboardings, and purchase contracts."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending Actions
              {pendingList.length > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                  {pendingList.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">Approval History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pending" className="space-y-4">
          {pendingList.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <CheckCircle className="size-12 text-success/60 mb-3" />
              <CardTitle className="text-lg">All caught up!</CardTitle>
              <CardDescription className="mt-1">
                No pending items require your approval at this time.
              </CardDescription>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Approvals List (Left Columns) */}
              <div className="xl:col-span-2 space-y-4">
                {pendingList.map((app) => (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 flex flex-row items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {app.type}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">{app.id}</span>
                        </div>
                        <CardTitle className="text-base mt-2">{app.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-1">
                          <User className="size-3.5" /> Requested by {app.requestedBy} &bull; {app.requestedAt}
                        </CardDescription>
                      </div>
                      <StatusBadge status={app.priority} className="text-[10px] px-1.5 py-0" />
                    </CardHeader>
                    <CardContent className="pb-3">
                      {app.amount > 0 && (
                        <div className="bg-muted/40 p-3 rounded border text-sm flex items-center justify-between">
                          <span className="text-muted-foreground">Workflow Value:</span>
                          <span className="font-bold text-base text-card-foreground">
                            {formatFullCurrency(app.amount)}
                          </span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-3.5 bg-muted/10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => handleOpenAction(app, "reject")}
                      >
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleOpenAction(app, "approve")}>
                        Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Sidebar Workflow Tracker (Right Column) */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="size-4 text-primary" /> Active Workflow Timeline
                    </CardTitle>
                    <CardDescription>Select an approval to view transitions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingList.map((app) => (
                      <div key={app.id} className="border-t pt-3 first:border-0 first:pt-0">
                        <span className="font-mono text-xs font-bold block mb-2">{app.id} Trails</span>
                        <div className="relative pl-4 border-l-2 border-primary/20 space-y-3">
                          {(approvalLogs[app.id] || []).map((log, idx) => (
                            <div key={idx} className="relative text-xs">
                              <span className="absolute -left-[21px] top-0.5 size-2 rounded-full bg-primary ring-4 ring-background" />
                              <span className="font-medium text-card-foreground block">{log.action}</span>
                              <span className="text-[10px] text-muted-foreground block">{log.user} &bull; {log.time}</span>
                            </div>
                          ))}
                          <div className="relative text-xs">
                            <span className="absolute -left-[21px] top-0.5 size-2 rounded-full bg-warning animate-pulse ring-4 ring-background" />
                            <span className="font-medium text-warning block">Awaiting Decision</span>
                            <span className="text-[10px] text-muted-foreground block">Assignee: Rohit Mehta</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 border-b text-xs uppercase font-medium text-muted-foreground">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Requested By</th>
                      <th className="p-4">Action Date</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {historyList.map((app) => (
                      <tr key={app.id} className="hover:bg-muted/10">
                        <td className="p-4 font-mono text-xs font-semibold">{app.id}</td>
                        <td className="p-4 text-xs font-medium">{app.type}</td>
                        <td className="p-4">{app.title}</td>
                        <td className="p-4 font-semibold">{app.amount > 0 ? formatFullCurrency(app.amount) : "N/A"}</td>
                        <td className="p-4 text-xs">{app.requestedBy}</td>
                        <td className="p-4 text-xs">{app.requestedAt}</td>
                        <td className="p-4">
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approve/Reject Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === "approve" ? (
                <CheckCircle className="size-5 text-success" />
              ) : (
                <XCircle className="size-5 text-destructive" />
              )}
              Confirm Workflow Decision
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType === "approve" ? "approve" : "reject"} approval request{" "}
              <span className="font-mono font-bold">{selectedApproval?.id}</span>?
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmAction} className="space-y-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="remarksText">Decision Remarks (Optional)</Label>
              <Textarea
                id="remarksText"
                placeholder={
                  actionType === "approve"
                    ? "Remarks for approval (e.g. Verified quantities and prices...)"
                    : "Reason for rejection..."
                }
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant={actionType === "reject" ? "destructive" : "default"}
              >
                {actionType === "approve" ? "Approve Work" : "Reject Work"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
