-- ============================================================
-- VendorBridge ERP — 004_storage.sql
-- Supabase Storage Buckets & Policies
-- Run AFTER 003_rls.sql
-- ============================================================

-- ============================================================
-- CREATE STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('rfq-documents', 'rfq-documents', FALSE, 10485760,
     ARRAY['application/pdf','image/png','image/jpeg','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),

    ('vendor-documents', 'vendor-documents', FALSE, 10485760,
     ARRAY['application/pdf','image/png','image/jpeg','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']),

    ('quotation-files', 'quotation-files', FALSE, 10485760,
     ARRAY['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),

    ('invoice-pdfs', 'invoice-pdfs', FALSE, 10485760,
     ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES: rfq-documents
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_rfq_docs_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'rfq-documents'
        AND public.get_user_role() = 'admin'
    );

-- Procurement Officer: full access
CREATE POLICY "procurement_rfq_docs_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'rfq-documents'
        AND public.get_user_role() = 'procurement_officer'
    );

-- Manager: read only
CREATE POLICY "manager_rfq_docs_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'rfq-documents'
        AND public.get_user_role() = 'manager'
    );

-- Vendor: read documents for assigned RFQs
CREATE POLICY "vendor_rfq_docs_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'rfq-documents'
        AND public.get_user_role() = 'vendor'
    );

-- ============================================================
-- STORAGE POLICIES: vendor-documents
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_vendor_docs_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'vendor-documents'
        AND public.get_user_role() = 'admin'
    );

-- Procurement Officer: full access
CREATE POLICY "procurement_vendor_docs_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'vendor-documents'
        AND public.get_user_role() = 'procurement_officer'
    );

-- Manager: read only
CREATE POLICY "manager_vendor_docs_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'vendor-documents'
        AND public.get_user_role() = 'manager'
    );

-- Vendor: upload own documents (path must start with their user id)
CREATE POLICY "vendor_upload_own_docs" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'vendor-documents'
        AND public.get_user_role() = 'vendor'
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

CREATE POLICY "vendor_read_own_docs" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'vendor-documents'
        AND public.get_user_role() = 'vendor'
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

-- ============================================================
-- STORAGE POLICIES: quotation-files
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_quotation_files_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'quotation-files'
        AND public.get_user_role() = 'admin'
    );

-- Procurement Officer: read access
CREATE POLICY "procurement_quotation_files_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'quotation-files'
        AND public.get_user_role() = 'procurement_officer'
    );

-- Vendor: upload and read own quotation files
CREATE POLICY "vendor_upload_quotation_files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'quotation-files'
        AND public.get_user_role() = 'vendor'
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

CREATE POLICY "vendor_read_own_quotation_files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'quotation-files'
        AND public.get_user_role() = 'vendor'
        AND (storage.foldername(name))[1] = auth.uid()::TEXT
    );

-- Manager: read only
CREATE POLICY "manager_quotation_files_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'quotation-files'
        AND public.get_user_role() = 'manager'
    );

-- ============================================================
-- STORAGE POLICIES: invoice-pdfs
-- ============================================================

-- Admin: full access
CREATE POLICY "admin_invoice_pdfs_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'invoice-pdfs'
        AND public.get_user_role() = 'admin'
    );

-- Procurement Officer: full access
CREATE POLICY "procurement_invoice_pdfs_all" ON storage.objects
    FOR ALL USING (
        bucket_id = 'invoice-pdfs'
        AND public.get_user_role() = 'procurement_officer'
    );

-- Manager: read only
CREATE POLICY "manager_invoice_pdfs_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'invoice-pdfs'
        AND public.get_user_role() = 'manager'
    );

-- Vendor: read own invoice PDFs
CREATE POLICY "vendor_invoice_pdfs_read" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'invoice-pdfs'
        AND public.get_user_role() = 'vendor'
    );

-- ============================================================
-- END OF STORAGE
-- ============================================================
