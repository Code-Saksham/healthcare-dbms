import { useState } from 'react';

export function StatCard({ icon, val, label, color }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className={`stat-val ${color || ''}`}>{val}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function Chip({ status }) {
  const map = {
    Completed:'completed', Scheduled:'scheduled', Cancelled:'cancelled',
    Paid:'paid', Pending:'pending', Failed:'failed'
  };
  return <span className={`chip chip-${map[status]||'scheduled'}`}>{status}</span>;
}

export function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||'Search...'} />
    </div>
  );
}

export function Pagination({ page, total, perPage, onPage }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const nums = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length-1] !== '...') nums.push('...');
  }
  return (
    <div className="pagination">
      <button className="pg-btn" disabled={page===1} onClick={()=>onPage(page-1)}>‹</button>
      {nums.map((n,i) => n==='...'
        ? <span key={i} style={{color:'var(--text3)',padding:'0 4px'}}>…</span>
        : <button key={i} className={`pg-btn${page===n?' active':''}`} onClick={()=>onPage(n)}>{n}</button>
      )}
      <button className="pg-btn" disabled={page===pages} onClick={()=>onPage(page+1)}>›</button>
    </div>
  );
}

export function BarChart({ items, keyFn, valFn, color }) {
  const max = Math.max(...items.map(valFn), 1);
  return (
    <div className="bar-chart">
      {items.map((it, i) => (
        <div className="bar-row" key={i}>
          <div className="bar-label" title={keyFn(it)}>{keyFn(it)}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{
              width: `${(valFn(it)/max)*100}%`,
              background: color || 'linear-gradient(90deg,var(--cyan),#0077a8)'
            }}/>
          </div>
          <div className="bar-val">{typeof valFn(it)==='number'&&valFn(it)>999
            ? `₹${(valFn(it)/1000).toFixed(1)}k` : valFn(it)}</div>
        </div>
      ))}
    </div>
  );
}

export function DetailGrid({ items }) {
  return (
    <div className="detail-grid">
      {items.map(({ label, val }, i) => (
        <div className="detail-item" key={i}>
          <div className="di-label">{label}</div>
          <div className="di-val">{val ?? '—'}</div>
        </div>
      ))}
    </div>
  );
}

export function Navbar({ role, userName, activeTab, tabs, onTab, onLogout }) {
  const badgeClass = { admin:'badge-admin', doctor:'badge-doctor', patient:'badge-patient' }[role];
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-cross">🏥</div>
        <div>
          <div className="navbar-title">HealthCare DBMS</div>
          <div className="navbar-subtitle">UCS310 · TIET Patiala</div>
        </div>
      </div>
      <div className="navbar-nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-btn${activeTab===t.id?' active':''}`} onClick={()=>onTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="navbar-user">
        <span className={`user-badge ${badgeClass}`}>{role.toUpperCase()}</span>
        <span style={{fontSize:'.82rem',color:'var(--text2)'}}>{userName}</span>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
