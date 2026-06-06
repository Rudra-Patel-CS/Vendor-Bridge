// Centralized mock data for the VendorBridge ERP UI.
// All data is static and front-end only — no backend wiring.

export type Status =
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "draft"
  | "open"
  | "closed"
  | "paid"
  | "overdue"
  | "sent"

export type Vendor = {
  id: string
  name: string
  company: string
  gst: string
  pan: string
  email: string
  phone: string
  address: string
  category: string
  rating: number
  status: "active" | "inactive" | "pending"
  spend: number
  orders: number
  onTimeDelivery: number
  joinedAt: string
}

export const vendors: Vendor[] = [
  {
    id: "VEN-1001",
    name: "Rajesh Kumar",
    company: "Apex Industrial Supplies",
    gst: "27AABCA1234F1Z5",
    pan: "AABCA1234F",
    email: "rajesh@apexsupplies.com",
    phone: "+91 98200 11234",
    address: "Plot 14, MIDC, Andheri East, Mumbai 400093",
    category: "Raw Materials",
    rating: 4.8,
    status: "active",
    spend: 1840000,
    orders: 64,
    onTimeDelivery: 96,
    joinedAt: "2022-03-12",
  },
  {
    id: "VEN-1002",
    name: "Meera Iyer",
    company: "TechNova Components",
    gst: "29AAGCT5678P1Z2",
    pan: "AAGCT5678P",
    email: "meera@technova.io",
    phone: "+91 99450 88321",
    address: "No 9, Electronic City Phase 1, Bengaluru 560100",
    category: "Electronics",
    rating: 4.6,
    status: "active",
    spend: 2360000,
    orders: 88,
    onTimeDelivery: 92,
    joinedAt: "2021-11-02",
  },
  {
    id: "VEN-1003",
    name: "David Fernandes",
    company: "Coastal Logistics Pvt Ltd",
    gst: "33AACCF9012K1Z8",
    pan: "AACCF9012K",
    email: "david@coastallog.com",
    phone: "+91 90030 45612",
    address: "12 Harbour Road, Chennai 600001",
    category: "Logistics",
    rating: 4.2,
    status: "active",
    spend: 980000,
    orders: 41,
    onTimeDelivery: 88,
    joinedAt: "2023-01-20",
  },
  {
    id: "VEN-1004",
    name: "Sunita Rao",
    company: "GreenPack Packaging",
    gst: "24AAECG3456M1Z1",
    pan: "AAECG3456M",
    email: "sunita@greenpack.com",
    phone: "+91 98980 23145",
    address: "Survey 88, GIDC Vatva, Ahmedabad 382445",
    category: "Packaging",
    rating: 3.9,
    status: "pending",
    spend: 420000,
    orders: 18,
    onTimeDelivery: 81,
    joinedAt: "2024-06-08",
  },
  {
    id: "VEN-1005",
    name: "Arjun Malhotra",
    company: "PrecisionTools Mfg",
    gst: "06AAJCP7890N1Z4",
    pan: "AAJCP7890N",
    email: "arjun@precisiontools.in",
    phone: "+91 99100 67890",
    address: "Sector 37, Industrial Area, Gurugram 122001",
    category: "Machinery",
    rating: 4.5,
    status: "active",
    spend: 3120000,
    orders: 102,
    onTimeDelivery: 94,
    joinedAt: "2020-08-15",
  },
  {
    id: "VEN-1006",
    name: "Fatima Sheikh",
    company: "OfficePro Solutions",
    gst: "36AAKCO2345Q1Z9",
    pan: "AAKCO2345Q",
    email: "fatima@officepro.com",
    phone: "+91 91540 33221",
    address: "Banjara Hills Road 3, Hyderabad 500034",
    category: "Office Supplies",
    rating: 4.1,
    status: "inactive",
    spend: 260000,
    orders: 12,
    onTimeDelivery: 78,
    joinedAt: "2023-09-30",
  },
  {
    id: "VEN-1007",
    name: "Vikram Singh",
    company: "SteelLine Fabricators",
    gst: "08AALCS6789R1Z3",
    pan: "AALCS6789R",
    email: "vikram@steelline.in",
    phone: "+91 98290 55667",
    address: "RIICO Industrial Area, Jaipur 302013",
    category: "Raw Materials",
    rating: 4.7,
    status: "active",
    spend: 2780000,
    orders: 76,
    onTimeDelivery: 95,
    joinedAt: "2021-04-18",
  },
  {
    id: "VEN-1008",
    name: "Lakshmi Nair",
    company: "BrightChem Distributors",
    gst: "32AAMCB1234S1Z6",
    pan: "AAMCB1234S",
    email: "lakshmi@brightchem.com",
    phone: "+91 90720 11883",
    address: "Kalamassery Industrial Estate, Kochi 683104",
    category: "Chemicals",
    rating: 4.0,
    status: "active",
    spend: 690000,
    orders: 29,
    onTimeDelivery: 86,
    joinedAt: "2022-12-05",
  },
]

