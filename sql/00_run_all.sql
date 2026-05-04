-- ============================================================
-- HealthCare Data Management System
-- Master Runner Script
-- UCS310 - Database Management Systems
-- Thapar Institute of Engineering and Technology
-- Authors: Saksham Raj (1024030713) | Siddhant Mishra (1024030710)
-- Submitted to: Ms. Paramveer Sidhu
-- Session: Jan-May 2026
-- ============================================================
-- Run this file in Oracle SQL Developer to execute all scripts:
--   @sql/00_run_all.sql

PROMPT ==> Step 1: Creating Schema...
@sql/01_schema.sql

PROMPT ==> Step 2: Importing Seed Data...
@sql/02_seed_data.sql

PROMPT ==> Step 3: Deploying PL/SQL Components...
@sql/03_plsql.sql

PROMPT ==> Step 4: Running Analytics Queries...
@sql/04_analytics_queries.sql

PROMPT ==> Step 5: Transaction Demo...
@sql/05_transaction_demo.sql

PROMPT ==> All steps complete.
