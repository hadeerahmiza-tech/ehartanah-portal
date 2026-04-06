/* ================================================================
   e-Hartanah Portal — Map Utilities (Leaflet.js)
   ================================================================ */

// Asset coordinates (mock demo data — in production, use actual lat/lng)
const ASSET_LOCATIONS = {
  'AST-001': {lat:3.1390,lng:101.6869,name:'Bangunan Pejabat Utama, Lot 3A',loc:'Kuala Lumpur'},
  'AST-002': {lat:2.7258,lng:101.6964,name:'Tanah Rizab Kerajaan Precinct 8',loc:'Putrajaya'},
  'AST-003': {lat:3.0573,lng:101.5243,name:'Kompleks Perumahan Pegawai',loc:'Selangor'},
  'AST-004': {lat:1.4854,lng:103.7618,name:'Kedai Pejabat Kawasan Industri',loc:'Johor Bahru'},
  'AST-005': {lat:5.4164,lng:100.3377,name:'Gudang Bekalan Strategik',loc:'Penang'},
  'AST-006': {lat:2.9264,lng:101.5244,name:'Tanah Pertanian Hulu Langat',loc:'Selangor'},
  'AST-007': {lat:3.8048,lng:103.3256,name:'Bangunan Mahkamah Daerah',loc:'Kuantan'},
  'AST-008': {lat:4.5975,lng:101.4858,name:'Klinik Kesihatan Komuniti',loc:'Ipoh'},
  'AST-009': {lat:6.1256,lng:102.1381,name:'Gerai Pasar Awam Daerah',loc:'Kota Bharu'},
  'AST-010': {lat:3.1390,lng:101.5880,name:'Tapak Projek Perumahan PPR',loc:'Kuala Lumpur'},
  'AST-011': {lat:3.0731,lng:101.5501,name:'Kompleks Sukan Daerah',loc:'Shah Alam'},
  'AST-012': {lat:2.7258,lng:101.6964,name:'Bangunan Arkib Negara Cawangan',loc:'Putrajaya'},
  'AST-013': {lat:4.2088,lng:103.3256,name:'Tanah Rezab Orang Asli',loc:'Pahang'},
  'AST-014': {lat:3.1390,lng:101.6869,name:'Rumah Transit Pekerja Awam',loc:'Kuala Lumpur'},
  'AST-015': {lat:2.7286,lng:101.9424,name:'Stor Peralatan JKR',loc:'Seremban'},
};

// Marker colors by status
const STATUS_COLORS = {
  'Active': '#059669',           // green
  'Under Maintenance': '#d97706', // amber
  'Under Valuation': '#7c3aed',   // purple
  'Inactive': '#94a3b8',          // slate
  'Disposed': '#dc2626',          // red
  'Expiring Soon': '#d97706',     // amber
  'Expired': '#dc2626',           // red
};

function getMarkerColor(status) {
  return STATUS_COLORS[status] || '#64748b';
}

function createMarker(asset, map) {
  const loc = ASSET_LOCATIONS[asset.id];
  if (!loc) return null;

  const color = getMarkerColor(asset.status);
  const html = `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `;

  const icon = L.divIcon({
    html,
    iconSize: [32, 32],
    className: 'asset-marker'
  });

  const marker = L.marker([loc.lat, loc.lng], {icon}).addTo(map);

  const popup = `
    <div style="font-size:0.75rem;min-width:200px;">
      <p style="margin:0 0 6px;font-weight:600;color:#0f172a;">${asset.name}</p>
      <div style="background:#f1f5f9;padding:6px;border-radius:4px;margin-bottom:6px;font-size:0.7rem;">
        <p style="margin:0;">📍 <strong>${loc.loc}</strong></p>
        <p style="margin:2px 0 0;color:#64748b;">${asset.address||''}</p>
      </div>
      <p style="margin:0 0 3px;font-size:0.7rem;"><strong>Jenis:</strong> ${asset.type}</p>
      <p style="margin:0 0 3px;font-size:0.7rem;"><strong>Status:</strong> ${asset.status}</p>
      <p style="margin:0 0 3px;font-size:0.7rem;"><strong>Nilai:</strong> RM ${(asset.value||0).toLocaleString()}</p>
      <div style="background:#f8fafc;padding:6px;border-radius:4px;margin:6px 0;font-size:0.7rem;">
        <p style="margin:0 0 2px;color:#475569;"><strong>Cukai Tanah (CT):</strong> ${asset.taxtaxNo||'—'}</p>
        <p style="margin:0;color:#475569;"><strong>Cukai Pintu (CP):</strong> ${asset.doortaxNo||'—'}</p>
      </div>
    </div>
  `;

  marker.bindPopup(popup);
  return marker;
}

