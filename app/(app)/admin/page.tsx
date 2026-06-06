"use client"

import { useState } from "react"
import {
  Settings,
  Shield,
  Users,
  Key,
  Database,
  Save,
  CheckCircle,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatusBadge } from "@/components/status-badge"
import { users as initialUsers, roles } from "@/lib/mock-data"
import { toast } from "sonner"

export default function AdminPage() {
  const [users, setUsers] = useState(initialUsers)
  const [taxRate, setTaxRate] = useState("18")
  const [autoApproveLimit, setAutoApproveLimit] = useState("500000")

  const handleToggleUser = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? ("inactive" as const) : ("active" as const) } : u
      )
    )
    toast.success("User access status updated successfully.")
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("System parameters saved successfully!")
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Administration & Controls"
        description="Configure system integrations, modify operational thresholds, and manage operator accesses."
      />

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">User Directory</TabsTrigger>
          <TabsTrigger value="roles">Access Roles</TabsTrigger>
          <TabsTrigger value="settings">System Parameters</TabsTrigger>
        </TabsList>

        {/* User Directory Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4 text-primary" /> Active User Profiles
              </CardTitle>
              <CardDescription>Accounts with direct access tokens into the VendorBridge ERP workspace.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted border-b text-xs uppercase font-medium text-muted-foreground">
                    <tr>
                      <th className="p-4">Name</th>
                      <th className="p-4">Email Address</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4">Last Activity</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/10">
                        <td className="p-4 font-semibold text-card-foreground">{u.name}</td>
                        <td className="p-4 text-muted-foreground font-mono text-xs">{u.email}</td>
                        <td className="p-4 text-xs font-semibold">{u.role}</td>
                        <td className="p-4 text-xs text-muted-foreground">{u.lastActive}</td>
                        <td className="p-4">
                          <StatusBadge status={u.status} />
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleUser(u.id)}
                          >
                            {u.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="size-4 text-primary" /> Security Profiles & Matrix
              </CardTitle>
              <CardDescription>Permission bundles assigned to roles to enforce operational boundaries.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted border-b text-xs uppercase font-medium text-muted-foreground">
                    <tr>
                      <th className="p-4">Role Key</th>
                      <th className="p-4">Active Staff</th>
                      <th className="p-4">Assigned Permissions</th>
                      <th className="p-4">Scope Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {roles.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/10">
                        <td className="p-4 font-bold text-card-foreground">{r.name}</td>
                        <td className="p-4 text-sm font-semibold">{r.users} users</td>
                        <td className="p-4">
                          <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">
                            {r.permissions} Access nodes
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">{r.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System settings parameters Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="size-4 text-primary" /> System Controls & Integration
              </CardTitle>
              <CardDescription>Parameters for database synchronization limits, triggers, and tax coefficients.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-md">
                <div className="space-y-1">
                  <label htmlFor="taxInput" className="text-xs font-semibold text-muted-foreground block">
                    GST Coefficient rate (%)
                  </label>
                  <input
                    id="taxInput"
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="limitInput" className="text-xs font-semibold text-muted-foreground block">
                    Threshold for Auto-Approval Limit (INR)
                  </label>
                  <input
                    id="limitInput"
                    type="number"
                    value={autoApproveLimit}
                    onChange={(e) => setAutoApproveLimit(e.target.value)}
                    className="w-full h-9 px-3 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <Button type="submit" size="sm" className="mt-2">
                  <Save className="size-4 mr-2" /> Save Parameters
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
