"use client"

import { useMemo, useState } from "react"
import {
  Bell,
  Activity,
  ShieldAlert,
  Clock,
  User,
  Settings,
  MailCheck,
  CheckCircle,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { notifications as initialNotifications, activities, auditLogs } from "@/lib/mock-data"
import { toast } from "sonner"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("All notifications marked as read.")
  }

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Activity Logs & Notifications"
        description="Monitor system events, audit trails, and procurement workflows notifications."
      >
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" onClick={handleMarkAllRead}>
            <MailCheck className="size-4 mr-2" /> Mark all as read
          </Button>
        )}
      </PageHeader>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="notifications" className="relative">
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          {notifications.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <CheckCircle className="size-12 text-success/60 mb-3" />
              <CardTitle className="text-lg">No alerts</CardTitle>
              <CardDescription className="mt-1">
                You do not have any notifications at this time.
              </CardDescription>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <Card
                  key={n.id}
                  className={`transition-colors duration-200 ${
                    !n.read ? "border-primary/40 bg-primary/5 dark:bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="mt-1">
                      <StatusBadge status={n.type} className="text-[10px]" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-card-foreground">{n.title}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" /> {n.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{n.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-semibold"
                      onClick={() => handleToggleRead(n.id)}
                    >
                      {n.read ? "Mark Unread" : "Mark Read"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Activity Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="size-4 text-primary" /> Core Procurement Activity Feed
              </CardTitle>
              <CardDescription>Live updates from procurement workflows and supplier portals.</CardDescription>
            </CardHeader>
            <CardContent className="relative pl-6 border-l-2 border-primary/20 space-y-6 ml-4 py-2">
              {activities.map((act) => (
                <div key={act.id} className="relative text-sm">
                  <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-primary ring-4 ring-background flex items-center justify-center">
                    <User className="size-1.5 text-primary-foreground" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-card-foreground">{act.user}</span>
                    <span className="text-muted-foreground">{act.action}</span>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {act.target}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 block flex items-center gap-1">
                    <Clock className="size-3" /> {act.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldAlert className="size-4 text-primary" /> Admin System Audit Trails
              </CardTitle>
              <CardDescription>Historical records of permission updates and critical module modifications.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted border-b text-xs uppercase font-medium text-muted-foreground">
                    <tr>
                      <th className="p-4">Log ID</th>
                      <th className="p-4">Operator</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Target Module</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/10 font-medium">
                        <td className="p-4 font-mono font-bold text-primary">{log.id}</td>
                        <td className="p-4">{log.user}</td>
                        <td className="p-4 text-card-foreground">{log.action}</td>
                        <td className="p-4">
                          <StatusBadge status={log.module} className="text-[10px]" />
                        </td>
                        <td className="p-4 font-mono text-muted-foreground">{log.ip}</td>
                        <td className="p-4 text-muted-foreground">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
