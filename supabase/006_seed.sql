-- ============================================================
-- VendorBridge ERP — 006_seed.sql
-- Test/Demo Seed Data
-- Run AFTER all other SQL files
-- NOTE: Run as superuser/service_role to bypass RLS
-- ============================================================

-- ============================================================
-- IMPORTANT: Replace these UUIDs with actual auth.users IDs
-- after creating users in Supabase Auth dashboard
-- ============================================================

-- Create placeholder profiles (these would normally be created
-- by the auth trigger when users sign up)
-- Use these IDs as reference throughout the seed data

DO $$
DECLARE
    admin_id UUID := '00000000-0000-0000-0000-000000000001';
    procurement_id UUID := '00000000-0000-0000-0000-000000000002';
    manager_id UUID := '00000000-0000-0000-0000-000000000003';
    vendor_user_id UUID := '00000000-0000-0000-0000-000000000004';

    -- Vendor IDs
    v1 UUID; v2 UUID; v3 UUID; v4 UUID; v5 UUID;
    v6 UUID; v7 UUID; v8 UUID; v9 UUID; v10 UUID;

    -- RFQ IDs
    rfq1 UUID; rfq2 UUID; rfq3 UUID; rfq4 UUID; rfq5 UUID;

    -- RFQ Item IDs
    ri1 UUID; ri2 UUID; ri3 UUID; ri4 UUID; ri5 UUID;
    ri6 UUID; ri7 UUID; ri8 UUID; ri9 UUID; ri10 UUID;

    -- Quotation IDs
    q1 UUID; q2 UUID; q3 UUID; q4 UUID; q5 UUID;
    q6 UUID; q7 UUID; q8 UUID; q9 UUID; q10 UUID;

    -- PO IDs
    po1 UUID; po2 UUID; po3 UUID;

    -- Invoice IDs
    inv1 UUID; inv2 UUID; inv3 UUID;

BEGIN

-- ============================================================
-- PROFILES (4 users)
-- ============================================================
INSERT INTO public.profiles (id, email, full_name, phone, role, is_active) VALUES
    (admin_id, 'rohit@vendorbridge.com', 'Rohit Mehta', '+91 99100 44321', 'admin', TRUE),
    (procurement_id, 'priya@vendorbridge.com', 'Priya Sharma', '+91 98200 55678', 'procurement_officer', TRUE),
    (manager_id, 'amit@vendorbridge.com', 'Amit Verma', '+91 99450 66789', 'manager', TRUE),
    (vendor_user_id, 'meera@technova.io', 'Meera Iyer', '+91 99450 88321', 'vendor', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VENDORS (10 vendors)
-- ============================================================
INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'Apex Industrial Supplies', 'Rajesh Kumar', 'rajesh@apexsupplies.com', '+91 98200 11234', '27AABCA1234F1Z5', 'AABCA1234F', 'Plot 14, MIDC, Andheri East', 'Mumbai', 'Maharashtra', 'India', 'Raw Materials', 4.8, 'active', 'Reliable supplier for bulk metals', procurement_id)
RETURNING id INTO v1;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'TechNova Components', 'Meera Iyer', 'meera@technova.io', '+91 99450 88321', '29AAGCT5678P1Z2', 'AAGCT5678P', 'No 9, Electronic City Phase 1', 'Bengaluru', 'Karnataka', 'India', 'Electronics', 4.6, 'active', 'ISO certified electronics supplier', procurement_id)
RETURNING id INTO v2;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'Coastal Logistics Pvt Ltd', 'David Fernandes', 'david@coastallog.com', '+91 90030 45612', '33AACCF9012K1Z8', 'AACCF9012K', '12 Harbour Road', 'Chennai', 'Tamil Nadu', 'India', 'Logistics', 4.2, 'active', 'Pan-India logistics coverage', procurement_id)
RETURNING id INTO v3;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'GreenPack Packaging', 'Sunita Rao', 'sunita@greenpack.com', '+91 98980 23145', '24AAECG3456M1Z1', 'AAECG3456M', 'Survey 88, GIDC Vatva', 'Ahmedabad', 'Gujarat', 'India', 'Packaging', 3.9, 'pending', 'Eco-friendly packaging solutions', procurement_id)
RETURNING id INTO v4;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'PrecisionTools Mfg', 'Arjun Malhotra', 'arjun@precisiontools.in', '+91 99100 67890', '06AAJCP7890N1Z4', 'AAJCP7890N', 'Sector 37, Industrial Area', 'Gurugram', 'Haryana', 'India', 'Machinery', 4.5, 'active', 'CNC and precision tooling specialists', procurement_id)
RETURNING id INTO v5;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'OfficePro Solutions', 'Fatima Sheikh', 'fatima@officepro.com', '+91 91540 33221', '36AAKCO2345Q1Z9', 'AAKCO2345Q', 'Banjara Hills Road 3', 'Hyderabad', 'Telangana', 'India', 'Office Supplies', 4.1, 'inactive', 'Office and stationery supplier', procurement_id)
RETURNING id INTO v6;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'SteelLine Fabricators', 'Vikram Singh', 'vikram@steelline.in', '+91 98290 55667', '08AALCS6789R1Z3', 'AALCS6789R', 'RIICO Industrial Area', 'Jaipur', 'Rajasthan', 'India', 'Raw Materials', 4.7, 'active', 'Steel and metal fabrication', procurement_id)
RETURNING id INTO v7;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'BrightChem Distributors', 'Lakshmi Nair', 'lakshmi@brightchem.com', '+91 90720 11883', '32AAMCB1234S1Z6', 'AAMCB1234S', 'Kalamassery Industrial Estate', 'Kochi', 'Kerala', 'India', 'Chemicals', 4.0, 'active', 'Industrial chemical distributor', procurement_id)
RETURNING id INTO v8;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'SafeGuard PPE India', 'Anil Kapoor', 'anil@safeguardppe.in', '+91 88000 99221', '27AAFCS3456T1Z7', 'AAFCS3456T', '45 Mahape MIDC', 'Navi Mumbai', 'Maharashtra', 'India', 'Safety Equipment', 4.3, 'active', 'PPE and safety equipment manufacturer', procurement_id)
RETURNING id INTO v9;

