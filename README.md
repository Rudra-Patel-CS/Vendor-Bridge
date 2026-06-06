# VendorBridge 🚀

### Procurement & Vendor Management ERP

VendorBridge is a modern Procurement & Vendor Management ERP designed to streamline procurement operations through a centralized platform. It enables organizations to manage vendors, create RFQs, collect quotations, process approvals, generate purchase orders, create invoices, and monitor procurement activities efficiently.

## 🌐 Live Demo

**Deployed Application:**
https://vendorbridge-gray.vercel.app

---

## 📌 Overview

VendorBridge simplifies procurement workflows by providing a structured and role-based system for managing vendor relationships and procurement processes.

The platform helps organizations:

* Manage vendor registrations and profiles
* Create and distribute RFQs (Request for Quotations)
* Receive and compare vendor quotations
* Process approval workflows
* Generate Purchase Orders (POs)
* Generate and manage invoices
* Send invoices via email
* Monitor procurement activities through analytics and reports

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* Secure Login & Signup
* Forgot Password
* Session Management
* Role-Based Access Control (RBAC)
* Protected Routes

### 📊 Dashboard

* Procurement Overview
* Active RFQs
* Pending Approvals
* Recent Purchase Orders
* Recent Invoices
* Analytics Cards

### 👥 Vendor Management

* Vendor Registration
* Vendor Categories
* GST Information
* Contact Management
* Vendor Status Tracking
* Search & Filtering

### 📝 RFQ Management

* Create RFQs
* Product & Service Details
* Quantity Management
* Deadline Tracking
* Vendor Assignment
* Document Attachments

### 💰 Quotation Management

* Vendor Quotation Submission
* Pricing Details
* Delivery Timelines
* Notes & Comments
* Editable Quotations

### ⚖️ Quotation Comparison

* Side-by-Side Comparison
* Price Comparison
* Delivery Timeline Analysis
* Vendor Rating Indicators
* Sorting & Filtering

### ✅ Approval Workflow

* Approve / Reject Requests
* Approval Remarks
* Workflow Tracking
* Status Monitoring

### 📦 Purchase Orders

* Auto-Generated PO Numbers
* Purchase Order Management
* Status Tracking

### 🧾 Invoice Management

* Invoice Generation
* Tax Calculations
* PDF Export
* Print Invoice
* Email Invoice

### 🔔 Notifications & Activity Logs

* RFQ Notifications
* Approval Alerts
* Invoice Updates
* Activity Timeline
* Audit Logs

### 📈 Reports & Analytics

* Vendor Performance Analytics
* Procurement Statistics
* Spending Analysis
* Monthly Procurement Trends
* Exportable Reports

---

## 👤 User Roles

### Admin

* Manage Users
* Manage Vendors
* View Analytics
* Full System Access

### Procurement Officer

* Create RFQs
* Manage Vendors
* Compare Quotations
* Generate Purchase Orders
* Generate Invoices

### Vendor

* View Assigned RFQs
* Submit Quotations
* Track RFQ Status
* View Purchase Orders

### Manager / Approver

* Approve Procurement Requests
* Reject Procurement Requests
* Monitor Procurement Workflow

---

## 🔄 Procurement Workflow

1. Procurement Officer creates an RFQ.
2. Vendors receive RFQ invitations.
3. Vendors submit quotations.
4. Quotations are compared.
5. Approval workflow is initiated.
6. Approved quotations generate Purchase Orders.
7. Invoices are generated from Purchase Orders.
8. Invoices can be printed or emailed.
9. Procurement activities are tracked through reports and analytics.

---

## 🏗️ Tech Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* ShadCN UI
* React Router
* React Hook Form
* TanStack Query

### Backend

* Node.js
* Express.js

### Database

* Supabase PostgreSQL

### Authentication

* Supabase Auth
* JWT

### Storage

* Supabase Storage

### Additional Tools

* Zod Validation
* Recharts
* PDF Generation
* Nodemailer

---

## 📁 Project Structure

```bash
VendorBridge/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── utils/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   └── config/
│
├── database/
│
├── docs/
│
└── README.md
```

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/your-username/vendorbridge.git
cd vendorbridge
```

### Install Frontend Dependencies

```bash
npm install
```

### Install Backend Dependencies

```bash
cd server
npm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

JWT_SECRET=

EMAIL_USER=
EMAIL_PASSWORD=
```

### Start Development Server

```bash
npm run dev
```

---

## 🔒 Security Features

* Role-Based Access Control
* Protected Routes
* Secure Authentication
* JWT Sessions
* Input Validation
* Supabase Row Level Security (RLS)

---

## 📌 Future Enhancements

* AI Vendor Recommendation
* Vendor Risk Analysis
* Procurement Assistant Chatbot
* Predictive Procurement Analytics
* Mobile Application
* Multi-Organization Support

---

## 🤝 Contributors

Developed as part of a Hackathon Project.

Contributions, feedback, and suggestions are welcome.
## 👥 Our Team

* **Prince Patel**
* **Rudra Patel**
* **Kaushal Patel**
* **Manthan Joshi**

