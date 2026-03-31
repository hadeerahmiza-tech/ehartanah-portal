/* ================================================================
   e-Hartanah Portal — Assets Page (corrad-laravel style)
   ================================================================ */

let allAssets = [], filtered = [], currentPage = 1;
const PAGE_SIZE = 8;

async function loadAssets() {
  try {
    const { assets } = await fetch('mock-data/assets.json').then(r=>r.json());
    allAssets = assets;
  } catch { allAssets = demoAssets(); }
  filtered = [...allAssets];
  renderStats();
  renderTable();
}

function renderStats() {
  const byStatus = {};
  allAssets.forEach(a => { byStatus[a.status]=(byStatus[a.status]||0)+1; });
  const totalVal = allAssets.reduce((s,a)=>s+a.value,0);
  const statDefs = [
    { label:'Jumlah Aset', value: allAssets.length, icon:'blue', svg:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>' },
    { label:'Aset Aktif',  value: byStatus['Active']||0, icon:'green', svg:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
    { label:'Penyelenggaraan', value: byStatus['Under Maintenance']||0, icon:'amber', svg:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' },
    { label:'Jumlah Nilai', value: 'RM '+(allAssets.reduce((s,a)=>s+a.value,0)/1e6).toFixed(1)+'M', icon:'purple', svg:'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  ];
  document.getElementById('asset-stats').innerHTML = statDefs.map(s=>`
    <div class="stat-card fade-up">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div class="stat-icon ${s.icon}"><svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">${s.svg}</svg></div>
      </div>
      <p style="font-size:1.15rem;font-weight:700;color:#0f172a;margin:0 0 2px;">${s.value}</p>
      <p style="font-size:0.72rem;color:#64748b;margin:0;font-weight:500;">${s.label}</p>
    </div>
  `).join('');
}

function renderTable() {
  const start = (currentPage-1)*PAGE_SIZE;
  const page  = filtered.slice(start, start+PAGE_SIZE);
  const total = filtered.length;

  const info = document.getElementById('page-info');
  if (info) info.textContent = total
    ? `${start+1}–${Math.min(start+PAGE_SIZE,total)} / ${total}`
    : '';
  document.getElementById('filter-count').textContent = total+' rekod';

  const ICONS = {'Office Building':'🏢','Land':'🌿','Residential':'🏠','Commercial':'🏪','Industrial':'🏭'};

  document.getElementById('assets-tbody').innerHTML = page.length === 0
    ? `<tr><td colspan="9" style="text-align:center;padding:32px;color:#94a3b8;font-size:0.82rem;">Tiada rekod dijumpai.</td></tr>`
    : page.map(a => `
      <tr>
        <td><code style="font-size:0.72rem;background:#f1f5f9;padding:2px 7px;border-radius:4px;color:#475569;">${a.id}</code></td>
        <td class="primary" style="max-width:200px;">
          <div style="font-weight:500;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.name}</div>
          <div style="font-size:0.7rem;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.location}</div>
        </td>
        <td style="font-size:0.82rem;">${ICONS[a.type]||'🏗'} ${a.type}</td>
        <td>${statusBadge(a.ownershipType)}</td>
        <td style="font-size:0.82rem;color:#475569;">${a.location}</td>
        <td>${statusBadge(a.fundSource)}</td>
        <td style="text-align:right;font-weight:600;color:#0f172a;font-size:0.82rem;">RM ${a.value.toLocaleString()}</td>
        <td>${statusBadge(a.status)}</td>
        <td>
          <div style="display:flex;gap:5px;">
            <button onclick="viewAsset('${a.id}')" class="btn btn-ghost btn-xs" title="Lihat butiran" style="padding:3px 7px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
            <button data-write-action onclick="showToast('Edit ${a.id} — akan datang.','info')" class="btn btn-ghost btn-xs" title="Edit" style="padding:3px 7px;"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
          </div>
        </td>
      </tr>
    `).join('');

  renderPagination(total);
}

function renderPagination(total) {
  const pages = Math.ceil(total/PAGE_SIZE);
  const el = document.getElementById('pagination');
  if (!el || pages <= 1) { if(el) el.innerHTML=''; return; }
  let h = `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>`;
  for (let p=1; p<=pages; p++) {
    if (pages>7 && p>2 && p<pages-1 && Math.abs(p-currentPage)>1) {
      if (p===3||p===pages-2) h+=`<span style="padding:0 4px;color:#94a3b8;">…</span>`;
      continue;
    }
    h+=`<button class="page-btn${p===currentPage?' active':''}" onclick="goPage(${p})">${p}</button>`;
  }
  h+=`<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===pages?'disabled':''}>›</button>`;
  el.innerHTML = h;
}

function goPage(p) {
  const max = Math.ceil(filtered.length/PAGE_SIZE);
  if (p<1||p>max) return;
  currentPage = p;
  renderTable();
}

function applyFilters() {
  const s  = (document.getElementById('search-input')?.value||'').toLowerCase();
  const ty = document.getElementById('filter-type')?.value||'';
  const st = document.getElementById('filter-status')?.value||'';
  const lo = document.getElementById('filter-location')?.value||'';
  const fu = document.getElementById('filter-fund')?.value||'';
  filtered = allAssets.filter(a => {
    if (s  && !`${a.id} ${a.name} ${a.address} ${a.location}`.toLowerCase().includes(s)) return false;
    if (ty && a.type       !== ty) return false;
    if (st && a.status     !== st) return false;
    if (lo && a.location   !== lo) return false;
    if (fu && a.fundSource !== fu) return false;
    return true;
  });
  currentPage = 1;
  renderTable();
}

function clearFilters() {
  ['search-input','filter-type','filter-status','filter-location','filter-fund']
    .forEach(id=>{ const e=document.getElementById(id); if(e) e.value=''; });
  filtered = [...allAssets];
  currentPage = 1;
  renderTable();
}

function sortBy(col) {
  const h = document.querySelector(`[data-sort="${col}"]`);
  const asc = h?.dataset.order !== 'asc';
  document.querySelectorAll('[data-sort]').forEach(x=>{ x.dataset.order=''; const si=x.querySelector('.sort-icon'); if(si) si.textContent='↕'; si && (si.style.color='#cbd5e1'); });
  if (h) { h.dataset.order = asc?'asc':'desc'; const si=h.querySelector('.sort-icon'); if(si){si.textContent=asc?'↑':'↓';si.style.color='#475569';} }
  filtered.sort((a,b) => {
    let va=a[col], vb=b[col];
    if (typeof va==='string') { va=va.toLowerCase(); vb=vb.toLowerCase(); }
    return asc?(va>vb?1:-1):(va<vb?1:-1);
  });
  currentPage=1; renderTable();
}

function viewAsset(id) {
  const a = allAssets.find(x=>x.id===id);
  if (!a) return;
  document.getElementById('modal-content').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${[
        ['ID Aset', `<code style="font-size:0.8rem;background:#f1f5f9;padding:2px 8px;border-radius:4px;">${a.id}</code>`],
        ['Status', statusBadge(a.status)],
        ['Nama Aset', `<span style="font-weight:600;">${a.name}</span>`],
        ['Jenis', a.type],
        ['Jenis Pemilikan', statusBadge(a.ownershipType)],
        ['Sumber Dana', statusBadge(a.fundSource)],
        ['Lokasi', a.location],
        ['Alamat', a.address],
        ['Keluasan', a.area],
        ['Nilai Harta', `<span style="font-weight:700;color:#2563eb;">RM ${a.value.toLocaleString()}</span>`],
        ['Tarikh Perolehan', formatDate(a.acquiredDate)],
        ['Penilaian Terakhir', a.lastValuation?formatDate(a.lastValuation):'—'],
      ].map(([l,v])=>`
        <div>
          <p style="font-size:0.68rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#94a3b8;margin:0 0 3px;">${l}</p>
          <p style="font-size:0.82rem;color:#0f172a;margin:0;">${v}</p>
        </div>
      `).join('')}
    </div>
  `;
  document.getElementById('asset-modal').classList.add('open');
}

function closeModal() { document.getElementById('asset-modal').classList.remove('open'); }
function exportAssets(fmt) { simulateExport(fmt, 'Senarai_Aset'); }

function demoAssets() {
  return [
    {id:'AST-2024-001',name:'Bangunan Pejabat Utama',type:'Office Building',ownershipType:'Freehold',location:'Kuala Lumpur',address:'No. 1, Jalan Semarak',fundSource:'Federal',status:'Active',area:'5,200 m²',value:12500000,acquiredDate:'2008-06-15',lastValuation:'2024-01-10'},
    {id:'AST-2024-002',name:'Tanah Rizab Kerajaan',type:'Land',ownershipType:'Freehold',location:'Putrajaya',address:'PT 5678, Precinct 8',fundSource:'Federal',status:'Active',area:'12.5 acres',value:35000000,acquiredDate:'2005-03-20',lastValuation:'2023-11-15'},
    {id:'AST-2024-003',name:'Kompleks Perumahan Pegawai',type:'Residential',ownershipType:'Strata Title',location:'Selangor',address:'Lot 112, Kota Damansara',fundSource:'State',status:'Active',area:'3,800 m²',value:8200000,acquiredDate:'2012-09-01',lastValuation:'2024-03-01'},
    {id:'AST-2024-004',name:'Kedai Pejabat Kawasan Industri',type:'Commercial',ownershipType:'Leasehold',location:'Johor Bahru',address:'No. 88, Jalan Skudai',fundSource:'State',status:'Under Maintenance',area:'1,200 m²',value:2800000,acquiredDate:'2015-07-22',lastValuation:'2023-07-10'},
    {id:'AST-2024-005',name:'Gudang Bekalan Strategik',type:'Industrial',ownershipType:'Leasehold',location:'Penang',address:'Lot 45, Bayan Lepas',fundSource:'Federal',status:'Active',area:'8,500 m²',value:6500000,acquiredDate:'2010-11-30',lastValuation:'2024-02-20'},
    {id:'AST-2024-006',name:'Tanah Pertanian Hulu Langat',type:'Land',ownershipType:'Freehold',location:'Selangor',address:'Lot 788, Hulu Langat',fundSource:'State',status:'Active',area:'45.2 acres',value:15000000,acquiredDate:'2001-04-10',lastValuation:'2023-09-05'},
    {id:'AST-2024-007',name:'Bangunan Mahkamah Daerah',type:'Office Building',ownershipType:'Freehold',location:'Kuantan',address:'Jalan Mahkamah, Kuantan',fundSource:'Federal',status:'Under Valuation',area:'2,100 m²',value:5500000,acquiredDate:'1995-12-01',lastValuation:'2021-06-30'},
    {id:'AST-2024-008',name:'Klinik Kesihatan Komuniti',type:'Office Building',ownershipType:'Freehold',location:'Ipoh',address:'Jalan Raja Musa Aziz',fundSource:'Federal',status:'Active',area:'950 m²',value:1800000,acquiredDate:'2003-08-14',lastValuation:'2024-01-25'},
    {id:'AST-2024-009',name:'Gerai Pasar Awam Daerah',type:'Commercial',ownershipType:'Strata Title',location:'Kota Bharu',address:'Pasar Besar Siti Khadijah',fundSource:'State',status:'Active',area:'650 m²',value:890000,acquiredDate:'2018-02-28',lastValuation:'2023-12-12'},
    {id:'AST-2024-010',name:'Tapak Projek Perumahan PPR',type:'Land',ownershipType:'Freehold',location:'Kuala Lumpur',address:'Lot 99, Jalan Cheras',fundSource:'Federal',status:'Active',area:'3.8 acres',value:28000000,acquiredDate:'2019-06-01',lastValuation:'2024-04-01'},
    {id:'AST-2024-011',name:'Kompleks Sukan Daerah',type:'Commercial',ownershipType:'Freehold',location:'Shah Alam',address:'Jalan Stadium, Shah Alam',fundSource:'State',status:'Under Maintenance',area:'11,000 m²',value:9800000,acquiredDate:'2000-10-05',lastValuation:'2022-10-20'},
    {id:'AST-2024-012',name:'Bangunan Arkib Negara Cawangan',type:'Office Building',ownershipType:'Freehold',location:'Putrajaya',address:'Precinct 4, Putrajaya',fundSource:'Federal',status:'Active',area:'4,300 m²',value:11200000,acquiredDate:'2007-01-18',lastValuation:'2024-02-08'},
    {id:'AST-2024-013',name:'Tanah Rezab Orang Asli',type:'Land',ownershipType:'Freehold',location:'Pahang',address:'Pos Iskandar, Kuala Lipis',fundSource:'Federal',status:'Active',area:'320 acres',value:4200000,acquiredDate:'1980-05-01',lastValuation:'2022-03-15'},
    {id:'AST-2024-014',name:'Rumah Transit Pekerja Awam',type:'Residential',ownershipType:'Leasehold',location:'Kuala Lumpur',address:'Jalan Ampang, KL',fundSource:'Federal',status:'Active',area:'2,600 m²',value:7400000,acquiredDate:'2014-11-11',lastValuation:'2023-08-20'},
    {id:'AST-2024-015',name:'Stor Peralatan JKR',type:'Industrial',ownershipType:'Freehold',location:'Seremban',address:'Jalan Besar, Seremban',fundSource:'Federal',status:'Inactive',area:'3,200 m²',value:2100000,acquiredDate:'1998-07-07',lastValuation:'2021-09-10'},
  ];
}

document.addEventListener('DOMContentLoaded', () => {
  loadAssets();
  document.getElementById('search-input')?.addEventListener('input', applyFilters);
  ['filter-type','filter-status','filter-location','filter-fund'].forEach(id =>
    document.getElementById(id)?.addEventListener('change', applyFilters));
  document.getElementById('asset-modal')?.addEventListener('click', e => {
    if (e.target.id==='asset-modal') closeModal();
  });
});