INSERT INTO public.vendors (id, company_name, contact_person, email, phone, gst_number, pan_number, address, city, state, country, category, rating, status, notes, created_by)
VALUES
    (uuid_generate_v4(), 'QuickShip Couriers', 'Ravi Teja', 'ravi@quickship.co.in', '+91 77990 44556', '36AAECQ7890U1Z2', 'AAECQ7890U', 'Kondapur Tech Park', 'Hyderabad', 'Telangana', 'India', 'Logistics', 3.8, 'active', 'Express courier and last-mile delivery', procurement_id)
RETURNING id INTO v10;

-- ============================================================
-- RFQS (5 RFQs)
-- ============================================================
INSERT INTO public.rfqs (id, title, description, department, procurement_type, priority, budget, currency, deadline, required_delivery_date, status, created_by)
VALUES
    (uuid_generate_v4(), 'Aluminium Sheets Q3 Procurement', 'Bulk purchase of 2mm aluminium sheets for Q3 production', 'Manufacturing', 'goods', 'high', 1250000, 'INR', '2026-06-20', '2026-07-05', 'open', procurement_id)
RETURNING id INTO rfq1;

INSERT INTO public.rfqs (id, title, description, department, procurement_type, priority, budget, currency, deadline, required_delivery_date, status, created_by)
VALUES
    (uuid_generate_v4(), 'PCB Components Bulk Order', 'PCB assembly kits for IoT product line', 'Engineering', 'goods', 'high', 860000, 'INR', '2026-06-18', '2026-07-02', 'open', procurement_id)
RETURNING id INTO rfq2;

INSERT INTO public.rfqs (id, title, description, department, procurement_type, priority, budget, currency, deadline, required_delivery_date, status, created_by)
VALUES
    (uuid_generate_v4(), 'Warehouse Logistics Contract', 'Annual freight and warehousing service contract', 'Operations', 'services', 'medium', 540000, 'INR', '2026-06-12', '2026-06-25', 'closed', procurement_id)
RETURNING id INTO rfq3;

