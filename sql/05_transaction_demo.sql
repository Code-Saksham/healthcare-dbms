-- ============================================================
-- 05_transaction_demo.sql : Transaction Control (ACID Demo)
-- ============================================================
-- Demonstrates: SAVEPOINT, ROLLBACK TO SAVEPOINT, COMMIT
-- ACID Properties: Atomicity, Consistency, Isolation, Durability
-- ============================================================

-- Scenario: Register a new patient, book appointment,
--           then attempt invalid bill -> rollback partial work

BEGIN
    DBMS_OUTPUT.PUT_LINE('=== Transaction Demo: Healthcare System ===');
END;
/

-- Step 1: Insert a new test patient
INSERT INTO PATIENT (Patient_ID, Name, Age, Gender, Contact, Address)
VALUES ('DEMO01', 'Arjun Testpatient', 30, 'Male', '9000000001', 'Demo Street, Patiala');

SAVEPOINT after_patient;
DBMS_OUTPUT.PUT_LINE('SAVEPOINT: Patient inserted (DEMO01).');

-- Step 2: Insert a test doctor
INSERT INTO DOCTOR (Doctor_ID, Name, Specialization, Contact)
VALUES ('DEMD01', 'Dr. Demo Doctor', 'General Medicine', '9000000002');

SAVEPOINT after_doctor;
DBMS_OUTPUT.PUT_LINE('SAVEPOINT: Doctor inserted (DEMD01).');

-- Step 3: Book appointment
INSERT INTO APPOINTMENT (App_ID, Patient_ID, Doctor_ID, App_Date, Status)
VALUES ('DEMA01', 'DEMO01', 'DEMD01', SYSDATE, 'Scheduled');

SAVEPOINT after_appointment;
DBMS_OUTPUT.PUT_LINE('SAVEPOINT: Appointment booked (DEMA01).');

-- Step 4: Attempt to insert a TREATMENT
INSERT INTO TREATMENT (Treat_ID, App_ID, Diagnosis, Prescription, Disease_Type)
VALUES ('DEMT01', 'DEMA01', 'Common Cold', 'Paracetamol 500mg', 'Infectious Disease');

SAVEPOINT after_treatment;
DBMS_OUTPUT.PUT_LINE('SAVEPOINT: Treatment inserted (DEMT01).');

-- Step 5: Attempt INVALID bill (amount = -500 -> violates constraint)
-- In a real scenario this would raise an exception.
-- We simulate it with ROLLBACK TO SAVEPOINT.
DBMS_OUTPUT.PUT_LINE('Simulating invalid bill entry (negative amount)...');
ROLLBACK TO SAVEPOINT after_treatment;
DBMS_OUTPUT.PUT_LINE('ROLLBACK TO after_treatment: Invalid bill rolled back.');

-- Step 6: Insert a VALID bill
INSERT INTO BILL (Bill_ID, Treat_ID, Total_Amount)
VALUES ('DEMB01', 'DEMT01', 1500.00);

INSERT INTO PAYMENT (Payment_ID, Bill_ID, Payment_Date, Mode, Status)
VALUES ('DEMP01', 'DEMB01', SYSDATE, 'Cash', 'Paid');

DBMS_OUTPUT.PUT_LINE('Valid bill (DEMB01) and payment (DEMP01) inserted.');

-- Commit the full valid transaction
COMMIT;
DBMS_OUTPUT.PUT_LINE('COMMIT: Full transaction committed successfully.');

-- Verify the data
SELECT 'Patient'     AS Entity, Patient_ID AS ID, Name FROM PATIENT     WHERE Patient_ID = 'DEMO01'
UNION ALL
SELECT 'Doctor',       Doctor_ID, Name          FROM DOCTOR       WHERE Doctor_ID  = 'DEMD01'
UNION ALL
SELECT 'Appointment',  App_ID,    Status        FROM APPOINTMENT  WHERE App_ID     = 'DEMA01'
UNION ALL
SELECT 'Treatment',    Treat_ID,  Diagnosis     FROM TREATMENT    WHERE Treat_ID   = 'DEMT01'
UNION ALL
SELECT 'Bill',         Bill_ID,   TO_CHAR(Total_Amount) FROM BILL WHERE Bill_ID    = 'DEMB01';

-- Cleanup demo data (optional - comment out to keep)
-- DELETE FROM PAYMENT    WHERE Payment_ID = 'DEMP01';
-- DELETE FROM BILL       WHERE Bill_ID    = 'DEMB01';
-- DELETE FROM TREATMENT  WHERE Treat_ID   = 'DEMT01';
-- DELETE FROM APPOINTMENT WHERE App_ID   = 'DEMA01';
-- DELETE FROM DOCTOR     WHERE Doctor_ID  = 'DEMD01';
-- DELETE FROM PATIENT    WHERE Patient_ID = 'DEMO01';
-- COMMIT;

PROMPT Transaction demo complete.