export const vendorCategories = [
  "Raw Materials",
  "Electronics",
  "Logistics",
  "Packaging",
  "Machinery",
  "Office Supplies",
  "Chemicals",
]

export type RFQ = {
  id: string
  title: string
  product: string
  quantity: number
  unit: string
  vendorCount: number
  deadline: string
  status: "open" | "closed" | "draft"
  createdAt: string
  budget: number
  quotations: number
}

export const rfqs: RFQ[] = [
  {
    id: "RFQ-2041",
    title: "Aluminium Sheets Q3 Procurement",
    product: "Aluminium Sheet 2mm",
    quantity: 5000,
    unit: "kg",
    vendorCount: 5,
    deadline: "2026-06-20",
    status: "open",
    createdAt: "2026-06-01",
    budget: 1250000,
    quotations: 4,
  },
  {
    id: "RFQ-2042",
    title: "PCB Components Bulk Order",
    product: "PCB Assembly Kit",
    quantity: 1200,
    unit: "units",
    vendorCount: 4,
    deadline: "2026-06-18",
    status: "open",
    createdAt: "2026-05-28",
    budget: 860000,
    quotations: 3,
  },
  {
    id: "RFQ-2043",
    title: "Warehouse Logistics Contract",
    product: "Freight Service",
    quantity: 1,
    unit: "contract",
    vendorCount: 3,
    deadline: "2026-06-12",
    status: "closed",
    createdAt: "2026-05-15",
    budget: 540000,
    quotations: 3,
  },
  {
    id: "RFQ-2044",
    title: "Eco Packaging Materials",
    product: "Corrugated Boxes",
    quantity: 20000,
    unit: "units",
    vendorCount: 2,
    deadline: "2026-06-25",
    status: "open",
    createdAt: "2026-06-03",
    budget: 320000,
    quotations: 2,
  },
  {
    id: "RFQ-2045",
    title: "CNC Machine Spare Parts",
    product: "Spindle Assembly",
    quantity: 35,
    unit: "units",
    vendorCount: 4,
    deadline: "2026-06-30",
    status: "draft",
    createdAt: "2026-06-05",
    budget: 980000,
    quotations: 0,
  },
]

export type Quotation = {
  id: string
  rfqId: string
  rfqTitle: string
  vendor: string
  vendorId: string
  price: number
  deliveryDays: number
  rating: number
  notes: string
  status: "submitted" | "shortlisted" | "rejected"
  submittedAt: string
}

