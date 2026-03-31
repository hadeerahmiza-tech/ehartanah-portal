/* ================================================================
   e-Hartanah Portal — Shared Nav & Utilities
   Matches corrad-laravel design system (Lucide icons, slate palette)
   ================================================================ */

/* ─── Navigation config ──────────────────────────────────────── */
/* Icons: Lucide-style, stroke-width="1.5", viewBox="0 0 24 24"  */
const NAV = [
  {
    id: 'dashboard', label: 'Dashboard', href: 'dashboard.html',
    /* Lucide: LayoutDashboard */
    icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
  },
  {
    id: 'assets', label: 'Pengurusan Aset', href: 'assets.html',
    /* Lucide: Building2 */
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18"/><path stroke-linecap="round" stroke-linejoin="round" d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path stroke-linecap="round" stroke-linejoin="round" d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path stroke-linecap="round" stroke-linejoin="round" d="M10 6h4M10 10h4M10 14h4M10 18h4"/>'
  },
  {
    id: 'leasing', label: 'Pajakan & Sewa', href: 'leasing.html',
    /* Lucide: FileText */
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path stroke-linecap="round" stroke-linejoin="round" d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>'
  },
  {
    id: 'maintenance', label: 'Penyelenggaraan', href: 'maintenance.html',
    /* Lucide: Wrench */
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>'
  },
  {
    id: 'valuation', label: 'Penilaian', href: 'valuation.html',
    /* Lucide: TrendingUp */
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M23 6l-9.5 9.5-5-5L1 18"/><path stroke-linecap="round" stroke-linejoin="round" d="M17 6h6v6"/>'
  },
  {
    id: 'disposal', label: 'Pelupusan', href: 'disposal.html',
    /* Lucide: ArrowRightLeft */
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M21 7H3M21 7l-4-4M21 7l-4 4M3 17h18M3 17l4-4M3 17l4 4"/>'
  },
  {
    id: 'reports', label: 'Laporan', href: 'reports.html',
    /* Lucide: BarChart2 */
    icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M18 20V10M12 20V4M6 20v-6"/>'
  },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  assets: 'Pengurusan Aset',
  leasing: 'Pajakan & Penyewaan',
  maintenance: 'Penyelenggaraan',
  valuation: 'Penilaian Harta',
  disposal: 'Pelupusan Aset',
  reports: 'Laporan & Analitik',
};

function getUser() {
  try { return JSON.parse(localStorage.getItem('ehartanah_user') || '{}'); } catch { return {}; }
}

