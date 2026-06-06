'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  ClipboardList,
  CheckSquare,
  FileSpreadsheet,
  Receipt,
  BarChart3,
  Settings,
  PackageSearch,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/lib/auth/auth-context'
import { ROLE_NAVIGATION } from '@/lib/types/auth'

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  ClipboardList,
  CheckSquare,
  FileSpreadsheet,
  Receipt,
  BarChart3,
  Settings,
}

export function AppSidebar() {
  const pathname = usePathname()
  const { profile, signOut } = useAuth()
  
  const role = profile?.role || 'procurement_officer'
  const navItems = ROLE_NAVIGATION[role] || []
  
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + '/')

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  // Format Role Name for badge/display
  const formatRole = (r: string) => {
    return r
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
            <PackageSearch className="size-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-900">VendorBridge</span>
            <span className="text-xs text-slate-400 font-medium">Procurement ERP</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 font-semibold px-2 py-1">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const IconComponent = iconMap[item.icon] || LayoutDashboard
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive(item.href)}
                      tooltip={item.title}
                      render={
                        <Link href={item.href}>
                          <IconComponent className="size-4" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-100 p-2">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8 border border-slate-100">
              <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xs font-semibold">
                {getInitials(profile?.full_name || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-sm font-semibold text-slate-900 truncate">
                {profile?.full_name || 'Guest User'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {formatRole(role)}
              </span>
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