export const quotations: Quotation[] = [
  {
    id: "QUO-5501",
    rfqId: "RFQ-2041",
    rfqTitle: "Aluminium Sheets Q3 Procurement",
    vendor: "Apex Industrial Supplies",
    vendorId: "VEN-1001",
    price: 1180000,
    deliveryDays: 12,
    rating: 4.8,
    notes: "Includes free transport within Maharashtra.",
    status: "shortlisted",
    submittedAt: "2026-06-04",
  },
  {
    id: "QUO-5502",
    rfqId: "RFQ-2041",
    rfqTitle: "Aluminium Sheets Q3 Procurement",
    vendor: "SteelLine Fabricators",
    vendorId: "VEN-1007",
    price: 1095000,
    deliveryDays: 18,
    rating: 4.7,
    notes: "Bulk discount applied. Payment 30% advance.",
    status: "submitted",
    submittedAt: "2026-06-05",
  },
  {
    id: "QUO-5503",
    rfqId: "RFQ-2041",
    rfqTitle: "Aluminium Sheets Q3 Procurement",
    vendor: "PrecisionTools Mfg",
    vendorId: "VEN-1005",
    price: 1245000,
    deliveryDays: 9,
    rating: 4.5,
    notes: "Fastest delivery available, premium grade material.",
    status: "submitted",
    submittedAt: "2026-06-05",
  },
  {
    id: "QUO-5504",
    rfqId: "RFQ-2041",
    rfqTitle: "Aluminium Sheets Q3 Procurement",
    vendor: "BrightChem Distributors",
    vendorId: "VEN-1008",
    price: 1320000,
    deliveryDays: 15,
    rating: 4.0,
    notes: "Standard terms, GST extra.",
    status: "rejected",
    submittedAt: "2026-06-03",
  },
  {
    id: "QUO-5505",
    rfqId: "RFQ-2042",
    rfqTitle: "PCB Components Bulk Order",
    vendor: "TechNova Components",
    vendorId: "VEN-1002",
    price: 798000,
    deliveryDays: 14,
    rating: 4.6,
    notes: "ISO certified components with 2 year warranty.",
    status: "shortlisted",
    submittedAt: "2026-06-02",
  },
]

export type Approval = {
  id: string
  type: "RFQ" | "Purchase Order" | "Invoice" | "Vendor"
  reference: string
  title: string
  requestedBy: string
  amount: number
  status: "pending" | "approved" | "rejected"
  priority: "low" | "medium" | "high"
  requestedAt: string
}

export const approvals: Approval[] = [
  {
    id: "APR-7701",
    type: "Purchase Order",
    reference: "PO-3301",
    title: "Aluminium Sheets — Apex Industrial",
    requestedBy: "Priya Sharma",
    amount: 1180000,
    status: "pending",
    priority: "high",
    requestedAt: "2026-06-05",
  },
  {
    id: "APR-7702",
    type: "Vendor",
    reference: "VEN-1004",
    title: "New Vendor Onboarding — GreenPack",
    requestedBy: "Amit Verma",
    amount: 0,
    status: "pending",
    priority: "medium",
    requestedAt: "2026-06-04",
  },
  {
    id: "APR-7703",
    type: "Invoice",
    reference: "INV-9902",
    title: "PCB Components Payment",
    requestedBy: "Neha Gupta",
    amount: 798000,
    status: "pending",
    priority: "high",
    requestedAt: "2026-06-05",
  },
  {
    id: "APR-7704",
    type: "RFQ",
    reference: "RFQ-2045",
    title: "CNC Machine Spare Parts RFQ",
    requestedBy: "Rohit Mehta",
    amount: 980000,
    status: "approved",
    priority: "low",
    requestedAt: "2026-06-02",
  },
  {
    id: "APR-7705",
    type: "Purchase Order",
    reference: "PO-3298",
    title: "Office Supplies Quarterly",
    requestedBy: "Priya Sharma",
    amount: 86000,
    status: "rejected",
    priority: "low",
    requestedAt: "2026-05-30",
  },
]

export type PurchaseOrder = {
  id: string
  vendor: string
  vendorId: string
  items: number
  amount: number
  status: "draft" | "sent" | "approved" | "closed"
  createdAt: string
  deliveryDate: string
}

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-3301",
    vendor: "Apex Industrial Supplies",
    vendorId: "VEN-1001",
    items: 3,
    amount: 1180000,
    status: "approved",
    createdAt: "2026-06-05",
    deliveryDate: "2026-06-17",
  },
  {
    id: "PO-3300",
    vendor: "TechNova Components",
    vendorId: "VEN-1002",
    items: 5,
    amount: 798000,
    status: "sent",
    createdAt: "2026-06-04",
    deliveryDate: "2026-06-18",
  },
  {
    id: "PO-3299",
    vendor: "PrecisionTools Mfg",
    vendorId: "VEN-1005",
    items: 2,
    amount: 612000,
    status: "closed",
    createdAt: "2026-05-28",
    deliveryDate: "2026-06-06",
  },
  {
    id: "PO-3298",
    vendor: "OfficePro Solutions",
    vendorId: "VEN-1006",
    items: 8,
    amount: 86000,
    status: "draft",
    createdAt: "2026-05-30",
    deliveryDate: "2026-06-10",
  },
  {
    id: "PO-3297",
    vendor: "SteelLine Fabricators",
    vendorId: "VEN-1007",
    items: 4,
    amount: 1490000,
    status: "closed",
    createdAt: "2026-05-20",
    deliveryDate: "2026-06-01",
  },
]

