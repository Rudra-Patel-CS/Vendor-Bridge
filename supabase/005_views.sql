-- ============================================================
-- VendorBridge ERP — 005_views.sql
-- Analytics Views for Dashboard
-- Run AFTER 001_schema.sql
-- ============================================================

-- ============================================================
-- 1. VENDOR PERFORMANCE VIEW
-- ============================================================
CREATE OR REPLACE VIEW public.vendor_performance_view AS
SELECT
    v.id AS vendor_id,
    v.vendor_code,
    v.company_name,
    v.category,
    v.rating,
    v.status,
    COUNT(DISTINCT po.id) AS total_orders,
    COALESCE(SUM(po.total_amount), 0) AS total_spend,
    COUNT(DISTINCT q.id) AS total_quotations,
    COUNT(DISTINCT CASE WHEN q.status = 'accepted' THEN q.id END) AS accepted_quotations,
    CASE
        WHEN COUNT(DISTINCT q.id) > 0
        THEN ROUND(
            COUNT(DISTINCT CASE WHEN q.status = 'accepted' THEN q.id END)::NUMERIC
            / COUNT(DISTINCT q.id) * 100, 1
        )
        ELSE 0
    END AS win_rate_pct,
    COALESCE(AVG(q.delivery_days), 0) AS avg_delivery_days,
    COUNT(DISTINCT CASE WHEN po.status = 'fulfilled' THEN po.id END) AS fulfilled_orders,
    CASE
        WHEN COUNT(DISTINCT po.id) > 0
        THEN ROUND(
            COUNT(DISTINCT CASE WHEN po.status = 'fulfilled' THEN po.id END)::NUMERIC
            / COUNT(DISTINCT po.id) * 100, 1
        )
        ELSE 0
    END AS fulfillment_rate_pct
FROM public.vendors v
LEFT JOIN public.quotations q ON q.vendor_id = v.id
LEFT JOIN public.purchase_orders po ON po.vendor_id = v.id
GROUP BY v.id, v.vendor_code, v.company_name, v.category, v.rating, v.status;

COMMENT ON VIEW public.vendor_performance_view IS 'Aggregated vendor performance metrics';

-- ============================================================
-- 2. MONTHLY PROCUREMENT VIEW
-- ============================================================
CREATE OR REPLACE VIEW public.monthly_procurement_view AS
SELECT
    DATE_TRUNC('month', po.created_at)::DATE AS month,
    TO_CHAR(po.created_at, 'Mon YYYY') AS month_label,
    COUNT(DISTINCT po.id) AS total_orders,
    COALESCE(SUM(po.total_amount), 0) AS total_spend,
    COALESCE(AVG(po.total_amount), 0) AS avg_order_value,
    COUNT(DISTINCT po.vendor_id) AS unique_vendors,
    COUNT(DISTINCT CASE WHEN po.status = 'fulfilled' THEN po.id END) AS fulfilled_orders,
    COUNT(DISTINCT CASE WHEN po.status = 'cancelled' THEN po.id END) AS cancelled_orders
FROM public.purchase_orders po
GROUP BY DATE_TRUNC('month', po.created_at), TO_CHAR(po.created_at, 'Mon YYYY')
ORDER BY month DESC;

COMMENT ON VIEW public.monthly_procurement_view IS 'Month-over-month procurement trends';

-- ============================================================
-- 3. SPENDING SUMMARY VIEW
-- ============================================================
CREATE OR REPLACE VIEW public.spending_summary_view AS
SELECT
    v.category AS vendor_category,
    r.department,
    COUNT(DISTINCT po.id) AS order_count,
    COALESCE(SUM(po.total_amount), 0) AS total_spend,
    COALESCE(AVG(po.total_amount), 0) AS avg_order_value,
    COUNT(DISTINCT po.vendor_id) AS vendor_count,
    COUNT(DISTINCT CASE WHEN i.status = 'paid' THEN i.id END) AS paid_invoices,
    COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.total_amount ELSE 0 END), 0) AS paid_amount,
    COALESCE(SUM(CASE WHEN i.status = 'pending' THEN i.total_amount ELSE 0 END), 0) AS pending_amount,
    COALESCE(SUM(CASE WHEN i.status = 'overdue' THEN i.total_amount ELSE 0 END), 0) AS overdue_amount
