-- ============================================================
-- 01_schema.sql : Tables, Constraints, Indexes, Views
-- ============================================================

-- Drop existing tables in reverse dependency order
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE PAYMENT CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE BILL CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE TREATMENT CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE APPOINTMENT CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE DOCTOR CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE PATIENT CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

-- ============================================================
-- Table: PATIENT
-- ============================================================
CREATE TABLE PATIENT (
    Patient_ID  VARCHAR2(10)  NOT NULL,
    Name        VARCHAR2(100) NOT NULL,
    Age         NUMBER(3)     CONSTRAINT chk_age CHECK (Age > 0 AND Age < 150),
    Gender      VARCHAR2(10)  CONSTRAINT chk_gender CHECK (Gender IN ('Male', 'Female', 'Other')),
    Contact     VARCHAR2(15),
    Address     VARCHAR2(250),
    CONSTRAINT PK_PATIENT PRIMARY KEY (Patient_ID)
);

-- ============================================================
-- Table: DOCTOR
-- ============================================================
CREATE TABLE DOCTOR (
    Doctor_ID       VARCHAR2(10)  NOT NULL,
    Name            VARCHAR2(100) NOT NULL,
    Specialization  VARCHAR2(100),
    Contact         VARCHAR2(15),
    CONSTRAINT PK_DOCTOR PRIMARY KEY (Doctor_ID)
);

-- ============================================================
-- Table: APPOINTMENT
-- ============================================================
CREATE TABLE APPOINTMENT (
    App_ID      VARCHAR2(10)  NOT NULL,
    Patient_ID  VARCHAR2(10)  NOT NULL,
    Doctor_ID   VARCHAR2(10)  NOT NULL,
    App_Date    DATE          NOT NULL,
    Status      VARCHAR2(20)  DEFAULT 'Scheduled'
                CONSTRAINT chk_app_status CHECK (Status IN ('Scheduled','Completed','Cancelled')),
    CONSTRAINT PK_APPOINTMENT    PRIMARY KEY (App_ID),
    CONSTRAINT FK_APP_PATIENT    FOREIGN KEY (Patient_ID) REFERENCES PATIENT(Patient_ID),
    CONSTRAINT FK_APP_DOCTOR     FOREIGN KEY (Doctor_ID)  REFERENCES DOCTOR(Doctor_ID)
);

-- ============================================================
-- Table: TREATMENT
-- ============================================================
CREATE TABLE TREATMENT (
    Treat_ID        VARCHAR2(10)   NOT NULL,
    App_ID          VARCHAR2(10)   NOT NULL,
    Diagnosis       VARCHAR2(300),
    Prescription    VARCHAR2(300),
    Disease_Type    VARCHAR2(100),
    CONSTRAINT PK_TREATMENT   PRIMARY KEY (Treat_ID),
    CONSTRAINT FK_TREAT_APP   FOREIGN KEY (App_ID) REFERENCES APPOINTMENT(App_ID),
    CONSTRAINT UQ_TREAT_APP   UNIQUE (App_ID)
);

-- ============================================================
-- Table: BILL
-- ============================================================
CREATE TABLE BILL (
    Bill_ID       VARCHAR2(10)   NOT NULL,
    Treat_ID      VARCHAR2(10)   NOT NULL,
    Total_Amount  NUMBER(10,2)   CONSTRAINT chk_amount CHECK (Total_Amount >= 0),
    CONSTRAINT PK_BILL       PRIMARY KEY (Bill_ID),
    CONSTRAINT FK_BILL_TREAT FOREIGN KEY (Treat_ID) REFERENCES TREATMENT(Treat_ID),
    CONSTRAINT UQ_BILL_TREAT UNIQUE (Treat_ID)
);