INSERT INTO public.rfqs (id, title, description, department, procurement_type, priority, budget, currency, deadline, required_delivery_date, status, created_by)
VALUES
    (uuid_generate_v4(), 'Eco Packaging Materials', 'Corrugated boxes and biodegradable packaging', 'Logistics', 'goods', 'medium', 320000, 'INR', '2026-06-25', '2026-07-10', 'open', procurement_id)
RETURNING id INTO rfq4;

INSERT INTO public.rfqs (id, title, description, department, procurement_type, priority, budget, currency, deadline, required_delivery_date, status, created_by, approved_by)
VALUES
    (uuid_generate_v4(), 'CNC Machine Spare Parts', 'Spindle assemblies and replacement tooling for CNC machines', 'Manufacturing', 'goods', 'low', 980000, 'INR', '2026-06-30', '2026-07-15', 'approved', procurement_id, manager_id)
RETURNING id INTO rfq5;

-- ============================================================
-- RFQ ITEMS (2 items per RFQ)
-- ============================================================
INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq1, 'Aluminium Sheet 2mm', 'Grade 6061, 2mm thickness', 5000, 'kg', 200, '2026-07-05')
RETURNING id INTO ri1;
INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq1, 'Aluminium Sheet 4mm', 'Grade 6061, 4mm thickness', 2000, 'kg', 250, '2026-07-05')
RETURNING id INTO ri2;

INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq2, 'PCB Assembly Kit - Type A', 'Standard IoT board v3.2', 800, 'units', 450, '2026-07-02')
RETURNING id INTO ri3;
INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq2, 'PCB Assembly Kit - Type B', 'Advanced IoT board v3.2 Pro', 400, 'units', 780, '2026-07-02')
RETURNING id INTO ri4;

INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq3, 'Freight Service - Mumbai to Delhi', 'Monthly freight contract', 12, 'months', 30000, '2026-06-25')
RETURNING id INTO ri5;
INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq3, 'Warehousing Space', '5000 sq ft warehouse lease', 12, 'months', 15000, '2026-06-25')
RETURNING id INTO ri6;

INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq4, 'Corrugated Boxes (Large)', '24x18x12 inch, 5-ply', 15000, 'units', 12, '2026-07-10')
RETURNING id INTO ri7;
INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq4, 'Corrugated Boxes (Medium)', '18x12x8 inch, 3-ply', 5000, 'units', 8, '2026-07-10')
RETURNING id INTO ri8;

INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq5, 'CNC Spindle Assembly', 'BT40 Spindle, 24000 RPM', 20, 'units', 35000, '2026-07-15')
RETURNING id INTO ri9;
INSERT INTO public.rfq_items (id, rfq_id, item_name, description, quantity, unit, estimated_price, expected_delivery)
VALUES (uuid_generate_v4(), rfq5, 'Tool Holder Set', 'ER32 collet set with holders', 15, 'sets', 8000, '2026-07-15')
RETURNING id INTO ri10;

-- ============================================================
-- RFQ VENDOR INVITATIONS
-- ============================================================
INSERT INTO public.rfq_vendors (rfq_id, vendor_id, invitation_status, sent_at) VALUES
    (rfq1, v1, 'accepted', now() - INTERVAL '5 days'),
    (rfq1, v7, 'accepted', now() - INTERVAL '5 days'),
    (rfq1, v5, 'accepted', now() - INTERVAL '5 days'),
    (rfq1, v8, 'accepted', now() - INTERVAL '5 days'),
    (rfq2, v2, 'accepted', now() - INTERVAL '4 days'),
    (rfq2, v5, 'sent', now() - INTERVAL '4 days'),
    (rfq3, v3, 'accepted', now() - INTERVAL '10 days'),
    (rfq3, v10, 'accepted', now() - INTERVAL '10 days'),
    (rfq4, v4, 'sent', now() - INTERVAL '2 days'),
    (rfq4, v8, 'sent', now() - INTERVAL '2 days'),
    (rfq5, v5, 'accepted', now() - INTERVAL '1 day'),
    (rfq5, v7, 'accepted', now() - INTERVAL '1 day');

