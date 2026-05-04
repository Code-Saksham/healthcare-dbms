import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { healthData as D } from './data/healthData.js';
import { StatCard, Chip, SearchBar, Pagination, BarChart, Navbar } from './components.jsx';

/* ── Landing / Panel Selector ───────────────────── */
function PanelSelect({ onPick }) {
  const panels = [
    { role:'admin',   icon:'🛡️', title:'Admin Panel',   desc:'View all patients, doctors, appointments, revenue & disease analytics' },
    { role:'doctor',  icon:'🩺', title:'Doctor Panel',  desc:'View a doctor\'s profile, their patients and appointment history' },
    { role:'patient', icon:'👤', title:'Patient Panel', desc:'View a patient\'s info, appointments and assigned doctor details' },
  ];
  return (
    <div className="login-page">
      <div className="login-container fade-up" style={{maxWidth:700}}>
        <div className="login-logo">
          <div className="cross">🏥</div>
          <h1>HealthCare Data Management System</h1>
          <p>UCS310 DBMS · Saksham Raj & Siddhant Mishra · TIET Patiala</p>
        </div>
        <div style={{display:'grid',gap:'1rem'}}>
          {panels.map(p=>(
            <button key={p.role} onClick={()=>onPick(p.role)} style={{
              background:'var(--card)',border:'1px solid var(--border)',borderRadius:'var(--radius)',
              padding:'1.5rem',cursor:'pointer',textAlign:'left',transition:'var(--trans)',
              display:'flex',alignItems:'center',gap:'1.25rem',color:'var(--text)',fontFamily:'inherit',
            }} onMouseOver={e=>e.currentTarget.style.borderColor='var(--cyan)'}
               onMouseOut={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <span style={{fontSize:'2.5rem'}}>{p.icon}</span>
              <div><div style={{fontSize:'1.1rem',fontWeight:700}}>{p.title}</div>
                <div style={{fontSize:'.82rem',color:'var(--text2)',marginTop:'.25rem'}}>{p.desc}</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Admin Dashboard ────────────────────────────── */
function AdminDash({ onBack }) {
  const [tab, setTab] = useState('overview');
  const [q, setQ] = useState('');
  const [pg, setPg] = useState(1);
  const PP = 15;
  const filtP = useMemo(()=>D.patients.filter(p=>
    p.name.toLowerCase().includes(q.toLowerCase())||p.id.toLowerCase().includes(q.toLowerCase())),[q]);
  const filtD = useMemo(()=>D.doctors.filter(d=>
    d.name.toLowerCase().includes(q.toLowerCase())||d.spec.toLowerCase().includes(q.toLowerCase())),[q]);
  const filtA = useMemo(()=>D.appointments.filter(a=>
    a.id.toLowerCase().includes(q.toLowerCase())||a.patient.toLowerCase().includes(q.toLowerCase())),[q]);

  const tabs = [
    {id:'overview',icon:'📊',label:'Overview'},{id:'patients',icon:'👥',label:'Patients'},
    {id:'doctors',icon:'🩺',label:'Doctors'},{id:'appointments',icon:'📋',label:'Appointments'},
    {id:'diseases',icon:'🦠',label:'Diseases'},{id:'dbms',icon:'🗄️',label:'DBMS Info'},
  ];
  return (<>
    <Navbar role="admin" userName="Administrator" activeTab={tab} tabs={tabs}
      onTab={t=>{setTab(t);setQ('');setPg(1);}} onLogout={onBack}/>
    <div className="main-content fade-up">

      {tab==='overview'&&<>
        <div className="section-header"><h1 className="section-title">Admin Dashboard</h1>
          <p className="section-sub">Complete healthcare system overview</p></div>
        <div className="stats-grid">
          <StatCard icon="👥" val={D.summary.totalPatients} label="Patients" color="cyan"/>
          <StatCard icon="🩺" val={D.summary.totalDoctors} label="Doctors" color="green"/>
          <StatCard icon="📋" val={D.summary.totalAppointments} label="Appointments" color="amber"/>
          <StatCard icon="💊" val={D.summary.totalTreatments} label="Treatments" color="purple"/>
          <StatCard icon="💰" val={`₹${(D.summary.totalRevenue/1000).toFixed(0)}k`} label="Total Revenue" color="cyan"/>
          <StatCard icon="✅" val={D.summary.completedApps} label="Completed" color="green"/>
        </div>
        <div className="card-grid">
          <div className="card"><div className="card-title">🦠 Top Diseases by Cases</div>
            <BarChart items={D.diseaseStats.slice(0,8)} keyFn={d=>d.name} valFn={d=>d.count} color="linear-gradient(90deg,var(--cyan),var(--green))"/></div>
          <div className="card"><div className="card-title">🏥 Revenue by Specialization</div>
            <BarChart items={D.specStats} keyFn={s=>s.spec} valFn={s=>s.revenue} color="linear-gradient(90deg,var(--amber),var(--red))"/></div>
        </div>
      </>}

      {tab==='patients'&&<>
        <div className="section-header"><h1 className="section-title">All Patients ({D.patients.length})</h1></div>
        <SearchBar value={q} onChange={v=>{setQ(v);setPg(1);}} placeholder="Search by name or ID..."/>
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th><th>Visits</th><th>Spend</th></tr></thead>
          <tbody>{filtP.slice((pg-1)*PP,pg*PP).map(p=><tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td className="muted">{p.contact}</td><td>{p.totalVisits}</td><td>₹{p.totalSpend}</td></tr>)}</tbody>
        </table></div><Pagination page={pg} total={filtP.length} perPage={PP} onPage={setPg}/></div>
      </>}

      {tab==='doctors'&&<>
        <div className="section-header"><h1 className="section-title">All Doctors ({D.doctors.length})</h1></div>
        <SearchBar value={q} onChange={v=>{setQ(v);setPg(1);}} placeholder="Search by name or specialization..."/>
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Appointments</th><th>Completed</th><th>Revenue</th></tr></thead>
          <tbody>{filtD.slice((pg-1)*PP,pg*PP).map(d=><tr key={d.id}><td>{d.id}</td><td>{d.name}</td><td>{d.spec}</td><td>{d.totalAppointments}</td><td>{d.completedAppointments}</td><td>₹{d.totalRevenue}</td></tr>)}</tbody>
        </table></div><Pagination page={pg} total={filtD.length} perPage={PP} onPage={setPg}/></div>
      </>}

      {tab==='appointments'&&<>
        <div className="section-header"><h1 className="section-title">All Appointments</h1></div>
        <SearchBar value={q} onChange={v=>{setQ(v);setPg(1);}} placeholder="Search by appointment or patient ID..."/>
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Diagnosis</th><th>Amount</th><th>Payment</th></tr></thead>
          <tbody>{filtA.slice((pg-1)*PP,pg*PP).map(a=><tr key={a.id}><td>{a.id}</td><td>{a.patient}</td><td>{a.doctor}</td><td>{a.date}</td><td><Chip status={a.status}/></td><td className="muted">{a.diagnosis||'—'}</td><td>{a.amount?`₹${a.amount}`:'—'}</td><td>{a.payStatus?<Chip status={a.payStatus}/>:'—'}</td></tr>)}</tbody>
        </table></div><Pagination page={pg} total={filtA.length} perPage={PP} onPage={setPg}/></div>
      </>}

      {tab==='diseases'&&<>
        <div className="section-header"><h1 className="section-title">Disease Statistics</h1></div>
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>Disease</th><th>Specialization</th><th>Cases</th><th>Total Billed</th></tr></thead>
          <tbody>{D.diseaseStats.map((d,i)=><tr key={i}><td>{d.name}</td><td>{d.type}</td><td>{d.count}</td><td>₹{d.totalBill.toFixed(0)}</td></tr>)}</tbody>
        </table></div></div>
      </>}

      {tab==='dbms'&&<DbmsInfo/>}
    </div>
  </>);
}

/* ── Doctor Dashboard ───────────────────────────── */
function DoctorDash({ onBack }) {
  const [docIdx, setDocIdx] = useState(0);
  const doc = D.doctors[docIdx];
  const myApps = useMemo(()=>D.appointments.filter(a=>a.doctor===doc.id),[doc.id]);
  const myPIds = useMemo(()=>[...new Set(myApps.map(a=>a.patient))],[myApps]);
  const myPats = useMemo(()=>D.patients.filter(p=>myPIds.includes(p.id)),[myPIds]);
  const [tab, setTab] = useState('overview');

  return (<>
    <Navbar role="doctor" userName={doc.name} activeTab={tab}
      tabs={[{id:'overview',icon:'📊',label:'Overview'},{id:'patients',icon:'👥',label:'My Patients'},{id:'appointments',icon:'📋',label:'Appointments'},{id:'dbms',icon:'🗄️',label:'DBMS Info'}]}
      onTab={setTab} onLogout={onBack}/>
    <div className="main-content fade-up">
      {/* Doctor Selector */}
      <div className="card" style={{marginBottom:'1.5rem'}}>
        <div className="card-title">🩺 Select Doctor</div>
        <select value={docIdx} onChange={e=>setDocIdx(+e.target.value)}
          style={{width:'100%',padding:'.7rem 1rem',background:'rgba(255,255,255,.04)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',color:'var(--text)',fontSize:'.9rem',fontFamily:'inherit',outline:'none'}}>
          {D.doctors.map((d,i)=><option key={d.id} value={i} style={{background:'var(--bg2)'}}>{d.id} — {d.name} ({d.spec})</option>)}
        </select>
      </div>

      {tab==='overview'&&<>
        <div className="section-header"><h1 className="section-title">{doc.name}</h1>
          <p className="section-sub">{doc.spec} · ID: {doc.id} · Contact: {doc.contact}</p></div>
        <div className="stats-grid">
          <StatCard icon="👥" val={myPats.length} label="My Patients" color="cyan"/>
          <StatCard icon="📋" val={doc.totalAppointments} label="Appointments" color="amber"/>
          <StatCard icon="✅" val={doc.completedAppointments} label="Completed" color="green"/>
          <StatCard icon="💰" val={`₹${doc.totalRevenue}`} label="Revenue" color="purple"/>
        </div>
      </>}

      {tab==='patients'&&<>
        <div className="section-header"><h1 className="section-title">Patients of {doc.name} ({myPats.length})</h1></div>
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>ID</th><th>Name</th><th>Age</th><th>Gender</th><th>Contact</th><th>Address</th></tr></thead>
          <tbody>{myPats.map(p=><tr key={p.id}><td>{p.id}</td><td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td className="muted">{p.contact}</td><td className="muted">{p.address}</td></tr>)}</tbody>
        </table></div></div>
      </>}

      {tab==='appointments'&&<>
        <div className="section-header"><h1 className="section-title">Appointments ({myApps.length})</h1></div>
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>ID</th><th>Patient</th><th>Date</th><th>Status</th><th>Diagnosis</th><th>Prescription</th><th>Amount</th></tr></thead>
          <tbody>{myApps.map(a=><tr key={a.id}><td>{a.id}</td><td>{a.patient}</td><td>{a.date}</td><td><Chip status={a.status}/></td><td className="muted">{a.diagnosis||'—'}</td><td className="muted">{a.prescription||'—'}</td><td>{a.amount?`₹${a.amount}`:'—'}</td></tr>)}</tbody>
        </table></div></div>
      </>}

      {tab==='dbms'&&<DbmsInfo/>}
    </div>
  </>);
}

/* ── Patient Dashboard ──────────────────────────── */
function PatientDash({ onBack }) {
  const [patIdx, setPatIdx] = useState(0);
  const pat = D.patients[patIdx];
  const myApps = useMemo(()=>D.appointments.filter(a=>a.patient===pat.id),[pat.id]);
  const myDocIds = [...new Set(myApps.map(a=>a.doctor))];
  const myDocs = D.doctors.filter(d=>myDocIds.includes(d.id));
  const [tab, setTab] = useState('overview');

  return (<>
    <Navbar role="patient" userName={pat.name} activeTab={tab}
      tabs={[{id:'overview',icon:'👤',label:'My Info'},{id:'appointments',icon:'📋',label:'Appointments'},{id:'doctors',icon:'🩺',label:'My Doctors'},{id:'dbms',icon:'🗄️',label:'DBMS Info'}]}
      onTab={setTab} onLogout={onBack}/>
    <div className="main-content fade-up">
      {/* Patient Selector */}
      <div className="card" style={{marginBottom:'1.5rem'}}>
        <div className="card-title">👤 Select Patient</div>
        <select value={patIdx} onChange={e=>setPatIdx(+e.target.value)}
          style={{width:'100%',padding:'.7rem 1rem',background:'rgba(255,255,255,.04)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',color:'var(--text)',fontSize:'.9rem',fontFamily:'inherit',outline:'none'}}>
          {D.patients.map((p,i)=><option key={p.id} value={i} style={{background:'var(--bg2)'}}>{p.id} — {p.name} (Age: {p.age})</option>)}
        </select>
      </div>

      {tab==='overview'&&<>
        <div className="section-header"><h1 className="section-title">{pat.name}</h1>
          <p className="section-sub">Patient ID: {pat.id}</p></div>
        <div className="stats-grid">
          <StatCard icon="📋" val={pat.totalVisits} label="Visits" color="cyan"/>
          <StatCard icon="💰" val={`₹${pat.totalSpend}`} label="Total Spend" color="amber"/>
          <StatCard icon="🩺" val={myDocs.length} label="Doctors" color="green"/>
          <StatCard icon="🎂" val={pat.age} label="Age" color="purple"/>
        </div>
        <div className="card"><div className="card-title">👤 Personal Information</div>
          <div className="detail-grid">
            {[{label:'Name',val:pat.name},{label:'Age',val:pat.age},{label:'Gender',val:pat.gender},{label:'Contact',val:pat.contact},{label:'Address',val:pat.address},{label:'ID',val:pat.id}].map((it,i)=>
              <div className="detail-item" key={i}><div className="di-label">{it.label}</div><div className="di-val">{it.val}</div></div>
            )}
          </div>
        </div>
      </>}

      {tab==='appointments'&&<>
        <div className="section-header"><h1 className="section-title">My Appointments ({myApps.length})</h1></div>
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>ID</th><th>Doctor</th><th>Date</th><th>Status</th><th>Diagnosis</th><th>Prescription</th><th>Amount</th><th>Payment</th></tr></thead>
          <tbody>{myApps.map(a=>{const dc=D.doctors.find(d=>d.id===a.doctor);return(
            <tr key={a.id}><td>{a.id}</td><td>{dc?dc.name:a.doctor}</td><td>{a.date}</td><td><Chip status={a.status}/></td><td className="muted">{a.diagnosis||'—'}</td><td className="muted">{a.prescription||'—'}</td><td>{a.amount?`₹${a.amount}`:'—'}</td><td>{a.payStatus?<Chip status={a.payStatus}/>:'—'}</td></tr>
          );})}</tbody>
        </table></div></div>
      </>}

      {tab==='doctors'&&<>
        <div className="section-header"><h1 className="section-title">Assigned Doctors ({myDocs.length})</h1></div>
        <div className="card"><div className="table-wrap"><table>
          <thead><tr><th>ID</th><th>Name</th><th>Specialization</th><th>Contact</th></tr></thead>
          <tbody>{myDocs.map(d=><tr key={d.id}><td>{d.id}</td><td>{d.name}</td><td>{d.spec}</td><td className="muted">{d.contact}</td></tr>)}</tbody>
        </table></div></div>
      </>}

      {tab==='dbms'&&<DbmsInfo/>}
    </div>
  </>);
}

/* ── DBMS Info ──────────────────────────────────── */
function DbmsInfo() {
  const cards = [
    {t:'📐 Schema (3NF)',d:'6 tables: PATIENT, DOCTOR, APPOINTMENT, TREATMENT, BILL, PAYMENT with PK, FK, CHECK constraints.',c:'CREATE TABLE PATIENT (\n  Patient_ID VARCHAR2(10) PK,\n  Name, Age, Gender,\n  Contact, Address\n);'},
    {t:'⚡ Triggers',d:'trg_auto_complete_appointment — auto-marks Completed. trg_validate_bill_amount — prevents invalid bills.',c:'CREATE TRIGGER trg_auto_complete\nAFTER INSERT ON TREATMENT\nFOR EACH ROW BEGIN\n  UPDATE APPOINTMENT\n  SET Status=\'Completed\'\n  WHERE App_ID=:NEW.App_ID;\nEND;'},
    {t:'🔧 Procedures (Cursors)',d:'prc_register_patient, prc_book_appointment, prc_patient_appointments (explicit cursor), prc_disease_summary (cursor + aggregation).',c:'CURSOR c_apt IS\n  SELECT App_ID, App_Date...\n  FROM APPOINTMENT\n  WHERE Patient_ID = p_pid;\nOPEN c_apt;\nLOOP FETCH c_apt INTO v;\n  EXIT WHEN c_apt%NOTFOUND;\nEND LOOP;'},
    {t:'📊 Functions',d:'fn_patient_total_cost — total bill per patient. fn_doctor_revenue — total revenue per doctor.',c:'FUNCTION fn_patient_total_cost\n  (p_pid VARCHAR2)\nRETURN NUMBER IS\nBEGIN\n  SELECT SUM(Total_Amount)\n  INTO v_total FROM BILL...\n  RETURN v_total;\nEND;'},
    {t:'🔄 Transactions',d:'SAVEPOINT, ROLLBACK TO SAVEPOINT, COMMIT with patient registration + billing workflow.',c:'SAVEPOINT after_patient;\nINSERT INTO APPOINTMENT...;\nROLLBACK TO after_patient;\n-- undo appointment\nCOMMIT;'},
    {t:'👁️ Views',d:'V_PATIENT_APPOINTMENTS, V_TREATMENT_BILLING, V_DISEASE_STATS, V_DOCTOR_STATS for simplified reporting.',c:'CREATE VIEW V_DISEASE_STATS AS\nSELECT Disease_Type,\n  COUNT(*) AS Cases,\n  AVG(Total_Amount)\nFROM TREATMENT t\nJOIN BILL b ON...\nGROUP BY Disease_Type;'},
  ];
  return (<>
    <div className="section-header"><h1 className="section-title">DBMS Implementation</h1>
      <p className="section-sub">Oracle SQL + PL/SQL backend — UCS310 Project</p></div>
    <div className="dbms-grid">{cards.map((c,i)=>
      <div className="dbms-card" key={i}><h3>{c.t}</h3><p>{c.d}</p><div className="dbms-code">{c.c}</div></div>
    )}</div>
  </>);
}

/* ── App Root ───────────────────────────────────── */
function App() {
  const [panel, setPanel] = useState(null);
  if (!panel) return <PanelSelect onPick={setPanel}/>;
  return (
    <div className="app-shell">
      {panel==='admin'   && <AdminDash onBack={()=>setPanel(null)}/>}
      {panel==='doctor'  && <DoctorDash onBack={()=>setPanel(null)}/>}
      {panel==='patient' && <PatientDash onBack={()=>setPanel(null)}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
