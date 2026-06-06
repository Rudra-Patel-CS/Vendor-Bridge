import { UserRole, Permission, ROLE_PERMISSIONS } from '../types/auth'

export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions.includes(permission)
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  // Normalize pathname to check base routes
  const cleanPath = pathname.split('?')[0].split('#')[0]

  if (cleanPath === '/dashboard' || cleanPath === '/unauthorized') {
    return true
  }

  if (cleanPath.startsWith('/users')) {
    return role === 'admin'
  }

  if (cleanPath.startsWith('/vendors')) {
    return role === 'admin' || role === 'procurement_officer'
  }

  if (cleanPath.startsWith('/rfqs')) {
    // Both admin, procurement_officer, vendor, and manager can see RFQs (vendor sees assigned ones, handled via RLS)
    return true
  }

  if (cleanPath.startsWith('/quotations')) {
    // Admin, procurement_officer, vendor, manager can see quotations
    return true
  }

  if (cleanPath.startsWith('/approvals')) {
    return role === 'admin' || role === 'manager'
  }

  if (cleanPath.startsWith('/purchase-orders')) {
    return role === 'admin' || role === 'procurement_officer' || role === 'vendor'
  }

  if (cleanPath.startsWith('/invoices')) {
    return role === 'admin' || role === 'procurement_officer'
  }

  if (cleanPath.startsWith('/reports')) {
    return role === 'admin' || role === 'procurement_officer' || role === 'manager'
  }

  if (cleanPath.startsWith('/settings')) {
    return role === 'admin'
  }

  return true
}
