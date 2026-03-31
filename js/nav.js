/* ================================================================
   e-Hartanah Portal — Shared Nav
   Matches: github.com/mfauzzury/corrad-laravel AdminLayout.vue
   ================================================================ */

/* Lucide icon paths — all use stroke-linecap/join="round", stroke-width="1.5" */
const NAV = [
  { id:'dashboard',   label:'Dashboard',        href:'dashboard.html',
    icon:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
  { id:'assets',      label:'Pengurusan Aset',  href:'assets.html',
    /* Building2 */
    icon:'<path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>' },
  { id:'leasing',     label:'Pajakan & Sewa',   href:'leasing.html',
    /* FileText */
    icon:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>' },
  { id:'maintenance', label:'Penyelenggaraan',  href:'maintenance.html',
    /* Wrench */
    icon:'<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>' },
  { id:'valuation',   label:'Penilaian',        href:'valuation.html',
    /* TrendingUp */
    icon:'<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>' },
  { id:'disposal',    label:'Pelupusan',        href:'disposal.html',
    /* ArrowRightLeft */
    icon:'<path d="M21 7H3M21 7l-4-4M21 7l-4 4M3 17h18M3 17l4-4M3 17l4 4"/>' },
  { id:'reports',     label:'Laporan',          href:'reports.html',
    /* BarChart2 */
    icon:'<path d="M18 20V10M12 20V4M6 20v-6"/>' },
];

const PAGE_TITLES = {
  dashboard:'Dashboard', assets:'Pengurusan Aset', leasing:'Pajakan & Penyewaan',
  maintenance:'Penyelenggaraan', valuation:'Penilaian Harta',
  disposal:'Pelupusan Aset', reports:'Laporan & Analitik',
};

function getUser() {
  try { return JSON.parse(localStorage.getItem('ehartanah_user') || '{}'); } catch { return {}; }
}

function svgIcon(paths, size=16) {
  return `<svg width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${paths}</svg>`;
}

function initNav(active) {
  const user = getUser();
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  /* ── Sidebar ──────────────────────────────────────────────── */
  /* bg-slate-50/50 border-r border-slate-200, w-64 */
  const sb = document.getElementById('sidebar');
  if (sb) sb.innerHTML = `
    <aside class="sidebar">

      <!-- Logo area: bg-white border-b px-3 py-3 -->
      <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <!-- Shield icon in gradient square — matches corrad login logo -->
          <div style="width:32px;height:32px;border-radius:8px;flex-shrink:0;background:linear-gradient(135deg,var(--accent-600),var(--accent-500));display:flex;align-items:center;justify-content:center;">
            ${svgIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', 16)}
          </div>
          <div>
            <div style="font-size:0.875rem;font-weight:700;color:#0f172a;letter-spacing:-0.01em;line-height:1.2;">e-Hartanah</div>
            <div style="font-size:0.7rem;color:#94a3b8;line-height:1.3;">Portal Pengurusan Harta</div>
          </div>
        </div>
      </div>

      <!-- Nav: p-3 -->
      <nav style="flex:1;overflow-y:auto;padding:12px 8px;">
        <p class="nav-section">Menu Utama</p>
        ${NAV.slice(0,5).map(n=>`
          <a href="${n.href}" class="nav-item${active===n.id?' active':''}">
            ${svgIcon(n.icon,16)}
            <span>${n.label}</span>
          </a>`).join('')}

        <p class="nav-section">Pengurusan</p>
        ${NAV.slice(5).map(n=>`
          <a href="${n.href}" class="nav-item${active===n.id?' active':''}">
            ${svgIcon(n.icon,16)}
            <span>${n.label}</span>
          </a>`).join('')}

        <p class="nav-section">Sistem</p>
        <a href="index.html" class="nav-item" onclick="localStorage.removeItem('ehartanah_user')">
          ${svgIcon('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',16)}
          <span>Log Keluar</span>
        </a>
      </nav>

      <!-- Footer: border-t border-slate-200 px-3 py-2.5 text-[11px] text-slate-400 -->
      <div style="border-top:1px solid #e2e8f0;padding:10px 12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent-600),var(--accent-500));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#fff;flex-shrink:0;">${initial}</div>
          <div style="min-width:0;">
            <div style="font-size:0.8rem;font-weight:600;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.name||'Pengguna'}</div>
            <div style="font-size:0.68rem;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.role||'Admin'}</div>
          </div>
        </div>
        <p style="font-size:11px;color:#94a3b8;margin:8px 0 0;line-height:1.6;">e-Hartanah Portal v1.0<br>Kementerian Kewangan Malaysia</p>
      </div>
    </aside>
  `;

  /* ── Topbar ───────────────────────────────────────────────── */
  /* sticky top-0 z-40 h-10 flex items-center justify-between border-b border-slate-200 bg-white px-5
     Structure (left → right):
       [shield icon] [site title] [divider] [toast region] [divider] [user] [divider] [settings] [divider] [bell] [divider] [logout]
  */
  const tb = document.getElementById('topbar');
  if (tb) tb.innerHTML = `
    <div class="topbar">

      <!-- Left: icon + title -->
      <div style="display:flex;align-items:center;gap:4px;padding:0 16px;border-right:1px solid #e2e8f0;height:100%;">
        <!-- Shield icon: h-[18px] w-[18px] rounded-md gradient -->
        <div style="width:18px;height:18px;border-radius:4px;background:linear-gradient(135deg,var(--accent-600),var(--accent-500));display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${svgIcon('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',11)}
        </div>
        <!-- Site title: text-sm font-light, truncated max-20 chars -->
        <span style="font-size:0.875rem;font-weight:300;color:#0f172a;padding-left:6px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">e-Hartanah Portal</span>
      </div>

      <!-- Toast region (inline in topbar — matches corrad AppToastRegion) -->
      <div id="topbar-toast" style="display:flex;align-items:stretch;height:100%;overflow:hidden;max-width:22rem;flex:1;"></div>

      <!-- Right group -->
      <div style="display:flex;align-items:stretch;height:100%;margin-left:auto;">

        <!-- User: gap-2 px-4 hover:bg-[--accent-600] -->
        <a href="#" class="topbar-user" style="border-left:1px solid #e2e8f0;" onclick="return false;" title="${user.name||'Pengguna'}">
          <div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--accent-600),var(--accent-500));display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;flex-shrink:0;">${initial}</div>
          <div style="line-height:1.25;">
            <p class="user-name" style="font-size:0.875rem;font-weight:500;color:#334155;margin:0;">${user.name||'Pengguna'}</p>
            <p class="user-role" style="font-size:11px;color:#64748b;margin:0;">${user.role||'Admin'}</p>
          </div>
        </a>

        <!-- Settings gear -->
        <button class="topbar-btn" onclick="showToast('Tetapan tema — akan datang','info')" style="border-left:1px solid #e2e8f0;">
          ${svgIcon('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',16)}
          <span class="tooltip">Tetapan</span>
        </button>

        <!-- Bell with red dot -->
        <button class="topbar-btn" onclick="showNotifications()" style="border-left:1px solid #e2e8f0;position:relative;">
          ${svgIcon('<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',16)}
          <span style="position:absolute;top:8px;right:10px;width:8px;height:8px;background:#f43f5e;border-radius:50%;border:2px solid #fff;"></span>
          <span class="tooltip">Notifikasi</span>
        </button>

        <!-- Logout: LogOut icon -->
        <a href="index.html" class="topbar-btn" onclick="localStorage.removeItem('ehartanah_user')" style="border-left:1px solid #e2e8f0;">
          ${svgIcon('<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',16)}
          <span class="tooltip">Log Keluar</span>
        </a>

      </div>
    </div>
  `;
}

/* ─── Utilities ──────────────────────────────────────────────── */
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ms-MY', { day:'2-digit', month:'short', year:'numeric' });
}
function formatCurrency(n) {
  if (n >= 1e6) return 'RM ' + (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return 'RM ' + (n/1e3).toFixed(0) + 'K';
  return 'RM ' + n.toLocaleString();
}
function statusBadge(s) {
  const m = {
    'Active':'badge-active','Aktif':'badge-active',
    'Under Maintenance':'badge-maintenance','Penyelenggaraan':'badge-maintenance',
    'Under Valuation':'badge-valuation',
    'Inactive':'badge-inactive','Tidak Aktif':'badge-inactive','Disposed':'badge-inactive',
    'Pending':'badge-pending','In Progress':'badge-inprogress',
    'Completed':'badge-completed','Selesai':'badge-completed',
    'Expiring Soon':'badge-expiring','Expired':'badge-expired',
    'Freehold':'badge-freehold','Leasehold':'badge-leasehold','Strata Title':'badge-strata',
    'Federal':'badge-federal','State':'badge-state',
    'High':'badge-high','Medium':'badge-medium','Low':'badge-low',
    'Government':'badge-federal','Government-Linked':'badge-inprogress','Commercial':'badge-medium',
  };
  return `<span class="badge ${m[s]||'badge-inactive'}">${s}</span>`;
}

/* ─── Toast — matches corrad AppToastRegion exactly ─────────── */
/* In corrad: toast lives INSIDE the topbar (AppToastRegion).
   We replicate: gradient bg, icon circle, slide in/out from right,
   text-[10px] uppercase label + text-xs message */
function showToast(msg, type='success') {
  const variants = {
    success: {
      wrap: 'background:linear-gradient(135deg,#6ee7b7,#a7f3d0);color:#022c22;',
      icon: 'background:#bbf7d0;color:#065f46;box-shadow:0 0 0 1px rgba(52,211,153,0.7);',
      label: 'SUCCESS',
      path: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',
    },
    error: {
      wrap: 'background:linear-gradient(135deg,#fca5a5,#fee2e2);color:#450a0a;',
      icon: 'background:#fecaca;color:#991b1b;box-shadow:0 0 0 1px rgba(248,113,113,0.7);',
      label: 'ERROR',
      path: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
    },
    info: {
      wrap: 'background:linear-gradient(135deg,#93c5fd,#bfdbfe);color:#0c1a3d;',
      icon: 'background:#bfdbfe;color:#1e40af;box-shadow:0 0 0 1px rgba(96,165,250,0.7);',
      label: 'INFO',
      path: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    },
    warning: {
      wrap: 'background:linear-gradient(135deg,#fcd34d,#fef3c7);color:#451a03;',
      icon: 'background:#fef3c7;color:#92400e;box-shadow:0 0 0 1px rgba(251,191,36,0.7);',
      label: 'WARNING',
      path: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    },
  };
  const v = variants[type] || variants.success;

  /* Try to show inline in topbar toast region first (corrad style) */
  const region = document.getElementById('topbar-toast');
  if (region) {
    const el = document.createElement('div');
    el.style.cssText = `display:flex;align-items:center;gap:8px;height:100%;padding:0 12px;${v.wrap}will-change:transform;animation:slideInRight 0.6s cubic-bezier(0.22,1,0.36,1) both;min-width:14rem;max-width:22rem;overflow:hidden;`;
    el.innerHTML = `
      <div style="width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;${v.icon}">
        <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${v.path}</svg>
      </div>
      <div style="min-width:0;flex:1;">
        <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.11em;opacity:0.7;margin:0;line-height:1;">${v.label}</p>
        <p style="font-size:0.75rem;font-weight:600;margin:2px 0 0;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${msg}</p>
      </div>
    `;
    region.innerHTML = '';
    region.appendChild(el);
    setTimeout(() => {
      el.style.animation = 'slideOutRight 1.5s cubic-bezier(0.4,0,1,1) both';
      setTimeout(() => { if (region.contains(el)) region.removeChild(el); }, 1500);
    }, 3000);
    return;
  }

  /* Fallback: fixed bottom-right if topbar region not found */
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:20px;right:20px;z-index:9999;${v.wrap}padding:10px 14px;border-radius:10px;font-size:0.875rem;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.12);display:flex;align-items:center;gap:10px;max-width:320px;animation:slideInRight 0.3s ease both;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function simulateExport(fmt, name) {
  showToast(`Mengeksport ${name}.${fmt.toLowerCase()}...`, 'info');
  setTimeout(() => showToast(`${name}.${fmt.toLowerCase()} berjaya dimuat turun`, 'success'), 1600);
}

function showNotifications() {
  showToast('3 pajakan hampir tamat · 2 penyelenggaraan aktif', 'warning');
}
