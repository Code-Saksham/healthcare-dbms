-- ============================================================
-- 04_analytics_queries.sql : SQL Analytics
-- ============================================================

-- Q1: Top 10 most common diseases
SELECT Disease_Type, COUNT(*) AS Cases
FROM   TREATMENT
GROUP  BY Disease_Type
ORDER  BY Cases DESC
FETCH  FIRST 10 ROWS ONLY;

-- Q2: Doctor leaderboard by revenue
SELECT d.Name AS Doctor, d.Specialization,
       COUNT(a.App_ID) AS Appointments,
       ROUND(SUM(b.Total_Amount),2) AS Total_Revenue_Rs
FROM   DOCTOR d
LEFT JOIN APPOINTMENT a ON a.Doctor_ID  = d.Doctor_ID
LEFT JOIN TREATMENT   t ON t.App_ID     = a.App_ID
LEFT JOIN BILL        b ON b.Treat_ID   = t.Treat_ID
GROUP  BY d.Name, d.Specialization
ORDER  BY Total_Revenue_Rs DESC NULLS LAST;

-- Q3: Average bill per specialization
SELECT d.Specialization,
       COUNT(b.Bill_ID) AS Bills_Raised,
       ROUND(AVG(b.Total_Amount),2) AS Avg_Bill_Rs,
       ROUND(SUM(b.Total_Amount),2) AS Total_Revenue_Rs
FROM   DOCTOR d
JOIN   APPOINTMENT a ON a.Doctor_ID = d.Doctor_ID
JOIN   TREATMENT   t ON t.App_ID    = a.App_ID
JOIN   BILL        b ON b.Treat_ID  = t.Treat_ID
GROUP  BY d.Specialization
ORDER  BY Total_Revenue_Rs DESC;

-- Q4: Top 10 patients by total spend
SELECT p.Patient_ID, p.Name, p.Age,
       COUNT(DISTINCT a.App_ID) AS Visits,
       ROUND(SUM(b.Total_Amount),2) AS Total_Spend_Rs
FROM   PATIENT p
JOIN   APPOINTMENT a ON a.Patient_ID = p.Patient_ID
JOIN   TREATMENT   t ON t.App_ID     = a.App_ID
JOIN   BILL        b ON b.Treat_ID   = t.Treat_ID
GROUP  BY p.Patient_ID, p.Name, p.Age
ORDER  BY Total_Spend_Rs DESC
FETCH  FIRST 10 ROWS ONLY;

-- Q5: Payment mode distribution
SELECT Mode, COUNT(*) AS Transactions,
       ROUND(SUM(b.Total_Amount),2) AS Amount_Collected
FROM   PAYMENT py
JOIN   BILL    b ON b.Bill_ID = py.Bill_ID
GROUP  BY Mode
ORDER  BY Amount_Collected DESC;

-- Q6: Monthly appointment volume
SELECT TO_CHAR(App_Date,'YYYY-MM') AS Month,
       COUNT(*) AS Total_Appointments,
       COUNT(CASE WHEN Status='Completed' THEN 1 END) AS Completed,
       COUNT(CASE WHEN Status='Cancelled' THEN 1 END) AS Cancelled
FROM   APPOINTMENT
GROUP  BY TO_CHAR(App_Date,'YYYY-MM')
ORDER  BY Month;

-- Q7: Gender distribution of patients
SELECT Gender, COUNT(*) AS Count,
       ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM PATIENT),2) AS Pct
FROM   PATIENT
GROUP  BY Gender;

-- Q8: Unpaid bills (Pending payments)
SELECT b.Bill_ID, p.Name AS Patient, b.Total_Amount,
       py.Status AS Payment_Status
FROM   BILL b
JOIN   TREATMENT   t ON t.Treat_ID  = b.Treat_ID
JOIN   APPOINTMENT a ON a.App_ID    = t.App_ID
JOIN   PATIENT     p ON p.Patient_ID= a.Patient_ID
LEFT JOIN PAYMENT  py ON py.Bill_ID = b.Bill_ID
WHERE  py.Status = 'Pending' OR py.Status IS NULL
ORDER  BY b.Total_Amount DESC;
