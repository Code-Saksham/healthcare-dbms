"""
HealthCare Data Management System - Data Generator
Generates:
  1. sql/02_seed_data.sql  — Oracle INSERT statements (1000 patients, 50 doctors, ~2000 appointments...)
  2. src/data/healthData.js — Frontend JS data for the React dashboard

UCS310 - Database Management Systems
Authors: Saksham Raj (1024030713) | Siddhant Mishra (1024030710)
Run: python scripts/generate_healthcare_data.py
"""

import random
import json
import os
from datetime import date, timedelta

# ── Seed for reproducibility ────────────────────────────────────────────────
random.seed(42)

# ── Indian names ─────────────────────────────────────────────────────────────
MALE_FIRST = [
    "Aarav","Aditya","Akash","Amit","Ankit","Arjun","Aryan","Ashish","Ayush",
    "Bharat","Deepak","Dev","Dhruv","Dinesh","Gaurav","Harsh","Himanshu",
    "Ishaan","Jai","Karan","Kartik","Krishna","Kunal","Lokesh","Manish",
    "Mohit","Naveen","Nikhil","Nishant","Om","Parth","Piyush","Pranav",
    "Prateek","Rahul","Raj","Rajesh","Rakesh","Ram","Rishabh","Rohit",
    "Sachin","Saksham","Sanjay","Shivam","Shubham","Siddhant","Sourav",
    "Suresh","Tarun","Uday","Utkarsh","Vaibhav","Vikas","Vipin","Vivek",
    "Yash","Yogesh","Zeeshan","Abhishek","Alok","Aman","Aniket","Ankur",
    "Bhuvan","Chetan","Dushyant","Govind","Harish","Ishan","Jagdish",
    "Kamlesh","Lalit","Mahesh","Naresh","Omkar","Prashant","Rohan","Sumit"
]

FEMALE_FIRST = [
    "Aarti","Aditi","Aishwarya","Alka","Amita","Ananya","Anchal","Anjali",
    "Anupama","Archana","Avni","Bhavna","Chandni","Deepika","Divya","Ekta",
    "Garima","Geeta","Gunjan","Harsha","Isha","Jyoti","Kajal","Kavita",
    "Kavya","Komal","Kritika","Lakshmi","Lata","Mansi","Meera","Meghna",
    "Nandita","Neha","Nidhi","Nikita","Nisha","Pallavi","Poonam","Pooja",
    "Prachi","Pragya","Prerna","Priya","Radha","Raka","Rekha","Ritu",
    "Rohini","Ruchi","Sakshi","Sangeeta","Seema","Shikha","Shilpa","Shruti",
    "Simran","Sneha","Sonal","Sonam","Sudha","Sunita","Swati","Tanya",
    "Uma","Usha","Vandana","Varsha","Veena","Vidya","Vijaya","Yamini","Zara"
]

LAST_NAMES = [
    "Agarwal","Ahuja","Anand","Arora","Bajaj","Bansal","Batra","Bhatnagar",
    "Bhatt","Chauhan","Chawla","Chopra","Choudhary","Das","Desai","Deshpande",
    "Dubey","Dutta","Gandhi","Garg","Goyal","Gupta","Iyer","Jain","Joshi",
    "Kapoor","Kaur","Khanna","Kumar","Lal","Luthra","Mahajan","Malhotra",
    "Mehta","Mishra","Mittal","Nair","Narang","Pande","Pandey","Patel",
    "Pathak","Rao","Reddy","Saxena","Sethi","Shah","Sharma","Shukla",
    "Singh","Sinha","Srivastava","Tiwari","Trivedi","Varma","Verma","Yadav"
]

CITIES = [
    ("Delhi","110001"),("Mumbai","400001"),("Kolkata","700001"),
    ("Chennai","600001"),("Bengaluru","560001"),("Hyderabad","500001"),
    ("Ahmedabad","380001"),("Pune","411001"),("Jaipur","302001"),
    ("Chandigarh","160001"),("Patiala","147001"),("Ludhiana","141001"),
    ("Amritsar","143001"),("Surat","395001"),("Nagpur","440001"),
    ("Lucknow","226001"),("Kanpur","208001"),("Bhopal","462001"),
    ("Indore","452001"),("Coimbatore","641001"),("Dehradun","248001"),
    ("Agra","282001"),("Varanasi","221001"),("Meerut","250001"),
    ("Faridabad","121001"),("Gurgaon","122001"),("Noida","201301"),
    ("Kochi","682001"),("Mysuru","570001"),("Patna","800001")
]