FROM public.purchase_orders po
LEFT JOIN public.vendors v ON v.id = po.vendor_id
LEFT JOIN public.rfqs r ON r.id = po.rfq_id
LEFT JOIN public.invoices i ON i.purchase_order_id = po.id
GROUP BY v.category, r.department
ORDER BY total_spend DESC;

COMMENT ON VIEW public.spending_summary_view IS 'Spending breakdown by category and department';

-- ============================================================
-- 4. APPROVAL STATISTICS VIEW
-- ============================================================
CREATE OR REPLACE VIEW public.approval_statistics_view AS
SELECT
    p.id AS approver_id,
    p.full_name AS approver_name,
    COUNT(a.id) AS total_reviews,
    COUNT(CASE WHEN a.decision = 'approved' THEN 1 END) AS approved_count,
    COUNT(CASE WHEN a.decision = 'rejected' THEN 1 END) AS rejected_count,
    COUNT(CASE WHEN a.decision = 'pending' THEN 1 END) AS pending_count,
    COUNT(CASE WHEN a.decision = 'deferred' THEN 1 END) AS deferred_count,
    CASE
        WHEN COUNT(CASE WHEN a.decision IN ('approved', 'rejected') THEN 1 END) > 0
        THEN ROUND(
            COUNT(CASE WHEN a.decision = 'approved' THEN 1 END)::NUMERIC
            / COUNT(CASE WHEN a.decision IN ('approved', 'rejected') THEN 1 END) * 100, 1
        )
        ELSE 0
    END AS approval_rate_pct,
    COALESCE(
        AVG(
            CASE WHEN a.approved_at IS NOT NULL
            THEN EXTRACT(EPOCH FROM (a.approved_at - a.created_at)) / 3600
            END
        ), 0
    ) AS avg_turnaround_hours
FROM public.profiles p
LEFT JOIN public.approvals a ON a.approver_id = p.id
WHERE p.role IN ('manager', 'admin')
GROUP BY p.id, p.full_name
ORDER BY total_reviews DESC;

COMMENT ON VIEW public.approval_statistics_view IS 'Approval workflow statistics by approver';

-- ============================================================
-- 5. DASHBOARD SUMMARY VIEW (Bonus)
-- ============================================================
CREATE OR REPLACE VIEW public.dashboard_summary_view AS
SELECT
    (SELECT COUNT(*) FROM public.vendors WHERE status = 'active') AS active_vendors,
    (SELECT COUNT(*) FROM public.vendors) AS total_vendors,
    (SELECT COUNT(*) FROM public.rfqs WHERE status = 'open') AS open_rfqs,
    (SELECT COUNT(*) FROM public.rfqs) AS total_rfqs,
    (SELECT COUNT(*) FROM public.quotations WHERE status = 'submitted') AS pending_quotations,
    (SELECT COUNT(*) FROM public.approvals WHERE decision = 'pending') AS pending_approvals,
    (SELECT COUNT(*) FROM public.purchase_orders WHERE status IN ('issued', 'acknowledged')) AS active_pos,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.purchase_orders) AS total_procurement_value,
    (SELECT COUNT(*) FROM public.invoices WHERE status = 'overdue') AS overdue_invoices,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.invoices WHERE status = 'overdue') AS overdue_amount,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.invoices WHERE status = 'paid') AS paid_amount;

COMMENT ON VIEW public.dashboard_summary_view IS 'High-level dashboard KPI summary';

-- ============================================================
-- ENABLE REALTIME for key tables
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.rfqs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;

-- ============================================================
-- END OF VIEWS
-- ============================================================