-- ============================================================
-- QUOTATIONS (10 quotations)
-- ============================================================
INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq1, v1, 1180000, 12, 'Includes free transport within Maharashtra.', 'shortlisted', now() - INTERVAL '4 days')
RETURNING id INTO q1;
INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq1, v7, 1095000, 18, 'Bulk discount applied. Payment 30% advance.', 'submitted', now() - INTERVAL '3 days')
RETURNING id INTO q2;
INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq1, v5, 1245000, 9, 'Fastest delivery, premium grade material.', 'submitted', now() - INTERVAL '3 days')
RETURNING id INTO q3;
INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq1, v8, 1320000, 15, 'Standard terms, GST extra.', 'rejected', now() - INTERVAL '5 days')
RETURNING id INTO q4;

INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq2, v2, 798000, 14, 'ISO certified components with 2 year warranty.', 'shortlisted', now() - INTERVAL '3 days')
RETURNING id INTO q5;
INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq2, v5, 845000, 10, 'Premium components, faster delivery.', 'submitted', now() - INTERVAL '2 days')
RETURNING id INTO q6;

INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq3, v3, 495000, 5, 'Pan-India coverage included.', 'accepted', now() - INTERVAL '8 days')
RETURNING id INTO q7;
INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq3, v10, 520000, 7, 'Express delivery option available.', 'rejected', now() - INTERVAL '9 days')
RETURNING id INTO q8;

INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq5, v5, 820000, 14, 'OEM-grade spindle assemblies with warranty.', 'accepted', now() - INTERVAL '1 day')
RETURNING id INTO q9;
INSERT INTO public.quotations (id, rfq_id, vendor_id, total_amount, delivery_days, notes, status, submitted_at)
VALUES (uuid_generate_v4(), rfq5, v7, 890000, 21, 'Custom machined to spec. 45-day warranty.', 'submitted', now() - INTERVAL '1 day')
RETURNING id INTO q10;

-- ============================================================
-- QUOTATION ITEMS
-- ============================================================
INSERT INTO public.quotation_items (quotation_id, rfq_item_id, unit_price, quantity) VALUES
    (q1, ri1, 190, 5000), (q1, ri2, 240, 2000),
    (q2, ri1, 175, 5000), (q2, ri2, 235, 2000),
    (q3, ri1, 205, 5000), (q3, ri2, 260, 2000),
    (q4, ri1, 210, 5000), (q4, ri2, 275, 2000),
    (q5, ri3, 430, 800), (q5, ri4, 755, 400),
    (q6, ri3, 465, 800), (q6, ri4, 790, 400),
    (q7, ri5, 28000, 12), (q7, ri6, 13250, 12),
    (q8, ri5, 30000, 12), (q8, ri6, 14000, 12),
    (q9, ri9, 33000, 20), (q9, ri10, 7600, 15),
    (q10, ri9, 36000, 20), (q10, ri10, 8200, 15);

-- ============================================================
-- APPROVALS
-- ============================================================
INSERT INTO public.approvals (rfq_id, approver_id, decision, remarks, approved_at) VALUES
    (rfq5, manager_id, 'approved', 'Budget within limits. Approved for procurement.', now() - INTERVAL '1 day'),
    (rfq1, manager_id, 'pending', NULL, NULL),
    (rfq2, manager_id, 'pending', NULL, NULL);

-- ============================================================
-- PURCHASE ORDERS (3 POs)
-- ============================================================
INSERT INTO public.purchase_orders (id, rfq_id, vendor_id, quotation_id, total_amount, status, issued_date, created_by)
VALUES (uuid_generate_v4(), rfq1, v1, q1, 1180000, 'issued', '2026-06-05', procurement_id)
RETURNING id INTO po1;

INSERT INTO public.purchase_orders (id, rfq_id, vendor_id, quotation_id, total_amount, status, issued_date, created_by)
VALUES (uuid_generate_v4(), rfq2, v2, q5, 798000, 'issued', '2026-06-04', procurement_id)
RETURNING id INTO po2;

INSERT INTO public.purchase_orders (id, rfq_id, vendor_id, quotation_id, total_amount, status, issued_date, created_by)
VALUES (uuid_generate_v4(), rfq3, v3, q7, 495000, 'fulfilled', '2026-05-28', procurement_id)
RETURNING id INTO po3;