STREETS = [
    "MG Road","Sector 7","Civil Lines","Model Town","Rajpur Road","Ashok Nagar",
    "Connaught Place","Green Park","Banjara Hills","Ranjit Avenue","Sadar Bazar",
    "Lake Road","Station Road","Gandhi Nagar","Subhash Marg","Mall Road",
    "Nehru Place","Lajpat Nagar","Karol Bagh","Defence Colony","Vasant Kunj"
]

SPECIALIZATIONS = [
    "Cardiology","Neurology","Orthopedics","General Medicine","Dermatology",
    "Gastroenterology","Pediatrics","Gynecology","Ophthalmology","ENT"
]

DISEASE_MAP = {
    "Cardiology":      [("Hypertension","Amlodipine 5mg, Losartan 50mg",3500),
                        ("Coronary Artery Disease","Aspirin 75mg, Atorvastatin 40mg",8000),
                        ("Cardiac Arrhythmia","Metoprolol 25mg, ECG monitoring",6500),
                        ("Heart Failure","Furosemide 40mg, Digoxin 0.25mg",9000),
                        ("Atrial Fibrillation","Warfarin 5mg, Rate control",7500)],
    "Neurology":       [("Chronic Migraine","Sumatriptan 100mg, Topiramate 25mg",4000),
                        ("Epilepsy","Levetiracetam 500mg, MRI recommended",7000),
                        ("Parkinson Disease","Levodopa 100mg, Carbidopa 25mg",9500),
                        ("Stroke","Aspirin 150mg, Clopidogrel 75mg",12000),
                        ("Multiple Sclerosis","Interferon beta-1a, Physiotherapy",15000)],
    "Orthopedics":     [("Knee Osteoarthritis","Ibuprofen 400mg, Physiotherapy",3000),
                        ("Lumbar Disc Herniation","Diclofenac 75mg, Bed rest, MRI",5500),
                        ("Fracture","Plaster cast, Calcium supplements",6000),
                        ("Knee Ligament Injury","Surgery, Analgesics",14000),
                        ("Cervical Spondylosis","Physiotherapy, Muscle relaxants",2500)],
    "General Medicine":[("Viral Fever","Paracetamol 500mg, Rest, Fluids",800),
                        ("Type 2 Diabetes","Metformin 500mg, Diet control",2000),
                        ("Typhoid","Ciprofloxacin 500mg, Oral rehydration",1500),
                        ("Anaemia","Iron tablets, Folic acid 5mg",1200),
                        ("Tuberculosis","RIPE therapy (6 months)",5000)],
    "Dermatology":     [("Eczema","Hydrocortisone cream, Antihistamine",2000),
                        ("Psoriasis","Methotrexate 7.5mg, Topical steroids",5000),
                        ("Acne Vulgaris","Doxycycline 100mg, Benzoyl peroxide",1800),
                        ("Fungal Infection","Clotrimazole cream, Fluconazole",1200),
                        ("Vitiligo","Tacrolimus ointment, Phototherapy",4500)],
    "Gastroenterology":[("Gastritis","Omeprazole 20mg, Antacid syrup",1500),
                        ("Irritable Bowel Syndrome","Mebeverine 135mg, Dietary changes",2200),
                        ("Peptic Ulcer","Pantoprazole 40mg, Clarithromycin 500mg",3000),
                        ("Liver Cirrhosis","Lactulose 30ml, Spironolactone 100mg",8000),
                        ("Crohn Disease","Mesalamine 800mg, Steroids",11000)],
    "Pediatrics":      [("Childhood Asthma","Salbutamol inhaler, Montelukast",2500),
                        ("Malnutrition","Nutritional supplements, Diet plan",1500),
                        ("Chicken Pox","Acyclovir 400mg, Calamine lotion",1800),
                        ("Dengue","IV fluids, Paracetamol, Monitoring",6000),
                        ("Tonsillitis","Amoxicillin 250mg, Warm saline gargle",1200)],
    "Gynecology":      [("PCOS","Metformin 500mg, OCP, Diet control",3500),
                        ("Endometriosis","Hormonal therapy, Laparoscopy",12000),
                        ("Uterine Fibroids","Mifepristone 10mg, Surgery if needed",8000),
                        ("Menorrhagia","Tranexamic acid 500mg, Iron therapy",2500),
                        ("Cervical Infection","Metronidazole 400mg, Antifungal",1800)],
    "Ophthalmology":   [("Cataract","Phacoemulsification surgery, Eye drops",18000),
                        ("Glaucoma","Timolol eye drops, Laser therapy",7000),
                        ("Diabetic Retinopathy","Laser photocoagulation, Avastin",15000),
                        ("Conjunctivitis","Ciprofloxacin eye drops, Eye wash",500),
                        ("Myopia","Spectacle prescription, LASIK option",3000)],
    "ENT":             [("Chronic Sinusitis","Fluticasone spray, Amoxicillin",2000),
                        ("Tinnitus","Betahistine 16mg, Audiometry",3500),
                        ("Otitis Media","Amoxicillin-clavulanate, Ear drops",1500),
                        ("Nasal Polyps","Mometasone spray, Polypectomy",6000),
                        ("Laryngitis","Voice rest, Steam inhalation",800)]
}

