-- ============================================================
-- VendorBridge ERP — 001_schema.sql
-- Complete PostgreSQL schema for Supabase
-- Run this FIRST in Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES
-- Extends Supabase auth.users with app-specific fields
-- ============================================================
CREATE TABLE public.profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           TEXT UNIQUE NOT NULL,
    full_name       TEXT NOT NULL,
    phone           TEXT,
    role            TEXT NOT NULL DEFAULT 'procurement_officer'
                    CHECK (role IN ('admin', 'procurement_officer', 'vendor', 'manager')),
    avatar_url      TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN public.profiles.role IS 'admin | procurement_officer | vendor | manager';

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);

-- ============================================================
-- 2. VENDORS
-- ============================================================
CREATE TABLE public.vendors (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_code     TEXT UNIQUE,
    company_name    TEXT NOT NULL,
    contact_person  TEXT NOT NULL,
    email           TEXT NOT NULL,
    phone           TEXT,
    gst_number      TEXT,
    pan_number      TEXT,
    address         TEXT,
    city            TEXT,
    state           TEXT,
    country         TEXT DEFAULT 'India',
    category        TEXT,
    rating          NUMERIC(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('active', 'inactive', 'pending', 'blacklisted')),
    notes           TEXT,
    created_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.vendors IS 'Vendor registry with company and compliance details';

CREATE INDEX idx_vendors_vendor_code ON public.vendors(vendor_code);
CREATE INDEX idx_vendors_email ON public.vendors(email);
CREATE INDEX idx_vendors_status ON public.vendors(status);
CREATE INDEX idx_vendors_category ON public.vendors(category);
CREATE INDEX idx_vendors_created_by ON public.vendors(created_by);

-- ============================================================
-- 3. RFQS (Request for Quotations)
-- ============================================================
CREATE TABLE public.rfqs (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_number              TEXT UNIQUE,
    title                   TEXT NOT NULL,
    description             TEXT,
    department              TEXT,
    procurement_type        TEXT CHECK (procurement_type IN ('goods', 'services', 'works', 'consulting')),
    priority                TEXT NOT NULL DEFAULT 'medium'
                            CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    budget                  NUMERIC(15,2),
    currency                TEXT NOT NULL DEFAULT 'INR',
    deadline                DATE,
    required_delivery_date  DATE,
    status                  TEXT NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'open', 'under_review', 'approved', 'rejected', 'closed', 'cancelled')),
    created_by              UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_by             UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.rfqs IS 'Request for Quotations — the procurement lifecycle starts here';

CREATE INDEX idx_rfqs_rfq_number ON public.rfqs(rfq_number);
CREATE INDEX idx_rfqs_status ON public.rfqs(status);
CREATE INDEX idx_rfqs_priority ON public.rfqs(priority);
CREATE INDEX idx_rfqs_created_by ON public.rfqs(created_by);
CREATE INDEX idx_rfqs_approved_by ON public.rfqs(approved_by);
CREATE INDEX idx_rfqs_deadline ON public.rfqs(deadline);

-- ============================================================
-- 4. RFQ_ITEMS
-- ============================================================
CREATE TABLE public.rfq_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id          UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    item_name       TEXT NOT NULL,
    description     TEXT,
    quantity        NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
    unit            TEXT NOT NULL DEFAULT 'units',
    estimated_price NUMERIC(15,2),
    expected_delivery DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.rfq_items IS 'Line items within an RFQ';

CREATE INDEX idx_rfq_items_rfq_id ON public.rfq_items(rfq_id);

-- ============================================================
-- 5. RFQ_VENDORS (Many-to-many: RFQ ↔ Vendor invitations)
-- ============================================================
CREATE TABLE public.rfq_vendors (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id              UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    vendor_id           UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    invitation_status   TEXT NOT NULL DEFAULT 'pending'
                        CHECK (invitation_status IN ('pending', 'sent', 'accepted', 'declined')),
    sent_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(rfq_id, vendor_id)
);

COMMENT ON TABLE public.rfq_vendors IS 'Tracks which vendors are invited to which RFQs';

CREATE INDEX idx_rfq_vendors_rfq_id ON public.rfq_vendors(rfq_id);
CREATE INDEX idx_rfq_vendors_vendor_id ON public.rfq_vendors(vendor_id);

