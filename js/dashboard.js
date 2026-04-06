/* ================================================================
   e-Hartanah Portal — Dashboard (corrad-laravel style)
   ================================================================ */

async function loadDashboard() {
  try {
    const [ar, tr, mr] = await Promise.all([
      fetch('mock-data/assets.json').then(r=>r.json()),
      fetch('mock-data/tenancy.json').then(r=>r.json()),
      fetch('mock-data/maintenance.json').then(r=>r.json()),
    ]);
    render(ar.assets, tr.tenants, mr.maintenance);
  } catch {
    render(demoAssets(), demoTenants(), demoMaint());
  }
}

function render(assets, tenants, maint) {
  renderKPIs(assets, tenants, maint);
  renderTypeChart(assets);
  renderStatusChart(assets);
  renderRentalChart(tenants);
  renderMaintChart(maint);
  renderActivity(tenants, maint);
}

/* ── KPIs ── */
function renderKPIs(assets, tenants, maint) {
  const totalVal   = assets.reduce((s,a)=>s+a.value,0);
  const active     = tenants.filter(t=>t.status==='Active');
  const occ        = Math.round(active.length/tenants.length*100);
  const income     = active.reduce((s,t)=>s+t.rental,0);
  const pendingM   = maint.filter(m=>m.status!=='Completed').length;
  const maintCost  = maint.reduce((s,m)=>s+(m.actualCost||m.estimatedCost||0),0);
  const upcomingV  = assets.filter(a=>a.status==='Under Valuation').length + 2;

  /* Lucide icon paths — stroke-linecap/join set on outer svg */
  const kpis = [
    { label:'Jumlah Aset', value: assets.length, sub: formatCurrency(totalVal), icon:'blue',
      /* Lucide: Building2 */
      svg:'<path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>',
      trend:'up' },
    { label:'Kadar Penghunian', value: occ+'%', sub: active.length+' sewaan aktif', icon:'green',
      /* Lucide: Users */
      svg:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
      trend:'up' },
    { label:'Pendapatan Sewa/Bulan', value: formatCurrency(income), sub: tenants.length+' penyewa berdaftar', icon:'teal',
      /* Lucide: CircleDollarSign */
      svg:'<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 000 4h4a2 2 0 010 4H8M12 6v2m0 8v2"/>',
      trend:'up' },
    { label:'Kos Penyelenggaraan', value: formatCurrency(maintCost), sub: pendingM+' tugasan belum selesai', icon:'amber',
      /* Lucide: Wrench */
      svg:'<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>',
      trend:'down' },
    { label:'Penilaian Akan Datang', value: upcomingV, sub: 'Dalam tempoh 3 bulan', icon:'purple',
      /* Lucide: CalendarDays */
      svg:'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
      trend:'neutral' },
  ];

  document.getElementById('kpi-grid').innerHTML = kpis.map((k,i) => `
    <div class="stat-card fade-up d${i+1}">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div class="stat-icon ${k.icon}">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${k.svg}</svg>
        </div>
        <svg width="14" height="14" fill="none" stroke="${k.trend==='up'?'#059669':k.trend==='down'?'#dc2626':'#94a3b8'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          ${k.trend==='up'
            ? '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>'
            : k.trend==='down'
            ? '<path d="M23 18l-9.5-9.5-5 5L1 6"/><path d="M17 18h6v-6"/>'
            : '<path d="M5 12h14"/>'}
        </svg>
      </div>
      <p style="font-size:1.25rem;font-weight:700;color:#0f172a;margin:0 0 2px;">${k.value}</p>
      <p style="font-size:0.75rem;font-weight:600;color:#475569;margin:0 0 1px;">${k.label}</p>
      <p style="font-size:0.7rem;color:#94a3b8;margin:0;">${k.sub}</p>
    </div>
  `).join('');
}

/* ── Asset Type Doughnut ── */
function renderTypeChart(assets) {
  const counts = {};
  assets.forEach(a => { counts[a.type]=(counts[a.type]||0)+1; });
  const labels = Object.keys(counts);
  const COLORS = ['#FF829D','#FFD778','#5EB5EF','#6FCDCD','#ECEDF1','#FF829D'];
  new Chart(document.getElementById('typeChart'), {
    type:'doughnut',
    data:{ labels, datasets:[{ data:labels.map(l=>counts[l]), backgroundColor:COLORS.slice(0,labels.length), borderWidth:2, borderColor:'#fff', hoverOffset:6 }] },
    options:{ responsive:true, cutout:'65%', plugins:{ legend:{ position:'bottom', labels:{ padding:12, font:{ size:11, weight:'500' }, color:'#475569', usePointStyle:true, pointStyleWidth:8 }}, tooltip:{ callbacks:{ label:c=>` ${c.label}: ${c.raw} (${Math.round(c.raw/assets.length*100)}%)` }}}}
  });
}