PAYMENT_MODES = ["Cash","Card","Online","Insurance"]
PAY_MODE_WEIGHTS = [0.25, 0.30, 0.25, 0.20]

# ── Helpers ──────────────────────────────────────────────────────────────────
def random_date(start, end):
    delta = end - start
    return start + timedelta(days=random.randint(0, delta.days))

def rand_contact():
    return "9" + "".join([str(random.randint(0,9)) for _ in range(9)])

def sql_str(s):
    return "'" + str(s).replace("'","''") + "'"

# ── Generate Doctors (50) ─────────────────────────────────────────────────────
doctors = []
used_names = set()
for i in range(1, 51):
    spec = SPECIALIZATIONS[(i-1) % len(SPECIALIZATIONS)]
    gender = random.choice(["Male","Female"])
    first_pool = MALE_FIRST if gender == "Male" else FEMALE_FIRST
    first = random.choice(first_pool)
    last  = random.choice(LAST_NAMES)
    name  = f"Dr. {first} {last}"
    while name in used_names:
        first = random.choice(first_pool)
        last  = random.choice(LAST_NAMES)
        name  = f"Dr. {first} {last}"
    used_names.add(name)
    doctors.append({
        "id":   f"DR{i:03d}",
        "name": name,
        "spec": spec,
        "contact": rand_contact(),
        "gender": gender
    })

# ── Generate Patients (1000) ──────────────────────────────────────────────────
patients = []
used_pnames = set()
for i in range(1, 1001):
    gender = random.choice(["Male","Female"])
    first_pool = MALE_FIRST if gender == "Male" else FEMALE_FIRST
    first = random.choice(first_pool)
    last  = random.choice(LAST_NAMES)
    name  = f"{first} {last}"
    while name in used_pnames:
        first = random.choice(first_pool)
        last  = random.choice(LAST_NAMES)
        name  = f"{first} {last}"
    used_pnames.add(name)
    city, pin = random.choice(CITIES)
    street_no = random.randint(1, 200)
    street    = random.choice(STREETS)
    patients.append({
        "id":      f"P{i:04d}",
        "name":    name,
        "age":     random.randint(5, 80),
        "gender":  gender,
        "contact": rand_contact(),
        "address": f"{street_no} {street}, {city} - {pin}"
    })

# ── Generate Appointments (~2000) ─────────────────────────────────────────────
START_DATE = date(2025, 6, 1)
END_DATE   = date(2026, 4, 30)

appointments = []
app_id = 1
for p in patients:
    num_apps = random.choices([1,2,3,4], weights=[0.3,0.4,0.2,0.1])[0]
    for _ in range(num_apps):
        doc = random.choice(doctors)
        d   = random_date(START_DATE, END_DATE)
        # Last 15 days: might still be Scheduled
        if d >= date.today() - timedelta(days=15):
            status = random.choices(["Scheduled","Completed"],weights=[0.6,0.4])[0]
        else:
            status = random.choices(["Completed","Cancelled"],weights=[0.85,0.15])[0]
        appointments.append({
            "id":        f"A{app_id:05d}",
            "patient":   p["id"],
            "doctor":    doc["id"],
            "doc_spec":  doc["spec"],
            "date":      d.isoformat(),
            "status":    status
        })
        app_id += 1

# ── Generate Treatments, Bills, Payments ─────────────────────────────────────
treatments = []
bills      = []
payments   = []
t_id = b_id = pay_id = 1

for app in appointments:
    if app["status"] != "Completed":
        continue
    spec = app["doc_spec"]
    disease_list = DISEASE_MAP.get(spec, DISEASE_MAP["General Medicine"])
    diag, presc, base_amount = random.choice(disease_list)
    disease_type = spec  # broad category = specialization area

    amount = round(base_amount * random.uniform(0.85, 1.20), 2)
    mode   = random.choices(PAYMENT_MODES, weights=PAY_MODE_WEIGHTS)[0]
    pay_status = random.choices(["Paid","Pending","Failed"],weights=[0.80,0.15,0.05])[0]
    pay_date = (date.fromisoformat(app["date"]) + timedelta(days=random.randint(0,3))).isoformat()

    treatments.append({
        "id":       f"T{t_id:05d}",
        "app_id":   app["id"],
        "diag":     diag,
        "presc":    presc,
        "dtype":    disease_type
    })
    bills.append({
        "id":       f"B{b_id:05d}",
        "treat_id": f"T{t_id:05d}",
        "amount":   amount
    })
    payments.append({
        "id":       f"PAY{pay_id:05d}",
        "bill_id":  f"B{b_id:05d}",
        "date":     pay_date,
        "mode":     mode,
        "status":   pay_status
    })
    t_id += 1; b_id += 1; pay_id += 1