-- ============================================================
-- PURCHASE ORDER ITEMS
-- ============================================================
INSERT INTO public.purchase_order_items (purchase_order_id, item_name, quantity, unit_price) VALUES
    (po1, 'Aluminium Sheet 2mm (Grade 6061)', 5000, 190),
    (po1, 'Aluminium Sheet 4mm (Grade 6061)', 2000, 240),
    (po2, 'PCB Assembly Kit - Type A (v3.2)', 800, 430),
    (po2, 'PCB Assembly Kit - Type B (v3.2 Pro)', 400, 755),
    (po3, 'Freight Service - Mumbai to Delhi (Monthly)', 12, 28000),
    (po3, 'Warehousing Space (5000 sq ft)', 12, 13250);

-- ============================================================
-- INVOICES (3 invoices)
-- ============================================================
INSERT INTO public.invoices (id, purchase_order_id, vendor_id, subtotal, tax_amount, total_amount, invoice_date, due_date, status, created_by)
VALUES (uuid_generate_v4(), po2, v2, 798000, 143640, 941640, '2026-06-05', '2026-06-20', 'pending', procurement_id)
RETURNING id INTO inv1;

INSERT INTO public.invoices (id, purchase_order_id, vendor_id, subtotal, tax_amount, total_amount, invoice_date, due_date, status, created_by)
VALUES (uuid_generate_v4(), po3, v3, 495000, 89100, 584100, '2026-05-29', '2026-06-13', 'paid', procurement_id)
RETURNING id INTO inv2;

INSERT INTO public.invoices (id, purchase_order_id, vendor_id, subtotal, tax_amount, total_amount, invoice_date, due_date, status, created_by)
VALUES (uuid_generate_v4(), po1, v1, 1180000, 212400, 1392400, '2026-06-06', '2026-06-21', 'pending', procurement_id)
RETURNING id INTO inv3;

-- ============================================================
-- NOTIFICATIONS (sample)
-- ============================================================
INSERT INTO public.notifications (user_id, title, message, type, is_read) VALUES
    (procurement_id, 'New quotation received', 'SteelLine Fabricators submitted a quote for RFQ Aluminium Sheets.', 'rfq', FALSE),
    (procurement_id, 'Approval requested', 'PO for Aluminium Sheets (₹11.8L) is awaiting approval.', 'approval', FALSE),
    (procurement_id, 'Invoice overdue alert', 'Invoice from SteelLine Fabricators is approaching due date.', 'invoice', FALSE),
    (manager_id, 'New approval request', 'RFQ for Aluminium Sheets Q3 requires your approval.', 'approval', FALSE),
    (manager_id, 'New approval request', 'RFQ for PCB Components requires your approval.', 'approval', FALSE),
    (admin_id, 'System update', 'VendorBridge ERP v2.0 is now live.', 'info', TRUE),
    (vendor_user_id, 'New RFQ invitation', 'You have been invited to submit a quotation for PCB Components.', 'rfq', FALSE),
    (vendor_user_id, 'Quotation shortlisted', 'Your quotation for PCB Components has been shortlisted.', 'rfq', FALSE);

-- ============================================================
-- ACTIVITY LOGS (sample)
-- ============================================================
INSERT INTO public.activity_logs (user_id, action, module, details) VALUES
    (procurement_id, 'Created PO-2026-0001', 'Purchase Orders', '{"amount": 1180000, "vendor": "Apex Industrial Supplies"}'::jsonb),
    (manager_id, 'Approved RFQ-2026-0005', 'Approvals', '{"rfq_title": "CNC Machine Spare Parts"}'::jsonb),
    (procurement_id, 'Generated INV-2026-0001', 'Invoices', '{"amount": 941640, "vendor": "TechNova Components"}'::jsonb),
    (procurement_id, 'Added vendor GreenPack Packaging', 'Vendors', '{"vendor_status": "pending"}'::jsonb),
    (admin_id, 'Updated role permissions', 'Admin', '{"role": "procurement_officer", "permissions_added": 2}'::jsonb),
    (admin_id, 'Deactivated user Sandeep Joshi', 'User Management', '{"reason": "Inactive for 30 days"}'::jsonb);

END $$;

-- ============================================================
-- END OF SEED DATA
-- ============================================================
