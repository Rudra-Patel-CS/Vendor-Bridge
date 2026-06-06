-- ============================================================
-- VendorBridge ERP — 003_rls.sql
-- Row Level Security Policies for all tables
-- Run AFTER 001_schema.sql and 002_triggers.sql
-- ============================================================

-- ============================================================
-- HELPER: Get current user's role
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- HELPER: Check if current user is a vendor linked to a vendor record
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_vendor_ids_for_user()
RETURNS SETOF UUID AS $$
    SELECT v.id FROM public.vendors v
    WHERE v.email = (SELECT email FROM public.profiles WHERE id = auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_profiles" ON public.profiles
    FOR ALL USING (public.get_user_role() = 'admin');

-- Users can read all profiles
CREATE POLICY "authenticated_read_profiles" ON public.profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- ============================================================
-- VENDORS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_vendors" ON public.vendors
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_vendors" ON public.vendors
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read only
CREATE POLICY "manager_read_vendors" ON public.vendors
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: can read own vendor record
CREATE POLICY "vendor_read_own" ON public.vendors
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND id IN (SELECT public.get_vendor_ids_for_user())
    );

-- ============================================================
-- RFQS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_rfqs" ON public.rfqs
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_rfqs" ON public.rfqs
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read all RFQs (for approval workflow)
CREATE POLICY "manager_read_rfqs" ON public.rfqs
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: can only see RFQs they are invited to
CREATE POLICY "vendor_read_assigned_rfqs" ON public.rfqs
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND id IN (
            SELECT rv.rfq_id FROM public.rfq_vendors rv
            WHERE rv.vendor_id IN (SELECT public.get_vendor_ids_for_user())
        )
    );

-- ============================================================
-- RFQ_ITEMS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_rfq_items" ON public.rfq_items
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_rfq_items" ON public.rfq_items
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read only
CREATE POLICY "manager_read_rfq_items" ON public.rfq_items
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: read items for assigned RFQs
CREATE POLICY "vendor_read_assigned_rfq_items" ON public.rfq_items
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND rfq_id IN (
            SELECT rv.rfq_id FROM public.rfq_vendors rv
            WHERE rv.vendor_id IN (SELECT public.get_vendor_ids_for_user())
        )
    );

-- ============================================================
-- RFQ_VENDORS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_rfq_vendors" ON public.rfq_vendors
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_rfq_vendors" ON public.rfq_vendors
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read only
CREATE POLICY "manager_read_rfq_vendors" ON public.rfq_vendors
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: read own invitations
CREATE POLICY "vendor_read_own_invitations" ON public.rfq_vendors
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND vendor_id IN (SELECT public.get_vendor_ids_for_user())
    );

-- ============================================================
-- QUOTATIONS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_quotations" ON public.quotations
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_quotations" ON public.quotations
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read only
CREATE POLICY "manager_read_quotations" ON public.quotations
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: can create and read own quotations
CREATE POLICY "vendor_read_own_quotations" ON public.quotations
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND vendor_id IN (SELECT public.get_vendor_ids_for_user())
    );

CREATE POLICY "vendor_insert_quotations" ON public.quotations
    FOR INSERT WITH CHECK (
        public.get_user_role() = 'vendor'
        AND vendor_id IN (SELECT public.get_vendor_ids_for_user())
        AND rfq_id IN (
            SELECT rv.rfq_id FROM public.rfq_vendors rv
            WHERE rv.vendor_id IN (SELECT public.get_vendor_ids_for_user())
        )
    );

CREATE POLICY "vendor_update_own_quotations" ON public.quotations
    FOR UPDATE USING (
        public.get_user_role() = 'vendor'
        AND vendor_id IN (SELECT public.get_vendor_ids_for_user())
        AND status IN ('draft', 'submitted')
    );

-- ============================================================
-- QUOTATION_ITEMS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_quotation_items" ON public.quotation_items
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_quotation_items" ON public.quotation_items
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read only
CREATE POLICY "manager_read_quotation_items" ON public.quotation_items
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: read and create for own quotations
CREATE POLICY "vendor_read_own_quotation_items" ON public.quotation_items
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND quotation_id IN (
            SELECT q.id FROM public.quotations q
            WHERE q.vendor_id IN (SELECT public.get_vendor_ids_for_user())
        )
    );

CREATE POLICY "vendor_insert_quotation_items" ON public.quotation_items
    FOR INSERT WITH CHECK (
        public.get_user_role() = 'vendor'
        AND quotation_id IN (
            SELECT q.id FROM public.quotations q
            WHERE q.vendor_id IN (SELECT public.get_vendor_ids_for_user())
        )
    );

-- ============================================================
-- APPROVALS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_approvals" ON public.approvals
    FOR ALL USING (public.get_user_role() = 'admin');

-- Manager: full CRUD (approval workflow)
CREATE POLICY "manager_all_approvals" ON public.approvals
    FOR ALL USING (public.get_user_role() = 'manager');

-- Procurement Officer: read only
CREATE POLICY "procurement_read_approvals" ON public.approvals
    FOR SELECT USING (public.get_user_role() = 'procurement_officer');

-- ============================================================
-- PURCHASE_ORDERS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_po" ON public.purchase_orders
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_po" ON public.purchase_orders
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read only
CREATE POLICY "manager_read_po" ON public.purchase_orders
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: read own POs
CREATE POLICY "vendor_read_own_po" ON public.purchase_orders
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND vendor_id IN (SELECT public.get_vendor_ids_for_user())
    );

-- ============================================================
-- PURCHASE_ORDER_ITEMS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_poi" ON public.purchase_order_items
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_poi" ON public.purchase_order_items
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read only
CREATE POLICY "manager_read_poi" ON public.purchase_order_items
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: read own PO items
CREATE POLICY "vendor_read_own_poi" ON public.purchase_order_items
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND purchase_order_id IN (
            SELECT po.id FROM public.purchase_orders po
            WHERE po.vendor_id IN (SELECT public.get_vendor_ids_for_user())
        )
    );

-- ============================================================
-- INVOICES POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_invoices" ON public.invoices
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: full CRUD
CREATE POLICY "procurement_all_invoices" ON public.invoices
    FOR ALL USING (public.get_user_role() = 'procurement_officer');

-- Manager: read only
CREATE POLICY "manager_read_invoices" ON public.invoices
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Vendor: read own invoices
CREATE POLICY "vendor_read_own_invoices" ON public.invoices
    FOR SELECT USING (
        public.get_user_role() = 'vendor'
        AND vendor_id IN (SELECT public.get_vendor_ids_for_user())
    );

-- ============================================================
-- NOTIFICATIONS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_notifications" ON public.notifications
    FOR ALL USING (public.get_user_role() = 'admin');

-- Users can read and update their own notifications
CREATE POLICY "users_read_own_notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "users_update_own_notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- ============================================================
-- ACTIVITY_LOGS POLICIES
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_all_activity_logs" ON public.activity_logs
    FOR ALL USING (public.get_user_role() = 'admin');

-- Procurement Officer: read all
CREATE POLICY "procurement_read_activity_logs" ON public.activity_logs
    FOR SELECT USING (public.get_user_role() = 'procurement_officer');

-- Manager: read all
CREATE POLICY "manager_read_activity_logs" ON public.activity_logs
    FOR SELECT USING (public.get_user_role() = 'manager');

-- Users can read their own logs
CREATE POLICY "users_read_own_activity_logs" ON public.activity_logs
    FOR SELECT USING (user_id = auth.uid());

-- ============================================================
-- END OF RLS POLICIES
-- ============================================================