-- ============================================================
-- 6. QUOTATIONS
-- ============================================================
CREATE TABLE public.quotations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_number    TEXT UNIQUE,
    rfq_id              UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    vendor_id           UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    total_amount        NUMERIC(15,2) NOT NULL DEFAULT 0,
    delivery_days       INTEGER,
    notes               TEXT,
    status              TEXT NOT NULL DEFAULT 'submitted'
                        CHECK (status IN ('draft', 'submitted', 'under_review', 'shortlisted', 'accepted', 'rejected')),
    submitted_at        TIMESTAMPTZ DEFAULT now(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.quotations IS 'Vendor quotation submissions against RFQs';

CREATE INDEX idx_quotations_quotation_number ON public.quotations(quotation_number);
CREATE INDEX idx_quotations_rfq_id ON public.quotations(rfq_id);
CREATE INDEX idx_quotations_vendor_id ON public.quotations(vendor_id);
CREATE INDEX idx_quotations_status ON public.quotations(status);

-- ============================================================
-- 7. QUOTATION_ITEMS
-- ============================================================
CREATE TABLE public.quotation_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id    UUID NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
    rfq_item_id     UUID NOT NULL REFERENCES public.rfq_items(id) ON DELETE CASCADE,
    unit_price      NUMERIC(15,2) NOT NULL CHECK (unit_price >= 0),
    quantity        NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
    subtotal        NUMERIC(15,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.quotation_items IS 'Line-item pricing within a quotation';

CREATE INDEX idx_quotation_items_quotation_id ON public.quotation_items(quotation_id);
CREATE INDEX idx_quotation_items_rfq_item_id ON public.quotation_items(rfq_item_id);

-- ============================================================
-- 8. APPROVALS
-- ============================================================
CREATE TABLE public.approvals (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id          UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    approver_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    decision        TEXT NOT NULL CHECK (decision IN ('pending', 'approved', 'rejected', 'deferred')),
    remarks         TEXT,
    approved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.approvals IS 'Manager approval decisions on RFQs';

CREATE INDEX idx_approvals_rfq_id ON public.approvals(rfq_id);
CREATE INDEX idx_approvals_approver_id ON public.approvals(approver_id);
CREATE INDEX idx_approvals_decision ON public.approvals(decision);

-- ============================================================
-- 9. PURCHASE_ORDERS
-- ============================================================
CREATE TABLE public.purchase_orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number       TEXT UNIQUE,
    rfq_id          UUID REFERENCES public.rfqs(id) ON DELETE SET NULL,
    vendor_id       UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    quotation_id    UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
    total_amount    NUMERIC(15,2) NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'issued', 'acknowledged', 'fulfilled', 'closed', 'cancelled')),
    issued_date     DATE DEFAULT CURRENT_DATE,
    created_by      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.purchase_orders IS 'Purchase orders generated from accepted quotations';

CREATE INDEX idx_po_po_number ON public.purchase_orders(po_number);
CREATE INDEX idx_po_rfq_id ON public.purchase_orders(rfq_id);
CREATE INDEX idx_po_vendor_id ON public.purchase_orders(vendor_id);
CREATE INDEX idx_po_quotation_id ON public.purchase_orders(quotation_id);
CREATE INDEX idx_po_status ON public.purchase_orders(status);

-- ============================================================
-- 10. PURCHASE_ORDER_ITEMS
-- ============================================================
CREATE TABLE public.purchase_order_items (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id   UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    item_name           TEXT NOT NULL,
    quantity            NUMERIC(12,2) NOT NULL CHECK (quantity > 0),
    unit_price          NUMERIC(15,2) NOT NULL CHECK (unit_price >= 0),
    subtotal            NUMERIC(15,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.purchase_order_items IS 'Line items within a purchase order';

CREATE INDEX idx_poi_purchase_order_id ON public.purchase_order_items(purchase_order_id);

-- ============================================================
-- 11. INVOICES
-- ============================================================
CREATE TABLE public.invoices (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number      TEXT UNIQUE,
    purchase_order_id   UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE RESTRICT,
    vendor_id           UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    subtotal            NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_amount          NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount        NUMERIC(15,2) NOT NULL DEFAULT 0,
    invoice_date        DATE DEFAULT CURRENT_DATE,
    due_date            DATE,
    status              TEXT NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('draft', 'pending', 'paid', 'overdue', 'cancelled', 'disputed')),
    created_by          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.invoices IS 'Invoices generated from purchase orders';

CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_po_id ON public.invoices(purchase_order_id);
CREATE INDEX idx_invoices_vendor_id ON public.invoices(vendor_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);

-- ============================================================
-- 12. NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    message         TEXT,
    type            TEXT NOT NULL DEFAULT 'info'
                    CHECK (type IN ('info', 'success', 'warning', 'error', 'rfq', 'approval', 'invoice', 'po', 'vendor')),
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    entity_id       UUID,
    entity_type     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notifications IS 'In-app notifications for users';

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================
-- 13. ACTIVITY_LOGS
-- ============================================================
CREATE TABLE public.activity_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action          TEXT NOT NULL,
    module          TEXT NOT NULL,
    entity_id       UUID,
    details         JSONB DEFAULT '{}',
    ip_address      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.activity_logs IS 'Audit trail for all user actions';

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX idx_activity_logs_module ON public.activity_logs(module);
CREATE INDEX idx_activity_logs_entity_id ON public.activity_logs(entity_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
-- Grant usage on public schema to authenticated and anon roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant sequence permissions
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
