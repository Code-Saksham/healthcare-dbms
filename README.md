# HealthCare Data Management System

**UCS310 — Database Management Systems**  
**Thapar Institute of Engineering and Technology, Patiala**  
**Session: Jan–May 2026**

**By:** Saksham Raj (1024030713) & Siddhant Mishra (1024030710)  
**Submitted to:** Ms. Paramveer Sidhu

---

## Overview

A backend-first Oracle SQL/PL-SQL project with a React visualization dashboard for healthcare data management. The system manages patient records, doctor information, appointments, treatments, billing, and disease statistics.

**Website:** https://code-saksham.github.io/healthcare-dbms/

## Implemented DBMS Modules

### 1. Schema Design (3NF)
- 6 normalized tables: PATIENT, DOCTOR, APPOINTMENT, TREATMENT, BILL, PAYMENT
- Primary keys, foreign keys, CHECK constraints, UNIQUE constraints
- 7 indexes for query optimization
- 4 views for simplified reporting

### 2. PL/SQL Components
- **Triggers:** Auto-complete appointments on treatment entry, bill amount validation
- **Functions:** Patient total cost calculation, doctor revenue calculation
- **Procedures:** Patient registration, appointment booking (with exception handling)
- **Cursors:** Patient appointment listing, disease summary reporting

### 3. Transaction Management
- SAVEPOINT, ROLLBACK TO SAVEPOINT, COMMIT
- ACID compliance demonstration

### 4. SQL Analytics
- Top diseases, doctor revenue leaderboard, specialization analytics
- Payment mode distribution, monthly appointment trends, unpaid bills

## Project Structure

```
healthcare_dbms_project/
  sql/
    00_run_all.sql               Master runner
    01_schema.sql                Tables, constraints, indexes, views
    02_seed_data.sql             1000 patients, 50 doctors, 2000+ appointments
    03_plsql.sql                 Triggers, functions, procedures, cursors
    04_analytics_queries.sql     SQL analytics queries
    05_transaction_demo.sql      Transaction demo (SAVEPOINT/ROLLBACK/COMMIT)
  src/
    main.jsx                     React dashboard app
    components.jsx               Shared UI components
    styles.css                   Dashboard styling
    data/healthData.js           Generated frontend data
  scripts/
    generate_healthcare_data.py  Data generator script
  docs/                          Documentation
```

## Frontend Dashboard

Three role-based panels:
- **Admin Panel:** Full system overview, all patients/doctors/appointments, disease stats, revenue analytics
- **Doctor Panel:** Select any doctor to view their profile, patient list, and appointments
- **Patient Panel:** Select any patient to view their info, appointments, and assigned doctors

## Run Oracle SQL

```sql
@sql/00_run_all.sql
```

## Run Frontend Locally

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
npm run build
```

## Data

- 1000 patients (Indian names)
- 50 doctors across 10 specializations
- 2000+ appointments
- 1700+ treatments with diagnoses and prescriptions
- Full billing and payment records
