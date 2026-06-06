import { User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'procurement_officer' | 'vendor' | 'manager'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  company_name: string | null
  department: string | null
  gst_number: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  user: User
  profile: Profile
}

export type Permission =
  | 'users.manage'
  | 'vendors.manage'
  | 'rfqs.create'
  | 'rfqs.view'
  | 'rfqs.approve'
  | 'quotations.submit'
  | 'quotations.view'
  | 'approvals.decide'
  | 'purchase_orders.manage'
  | 'invoices.manage'
  | 'reports.view'
  | 'settings.manage'

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'users.manage',
    'vendors.manage',
    'rfqs.create',
    'rfqs.view',
    'rfqs.approve',
    'quotations.submit',
    'quotations.view',
    'approvals.decide',
    'purchase_orders.manage',
    'invoices.manage',
    'reports.view',
    'settings.manage',
  ],
  procurement_officer: [
    'vendors.manage',
    'rfqs.create',
    'rfqs.view',
    'quotations.view',
    'purchase_orders.manage',
    'invoices.manage',
    'reports.view',
  ],
  vendor: [
    'rfqs.view',
    'quotations.submit',
    'quotations.view',
    'purchase_orders.manage', // limited to their own POs (enforced via RLS)
  ],
  manager: [
    'rfqs.view',
    'approvals.decide',
    'reports.view',
  ],
}

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  admin: '/dashboard',
  procurement_officer: '/dashboard',
  vendor: '/dashboard',
  manager: '/dashboard',
}

export interface NavItem {
  title: string
  href: string
  icon: string
  permissions?: Permission[]
}

export const ROLE_NAVIGATION: Record<UserRole, NavItem[]> = {
  admin: [
    { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { title: 'Users', href: '/users', icon: 'Users' },
    { title: 'Vendors', href: '/vendors', icon: 'Building2' },
    { title: 'RFQs', href: '/rfqs', icon: 'FileText' },
    { title: 'Quotations', href: '/quotations', icon: 'ClipboardList' },
    { title: 'Approvals', href: '/approvals', icon: 'CheckSquare' },
    { title: 'Purchase Orders', href: '/purchase-orders', icon: 'FileSpreadsheet' },
    { title: 'Invoices', href: '/invoices', icon: 'Receipt' },
    { title: 'Reports', href: '/reports', icon: 'BarChart3' },
    { title: 'Settings', href: '/settings', icon: 'Settings' },
  ],
  procurement_officer: [
    { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { title: 'Vendors', href: '/vendors', icon: 'Building2' },
    { title: 'RFQs', href: '/rfqs', icon: 'FileText' },
    { title: 'Quotations', href: '/quotations', icon: 'ClipboardList' },
    { title: 'Purchase Orders', href: '/purchase-orders', icon: 'FileSpreadsheet' },
    { title: 'Invoices', href: '/invoices', icon: 'Receipt' },
    { title: 'Reports', href: '/reports', icon: 'BarChart3' },
  ],
  vendor: [
    { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { title: 'Assigned RFQs', href: '/rfqs', icon: 'FileText' },
    { title: 'My Quotations', href: '/quotations', icon: 'ClipboardList' },
    { title: 'Purchase Orders', href: '/purchase-orders', icon: 'FileSpreadsheet' },
  ],
  manager: [
    { title: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { title: 'Approvals', href: '/approvals', icon: 'CheckSquare' },
    { title: 'Reports', href: '/reports', icon: 'BarChart3' },
  ],
}