print(f"Generated: {len(doctors)} doctors, {len(patients)} patients, "
      f"{len(appointments)} appointments, {len(treatments)} treatments, "
      f"{len(bills)} bills, {len(payments)} payments")

# ─────────────────────────────────────────────────────────────────────────────
# Write SQL seed file
# ─────────────────────────────────────────────────────────────────────────────
os.makedirs("sql", exist_ok=True)
sql_path = "sql/02_seed_data.sql"

with open(sql_path, "w", encoding="utf-8") as f:
    f.write("-- ============================================================\n")
    f.write("-- HealthCare Data Management System — Seed Data\n")
    f.write(f"-- {len(doctors)} Doctors | {len(patients)} Patients\n")
    f.write(f"-- {len(appointments)} Appointments | {len(treatments)} Treatments\n")
    f.write(f"-- {len(bills)} Bills | {len(payments)} Payments\n")
    f.write("-- Generated by scripts/generate_healthcare_data.py\n")
    f.write("-- ============================================================\n\n")

    # DOCTORS
    f.write("-- DOCTORS\n")
    for d in doctors:
        f.write(f"INSERT INTO DOCTOR VALUES ({sql_str(d['id'])},{sql_str(d['name'])},{sql_str(d['spec'])},{sql_str(d['contact'])});\n")
    f.write("\n")

    # PATIENTS (in batches for readability)
    f.write("-- PATIENTS\n")
    for p in patients:
        f.write(f"INSERT INTO PATIENT VALUES ({sql_str(p['id'])},{sql_str(p['name'])},{p['age']},{sql_str(p['gender'])},{sql_str(p['contact'])},{sql_str(p['address'])});\n")
    f.write("\n")

    # APPOINTMENTS
    f.write("-- APPOINTMENTS\n")
    for a in appointments:
        f.write(f"INSERT INTO APPOINTMENT VALUES ({sql_str(a['id'])},{sql_str(a['patient'])},{sql_str(a['doctor'])},TO_DATE({sql_str(a['date'])},'YYYY-MM-DD'),{sql_str(a['status'])});\n")
    f.write("\n")

    # TREATMENTS
    f.write("-- TREATMENTS\n")
    for t in treatments:
        f.write(f"INSERT INTO TREATMENT VALUES ({sql_str(t['id'])},{sql_str(t['app_id'])},{sql_str(t['diag'])},{sql_str(t['presc'])},{sql_str(t['dtype'])});\n")
    f.write("\n")

    # BILLS
    f.write("-- BILLS\n")
    for b in bills:
        f.write(f"INSERT INTO BILL VALUES ({sql_str(b['id'])},{sql_str(b['treat_id'])},{b['amount']});\n")
    f.write("\n")

    # PAYMENTS
    f.write("-- PAYMENTS\n")
    for py in payments:
        f.write(f"INSERT INTO PAYMENT VALUES ({sql_str(py['id'])},{sql_str(py['bill_id'])},TO_DATE({sql_str(py['date'])},'YYYY-MM-DD'),{sql_str(py['mode'])},{sql_str(py['status'])});\n")
    f.write("\n")
    f.write("COMMIT;\nPROMPT Seed data imported successfully.\n")

print(f"SQL seed written -> {sql_path}")

# ─────────────────────────────────────────────────────────────────────────────
# Build frontend JS data
# ─────────────────────────────────────────────────────────────────────────────
os.makedirs("src/data", exist_ok=True)

# Build lookup maps
treat_by_app = {t["app_id"]: t for t in treatments}
bill_by_treat = {b["treat_id"]: b for b in bills}
pay_by_bill  = {py["bill_id"]: py for py in payments}