-- ============================================================
-- Table: PAYMENT
-- ============================================================
CREATE TABLE PAYMENT (
    Payment_ID    VARCHAR2(10)  NOT NULL,
    Bill_ID       VARCHAR2(10)  NOT NULL,
    Payment_Date  DATE          DEFAULT SYSDATE,
    Mode          VARCHAR2(20)  CONSTRAINT chk_mode CHECK (Mode IN ('Cash','Card','Online','Insurance')),
    Status        VARCHAR2(20)  DEFAULT 'Pending'
                  CONSTRAINT chk_pay_status CHECK (Status IN ('Pending','Paid','Failed')),
    CONSTRAINT PK_PAYMENT    PRIMARY KEY (Payment_ID),
    CONSTRAINT FK_PAY_BILL   FOREIGN KEY (Bill_ID) REFERENCES BILL(Bill_ID),
    CONSTRAINT UQ_PAY_BILL   UNIQUE (Bill_ID)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IDX_APP_PATIENT  ON APPOINTMENT(Patient_ID);
CREATE INDEX IDX_APP_DOCTOR   ON APPOINTMENT(Doctor_ID);
CREATE INDEX IDX_APP_DATE     ON APPOINTMENT(App_Date);
CREATE INDEX IDX_TREAT_APP    ON TREATMENT(App_ID);
CREATE INDEX IDX_TREAT_DTYPE  ON TREATMENT(Disease_Type);
CREATE INDEX IDX_BILL_TREAT   ON BILL(Treat_ID);
CREATE INDEX IDX_PAY_BILL     ON PAYMENT(Bill_ID);

-- ============================================================
-- View: V_PATIENT_APPOINTMENTS
-- Full patient + doctor + appointment details
-- ============================================================
CREATE OR REPLACE VIEW V_PATIENT_APPOINTMENTS AS
SELECT
    p.Patient_ID, p.Name AS Patient_Name, p.Age, p.Gender, p.Contact,
    a.App_ID,     a.App_Date, a.Status AS App_Status,
    d.Doctor_ID,  d.Name AS Doctor_Name, d.Specialization
FROM PATIENT p
JOIN APPOINTMENT a ON p.Patient_ID = a.Patient_ID
JOIN DOCTOR      d ON a.Doctor_ID  = d.Doctor_ID;

-- ============================================================
-- View: V_TREATMENT_BILLING
-- Full treatment + billing + payment chain
-- ============================================================
CREATE OR REPLACE VIEW V_TREATMENT_BILLING AS
SELECT
    p.Patient_ID, p.Name AS Patient_Name,
    d.Name        AS Doctor_Name, d.Specialization,
    a.App_Date,
    t.Treat_ID, t.Diagnosis, t.Prescription, t.Disease_Type,
    b.Bill_ID,    b.Total_Amount,
    pay.Payment_ID, pay.Mode, pay.Status AS Payment_Status, pay.Payment_Date
FROM TREATMENT t
JOIN APPOINTMENT a ON t.App_ID    = a.App_ID
JOIN PATIENT     p ON a.Patient_ID = p.Patient_ID
JOIN DOCTOR      d ON a.Doctor_ID  = d.Doctor_ID
LEFT JOIN BILL    b   ON b.Treat_ID  = t.Treat_ID
LEFT JOIN PAYMENT pay ON pay.Bill_ID = b.Bill_ID;

-- ============================================================
-- View: V_DISEASE_STATS
-- Disease type frequency and patient count
-- ============================================================
CREATE OR REPLACE VIEW V_DISEASE_STATS AS
SELECT
    t.Disease_Type,
    COUNT(*)                    AS Case_Count,
    COUNT(DISTINCT a.Patient_ID) AS Unique_Patients,
    ROUND(AVG(b.Total_Amount), 2) AS Avg_Bill
FROM TREATMENT t
JOIN APPOINTMENT a ON t.App_ID   = a.App_ID
LEFT JOIN BILL   b ON b.Treat_ID = t.Treat_ID
GROUP BY t.Disease_Type
ORDER BY Case_Count DESC;

-- ============================================================
-- View: V_DOCTOR_STATS
-- Per-doctor summary of appointments and revenue
-- ============================================================
CREATE OR REPLACE VIEW V_DOCTOR_STATS AS
SELECT
    d.Doctor_ID, d.Name AS Doctor_Name, d.Specialization,
    COUNT(a.App_ID)                    AS Total_Appointments,
    COUNT(CASE WHEN a.Status = 'Completed' THEN 1 END) AS Completed,
    ROUND(SUM(b.Total_Amount), 2)      AS Total_Revenue
FROM DOCTOR d
LEFT JOIN APPOINTMENT a ON a.Doctor_ID  = d.Doctor_ID
LEFT JOIN TREATMENT   t ON t.App_ID     = a.App_ID
LEFT JOIN BILL        b ON b.Treat_ID   = t.Treat_ID
GROUP BY d.Doctor_ID, d.Name, d.Specialization
ORDER BY Total_Revenue DESC NULLS LAST;

COMMIT;
PROMPT Schema created successfully.