export type Invoice = {
  id: string
  vendor: string
  vendorId: string
  poRef: string
  subtotal: number
  gst: number
  total: number
  status: "paid" | "pending" | "overdue"
  issuedAt: string
  dueAt: string
}

export const invoices: Invoice[] = [
  {
    id: "INV-9902",
    vendor: "TechNova Components",
    vendorId: "VEN-1002",
    poRef: "PO-3300",
    subtotal: 798000,
    gst: 143640,
    total: 941640,
    status: "pending",
    issuedAt: "2026-06-05",
    dueAt: "2026-06-20",
  },
  {
    id: "INV-9901",
    vendor: "PrecisionTools Mfg",
    vendorId: "VEN-1005",
    poRef: "PO-3299",
    subtotal: 612000,
    gst: 110160,
    total: 722160,
    status: "paid",
    issuedAt: "2026-05-29",
    dueAt: "2026-06-13",
  },
  {
    id: "INV-9900",
    vendor: "SteelLine Fabricators",
    vendorId: "VEN-1007",
    poRef: "PO-3297",
    subtotal: 1490000,
    gst: 268200,
    total: 1758200,
    status: "overdue",
    issuedAt: "2026-05-21",
    dueAt: "2026-06-04",
  },
  {
    id: "INV-9899",
    vendor: "Coastal Logistics Pvt Ltd",
    vendorId: "VEN-1003",
    poRef: "PO-3295",
    subtotal: 240000,
    gst: 43200,
    total: 283200,
    status: "paid",
    issuedAt: "2026-05-18",
    dueAt: "2026-06-02",
  },
]

export type NotificationItem = {
  id: string
  type: "rfq" | "approval" | "invoice" | "po" | "vendor"
  title: string
  description: string
  time: string
  read: boolean
}

export const notifications: NotificationItem[] = [
  {
    id: "N-1",
    type: "rfq",
    title: "New quotation received",
    description: "SteelLine Fabricators submitted a quote for RFQ-2041.",
    time: "5 min ago",
    read: false,
  },
  {
    id: "N-2",
    type: "approval",
    title: "Approval requested",
    description: "PO-3301 (₹11.8L) is awaiting your approval.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "N-3",
    type: "invoice",
    title: "Invoice overdue",
    description: "INV-9900 from SteelLine Fabricators is past due.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "N-4",
    type: "po",
    title: "Purchase order delivered",
    description: "PO-3299 from PrecisionTools Mfg was marked delivered.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "N-5",
    type: "vendor",
    title: "Vendor onboarding pending",
    description: "GreenPack Packaging requires document verification.",
    time: "Yesterday",
    read: true,
  },
]

export type Activity = {
  id: string
  user: string
  action: string
  target: string
  time: string
}

export const activities: Activity[] = [
  { id: "A-1", user: "Priya Sharma", action: "created", target: "PO-3301", time: "10 min ago" },
  { id: "A-2", user: "Amit Verma", action: "approved", target: "RFQ-2045", time: "45 min ago" },
  { id: "A-3", user: "Neha Gupta", action: "generated invoice", target: "INV-9902", time: "2 hours ago" },
  { id: "A-4", user: "Rohit Mehta", action: "added vendor", target: "GreenPack Packaging", time: "5 hours ago" },
  { id: "A-5", user: "Priya Sharma", action: "rejected", target: "PO-3298", time: "Yesterday" },
]

export const pendingTasks = [
  { id: "T-1", title: "Review 3 quotations for RFQ-2041", due: "Today", priority: "high" as const },
  { id: "T-2", title: "Approve PO-3301 (₹11.8L)", due: "Today", priority: "high" as const },
  { id: "T-3", title: "Verify GreenPack documents", due: "Tomorrow", priority: "medium" as const },
  { id: "T-4", title: "Follow up on INV-9900 payment", due: "Jun 8", priority: "medium" as const },
  { id: "T-5", title: "Close RFQ-2043 logistics contract", due: "Jun 10", priority: "low" as const },
]