# Enrich appointments with treatment + billing info
apps_enriched = []
for a in appointments:
    treat = treat_by_app.get(a["id"])
    bill  = bill_by_treat.get(treat["id"]) if treat else None
    pay   = pay_by_bill.get(bill["id"]) if bill else None
    apps_enriched.append({
        **a,
        "diagnosis":   treat["diag"]   if treat else None,
        "prescription":treat["presc"]  if treat else None,
        "diseaseType": treat["dtype"]  if treat else None,
        "treatmentId": treat["id"]     if treat else None,
        "billId":      bill["id"]      if bill  else None,
        "amount":      bill["amount"]  if bill  else None,
        "payMode":     pay["mode"]     if pay   else None,
        "payStatus":   pay["status"]   if pay   else None,
        "payDate":     pay["date"]     if pay   else None,
    })

# Stats
total_revenue = sum(b["amount"] for b in bills)
paid_revenue  = sum(b["amount"] for b in bills
                    if pay_by_bill.get(b["id"],{}).get("status") == "Paid")

# Disease stats
disease_counts = {}
for t in treatments:
    key = t["diag"]
    if key not in disease_counts:
        disease_counts[key] = {"name": key, "type": t["dtype"], "count": 0, "totalBill": 0}
    disease_counts[key]["count"] += 1
    b = bill_by_treat.get(t["id"])
    if b:
        disease_counts[key]["totalBill"] += b["amount"]
disease_stats = sorted(disease_counts.values(), key=lambda x: x["count"], reverse=True)[:20]

# Spec stats
spec_stats = {}
for doc in doctors:
    spec_stats[doc["spec"]] = {"spec": doc["spec"], "doctors": 0, "appointments": 0, "revenue": 0}
for doc in doctors:
    spec_stats[doc["spec"]]["doctors"] += 1
for a in apps_enriched:
    doc = next((d for d in doctors if d["id"] == a["doctor"]), None)
    if doc and doc["spec"] in spec_stats:
        spec_stats[doc["spec"]]["appointments"] += 1
        if a["amount"]:
            spec_stats[doc["spec"]]["revenue"] += a["amount"]
spec_stats_list = sorted(spec_stats.values(), key=lambda x: x["revenue"], reverse=True)

# Payment mode stats
mode_stats = {}
for py in payments:
    m = py["mode"]
    if m not in mode_stats:
        mode_stats[m] = {"mode": m, "count": 0, "amount": 0}
    mode_stats[m]["count"] += 1
    b = bill_by_treat.get(pay_by_bill.get(py["id"],{}).get("bill_id",""),{})
    mode_stats[m]["amount"] += next((bl["amount"] for bl in bills if bl["id"] == py["bill_id"]),0)
mode_stats_list = list(mode_stats.values())

# Per-doctor enrichment for doctor dashboard
doctor_map = {d["id"]: d for d in doctors}
for doc in doctors:
    doc_apps = [a for a in apps_enriched if a["doctor"] == doc["id"]]
    doc["totalAppointments"] = len(doc_apps)
    doc["completedAppointments"] = sum(1 for a in doc_apps if a["status"]=="Completed")
    doc["totalRevenue"] = round(sum(a["amount"] or 0 for a in doc_apps),2)
    doc["patientIds"] = list({a["patient"] for a in doc_apps})

# Per-patient enrichment
patient_map = {p["id"]: p for p in patients}
for p in patients:
    p_apps = [a for a in apps_enriched if a["patient"] == p["id"]]
    p["totalVisits"] = len(p_apps)
    p["totalSpend"] = round(sum(a["amount"] or 0 for a in p_apps),2)
    p["doctorIds"] = list({a["doctor"] for a in p_apps})

js_data = {
    "summary": {
        "totalPatients":      len(patients),
        "totalDoctors":       len(doctors),
        "totalAppointments":  len(appointments),
        "totalTreatments":    len(treatments),
        "totalRevenue":       round(total_revenue,2),
        "paidRevenue":        round(paid_revenue,2),
        "completedApps":      sum(1 for a in appointments if a["status"]=="Completed"),
        "cancelledApps":      sum(1 for a in appointments if a["status"]=="Cancelled"),
    },
    "doctors":       doctors,
    "patients":      patients,
    "appointments":  apps_enriched,
    "diseaseStats":  disease_stats,
    "specStats":     spec_stats_list,
    "modeStats":     mode_stats_list,
}

js_path = "src/data/healthData.js"
with open(js_path, "w", encoding="utf-8") as f:
    f.write("// HealthCare Data Management System — Frontend Data\n")
    f.write("// Generated by scripts/generate_healthcare_data.py\n")
    f.write("// UCS310 DBMS | Saksham Raj | Siddhant Mishra\n\n")
    f.write("export const healthData = ")
    f.write(json.dumps(js_data, indent=2, ensure_ascii=False))
    f.write(";\n")

print(f"Frontend data written -> {js_path}")
print("Done! Run the app with: npm run dev")