function initNav(active) {
  const user = getUser();
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  /* ── Sidebar ──────────────────────────────────────────────── */
  const sb = document.getElementById('sidebar');
  if (sb) sb.innerHTML = `
    <aside class="sidebar">

      <!-- Logo area: bg-white border-b px-3 py-3 -->
      <div style="background:#fff;border-bottom:1px solid #e2e8f0;padding:10px 12px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <!-- Lucide-style building icon in gradient square — h-8 w-8 rounded-lg -->
          <div style="width:32px;height:32px;border-radius:8px;flex-shrink:0;background:linear-gradient(135deg,var(--accent-700),var(--accent-500));display:flex;align-items:center;justify-content:center;">
            <svg width="16" height="16" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18"/>
              <path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/>
              <path d="M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/>
              <path d="M10 6h4M10 10h4M10 14h4M10 18h4"/>
            </svg>
          </div>
          <div>
            <div style="font-size:0.875rem;font-weight:700;color:#0f172a;line-height:1.2;letter-spacing:-0.01em;">e-Hartanah</div>
            <div style="font-size:0.7rem;color:#94a3b8;line-height:1.3;">Portal Pengurusan Harta</div>
          </div>
        </div>
      </div>

      <!-- Nav links -->
      <nav style="flex:1;overflow-y:auto;padding:8px 8px;">
        <p class="nav-section" style="padding:0 8px;">Menu Utama</p>
        ${NAV.slice(0, 5).map(n => `
          <a href="${n.href}" class="nav-item${active === n.id ? ' active' : ''}">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${n.icon}</svg>
            <span>${n.label}</span>
          </a>
        `).join('')}

        <p class="nav-section" style="padding:0 8px;">Pengurusan</p>
        ${NAV.slice(5).map(n => `
          <a href="${n.href}" class="nav-item${active === n.id ? ' active' : ''}">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${n.icon}</svg>
            <span>${n.label}</span>
          </a>
        `).join('')}

        <p class="nav-section" style="padding:0 8px;">Sistem</p>
        <a href="index.html" class="nav-item" onclick="localStorage.removeItem('ehartanah_user')">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <!-- Lucide: LogOut -->
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span>Log Keluar</span>
        </a>
      </nav>

      <!-- User footer -->
      <div style="border-top:1px solid #e2e8f0;padding:10px 12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent-600),var(--accent-500));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;">${initial}</div>
          <div style="min-width:0;">
            <div style="font-size:0.8rem;font-weight:600;color:#0f172a;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.name || 'Pengguna'}</div>
            <div style="font-size:0.68rem;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${user.role || 'Admin'}</div>
          </div>
        </div>
        <p style="font-size:11px;color:#94a3b8;margin:8px 0 0;line-height:1.5;">e-Hartanah Portal v1.0<br>Kementerian Kewangan Malaysia</p>
      </div>
    </aside>
  `;

  /* ── Topbar ───────────────────────────────────────────────── */
  /* h-10, sticky top-0 z-40, border-b border-slate-200 bg-white */
  const tb = document.getElementById('topbar');
  if (tb) tb.innerHTML = `
    <div class="topbar">

      <!-- Logo icon — small h-5 w-5 rounded gradient -->
      <div style="display:flex;align-items:center;height:100%;padding:0 14px;border-right:1px solid #e2e8f0;gap:8px;">
        <div style="width:20px;height:20px;border-radius:5px;background:linear-gradient(135deg,var(--accent-700),var(--accent-500));display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="11" height="11" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18"/>
            <path d="M10 6h4M10 10h4M10 14h4"/>
          </svg>
        </div>
        <!-- Site title — text-sm font-light, max 20 chars truncated -->
        <span style="font-size:0.875rem;font-weight:300;color:#0f172a;letter-spacing:-0.01em;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">e-Hartanah Portal</span>
      </div>

      <!-- Breadcrumb -->
      <div style="display:flex;align-items:center;height:100%;padding:0 12px;flex:1;gap:6px;border-right:1px solid #e2e8f0;">
        <span style="font-size:0.75rem;color:#94a3b8;">Portal</span>
        <svg width="12" height="12" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        <span style="font-size:0.75rem;font-weight:500;color:#475569;">${PAGE_TITLES[active] || ''}</span>
      </div>

      <!-- Date -->
      <div style="display:flex;align-items:center;height:100%;padding:0 12px;border-right:1px solid #e2e8f0;">
        <span style="font-size:0.72rem;color:#94a3b8;">${new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      <!-- Bell — Lucide: Bell -->
      <button class="topbar-btn" onclick="showNotifications()" style="border-right:1px solid #e2e8f0;position:relative;">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <!-- Notification dot -->
        <span style="position:absolute;top:8px;right:10px;width:6px;height:6px;background:#f43f5e;border-radius:50%;border:1.5px solid #fff;"></span>
        <span class="tooltip">Notifikasi</span>
      </button>

      <!-- User area -->
      <a href="#" class="topbar-user" onclick="return false;">
        <div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,var(--accent-600),var(--accent-500));display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0;">${initial}</div>
        <div>
          <div class="user-name" style="font-size:0.8rem;font-weight:500;color:#334155;line-height:1.2;">${user.name || 'Pengguna'}</div>
          <div class="user-role" style="font-size:0.68rem;color:#94a3b8;line-height:1.2;">${user.role || 'Admin'}</div>
        </div>
      </a>

      <!-- Logout — Lucide: LogOut -->
      <a href="index.html" class="topbar-btn" onclick="localStorage.removeItem('ehartanah_user')" style="border-left:1px solid #e2e8f0;">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        <span class="tooltip">Log Keluar</span>
      </a>

    </div>
  `;
}

