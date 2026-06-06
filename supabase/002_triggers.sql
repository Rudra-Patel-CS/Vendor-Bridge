-- ============================================================
-- VendorBridge ERP — 002_triggers.sql
-- Triggers, auto-number generation, and utility functions
-- Run AFTER 001_schema.sql
-- ============================================================

-- ============================================================
-- UTILITY: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.rfqs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.quotations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.approvals
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.purchase_orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.invoices
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- AUTO-NUMBER: RFQ Number (RFQ-2026-0001)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.rfq_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_rfq_number()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_val INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM now())::TEXT;
    next_val := nextval('public.rfq_number_seq');
    NEW.rfq_number := 'RFQ-' || current_year || '-' || LPAD(next_val::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_rfq_number
    BEFORE INSERT ON public.rfqs
    FOR EACH ROW
    WHEN (NEW.rfq_number IS NULL)
    EXECUTE FUNCTION public.generate_rfq_number();

-- ============================================================
-- AUTO-NUMBER: Quotation Number (QT-2026-0001)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.quotation_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_quotation_number()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_val INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM now())::TEXT;
    next_val := nextval('public.quotation_number_seq');
    NEW.quotation_number := 'QT-' || current_year || '-' || LPAD(next_val::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_quotation_number
    BEFORE INSERT ON public.quotations
    FOR EACH ROW
    WHEN (NEW.quotation_number IS NULL)
    EXECUTE FUNCTION public.generate_quotation_number();

-- ============================================================
-- AUTO-NUMBER: Purchase Order Number (PO-2026-0001)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.po_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_po_number()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_val INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM now())::TEXT;
    next_val := nextval('public.po_number_seq');
    NEW.po_number := 'PO-' || current_year || '-' || LPAD(next_val::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_po_number
    BEFORE INSERT ON public.purchase_orders
    FOR EACH ROW
    WHEN (NEW.po_number IS NULL)
    EXECUTE FUNCTION public.generate_po_number();

-- ============================================================
-- AUTO-NUMBER: Invoice Number (INV-2026-0001)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_val INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM now())::TEXT;
    next_val := nextval('public.invoice_number_seq');
    NEW.invoice_number := 'INV-' || current_year || '-' || LPAD(next_val::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_invoice_number
    BEFORE INSERT ON public.invoices
    FOR EACH ROW
    WHEN (NEW.invoice_number IS NULL)
    EXECUTE FUNCTION public.generate_invoice_number();

-- ============================================================
-- AUTO-NUMBER: Vendor Code (VEN-0001)
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.vendor_code_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_vendor_code()
RETURNS TRIGGER AS $$
DECLARE
    next_val INTEGER;
BEGIN
    next_val := nextval('public.vendor_code_seq');
    NEW.vendor_code := 'VEN-' || LPAD(next_val::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_vendor_code
    BEFORE INSERT ON public.vendors
    FOR EACH ROW
    WHEN (NEW.vendor_code IS NULL)
    EXECUTE FUNCTION public.generate_vendor_code();

-- ============================================================
-- AUTO-CREATE PROFILE on auth.users INSERT
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'procurement_officer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ACTIVITY LOGGING: Helper function
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_activity(
    p_user_id UUID,
    p_action TEXT,
    p_module TEXT,
    p_entity_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.activity_logs (user_id, action, module, entity_id, details)
    VALUES (p_user_id, p_action, p_module, p_entity_id, p_details)
    RETURNING id INTO log_id;
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- NOTIFICATION: Helper function
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT DEFAULT 'info',
    p_entity_id UUID DEFAULT NULL,
    p_entity_type TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notif_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, entity_id, entity_type)
    VALUES (p_user_id, p_title, p_message, p_type, p_entity_id, p_entity_type)
    RETURNING id INTO notif_id;
    RETURN notif_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- AUTO-NOTIFY: When RFQ status changes
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_rfq_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Notify the creator
        IF NEW.created_by IS NOT NULL THEN
            PERFORM public.create_notification(
                NEW.created_by,
                'RFQ Status Updated',
                'RFQ ' || NEW.rfq_number || ' status changed to ' || NEW.status,
                'rfq',
                NEW.id,
                'rfq'
            );
        END IF;

        -- Log the activity
        PERFORM public.log_activity(
            auth.uid(),
            'Status changed to ' || NEW.status,
            'RFQs',
            NEW.id,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_rfq_status_change
    AFTER UPDATE ON public.rfqs
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_rfq_status_change();

-- ============================================================
-- AUTO-NOTIFY: When new quotation is submitted
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_new_quotation()
RETURNS TRIGGER AS $$
DECLARE
    rfq_creator UUID;
    rfq_num TEXT;
    vendor_name TEXT;
BEGIN
    -- Get RFQ creator
    SELECT r.created_by, r.rfq_number INTO rfq_creator, rfq_num
    FROM public.rfqs r WHERE r.id = NEW.rfq_id;

    -- Get vendor name
    SELECT v.company_name INTO vendor_name
    FROM public.vendors v WHERE v.id = NEW.vendor_id;

    -- Notify RFQ creator
    IF rfq_creator IS NOT NULL THEN
        PERFORM public.create_notification(
            rfq_creator,
            'New Quotation Received',
            vendor_name || ' submitted a quotation for ' || rfq_num,
            'rfq',
            NEW.id,
            'quotation'
        );
    END IF;

    -- Log activity
    PERFORM public.log_activity(
        auth.uid(),
        'Submitted quotation',
        'Quotations',
        NEW.id,
        jsonb_build_object('rfq_id', NEW.rfq_id, 'amount', NEW.total_amount)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_new_quotation
    AFTER INSERT ON public.quotations
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_new_quotation();

-- ============================================================
-- AUTO-NOTIFY: When approval decision is made
-- ============================================================
CREATE OR REPLACE FUNCTION public.notify_approval_decision()
RETURNS TRIGGER AS $$
DECLARE
    rfq_creator UUID;
    rfq_num TEXT;
    approver_name TEXT;
BEGIN
    -- Get RFQ info
    SELECT r.created_by, r.rfq_number INTO rfq_creator, rfq_num
    FROM public.rfqs r WHERE r.id = NEW.rfq_id;

    -- Get approver name
    SELECT p.full_name INTO approver_name
    FROM public.profiles p WHERE p.id = NEW.approver_id;

    -- Notify RFQ creator
    IF rfq_creator IS NOT NULL AND NEW.decision IN ('approved', 'rejected') THEN
        PERFORM public.create_notification(
            rfq_creator,
            'RFQ ' || INITCAP(NEW.decision),
            rfq_num || ' has been ' || NEW.decision || ' by ' || approver_name,
            'approval',
            NEW.id,
            'approval'
        );

        -- Update RFQ status
        IF NEW.decision = 'approved' THEN
            UPDATE public.rfqs SET status = 'approved', approved_by = NEW.approver_id WHERE id = NEW.rfq_id;
        ELSIF NEW.decision = 'rejected' THEN
            UPDATE public.rfqs SET status = 'rejected' WHERE id = NEW.rfq_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_approval_decision
    AFTER INSERT OR UPDATE ON public.approvals
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_approval_decision();

-- ============================================================
-- END OF TRIGGERS
-- ============================================================
