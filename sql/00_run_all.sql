-- ============================================================
-- HealthCare Data Management System
-- Master Runner Script
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
