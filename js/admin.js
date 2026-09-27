/**
 * AQUA WATER PURIFIERS - Admin Portal & CRM Dashboard Logic
 * Full management of Products, Services, Orders, Bookings, CRM, and Design
 * Version 1.0 - Powered by Kotti
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check auth
  checkAuthentication();

  // App State
  let currentTab = 'overview';
  let productFilter = 'all';
  let orderFilter = 'all';
  let bookingFilter = 'all';

  // DOM Elements
  const loginOverlay = document.getElementById('login-overlay');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const navItems = document.querySelectorAll('.admin-nav-item');
  const panes = document.querySelectorAll('.admin-tab-pane');
  const viewTitle = document.getElementById('admin-view-title');
  const toastContainer = document.getElementById('toast-container');
  const reseedBtn = document.getElementById('btn-reseed-data');

  // Modals
  const productModal = document.getElementById('product-modal');
  const serviceModal = document.getElementById('service-modal');
  const invoiceModal = document.getElementById('invoice-modal');

  // Forms
  const productForm = document.getElementById('product-edit-form');
  const serviceForm = document.getElementById('service-edit-form');
  const designForm = document.getElementById('form-design-settings');
  const integrationForm = document.getElementById('form-integration-settings');

  // Initial Boot
  initAdmin();

  function initAdmin() {
    setupNavigation();
    setupAuthListeners();
    setupModalListeners();
    setupFormListeners();
    refreshAllViews();

    // Subscribe to store updates
    AquaStore.subscribe((event, data) => {
      refreshAllViews();
    });
  }

  // ---------------- AUTHENTICATION ---------------- //
  function checkAuthentication() {
    const session = AquaStore.getSession();
    if (!session) {
      if (loginOverlay) loginOverlay.style.display = 'flex';
    } else {
      if (loginOverlay) loginOverlay.style.display = 'none';
      updateUserBadge(session);
    }
  }

  function updateUserBadge(session) {
    const nameEl = document.getElementById('admin-user-name');
    const roleEl = document.getElementById('admin-user-role');
    const avatarEl = document.getElementById('admin-user-avatar');

    if (nameEl) nameEl.textContent = session.username === 'admin' ? 'Administrator' : 'Staff Member';
    if (roleEl) roleEl.textContent = session.role;
    if (avatarEl) avatarEl.textContent = session.username.charAt(0).toUpperCase();
  }

  function setupAuthListeners() {
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('login-username').value.trim();
        const p = document.getElementById('login-password').value.trim();

        const res = AquaStore.loginAdmin(u, p);
        if (res.success) {
          loginOverlay.style.display = 'none';
          updateUserBadge(res.session);
          showToast(`Welcome back, ${res.session.role}!`, 'success');
          refreshAllViews();
        } else {
          showToast(res.error, 'danger');
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        AquaStore.logoutAdmin();
        if (loginOverlay) loginOverlay.style.display = 'flex';
        showToast('Logged out securely.', 'info');
      });
    }
  }

  // ---------------- NAVIGATION & TABS ---------------- //
  function setupNavigation() {
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        if (tab) switchTab(tab);
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && document.getElementById(`pane-${hash}`) && hash !== currentTab) {
        switchTab(hash);
      }
    });

    // Quick links from overview
    document.getElementById('btn-quick-view-orders')?.addEventListener('click', () => switchTab('orders'));
    document.getElementById('btn-quick-view-bookings')?.addEventListener('click', () => switchTab('bookings'));

    // Mobile sidebar toggle & close
    const sidebar = document.getElementById('admin-sidebar');
    document.getElementById('admin-mobile-toggle')?.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
    });
    document.getElementById('admin-sidebar-close')?.addEventListener('click', () => {
      sidebar?.classList.remove('open');
    });

    // Handle hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`pane-${hash}`)) {
      switchTab(hash);
    }
  }

  function switchTab(tabId) {
    currentTab = tabId;
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.getElementById('admin-sidebar')?.classList.remove('open');

    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    panes.forEach(p => {
      p.style.display = p.id === `pane-${tabId}` ? 'block' : 'none';
    });

    const titles = {
      overview: 'Dashboard Overview & Analytics',
      products: 'Product Management (Normal & Raindrop)',
      services: 'Service Offerings & AMC Management',
      orders: 'Customer Purifier Orders',
      bookings: 'Service & Repair Appointments',
      crm: 'Customer Directory & Order History',
      design: 'Website Design & Content Customizer',
      settings: 'WhatsApp, Phone & UPI Payment Settings',
      analytics: 'Sales & Service Demand Reports'
    };

    if (viewTitle) viewTitle.textContent = titles[tabId] || 'Admin Portal';
  }

  // ---------------- REFRESH ALL VIEWS ---------------- //
  function refreshAllViews() {
    updateBadges();
    renderOverview();
    renderProducts();
    renderServices();
    renderOrders();
    renderBookings();
    renderCrm();
    loadDesignSettings();
    loadIntegrationSettings();
  }

  function updateBadges() {
    const products = AquaStore.getAllProducts();
    const services = AquaStore.getServices();
    const orders = AquaStore.getOrders();
    const bookings = AquaStore.getBookings();

    const pendingOrders = orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Pending').length;
    const newBookings = bookings.filter(b => b.status === 'New').length;

    const bProd = document.getElementById('badge-products-count');
    const bServ = document.getElementById('badge-services-count');
    const bOrd = document.getElementById('badge-pending-orders');
    const bBook = document.getElementById('badge-new-bookings');

    if (bProd) bProd.textContent = products.length;
    if (bServ) bServ.textContent = services.length;
    if (bOrd) {
      bOrd.textContent = pendingOrders;
      bOrd.style.display = pendingOrders > 0 ? 'inline-block' : 'none';
    }
    if (bBook) {
      bBook.textContent = newBookings;
      bBook.style.display = newBookings > 0 ? 'inline-block' : 'none';
    }
  }

  // ---------------- TAB 1: OVERVIEW ---------------- //
  function renderOverview() {
    const products = AquaStore.getAllProducts();
    const orders = AquaStore.getOrders();
    const bookings = AquaStore.getBookings();

    const totalRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const normalRev = orders
      .filter(o => (o.items || []).some(i => i.name && i.name.toLowerCase().includes('normal')))
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const raindropRev = orders
      .filter(o => (o.items || []).some(i => i.name && i.name.toLowerCase().includes('raindrop')))
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // KPI Cards
    const elOrders = document.getElementById('stat-total-orders');
    const elBookings = document.getElementById('stat-total-bookings');
    const elRev = document.getElementById('stat-total-revenue');
    const elProd = document.getElementById('stat-total-products');

    if (elOrders) elOrders.textContent = orders.length;
    if (elBookings) elBookings.textContent = bookings.length;
    if (elRev) elRev.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
    if (elProd) elProd.textContent = products.length;

    // Charts
    const valNormal = document.getElementById('chart-val-normal');
    const valRaindrop = document.getElementById('chart-val-raindrop');
    const valServices = document.getElementById('chart-val-services');
    if (valNormal) valNormal.textContent = `₹${normalRev.toLocaleString('en-IN')}`;
    if (valRaindrop) valRaindrop.textContent = `₹${raindropRev.toLocaleString('en-IN')}`;
    if (valServices) valServices.textContent = `${bookings.length} visits`;

    // Overview Recent Orders Table
    const recentOrdersTable = document.getElementById('overview-recent-orders-table');
    if (recentOrdersTable) {
      const sliceOrders = orders.slice(0, 5);
      if (sliceOrders.length === 0) {
        recentOrdersTable.innerHTML = `<tr><td colspan="7" style="text-align:center;">No orders yet.</td></tr>`;
      } else {
        recentOrdersTable.innerHTML = sliceOrders.map(o => {
          const itemSummary = (o.items || []).map(i => `${i.name} (${i.color})`).join(', ');
          return `
            <tr>
              <td><strong>${o.id}</strong></td>
              <td>${o.customerName}<br><span style="font-size:0.75rem; color:#94a3b8;">${o.phone}</span></td>
              <td>${itemSummary}</td>
              <td><strong>₹${(o.total || 0).toLocaleString('en-IN')}</strong></td>
              <td>${o.paymentMethod} (${o.paymentStatus || 'Pending'})</td>
              <td><span class="table-badge ${getStatusClass(o.orderStatus)}">${o.orderStatus}</span></td>
              <td>
                <button class="btn btn-sm btn-outline" onclick="window.viewOrderInvoice('${o.id}')" style="background:#0f172a; border-color:#334155; color:#cbd5e1;">Invoice</button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Overview Recent Bookings
    const recentBookingsList = document.getElementById('overview-recent-bookings-list');
    if (recentBookingsList) {
      const sliceBookings = bookings.slice(0, 4);
      if (sliceBookings.length === 0) {
        recentBookingsList.innerHTML = `<p style="color:#94a3b8; font-size:0.85rem;">No bookings yet.</p>`;
      } else {
        recentBookingsList.innerHTML = sliceBookings.map(b => `
          <div style="background:#0f172a; padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1px solid #334155; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:700; font-size:0.9rem; color:#fff;">${b.serviceName}</div>
              <div style="font-size:0.75rem; color:#94a3b8;">${b.customerName} • ${b.preferredDate} (${b.timeSlot.split(' ')[0]})</div>
            </div>
            <span class="table-badge ${getStatusClass(b.status)}">${b.status}</span>
          </div>
        `).join('');
      }
    }
  }

  function getStatusClass(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('confirm') || s.includes('new')) return 'confirmed';
    if (s.includes('dispatch') || s.includes('assigned')) return 'dispatched';
    if (s.includes('deliver') || s.includes('complete')) return 'delivered';
    if (s.includes('cancel')) return 'cancelled';
    return 'pending';
  }

  // ---------------- TAB 2: PRODUCTS ---------------- //
  function renderProducts() {
    const tableBody = document.getElementById('admin-products-table-body');
    if (!tableBody) return;

    let products = AquaStore.getAllProducts();
    if (productFilter !== 'all') {
      products = products.filter(p => p.category === productFilter);
    }

    tableBody.innerHTML = products.map(p => {
      const swatchesHtml = (p.colors || []).map(c => `
        <span style="display:inline-block; width:14px; height:14px; border-radius:50%; background:${c.code}; border:1px solid #cbd5e1;" title="${c.name}"></span>
      `).join(' ');

      return `
        <tr data-prod-id="${p.id}">
          <td>
            <div class="table-product-cell">
              <div class="table-product-thumb">
                <img src="${p.image}" alt="${p.name}">
              </div>
              <div>
                <strong style="color:#fff;">${p.name}</strong>
                <div style="font-size:0.75rem; color:#94a3b8;">${p.subtitle}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="badge ${p.category === 'Raindrop' ? 'badge-raindrop' : 'badge-primary'}">${p.category}</span>
          </td>
          <td><strong style="color:#38bdf8;">₹${p.price.toLocaleString('en-IN')}</strong></td>
          <td><span style="text-decoration:line-through; color:#64748b;">₹${p.originalPrice.toLocaleString('en-IN')}</span></td>
          <td><div style="display:flex; align-items:center; gap:0.3rem;">${swatchesHtml}</div></td>
          <td>
            <span style="color:${p.inStock ? '#34d399' : '#f87171'}; font-weight:700;">
              ${p.inStock ? `In Stock (${p.stock})` : 'Out of Stock'}
            </span>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action" onclick="window.editProduct('${p.id}')" title="Edit Product">✏️</button>
              <button class="btn-table-action delete" onclick="window.deleteProduct('${p.id}')" title="Delete Product">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Filter Product Series
  document.getElementById('filter-product-series')?.addEventListener('change', (e) => {
    productFilter = e.target.value;
    renderProducts();
  });

  // ---------------- TAB 3: SERVICES ---------------- //
  function renderServices() {
    const tableBody = document.getElementById('admin-services-table-body');
    if (!tableBody) return;

    const services = AquaStore.getServices();

    tableBody.innerHTML = services.map(s => `
      <tr data-srv-id="${s.id}">
        <td><strong style="color:#fff;">${s.name}</strong></td>
        <td><span class="service-price-tag">${s.startingTag}</span></td>
        <td><span style="font-size:0.8rem; color:#bae6fd;">${s.turnaround}</span></td>
        <td><span class="badge badge-primary">${s.badge || 'Standard'}</span></td>
        <td><span style="font-size:0.75rem; color:#94a3b8;">${(s.features || []).length} inclusion items</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-table-action" onclick="window.editService('${s.id}')" title="Edit Service">✏️</button>
            <button class="btn-table-action delete" onclick="window.deleteService('${s.id}')" title="Delete Service">🗑️</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // ---------------- TAB 4: ORDERS ---------------- //
  function renderOrders() {
    const tableBody = document.getElementById('admin-orders-table-body');
    if (!tableBody) return;

    let orders = AquaStore.getOrders();
    if (orderFilter !== 'all') {
      orders = orders.filter(o => o.orderStatus === orderFilter);
    }

    if (orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:#94a3b8;">No orders matching filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = orders.map(o => {
      const itemsHtml = (o.items || []).map(i => `<strong>${i.name}</strong> (${i.color}) x ${i.quantity}`).join('<br>');
      const dateStr = new Date(o.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });

      return `
        <tr>
          <td>
            <strong style="color:#38bdf8;">${o.id}</strong>
            <div style="font-size:0.72rem; color:#94a3b8;">${dateStr}</div>
          </td>
          <td>
            <strong>${o.customerName}</strong>
            <div style="font-size:0.75rem; color:#34d399;">${o.phone}</div>
          </td>
          <td style="max-width:220px; font-size:0.8rem; color:#cbd5e1;">${o.address}</td>
          <td style="font-size:0.825rem;">${itemsHtml}</td>
          <td><strong style="color:#fff;">₹${(o.total || 0).toLocaleString('en-IN')}</strong></td>
          <td>
            <span class="badge ${o.paymentMethod === 'UPI' ? 'badge-primary' : 'badge-warning'}">${o.paymentMethod}</span>
            <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">${o.paymentStatus}</div>
          </td>
          <td>
            <select class="form-select" onchange="window.changeOrderStatus('${o.id}', this.value)" style="background:#0f172a; color:#fff; border-color:#334155; font-size:0.78rem; padding:0.25rem 0.5rem; width:125px;">
              <option value="Confirmed" ${o.orderStatus === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Dispatched" ${o.orderStatus === 'Dispatched' ? 'selected' : ''}>Dispatched</option>
              <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${o.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <div class="table-actions">
              <button class="btn-table-action" onclick="window.viewOrderInvoice('${o.id}')" title="Print Invoice">🖨️</button>
              <button class="btn-table-action" onclick="window.chatWithCustomer('${o.phone}', '${o.id}')" title="WhatsApp Customer" style="background:#25d366; color:#fff;">💬</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  document.getElementById('filter-orders-status')?.addEventListener('change', (e) => {
    orderFilter = e.target.value;
    renderOrders();
  });

  // ---------------- TAB 5: BOOKINGS ---------------- //
  function renderBookings() {
    const tableBody = document.getElementById('admin-bookings-table-body');
    if (!tableBody) return;

    let bookings = AquaStore.getBookings();
    if (bookingFilter !== 'all') {
      bookings = bookings.filter(b => b.status === bookingFilter);
    }

    if (bookings.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem; color:#94a3b8;">No service bookings matching filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = bookings.map(b => `
      <tr>
        <td><strong style="color:#38bdf8;">${b.id}</strong></td>
        <td><strong>${b.serviceName}</strong></td>
        <td>
          <strong>${b.preferredDate}</strong>
          <div style="font-size:0.72rem; color:#94a3b8;">${b.timeSlot}</div>
        </td>
        <td>
          <strong>${b.customerName}</strong>
          <div style="font-size:0.75rem; color:#34d399;">${b.phone}</div>
        </td>
        <td style="max-width:200px; font-size:0.78rem;">
          <div>${b.address}</div>
          <span style="color:#38bdf8; font-size:0.72rem;">Model: ${b.purifierBrand || 'All brands'}</span>
        </td>
        <td>
          <input type="text" class="form-input" value="${b.technician || 'Unassigned'}" 
                 onchange="window.updateTechnician('${b.id}', this.value)" 
                 style="background:#0f172a; color:#fff; border-color:#334155; font-size:0.78rem; padding:0.3rem 0.5rem; width:130px;">
        </td>
        <td>
          <select class="form-select" onchange="window.changeBookingStatus('${b.id}', this.value)" style="background:#0f172a; color:#fff; border-color:#334155; font-size:0.78rem; padding:0.25rem 0.5rem; width:120px;">
            <option value="New" ${b.status === 'New' ? 'selected' : ''}>New</option>
            <option value="Assigned" ${b.status === 'Assigned' ? 'selected' : ''}>Assigned</option>
            <option value="In Progress" ${b.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>
          <button class="btn-table-action" onclick="window.chatWithCustomer('${b.phone}', 'Booking ${b.id}')" title="WhatsApp Customer" style="background:#25d366; color:#fff;">💬</button>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('filter-bookings-status')?.addEventListener('change', (e) => {
    bookingFilter = e.target.value;
    renderBookings();
  });

  // ---------------- TAB 6: CRM ---------------- //
  function renderCrm() {
    const tableBody = document.getElementById('admin-crm-table-body');
    const totalCrmEl = document.getElementById('crm-total-customers');
    if (!tableBody) return;

    const orders = AquaStore.getOrders();
    const bookings = AquaStore.getBookings();

    // Aggregate by phone
    const customersMap = {};

    orders.forEach(o => {
      const ph = o.phone;
      if (!customersMap[ph]) {
        customersMap[ph] = {
          name: o.customerName,
          phone: ph,
          address: o.address,
          purchases: 0,
          services: 0,
          totalSpend: 0
        };
      }
      customersMap[ph].purchases += (o.items || []).length;
      customersMap[ph].totalSpend += (o.total || 0);
    });

    bookings.forEach(b => {
      const ph = b.phone;
      if (!customersMap[ph]) {
        customersMap[ph] = {
          name: b.customerName,
          phone: ph,
          address: b.address,
          purchases: 0,
          services: 0,
          totalSpend: 0
        };
      }
      customersMap[ph].services += 1;
    });

    const customers = Object.values(customersMap);
    if (totalCrmEl) totalCrmEl.textContent = customers.length;

    tableBody.innerHTML = customers.map(c => `
      <tr>
        <td><strong style="color:#fff;">${c.name}</strong></td>
        <td><strong style="color:#34d399;">${c.phone}</strong></td>
        <td style="max-width:240px; font-size:0.8rem;">${c.address}</td>
        <td><span class="badge badge-primary">${c.purchases} Unit(s)</span></td>
        <td><span class="badge badge-raindrop">${c.services} Service(s)</span></td>
        <td><strong style="color:#38bdf8;">₹${c.totalSpend.toLocaleString('en-IN')}</strong></td>
        <td>
          <a href="https://wa.me/${c.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn btn-sm btn-action-wa" style="padding:0.3rem 0.6rem;">
            💬 WhatsApp
          </a>
        </td>
      </tr>
    `).join('');
  }

  // ---------------- TAB 7: DESIGN CUSTOMIZER ---------------- //
  function loadDesignSettings() {
    const s = AquaStore.getSettings();
    const accentInput = document.getElementById('custom-accent-color');
    const announceInput = document.getElementById('design-announcement-text');
    const announceCheck = document.getElementById('design-announcement-active');
    const taglineInput = document.getElementById('design-tagline');
    const addressInput = document.getElementById('design-address');
    const footerCreditInput = document.getElementById('design-footer-credit');

    if (accentInput) accentInput.value = s.accentColor;
    if (announceInput) announceInput.value = s.announcementText;
    if (announceCheck) announceCheck.checked = s.announcementActive;
    if (taglineInput) taglineInput.value = s.tagline;
    if (addressInput) addressInput.value = s.address;
    if (footerCreditInput) footerCreditInput.value = s.footerCredit || "Powered by Kotti";

    // Highlight active swatch
    document.querySelectorAll('.theme-color-choice').forEach(choice => {
      const col = choice.getAttribute('data-color');
      if (col === s.accentColor) choice.classList.add('active');
      else choice.classList.remove('active');

      choice.onclick = () => {
        document.querySelectorAll('.theme-color-choice').forEach(c => c.classList.remove('active'));
        choice.classList.add('active');
        if (accentInput) accentInput.value = col;
      };
    });
  }

  // ---------------- TAB 8: INTEGRATION SETTINGS ---------------- //
  function loadIntegrationSettings() {
    const s = AquaStore.getSettings();
    const phoneInput = document.getElementById('settings-phone');
    const waInput = document.getElementById('settings-whatsapp');
    const hoursInput = document.getElementById('settings-hours');
    const upiIdInput = document.getElementById('settings-upi-id');
    const upiNameInput = document.getElementById('settings-upi-name');
    const codCheck = document.getElementById('settings-cod-enabled');
    const qrImg = document.getElementById('settings-qr-preview');

    if (phoneInput) phoneInput.value = s.phone;
    if (waInput) waInput.value = s.whatsapp;
    if (hoursInput) hoursInput.value = s.workingHours;
    if (upiIdInput) upiIdInput.value = s.upiId;
    if (upiNameInput) upiNameInput.value = s.upiName;
    if (codCheck) codCheck.checked = s.codEnabled;

    if (qrImg) {
      qrImg.src = AquaStore.generateUpiQrUrl(1000, "Sample Admin Test");
    }

    upiIdInput?.addEventListener('input', () => {
      if (qrImg) qrImg.src = AquaStore.generateUpiQrUrl(1000, "Sample Admin Test");
    });
  }

  // ---------------- FORM HANDLERS ---------------- //
  function setupFormListeners() {
    // Design Settings Save
    designForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        accentColor: document.getElementById('custom-accent-color').value.trim() || '#0284c7',
        announcementText: document.getElementById('design-announcement-text').value.trim(),
        announcementActive: document.getElementById('design-announcement-active').checked,
        tagline: document.getElementById('design-tagline').value.trim(),
        address: document.getElementById('design-address').value.trim(),
        footerCredit: document.getElementById('design-footer-credit').value.trim() || 'Powered by Kotti'
      };
      AquaStore.saveSettings(updated);
      showToast('Website Design settings saved & synced!', 'success');
    });

    // Integration Settings Save
    integrationForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        phone: document.getElementById('settings-phone').value.trim(),
        whatsapp: document.getElementById('settings-whatsapp').value.trim(),
        workingHours: document.getElementById('settings-hours').value.trim(),
        upiId: document.getElementById('settings-upi-id').value.trim(),
        upiName: document.getElementById('settings-upi-name').value.trim(),
        codEnabled: document.getElementById('settings-cod-enabled').checked
      };
      AquaStore.saveSettings(updated);
      showToast('WhatsApp, Call & UPI Settings saved!', 'success');
    });

    // Reseed Demo Data
    reseedBtn?.addEventListener('click', () => {
      if (confirm('Are you sure you want to restore demo products (20), services (8), and settings to defaults?')) {
        AquaStore.resetToDefaults();
        showToast('Default catalog & settings successfully restored!', 'success');
        refreshAllViews();
      }
    });

    // Product Add/Edit Form
    productForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-prod-id').value;
      const colorsStr = document.getElementById('edit-prod-colors').value;
      const featuresStr = document.getElementById('edit-prod-features').value;

      // Color variants parsing
      const colors = colorsStr.split(',').map(c => c.trim()).filter(Boolean).map(cName => {
        let code = '#0284c7';
        if (cName.toLowerCase().includes('white')) code = '#ffffff';
        if (cName.toLowerCase().includes('black')) code = '#18181b';
        if (cName.toLowerCase().includes('sky')) code = '#38bdf8';
        if (cName.toLowerCase().includes('blue')) code = '#1e40af';
        return { name: cName, code: code };
      });

      const product = {
        id: id || null,
        name: document.getElementById('edit-prod-name').value.trim(),
        category: document.getElementById('edit-prod-category').value,
        subtitle: document.getElementById('edit-prod-subtitle').value.trim(),
        price: parseInt(document.getElementById('edit-prod-price').value, 10),
        originalPrice: parseInt(document.getElementById('edit-prod-mrp').value, 10),
        stock: parseInt(document.getElementById('edit-prod-stock').value, 10),
        inStock: parseInt(document.getElementById('edit-prod-stock').value, 10) > 0,
        image: document.getElementById('edit-prod-image').value,
        colors: colors.length > 0 ? colors : [{ name: 'Default', code: '#0284c7' }],
        features: featuresStr.split('\n').map(f => f.trim()).filter(Boolean)
      };

      AquaStore.saveProduct(product);
      productModal.classList.remove('open');
      showToast(`Product "${product.name}" saved successfully!`, 'success');
      renderProducts();
    });

    // Service Add/Edit Form
    serviceForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('edit-srv-id').value;
      const featuresStr = document.getElementById('edit-srv-features').value;

      const service = {
        id: id || null,
        name: document.getElementById('edit-srv-name').value.trim(),
        price: parseInt(document.getElementById('edit-srv-price').value, 10),
        startingTag: document.getElementById('edit-srv-tag').value.trim() || `Starting from ₹${document.getElementById('edit-srv-price').value}`,
        shortDesc: document.getElementById('edit-srv-desc').value.trim(),
        features: featuresStr.split('\n').map(f => f.trim()).filter(Boolean)
      };

      AquaStore.saveService(service);
      serviceModal.classList.remove('open');
      showToast(`Service "${service.name}" saved successfully!`, 'success');
      renderServices();
    });
  }

  // ---------------- MODAL LISTENERS ---------------- //
  function setupModalListeners() {
    document.getElementById('btn-add-product')?.addEventListener('click', () => {
      document.getElementById('product-modal-title').textContent = 'Add New Purifier Product';
      document.getElementById('edit-prod-id').value = '';
      productForm.reset();
      productModal.classList.add('open');
    });

    document.getElementById('btn-add-service')?.addEventListener('click', () => {
      document.getElementById('service-modal-title').textContent = 'Add New Service Offering';
      document.getElementById('edit-srv-id').value = '';
      serviceForm.reset();
      serviceModal.classList.add('open');
    });

    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
          productModal?.classList.remove('open');
          serviceModal?.classList.remove('open');
          invoiceModal?.classList.remove('open');
        }
      });
    });
  }

  // ---------------- GLOBAL WINDOW ACTIONS ---------------- //
  window.editProduct = (id) => {
    const p = AquaStore.getProductById(id);
    if (!p) return;

    document.getElementById('product-modal-title').textContent = `Edit ${p.name}`;
    document.getElementById('edit-prod-id').value = p.id;
    document.getElementById('edit-prod-name').value = p.name;
    document.getElementById('edit-prod-category').value = p.category;
    document.getElementById('edit-prod-subtitle').value = p.subtitle;
    document.getElementById('edit-prod-price').value = p.price;
    document.getElementById('edit-prod-mrp').value = p.originalPrice;
    document.getElementById('edit-prod-stock').value = p.stock || 15;
    document.getElementById('edit-prod-image').value = p.image || 'assets/images/normal-series.jpg';
    document.getElementById('edit-prod-colors').value = (p.colors || []).map(c => c.name).join(', ');
    document.getElementById('edit-prod-features').value = (p.features || []).join('\n');

    productModal.classList.add('open');
  };

  window.deleteProduct = (id) => {
    const p = AquaStore.getProductById(id);
    if (!p) return;
    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
      AquaStore.deleteProduct(id);
      showToast(`Product deleted.`, 'info');
      renderProducts();
    }
  };

  window.editService = (id) => {
    const s = AquaStore.getServiceById(id);
    if (!s) return;

    document.getElementById('service-modal-title').textContent = `Edit ${s.name}`;
    document.getElementById('edit-srv-id').value = s.id;
    document.getElementById('edit-srv-name').value = s.name;
    document.getElementById('edit-srv-price').value = s.price;
    document.getElementById('edit-srv-tag').value = s.startingTag;
    document.getElementById('edit-srv-desc').value = s.shortDesc;
    document.getElementById('edit-srv-features').value = (s.features || []).join('\n');

    serviceModal.classList.add('open');
  };

  window.deleteService = (id) => {
    const s = AquaStore.getServiceById(id);
    if (!s) return;
    if (confirm(`Are you sure you want to delete "${s.name}"?`)) {
      AquaStore.deleteService(id);
      showToast(`Service deleted.`, 'info');
      renderServices();
    }
  };

  window.changeOrderStatus = (orderId, newStatus) => {
    AquaStore.updateOrderStatus(orderId, newStatus);
    showToast(`Order ${orderId} status changed to ${newStatus}`, 'success');
    renderOrders();
  };

  window.changeBookingStatus = (bookingId, newStatus) => {
    AquaStore.updateBookingStatus(bookingId, newStatus);
    showToast(`Booking ${bookingId} status changed to ${newStatus}`, 'success');
    renderBookings();
  };

  window.updateTechnician = (bookingId, techName) => {
    AquaStore.updateBookingStatus(bookingId, null, techName);
    showToast(`Assigned ${techName} to ${bookingId}`, 'success');
  };

  window.chatWithCustomer = (phone, contextId) => {
    const msg = `Hello from Aqua Water Purifiers! Regarding ${contextId}: our team is processing your request. Powered by Kotti`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  window.viewOrderInvoice = (orderId) => {
    const orders = AquaStore.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modalBody = document.getElementById('invoice-modal-body');
    const settings = AquaStore.getSettings();

    const itemsRows = (order.items || []).map((item, idx) => `
      <tr>
        <td style="padding:8px; border-bottom:1px solid #e2e8f0;">${idx + 1}</td>
        <td style="padding:8px; border-bottom:1px solid #e2e8f0;">
          <strong>${item.name}</strong><br>
          <span style="font-size:0.75rem; color:#64748b;">Variant Color: ${item.color}</span>
        </td>
        <td style="padding:8px; border-bottom:1px solid #e2e8f0; text-align:center;">${item.quantity}</td>
        <td style="padding:8px; border-bottom:1px solid #e2e8f0; text-align:right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding:8px; border-bottom:1px solid #e2e8f0; text-align:right;"><strong>₹${(item.price * item.quantity).toLocaleString('en-IN')}</strong></td>
      </tr>
    `).join('');

    modalBody.innerHTML = `
      <div class="printable-invoice">
        <div class="invoice-header">
          <div>
            <h2 style="color:#0284c7; font-size:1.8rem; margin-bottom:0.25rem;">AQUA WATER PURIFIERS</h2>
            <p style="font-size:0.8rem; color:#64748b;">${settings.address}</p>
            <p style="font-size:0.8rem; color:#64748b;">Phone: ${settings.phone} | GSTIN: 33AAQCA1234F1Z0</p>
          </div>
          <div style="text-align:right;">
            <h3 style="font-size:1.3rem; color:#0f172a;">TAX INVOICE</h3>
            <div style="font-weight:700; color:#0284c7;">#${order.id}</div>
            <div style="font-size:0.8rem; color:#64748b;">Date: ${new Date(order.date).toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; margin-bottom:1.5rem; font-size:0.875rem;">
          <div>
            <strong style="color:#64748b;">Billed / Shipped To:</strong>
            <div style="font-size:1rem; font-weight:700; margin-top:0.25rem;">${order.customerName}</div>
            <div>${order.phone}</div>
            <div style="max-width:300px; color:#475569;">${order.address}</div>
          </div>
          <div style="text-align:right;">
            <strong style="color:#64748b;">Payment Method:</strong>
            <div style="font-weight:700;">${order.paymentMethod}</div>
            <div style="color:#16a34a; font-weight:700;">${order.paymentStatus}</div>
          </div>
        </div>

        <table style="width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:0.875rem;">
          <thead>
            <tr style="background:#f1f5f9; text-align:left;">
              <th style="padding:8px;">#</th>
              <th style="padding:8px;">Product Description</th>
              <th style="padding:8px; text-align:center;">Qty</th>
              <th style="padding:8px; text-align:right;">Rate</th>
              <th style="padding:8px; text-align:right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end; margin-bottom:2rem;">
          <div style="width:250px; font-size:0.9rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem;">
              <span>Subtotal:</span>
              <span>₹${order.total.toLocaleString('en-IN')}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem; color:#16a34a;">
              <span>Standard Installation:</span>
              <span>FREE</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-weight:800; font-size:1.15rem; color:#0284c7; border-top:2px solid #e2e8f0; padding-top:0.5rem;">
              <span>Grand Total:</span>
              <span>₹${order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div style="text-align:center; padding-top:1.5rem; border-top:1px dashed #cbd5e1; font-size:0.8rem; color:#64748b;">
          Thank you for choosing Aqua Water Purifiers! All purifiers include a 1-Year on-site warranty.<br>
          <strong style="color:#0f172a;">${settings.footerCredit || 'Powered by Kotti'}</strong>
        </div>

        <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.5rem;" class="no-print">
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print Invoice</button>
        </div>
      </div>
    `;

    invoiceModal.classList.add('open');
  };

  // ---------------- TOAST ---------------- //
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