// Chart datasets
export const procurementTrend = [
  { month: "Jan", spend: 2.4, orders: 42 },
  { month: "Feb", spend: 2.1, orders: 38 },
  { month: "Mar", spend: 3.2, orders: 55 },
  { month: "Apr", spend: 2.8, orders: 49 },
  { month: "May", spend: 3.6, orders: 61 },
  { month: "Jun", spend: 4.1, orders: 68 },
]

export const monthlySpending = [
  { month: "Jan", value: 2400000 },
  { month: "Feb", value: 2100000 },
  { month: "Mar", value: 3200000 },
  { month: "Apr", value: 2800000 },
  { month: "May", value: 3600000 },
  { month: "Jun", value: 4100000 },
]

export const rfqStats = [
  { name: "Open", value: 3 },
  { name: "Closed", value: 1 },
  { name: "Draft", value: 1 },
]

export const vendorPerformance = [
  { vendor: "Apex", score: 96 },
  { vendor: "TechNova", score: 92 },
  { vendor: "PrecisionTools", score: 94 },
  { vendor: "SteelLine", score: 95 },
  { vendor: "BrightChem", score: 86 },
  { vendor: "Coastal", score: 88 },
]

export type User = {
  id: string
  name: string
  email: string
  role: "Admin" | "Procurement Manager" | "Approver" | "Vendor"
  status: "active" | "inactive"
  lastActive: string
}

export const users: User[] = [
  { id: "U-1", name: "Priya Sharma", email: "priya@vendorbridge.com", role: "Procurement Manager", status: "active", lastActive: "5 min ago" },
  { id: "U-2", name: "Amit Verma", email: "amit@vendorbridge.com", role: "Approver", status: "active", lastActive: "1 hour ago" },
  { id: "U-3", name: "Neha Gupta", email: "neha@vendorbridge.com", role: "Procurement Manager", status: "active", lastActive: "3 hours ago" },
  { id: "U-4", name: "Rohit Mehta", email: "rohit@vendorbridge.com", role: "Admin", status: "active", lastActive: "Just now" },
  { id: "U-5", name: "Meera Iyer", email: "meera@technova.io", role: "Vendor", status: "active", lastActive: "Yesterday" },
  { id: "U-6", name: "Sandeep Joshi", email: "sandeep@vendorbridge.com", role: "Approver", status: "inactive", lastActive: "2 weeks ago" },
]

export type AuditLog = {
  id: string
  user: string
  action: string
  module: string
  ip: string
  time: string
}

export const auditLogs: AuditLog[] = [
  { id: "L-1", user: "Rohit Mehta", action: "Updated role permissions", module: "Admin", ip: "10.0.4.12", time: "2026-06-05 14:32" },
  { id: "L-2", user: "Priya Sharma", action: "Created PO-3301", module: "Purchase Orders", ip: "10.0.4.45", time: "2026-06-05 11:08" },
  { id: "L-3", user: "Amit Verma", action: "Approved RFQ-2045", module: "Approvals", ip: "10.0.4.21", time: "2026-06-05 09:51" },
  { id: "L-4", user: "Neha Gupta", action: "Generated INV-9902", module: "Invoices", ip: "10.0.4.33", time: "2026-06-05 09:14" },
  { id: "L-5", user: "Rohit Mehta", action: "Deactivated user Sandeep Joshi", module: "User Management", ip: "10.0.4.12", time: "2026-06-04 16:45" },
]

export const roles = [
  { id: "R-1", name: "Admin", users: 1, permissions: 24, description: "Full system access including settings and audit logs." },
  { id: "R-2", name: "Procurement Manager", users: 2, permissions: 16, description: "Manage vendors, RFQs, quotations and purchase orders." },
  { id: "R-3", name: "Approver", users: 2, permissions: 8, description: "Review and approve POs, invoices and onboarding." },
  { id: "R-4", name: "Vendor", users: 1, permissions: 4, description: "Submit quotations and view assigned RFQs." },
]

// Formatting helpers
export function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
  return `₹${value}`
}

export function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}