/* ── Asset Status Pie ── */
function renderStatusChart(assets) {
  const counts = {};
  assets.forEach(a => { counts[a.status]=(counts[a.status]||0)+1; });
  const labels = Object.keys(counts);
  const PALETTE = ['#5EB5EF','#6FCDCD','#FFD778','#FF829D','#ECEDF1'];
  new Chart(document.getElementById('statusChart'), {
    type:'pie',
    data:{ labels, datasets:[{ data:labels.map(l=>counts[l]), backgroundColor:labels.map((_,i)=>PALETTE[i%PALETTE.length]), borderWidth:2, borderColor:'#fff', hoverOffset:6 }] },
    options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ padding:12, font:{ size:11, weight:'500' }, color:'#475569', usePointStyle:true, pointStyleWidth:8 }}, tooltip:{ callbacks:{ label:c=>` ${c.label}: ${c.raw}` }}}}
  });
}

/* ── Monthly Rental Bar ── */
function renderRentalChart(tenants) {
  const base = tenants.filter(t=>t.status==='Active').reduce((s,t)=>s+t.rental,0);
  const months = ['Okt','Nov','Dis','Jan','Feb','Mac','Apr','Mei'];
  const data = months.map((_,i) => Math.round(base*(0.88+Math.random()*0.24)));
  data[5] = base;
  new Chart(document.getElementById('rentalChart'), {
    type:'bar',
    data:{ labels:months, datasets:[{ data, backgroundColor:months.map((_,i)=>i===5?'#5EB5EF':'rgba(94,181,239,0.35)'), borderRadius:6, borderSkipped:false }] },
    options:{ responsive:true, plugins:{ legend:{ display:false }, tooltip:{ callbacks:{ label:c=>` RM ${c.raw.toLocaleString()}` }}}, scales:{ y:{ beginAtZero:true, grid:{ color:'#f1f5f9' }, border:{ display:false }, ticks:{ color:'#94a3b8', font:{ size:11 }, callback:v=>'RM '+(v/1000).toFixed(0)+'K' }}, x:{ grid:{ display:false }, border:{ display:false }, ticks:{ color:'#94a3b8', font:{ size:11 } }}}}
  });
}

/* ── Maintenance Cost Line ── */
function renderMaintChart(maint) {
  const months = ['Okt','Nov','Dis','Jan','Feb','Mac'];
  const actual = months.map(()=>Math.round(25000+Math.random()*30000));
  const budget = months.map(()=>35000);
  new Chart(document.getElementById('maintChart'), {
    type:'line',
    data:{ labels:months, datasets:[
      { label:'Kos Sebenar', data:actual, borderColor:'#FF829D', backgroundColor:'rgba(255,130,157,0.1)', tension:0.4, fill:true, pointRadius:4, pointBackgroundColor:'#FF829D', pointBorderColor:'#fff', pointBorderWidth:2, borderWidth:2 },
      { label:'Bajet', data:budget, borderColor:'#6FCDCD', borderDash:[5,4], backgroundColor:'transparent', tension:0, pointRadius:0, borderWidth:2 }
    ]},
    options:{ responsive:true, plugins:{ legend:{ position:'top', labels:{ font:{ size:11 }, color:'#475569', padding:12, usePointStyle:true, pointStyleWidth:8 }}, tooltip:{ callbacks:{ label:c=>` ${c.dataset.label}: RM ${c.raw.toLocaleString()}` }}}, scales:{ y:{ beginAtZero:true, grid:{ color:'#f1f5f9' }, border:{ display:false }, ticks:{ color:'#94a3b8', font:{ size:11 }, callback:v=>'RM '+(v/1000).toFixed(0)+'K' }}, x:{ grid:{ display:false }, border:{ display:false }, ticks:{ color:'#94a3b8', font:{ size:11 } }}}}
  });
}

/* ── Recent Activity ── */
function renderActivity(tenants, maint) {
  const rows = [
    ...tenants.slice(0,4).map(t=>({ date:t.startDate, type:'Sewaan', desc:t.name, status:t.status, val:t.rental })),
    ...maint.slice(0,3).map(m=>({ date:m.scheduledDate, type:'Selenggara', desc:m.description, status:m.status, val:m.estimatedCost })),
  ].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,7);

  document.getElementById('activity-tbody').innerHTML = rows.map(r=>`
    <tr>
      <td style="font-size:0.75rem;color:#94a3b8;white-space:nowrap;">${formatDate(r.date)}</td>
      <td><span class="badge ${r.type==='Sewaan'?'badge-inprogress':'badge-pending'}" style="font-size:0.68rem;">${r.type}</span></td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" class="primary">${r.desc}</td>
      <td>${statusBadge(r.status)}</td>
      <td style="text-align:right;font-weight:600;color:#0f172a;font-size:0.82rem;">RM ${r.val.toLocaleString()}</td>
    </tr>
  `).join('');
}