function createLegend(map) {
  const legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', '');
    div.style.background = 'white';
    div.style.padding = '10px 12px';
    div.style.borderRadius = '6px';
    div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    div.style.fontSize = '0.72rem';
    div.style.lineHeight = '1.5';

    const items = [
      ['#059669', 'Aktif'],
      ['#d97706', 'Penyelenggaraan / Tamat'],
      ['#7c3aed', 'Penilaian'],
      ['#94a3b8', 'Tidak Aktif'],
      ['#dc2626', 'Dilupuskan'],
    ];

    let html = '<p style="margin:0 0 6px;font-weight:600;color:#0f172a;">Legenda</p>';
    items.forEach(([color, label]) => {
      html += `<div style="display:flex;align-items:center;gap:6px;margin:4px 0;">
        <div style="width:12px;height:12px;background:${color};border-radius:50%;border:1px solid white;"></div>
        <span style="color:#475569;">${label}</span>
      </div>`;
    });

    div.innerHTML = html;
    return div;
  };

  legend.addTo(map);
}

function renderAssetMap(assets) {
  const container = document.getElementById('asset-map');
  if (!container) return;

  const map = L.map(container).setView([3.1390, 101.6869], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // Filter to MAIWP region if needed (or show all for this page)
  assets.forEach(asset => createMarker(asset, map));
  createLegend(map);

  return map;
}

function renderLeasingMap(tenants) {
  const container = document.getElementById('leasing-map');
  if (!container) return;

  const map = L.map(container).setView([3.1390, 101.6869], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // For tenants, we need to extract unique property names and create markers
  // This is simplified — in production you'd have property locations
  const propertyMap = {};
  tenants.forEach(tenant => {
    const prop = tenant.property;
    if (!propertyMap[prop]) {
      propertyMap[prop] = [];
    }
    propertyMap[prop].push(tenant);
  });

  Object.keys(propertyMap).forEach(propName => {
    const tenantList = propertyMap[propName];
    const firstTenant = tenantList[0];

    // Create a simplified asset object for marker rendering
    const assetLike = {
      id: `LEASE-${Object.keys(propertyMap).indexOf(propName)}`,
      name: propName,
      address: propName,
      type: firstTenant.type,
      status: firstTenant.status,
      value: firstTenant.rental * 12, // annual rental value
      taxtaxNo: '—',
      doortaxNo: '—'
    };

    // Use a location from ASSET_LOCATIONS if available, otherwise randomize near KL
    const firstAssetLoc = Object.values(ASSET_LOCATIONS)[Object.keys(propertyMap).indexOf(propName) % Object.keys(ASSET_LOCATIONS).length];
    const loc = firstAssetLoc || {lat: 3.1390 + (Math.random()-0.5)*0.5, lng: 101.6869 + (Math.random()-0.5)*0.5, loc: 'Malaysia'};
    ASSET_LOCATIONS[assetLike.id] = loc;

    const color = STATUS_COLORS[firstTenant.status] || '#64748b';
    const html = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `;

    const icon = L.divIcon({html, iconSize: [32, 32], className: 'lease-marker'});
    const marker = L.marker([loc.lat, loc.lng], {icon}).addTo(map);

    const popup = `
      <div style="font-size:0.75rem;min-width:220px;">
        <p style="margin:0 0 6px;font-weight:600;color:#0f172a;">${propName}</p>
        <p style="margin:0 0 6px;font-size:0.7rem;color:#64748b;">${tenantList.length} penyewa</p>
        <div style="background:#f1f5f9;padding:8px;border-radius:4px;font-size:0.7rem;max-height:120px;overflow-y:auto;">
          ${tenantList.map(t=>`
            <div style="margin-bottom:4px;padding-bottom:4px;border-bottom:1px solid #cbd5e1;">
              <p style="margin:0;font-weight:500;color:#0f172a;">${t.name}</p>
              <p style="margin:2px 0 0;color:#475569;"><strong>RM ${t.rental.toLocaleString()}</strong>/bulan</p>
              <p style="margin:2px 0 0;color:#64748b;">${t.status}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    marker.bindPopup(popup);
  });

  createLegend(map);
  return map;
}

function renderMaintenanceMap(maintenance) {
  const container = document.getElementById('maintenance-map');
  if (!container) return;

  const map = L.map(container).setView([3.1390, 101.6869], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // Group maintenance by property
  const propertyMap = {};
  maintenance.forEach(mnt => {
    const prop = mnt.property;
    if (!propertyMap[prop]) {
      propertyMap[prop] = [];
    }
    propertyMap[prop].push(mnt);
  });

  Object.keys(propertyMap).forEach((propName, idx) => {
    const mntList = propertyMap[propName];
    const firstMnt = mntList[0];

    const assetLike = {
      id: `MNT-${idx}`,
      name: propName,
      address: propName,
      type: firstMnt.category,
      status: firstMnt.status,
      value: firstMnt.estimatedCost,
      taxtaxNo: '—',
      doortaxNo: '—'
    };

    const firstAssetLoc = Object.values(ASSET_LOCATIONS)[idx % Object.keys(ASSET_LOCATIONS).length];
    const loc = firstAssetLoc || {lat: 3.1390 + (Math.random()-0.5)*0.5, lng: 101.6869 + (Math.random()-0.5)*0.5, loc: 'Malaysia'};
    ASSET_LOCATIONS[assetLike.id] = loc;

    const statusForColor = firstMnt.status==='Completed'?'Active':firstMnt.priority==='High'?'Under Maintenance':'Active';
    const color = getMarkerColor(statusForColor);
    const html = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `;

    const icon = L.divIcon({html, iconSize: [32, 32], className: 'mnt-marker'});
    const marker = L.marker([loc.lat, loc.lng], {icon}).addTo(map);

    const popup = `
      <div style="font-size:0.75rem;min-width:240px;">
        <p style="margin:0 0 6px;font-weight:600;color:#0f172a;">${propName}</p>
        <p style="margin:0 0 6px;font-size:0.7rem;color:#64748b;">${mntList.length} kerja penyelenggaraan</p>
        <div style="background:#f1f5f9;padding:8px;border-radius:4px;font-size:0.7rem;max-height:120px;overflow-y:auto;">
          ${mntList.map(m=>`
            <div style="margin-bottom:4px;padding-bottom:4px;border-bottom:1px solid #cbd5e1;">
              <p style="margin:0;font-weight:500;color:#0f172a;">${m.id}: ${m.category}</p>
              <p style="margin:2px 0 0;color:#475569;font-size:0.65rem;max-height:24px;overflow:hidden;">${m.description}</p>
              <p style="margin:2px 0 0;color:#64748b;"><strong>${m.status}</strong> • ${m.priority}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    marker.bindPopup(popup);
  });

  createLegend(map);
  return map;
}

function renderValuationMap(valuations) {
  const container = document.getElementById('valuation-map');
  if (!container) return;

  const map = L.map(container).setView([3.1390, 101.6869], 10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  valuations.forEach((val, idx) => {
    const assetLike = {
      id: val.id,
      name: val.name,
      address: val.location,
      type: val.type,
      status: val.status,
      value: val.market,
      taxtaxNo: '—',
      doortaxNo: '—'
    };

    const firstAssetLoc = Object.values(ASSET_LOCATIONS)[idx % Object.keys(ASSET_LOCATIONS).length];
    const loc = firstAssetLoc || {lat: 3.1390 + (Math.random()-0.5)*0.5, lng: 101.6869 + (Math.random()-0.5)*0.5, loc: val.location};
    ASSET_LOCATIONS[assetLike.id] = loc;

    // Color based on valuation status
    const statusForColor = val.status==='Overdue'?'Inactive':val.status==='Due Soon'?'Under Valuation':'Active';
    const color = getMarkerColor(statusForColor);
    const html = `
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `;

    const icon = L.divIcon({html, iconSize: [32, 32], className: 'val-marker'});
    const marker = L.marker([loc.lat, loc.lng], {icon}).addTo(map);

    const chg = ((val.market-val.cost)/val.cost*100).toFixed(1);
    const popup = `
      <div style="font-size:0.75rem;min-width:220px;">
        <p style="margin:0 0 6px;font-weight:600;color:#0f172a;">${val.name}</p>
        <p style="margin:0 0 6px;font-size:0.7rem;color:#64748b;">${val.location}</p>
        <p style="margin:0 0 3px;font-size:0.7rem;"><strong>Jenis:</strong> ${val.type}</p>
        <p style="margin:0 0 3px;font-size:0.7rem;"><strong>Status:</strong> ${val.status}</p>
        <div style="background:#f1f5f9;padding:8px;border-radius:4px;margin:6px 0;font-size:0.7rem;">
          <p style="margin:0 0 4px;"><strong>Nilai Perolehan:</strong> RM ${val.cost.toLocaleString()}</p>
          <p style="margin:0 0 4px;"><strong>Nilai Pasaran:</strong> RM ${val.market.toLocaleString()}</p>
          <p style="margin:0;"><strong>Perubahan:</strong> <span style="color:${parseFloat(chg)>=0?'#059669':'#dc2626'};">${parseFloat(chg)>=0?'+':''}${chg}%</span></p>
        </div>
        <p style="margin:0;color:#64748b;font-size:0.65rem;">Penilaian Terakhir: ${formatDate(val.last)}</p>
      </div>
    `;

    marker.bindPopup(popup);
  });

  createLegend(map);
  return map;
}