/* ─── Utilities ──────────────────────────────────────────────── */
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(n) {
  if (n >= 1e6) return 'RM ' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return 'RM ' + (n / 1e3).toFixed(0) + 'K';
  return 'RM ' + n.toLocaleString();
}

function statusBadge(s) {
  const m = {
    'Active': 'badge-active', 'Aktif': 'badge-active',
    'Under Maintenance': 'badge-maintenance', 'Penyelenggaraan': 'badge-maintenance',
    'Under Valuation': 'badge-valuation',
    'Inactive': 'badge-inactive', 'Tidak Aktif': 'badge-inactive',
    'Disposed': 'badge-inactive',
    'Pending': 'badge-pending', 'In Progress': 'badge-inprogress',
    'Completed': 'badge-completed', 'Selesai': 'badge-completed',
    'Expiring Soon': 'badge-expiring', 'Expired': 'badge-expired',
    'Freehold': 'badge-freehold', 'Leasehold': 'badge-leasehold', 'Strata Title': 'badge-strata',
    'Federal': 'badge-federal', 'State': 'badge-state',
    'High': 'badge-high', 'Medium': 'badge-medium', 'Low': 'badge-low',
    'Government': 'badge-federal', 'Government-Linked': 'badge-inprogress',
    'Commercial': 'badge-medium',
  };
  return `<span class="badge ${m[s] || 'badge-inactive'}">${s}</span>`;
}

/* Toast — corrad: gradient bg, rounded-lg, bottom-right, slide in/out */
function showToast(msg, type = 'success') {
  const styles = {
    success: { bg: 'linear-gradient(135deg,#a7f3d0,#d1fae5)', color: '#064e3b', border: '#6ee7b7' },
    error:   { bg: 'linear-gradient(135deg,#fecaca,#fee2e2)', color: '#7f1d1d', border: '#fca5a5' },
    info:    { bg: 'linear-gradient(135deg,#bfdbfe,#dbeafe)', color: '#1e3a8a', border: '#93c5fd' },
    warning: { bg: 'linear-gradient(135deg,#fde68a,#fef3c7)', color: '#78350f', border: '#fcd34d' },
  };
  const s = styles[type] || styles.success;

  /* Icon paths (Lucide) */
  const icons = {
    success: '<path stroke-linecap="round" stroke-linejoin="round" d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path stroke-linecap="round" stroke-linejoin="round" d="M22 4L12 14.01l-3-3"/>',
    error:   '<circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 9l-6 6M9 9l6 6"/>',
    info:    '<circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4M12 8h.01"/>',
    warning: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4M12 17h.01"/>',
  };

  const t = document.createElement('div');
  t.style.cssText = [
    'position:fixed', 'bottom:20px', 'right:20px', 'z-index:9999',
    `background:${s.bg}`, `color:${s.color}`,
    `border:1px solid ${s.border}`,
    'padding:10px 14px', 'border-radius:10px',
    'font-size:0.875rem', 'font-weight:500',
    'box-shadow:0 4px 20px rgba(0,0,0,0.12)',
    'display:flex', 'align-items:center', 'gap:10px',
    'max-width:320px', 'min-width:200px',
    'animation:slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) both',
  ].join(';');

  t.innerHTML = `
    <div style="width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,0.5);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">${icons[type] || icons.success}</svg>
    </div>
    <span style="flex:1;line-height:1.4;">${msg}</span>
  `;

  document.body.appendChild(t);
  setTimeout(() => {
    t.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4,0,1,1) both';
    setTimeout(() => t.remove(), 400);
  }, 3000);
}

function simulateExport(fmt, name) {
  showToast(`Mengeksport ${name}.${fmt.toLowerCase()}...`, 'info');
  setTimeout(() => showToast(`${name}.${fmt.toLowerCase()} berjaya dimuat turun`, 'success'), 1600);
}

function showNotifications() {
  showToast('3 pajakan hampir tamat · 2 penyelenggaraan aktif', 'warning');
}