/* ── Demo data fallbacks ── */
function demoAssets() {
  return [
    {id:'AST-2024-001',name:'Bangunan Pejabat Utama',value:12500000,type:'Office Building',status:'Active',location:'Kuala Lumpur',taxtaxNo:'CT-KL-2024-001234',doortaxNo:'CP-KL-2024-005678'},
    {id:'AST-2024-002',name:'Tanah Rizab Kerajaan',value:35000000,type:'Land',status:'Active',location:'Putrajaya',taxtaxNo:'CT-PJ-2024-002456',doortaxNo:'CP-PJ-2024-007890'},
    {id:'AST-2024-003',name:'Kompleks Perumahan Pegawai',value:8200000,type:'Residential',status:'Active',location:'Selangor',taxtaxNo:'CT-SLG-2024-003678',doortaxNo:'CP-SLG-2024-009012'},
    {id:'AST-2024-004',name:'Kedai Pejabat Kawasan Industri',value:2800000,type:'Commercial',status:'Under Maintenance',location:'Johor Bahru',taxtaxNo:'CT-JHR-2024-004890',doortaxNo:'CP-JHR-2024-001234'},
    {id:'AST-2024-005',name:'Gudang Bekalan Strategik',value:6500000,type:'Industrial',status:'Active',location:'Penang',taxtaxNo:'CT-PNG-2024-005012',doortaxNo:'CP-PNG-2024-003456'},
    {id:'AST-2024-006',name:'Tanah Pertanian Hulu Langat',value:15000000,type:'Land',status:'Active',location:'Selangor',taxtaxNo:'CT-SLG-2024-006234',doortaxNo:'CP-SLG-2024-005678'},
    {id:'AST-2024-007',name:'Bangunan Mahkamah Daerah',value:5500000,type:'Office Building',status:'Under Valuation',location:'Kuantan',taxtaxNo:'CT-PNG-2024-007456',doortaxNo:'CP-PNG-2024-007890'},
    {id:'AST-2024-008',name:'Klinik Kesihatan Komuniti',value:1800000,type:'Office Building',status:'Active',location:'Ipoh',taxtaxNo:'CT-PRK-2024-008678',doortaxNo:'CP-PRK-2024-009012'},
    {id:'AST-2024-009',name:'Gerai Pasar Awam Daerah',value:890000,type:'Commercial',status:'Active',location:'Kota Bharu',taxtaxNo:'CT-KTN-2024-009890',doortaxNo:'CP-KTN-2024-001234'},
    {id:'AST-2024-010',name:'Tapak Projek Perumahan PPR',value:28000000,type:'Land',status:'Active',location:'Kuala Lumpur',taxtaxNo:'CT-KL-2024-010012',doortaxNo:'CP-KL-2024-003456'},
    {id:'AST-2024-011',name:'Kompleks Sukan Daerah',value:9800000,type:'Commercial',status:'Under Maintenance',location:'Shah Alam',taxtaxNo:'CT-SLG-2024-011234',doortaxNo:'CP-SLG-2024-007890'},
    {id:'AST-2024-012',name:'Bangunan Arkib Negara Cawangan',value:11200000,type:'Office Building',status:'Active',location:'Putrajaya',taxtaxNo:'CT-PJ-2024-012456',doortaxNo:'CP-PJ-2024-009012'},
    {id:'AST-2024-013',name:'Tanah Rezab Orang Asli',value:4200000,type:'Land',status:'Active',location:'Pahang',taxtaxNo:'CT-PHG-2024-013678',doortaxNo:'CP-PHG-2024-001234'},
    {id:'AST-2024-014',name:'Rumah Transit Pekerja Awam',value:7400000,type:'Residential',status:'Active',location:'Kuala Lumpur',taxtaxNo:'CT-KL-2024-014890',doortaxNo:'CP-KL-2024-005678'},
    {id:'AST-2024-015',name:'Stor Peralatan JKR',value:2100000,type:'Industrial',status:'Inactive',location:'Seremban',taxtaxNo:'CT-NGS-2024-015012',doortaxNo:'CP-NGS-2024-003456'},
  ];
}
function demoTenants() {
  return [
    {name:'Syarikat Teknologi Maju',rental:15000,status:'Active',startDate:'2022-01-01'},
    {name:'Koperasi Kakitangan Kerajaan',rental:8500,status:'Expiring Soon',startDate:'2021-06-01'},
    {name:'Restoran Warisan Budi',rental:3200,status:'Active',startDate:'2023-03-01'},
    {name:'Jabatan Imigresen Malaysia',rental:5000,status:'Expiring Soon',startDate:'2020-09-01'},
    {name:'Pos Malaysia Berhad',rental:22000,status:'Active',startDate:'2019-01-01'},
    {name:'Bank Simpanan Nasional',rental:9800,status:'Active',startDate:'2022-08-01'},
  ];
}
function demoMaint() {
  return [
    {description:'Servis HVAC tahunan',estimatedCost:12500,status:'Pending',scheduledDate:'2026-04-15'},
    {description:'Pemeriksaan panel elektrik',estimatedCost:8800,status:'In Progress',scheduledDate:'2026-04-20'},
    {description:'Paip pecah aras 8',estimatedCost:2650,status:'Completed',scheduledDate:'2026-03-28'},
  ];
}

document.addEventListener('DOMContentLoaded', loadDashboard);
