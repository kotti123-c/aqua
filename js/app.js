/**
 * AQUA WATER PURIFIERS - Storefront Application Logic
 * Interactive catalogue, dynamic color variants, cart, checkout, booking, WhatsApp automation
 * Version 1.0 - Powered by Kotti
 */

document.addEventListener('DOMContentLoaded', () => {
  // Current app state
  const state = {
    activeCategoryFilter: 'all',
    searchQuery: '',
    selectedVariants: {}, // productId -> colorName
    checkoutProduct: null, // null if checking out full cart
    isAdmin: sessionStorage.getItem('aqua_inline_admin') === 'true',
    activeDetailProduct: null
  };

  // Cache DOM elements
  const spotlightGrid = document.getElementById('spotlight-products-grid');
  const detailModal = document.getElementById('product-detail-modal');
  const detailBody = document.getElementById('product-detail-body');
  const adminPasswordModal = document.getElementById('admin-password-modal');
  const adminEditBar = document.getElementById('admin-edit-bar');
  const adminSaveIndicator = document.getElementById('admin-save-indicator');
  const headerAdminBtn = document.getElementById('header-admin-btn');
  const normalGrid = document.getElementById('normal-products-grid');
  const raindropGrid = document.getElementById('raindrop-products-grid');
  const servicesGrid = document.getElementById('services-grid');
  const cartDrawerBackdrop = document.getElementById('cart-backdrop');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const cartSubtotalEl = document.getElementById('cart-subtotal-val');
  const checkoutModal = document.getElementById('checkout-modal');
  const serviceModal = document.getElementById('service-modal');
  const toastContainer = document.getElementById('toast-container');
  const announcementBar = document.getElementById('announcement-bar');
  const announcementTextEl = document.getElementById('announcement-text');
  const tdsSlider = document.getElementById('tds-slider');
  const tdsNumberEl = document.getElementById('tds-number');
  const tdsStatusTag = document.getElementById('tds-status-tag');
  const tdsAdviceText = document.getElementById('tds-advice-text');
  const tdsMatchBtn = document.getElementById('tds-match-btn');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');

  // Initialize
  initApp();

  function initApp() {
    applySettingsToUI();
    applyAdminModeUI();
    renderSpotlightProducts();
    renderNormalProducts();
    renderRaindropProducts();
    renderServices();
    renderCart();
    setupEventListeners();
    setupInlineAdmin();
    setupTdsCalculator();

    // Subscribe to storage updates from admin
    AquaStore.subscribe((event, data) => {
      applySettingsToUI();
      renderSpotlightProducts();
      renderNormalProducts();
      renderRaindropProducts();
      renderServices();
      renderCart();
      if (state.activeDetailProduct) {
        const refreshed = AquaStore.getSpotlightProductById(state.activeDetailProduct.id);
        if (refreshed) {
          state.activeDetailProduct = refreshed;
          renderDetailModalContent(refreshed);
        }
      }
    });
  }

  // ---------------- SETTINGS & BRANDING ---------------- //
  function applySettingsToUI() {
    const settings = AquaStore.getSettings();

    // Accent Color
    AquaStore.applyThemeColors(settings.accentColor);

    // Announcement
    if (settings.announcementActive && settings.announcementText) {
      if (announcementBar) {
        announcementBar.style.display = 'flex';
        announcementTextEl.textContent = settings.announcementText;
      }
    } else if (announcementBar) {
      announcementBar.style.display = 'none';
    }

    // Phone & WhatsApp links
    document.querySelectorAll('.btn-call-trigger').forEach(btn => {
      btn.href = AquaStore.buildCallUrl();
      if (btn.querySelector('.phone-label')) {
        btn.querySelector('.phone-label').textContent = settings.phone;
      }
    });

    document.querySelectorAll('.btn-wa-trigger').forEach(btn => {
      btn.href = AquaStore.buildWhatsAppDirectUrl();
    });

    // Address & Hours
    const addressEl = document.getElementById('store-address-display');
    if (addressEl) addressEl.textContent = settings.address;

    const hoursEl = document.getElementById('store-hours-display');
    if (hoursEl) hoursEl.textContent = settings.workingHours;

    // Footer Powered By
    document.querySelectorAll('.footer-powered-credit').forEach(el => {
      el.textContent = settings.footerCredit || "Powered by Kotti";
    });
  }

  // ---------------- ADMIN INLINE EDIT MODE & SPOTLIGHT ---------------- //
  function applyAdminModeUI() {
    if (state.isAdmin) {
      document.body.classList.add('admin-edit-active');
      if (adminEditBar) adminEditBar.style.display = 'block';
    } else {
      document.body.classList.remove('admin-edit-active');
      if (adminEditBar) adminEditBar.style.display = 'none';
    }
  }

  function triggerAutoSaveIndicator() {
    if (adminSaveIndicator) {
      adminSaveIndicator.textContent = '💾 Saving...';
      adminSaveIndicator.style.color = '#fbbf24';
      setTimeout(() => {
        adminSaveIndicator.textContent = '✓ Saved automatically';
        adminSaveIndicator.style.color = '#34d399';
      }, 400);
    }
  }

  function handleInlineFieldBlur(productId, fieldEl) {
    const field = fieldEl.getAttribute('data-field');
    let val = fieldEl.textContent.trim();
    if (field === 'price' || field === 'originalPrice') {
      val = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
      fieldEl.textContent = `₹${val.toLocaleString('en-IN')}`;
    }
    const updates = {};
    updates[field] = val;
    AquaStore.updateSpotlightProduct(productId, updates);
    triggerAutoSaveIndicator();
  }

  function renderSpotlightProducts() {
    if (!spotlightGrid) return;
    const products = AquaStore.getSpotlightProducts();
    spotlightGrid.innerHTML = '';

    products.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'spotlight-card';
      card.id = `spot-card-${p.id}`;

      const activeColor = p.selectedColor || (p.colors && p.colors[0] ? p.colors[0].name : 'Default');
      const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);

      // Color dots
      const colorDotsHtml = (p.colors || []).map(c => `
        <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${c.code}; border:1px solid #cbd5e1;" title="${c.name}"></span>
      `).join(' ');

      // Types tags
      const typesHtml = (p.types || []).map(t => `
        <span class="badge" style="background:#e0f2fe; color:#0284c7; font-size:0.68rem; text-transform:none;">${t.name}</span>
      `).join(' ');

      card.innerHTML = `
        <div class="spotlight-card-admin-bar">
          <div style="display:flex; gap:0.25rem;">
            <button class="btn btn-sm btn-outline" data-action="move-left" data-id="${p.id}" ${idx === 0 ? 'disabled' : ''} style="padding:0.15rem 0.4rem; font-size:0.7rem; color:#fff; border-color:#475569;">◀ Move</button>
            <button class="btn btn-sm btn-outline" data-action="move-right" data-id="${p.id}" ${idx === products.length - 1 ? 'disabled' : ''} style="padding:0.15rem 0.4rem; font-size:0.7rem; color:#fff; border-color:#475569;">Move ▶</button>
          </div>
          <button class="btn btn-sm" data-action="delete-spotlight" data-id="${p.id}" style="color:#ef4444; font-size:0.75rem; padding:0.1rem 0.3rem;">🗑️ Delete</button>
        </div>

        <div class="product-badge-wrap">
          <span class="badge ${p.category === 'Raindrop' ? 'badge-raindrop' : 'badge-primary'}">${p.category}</span>
          ${discount > 0 ? `<span class="product-discount-pill">Save ${discount}%</span>` : ''}
        </div>

        <div class="spotlight-img-box">
          <img src="${p.image}" alt="${p.name}" id="spot-img-${p.id}">
        </div>

        <div class="spotlight-content">
          <h3 class="spotlight-title editable-field" 
              contenteditable="${state.isAdmin}" 
              data-field="name" 
              data-id="${p.id}">${p.name}</h3>

          <p class="spotlight-desc editable-field" 
             contenteditable="${state.isAdmin}" 
             data-field="description" 
             data-id="${p.id}">${p.description}</p>

          <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:0.85rem;">
            ${typesHtml}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; padding-top:0.75rem; border-top:1px dashed var(--border-color);">
            <div style="display:flex; align-items:baseline; gap:0.4rem;">
              <span class="product-price-current editable-field" 
                    contenteditable="${state.isAdmin}" 
                    data-field="price" 
                    data-id="${p.id}">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="product-price-mrp editable-field" 
                    contenteditable="${state.isAdmin}" 
                    data-field="originalPrice" 
                    data-id="${p.id}">₹${p.originalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.25rem;">
              ${colorDotsHtml}
            </div>
          </div>

          <button class="btn btn-primary btn-block btn-sm" data-action="open-detail" data-id="${p.id}">
            🔍 View Types, Colors &amp; Gallery →
          </button>
        </div>
      `;

      // Card click opens detail modal (unless clicking admin buttons or contenteditable)
      card.addEventListener('click', (e) => {
        if (e.target.isContentEditable || e.target.closest('[contenteditable="true"]')) return;
        if (e.target.closest('button[data-action="move-left"]') ||
            e.target.closest('button[data-action="move-right"]') ||
            e.target.closest('button[data-action="delete-spotlight"]')) {
          return;
        }
        openProductDetailModal(p.id);
      });

      // Move left/right handlers
      card.querySelector('button[data-action="move-left"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        AquaStore.reorderSpotlightProduct(p.id, 'up');
        renderSpotlightProducts();
        triggerAutoSaveIndicator();
      });

      card.querySelector('button[data-action="move-right"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        AquaStore.reorderSpotlightProduct(p.id, 'down');
        renderSpotlightProducts();
        triggerAutoSaveIndicator();
      });

      card.querySelector('button[data-action="delete-spotlight"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Delete "${p.name}" from the spotlight grid?`)) {
          AquaStore.deleteSpotlightProduct(p.id);
          renderSpotlightProducts();
          triggerAutoSaveIndicator();
        }
      });

      // Direct inline text edits in admin mode
      if (state.isAdmin) {
        card.querySelectorAll('.editable-field').forEach(field => {
          field.addEventListener('blur', () => {
            handleInlineFieldBlur(p.id, field);
          });
          field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              field.blur();
            }
          });
        });
      }

      spotlightGrid.appendChild(card);
    });
  }

  // ---------------- DETAIL MODAL WITH TYPE TABS, COLOR SWATCHES & LABELED GALLERY ---------------- //
  function openProductDetailModal(productId) {
    const product = AquaStore.getSpotlightProductById(productId);
    if (!product) return;
    state.activeDetailProduct = product;

    const modeLabel = document.getElementById('detail-modal-mode-label');
    if (modeLabel) {
      modeLabel.textContent = state.isAdmin ? '🛠️ Admin Edit Mode Active' : 'Customer View';
      modeLabel.style.color = state.isAdmin ? '#f59e0b' : 'var(--text-muted)';
    }

    const catBadge = document.getElementById('detail-category-badge');
    if (catBadge) {
      catBadge.textContent = `${product.category} Series`;
      catBadge.className = `badge ${product.category === 'Raindrop' ? 'badge-raindrop' : 'badge-primary'}`;
    }

    renderDetailModalContent(product);
    if (detailModal) detailModal.classList.add('open');
  }

  function renderDetailModalContent(product) {
    if (!detailBody) return;

    // Selected states
    const activeType = (product.types || []).find(t => t.id === product.selectedType) || (product.types && product.types[0]) || { id: 'default', name: 'Standard', desc: 'All-round performance.' };
    const activeColor = (product.colors || []).find(c => c.name === product.selectedColor) || (product.colors && product.colors[0]) || { name: 'Default', code: '#0284c7' };
    const activeGallery = (product.gallery || []).find(g => g.id === product.selectedGallery) || (product.gallery && product.gallery[0]) || { id: 'g1', label: 'Front View', image: product.image, icon: '💧' };

    // Build Type Tabs HTML
    const typeTabsHtml = (product.types || []).map(t => `
      <button class="type-tab-btn ${t.id === activeType.id ? 'active' : ''}" 
              data-type-id="${t.id}">
        <span class="${state.isAdmin ? 'editable-field' : ''}" 
              contenteditable="${state.isAdmin}" 
              data-type-label-id="${t.id}">${t.name}</span>
        ${state.isAdmin ? `<span class="type-tab-del-btn" data-action="delete-type" data-type-id="${t.id}" title="Delete Type">✕</span>` : ''}
      </button>
    `).join('');

    // Build Color Swatches HTML
    const colorSwatchesHtml = (product.colors || []).map(c => `
      <div class="detail-color-swatch-item ${c.name === activeColor.name ? 'active' : ''}" 
           data-color-name="${c.name}">
        <span class="detail-swatch-dot" style="background:${c.code};"></span>
        <span class="detail-swatch-name">${c.name}</span>
        ${state.isAdmin ? `<span class="color-swatch-del-btn" data-action="delete-color" data-color-name="${c.name}" title="Delete Color">✕</span>` : ''}
      </div>
    `).join('');

    // Build Labeled Gallery HTML
    const galleryItemsHtml = (product.gallery || []).map(g => `
      <div class="gallery-thumbnail-card ${g.id === activeGallery.id ? 'active' : ''}" 
           data-gallery-id="${g.id}">
        <span class="gallery-thumb-icon">${g.icon || '💧'}</span>
        <span class="gallery-thumb-label ${state.isAdmin ? 'editable-field' : ''}" 
              contenteditable="${state.isAdmin}" 
              data-gallery-label-id="${g.id}">${g.label}</span>
        ${state.isAdmin ? `<span class="gallery-item-del-btn" data-action="delete-gallery" data-gallery-id="${g.id}" title="Delete Gallery Entry">✕</span>` : ''}
      </div>
    `).join('');

    detailBody.innerHTML = `
      <div class="detail-layout-grid">
        <!-- LEFT COLUMN: Image & Labeled Gallery -->
        <div class="detail-gallery-col">
          <div class="detail-main-img-box">
            <img src="${activeGallery.image || product.image}" alt="${product.name}" id="detail-main-preview-img">
          </div>

          <div>
            <div class="detail-labeled-gallery-title">
              <span>Labeled View Gallery:</span>
              ${state.isAdmin ? `<button class="btn-add-pill" id="btn-add-gallery-entry">+ Add View</button>` : ''}
            </div>
            <div class="detail-labeled-gallery" style="margin-top:0.6rem;">
              ${galleryItemsHtml}
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Title, Pricing, Types & Swatches -->
        <div class="detail-info-col">
          <div>
            <h2 class="detail-title editable-field" 
                contenteditable="${state.isAdmin}" 
                data-detail-field="name">${product.name}</h2>
            
            <div class="detail-price-row" style="margin-top:0.4rem;">
              <span class="detail-price-current editable-field" 
                    contenteditable="${state.isAdmin}" 
                    data-detail-field="price">₹${product.price.toLocaleString('en-IN')}</span>
              <span class="detail-price-mrp editable-field" 
                    contenteditable="${state.isAdmin}" 
                    data-detail-field="originalPrice">₹${product.originalPrice.toLocaleString('en-IN')}</span>
              <span class="badge badge-success">Free Doorstep Installation</span>
            </div>
          </div>

          <div>
            <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:0.25rem;">Product Overview:</div>
            <p class="detail-desc editable-field" 
               contenteditable="${state.isAdmin}" 
               data-detail-field="description">${product.description}</p>
          </div>

          <!-- TYPE TABS -->
          <div class="detail-type-section">
            <div class="detail-section-label">
              <span>Select Installation / Mounting Type:</span>
              ${state.isAdmin ? `<button class="btn-add-pill" id="btn-add-type-tab">+ Add Type</button>` : ''}
            </div>

            <div class="detail-type-tabs">
              ${typeTabsHtml}
            </div>

            <div class="type-tab-desc-box">
              <div style="font-weight:700; font-size:0.85rem; color:var(--primary); margin-bottom:0.2rem;">
                ${activeType.name} Configuration:
              </div>
              <div class="${state.isAdmin ? 'editable-field' : ''}" 
                   contenteditable="${state.isAdmin}" 
                   data-type-desc-id="${activeType.id}">
                ${activeType.desc || 'Optimized performance for this configuration.'}
              </div>
            </div>
          </div>

          <!-- COLOR SWATCHES -->
          <div>
            <div class="detail-section-label">
              <span>Color Variants (Selected: <strong style="color:var(--primary);">${activeColor.name}</strong>):</span>
              ${state.isAdmin ? `<button class="btn-add-pill" id="btn-add-color-swatch">+ Add Color</button>` : ''}
            </div>

            <div class="detail-color-swatches-box">
              ${colorSwatchesHtml}
            </div>
          </div>

          <!-- ACTIONS -->
          <div style="display:flex; flex-direction:column; gap:0.65rem; padding-top:0.75rem; border-top:1px solid var(--border-color);">
            <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:0.6rem;">
              <button class="btn btn-action-wa" id="btn-detail-wa-enquire" style="padding:0.75rem; font-weight:700; font-size:0.95rem;">
                💬 WhatsApp Buy / Enquiry
              </button>
              <button class="btn btn-primary" id="btn-detail-instant-buy" style="padding:0.75rem; font-weight:700;">
                ⚡ Buy Now (₹${product.price.toLocaleString('en-IN')})
              </button>
            </div>
            <a href="${AquaStore.buildCallUrl()}" class="btn btn-outline btn-sm" style="text-align:center;">
              📞 Call Product Specialist directly: ${AquaStore.getSettings().phone}
            </a>
          </div>
        </div>
      </div>
    `;

    // Type tab clicks
    detailBody.querySelectorAll('.type-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (e.target.isContentEditable || e.target.classList.contains('type-tab-del-btn')) return;
        const typeId = btn.getAttribute('data-type-id');
        AquaStore.updateSpotlightProduct(product.id, { selectedType: typeId });
        product.selectedType = typeId;
        renderDetailModalContent(product);
      });
    });

    // Color swatch clicks
    detailBody.querySelectorAll('.detail-color-swatch-item').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        if (e.target.classList.contains('color-swatch-del-btn')) return;
        const colorName = swatch.getAttribute('data-color-name');
        AquaStore.updateSpotlightProduct(product.id, { selectedColor: colorName });
        product.selectedColor = colorName;
        renderDetailModalContent(product);
      });
    });

    // Gallery thumbnail clicks
    detailBody.querySelectorAll('.gallery-thumbnail-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.isContentEditable || e.target.classList.contains('gallery-item-del-btn')) return;
        const galleryId = card.getAttribute('data-gallery-id');
        AquaStore.updateSpotlightProduct(product.id, { selectedGallery: galleryId });
        product.selectedGallery = galleryId;
        renderDetailModalContent(product);
      });
    });

    // WhatsApp Buy/Enquiry button
    detailBody.querySelector('#btn-detail-wa-enquire')?.addEventListener('click', () => {
      const settings = AquaStore.getSettings();
      const msg = `Hello Aqua Water Purifiers! I am interested in purchasing/inquiring about:
*${product.name}*
- Selected Type: ${activeType.name}
- Selected Color: ${activeColor.name}
- Quoted Price: ₹${product.price.toLocaleString('en-IN')}

Please share delivery availability and next steps. Powered by Kotti`;
      window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    });

    // Instant Buy Now button
    detailBody.querySelector('#btn-detail-instant-buy')?.addEventListener('click', () => {
      detailModal?.classList.remove('open');
      openCheckoutModal({
        id: product.id,
        name: `${product.name} (${activeType.name})`,
        price: product.price,
        originalPrice: product.originalPrice,
        image: activeGallery.image || product.image,
        defaultColor: activeColor.name
      }, activeColor.name);
    });

    // ADMIN INLINE EDITING LISTENERS IN DETAIL MODAL
    if (state.isAdmin) {
      // Editable main fields (name, price, originalPrice, description)
      detailBody.querySelectorAll('[data-detail-field]').forEach(field => {
        field.addEventListener('blur', () => {
          const fieldName = field.getAttribute('data-detail-field');
          let val = field.textContent.trim();
          if (fieldName === 'price' || fieldName === 'originalPrice') {
            val = parseInt(val.replace(/[^0-9]/g, ''), 10) || product[fieldName];
            field.textContent = `₹${val.toLocaleString('en-IN')}`;
          }
          const updates = {};
          updates[fieldName] = val;
          AquaStore.updateSpotlightProduct(product.id, updates);
          product[fieldName] = val;
          renderSpotlightProducts();
          triggerAutoSaveIndicator();
        });
        field.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && (field.getAttribute('data-detail-field') === 'name' || field.getAttribute('data-detail-field') === 'price')) {
            e.preventDefault();
            field.blur();
          }
        });
      });

      // Type tab label edits
      detailBody.querySelectorAll('[data-type-label-id]').forEach(el => {
        el.addEventListener('blur', () => {
          const tId = el.getAttribute('data-type-label-id');
          const newName = el.textContent.trim();
          const targetType = product.types.find(t => t.id === tId);
          if (targetType && newName) {
            targetType.name = newName;
            AquaStore.updateSpotlightProduct(product.id, { types: product.types });
            renderSpotlightProducts();
            triggerAutoSaveIndicator();
          }
        });
      });

      // Type tab description edit
      const typeDescEl = detailBody.querySelector('[data-type-desc-id]');
      if (typeDescEl) {
        typeDescEl.addEventListener('blur', () => {
          const tId = typeDescEl.getAttribute('data-type-desc-id');
          const newDesc = typeDescEl.textContent.trim();
          const targetType = product.types.find(t => t.id === tId);
          if (targetType) {
            targetType.desc = newDesc;
            AquaStore.updateSpotlightProduct(product.id, { types: product.types });
            triggerAutoSaveIndicator();
          }
        });
      }

      // Add Type button
      detailBody.querySelector('#btn-add-type-tab')?.addEventListener('click', () => {
        const typeName = prompt('Enter new installation / mounting type name (e.g. Island Countertop, Balcony Line):');
        if (!typeName) return;
        const newId = 'type-' + Date.now();
        product.types.push({
          id: newId,
          name: typeName.trim(),
          desc: `Custom ${typeName.trim()} configuration for your space.`
        });
        product.selectedType = newId;
        AquaStore.updateSpotlightProduct(product.id, { types: product.types, selectedType: newId });
        renderDetailModalContent(product);
        renderSpotlightProducts();
        triggerAutoSaveIndicator();
      });

      // Delete Type button
      detailBody.querySelectorAll('[data-action="delete-type"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tId = btn.getAttribute('data-type-id');
          if (product.types.length <= 1) {
            showToast('A product must have at least one type.', 'warning');
            return;
          }
          product.types = product.types.filter(t => t.id !== tId);
          if (product.selectedType === tId) {
            product.selectedType = product.types[0].id;
          }
          AquaStore.updateSpotlightProduct(product.id, { types: product.types, selectedType: product.selectedType });
          renderDetailModalContent(product);
          renderSpotlightProducts();
          triggerAutoSaveIndicator();
        });
      });

      // Add Color button
      detailBody.querySelector('#btn-add-color-swatch')?.addEventListener('click', () => {
        const colorName = prompt('Enter color variant name (e.g. Copper Bronze, Midnight Black):');
        if (!colorName) return;
        const colorCode = prompt('Enter hex color code (e.g. #b45309 or #0284c7):', '#0284c7');
        product.colors.push({
          name: colorName.trim(),
          code: colorCode.trim() || '#0284c7'
        });
        product.selectedColor = colorName.trim();
        AquaStore.updateSpotlightProduct(product.id, { colors: product.colors, selectedColor: product.selectedColor });
        renderDetailModalContent(product);
        renderSpotlightProducts();
        triggerAutoSaveIndicator();
      });

      // Delete Color button
      detailBody.querySelectorAll('[data-action="delete-color"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const cName = btn.getAttribute('data-color-name');
          if (product.colors.length <= 1) {
            showToast('A product must have at least one color.', 'warning');
            return;
          }
          product.colors = product.colors.filter(c => c.name !== cName);
          if (product.selectedColor === cName) {
            product.selectedColor = product.colors[0].name;
          }
          AquaStore.updateSpotlightProduct(product.id, { colors: product.colors, selectedColor: product.selectedColor });
          renderDetailModalContent(product);
          renderSpotlightProducts();
          triggerAutoSaveIndicator();
        });
      });

      // Gallery entry label edits
      detailBody.querySelectorAll('[data-gallery-label-id]').forEach(el => {
        el.addEventListener('blur', () => {
          const gId = el.getAttribute('data-gallery-label-id');
          const newLabel = el.textContent.trim();
          const targetG = product.gallery.find(g => g.id === gId);
          if (targetG && newLabel) {
            targetG.label = newLabel;
            AquaStore.updateSpotlightProduct(product.id, { gallery: product.gallery });
            triggerAutoSaveIndicator();
          }
        });
      });

      // Add Gallery Entry button
      detailBody.querySelector('#btn-add-gallery-entry')?.addEventListener('click', () => {
        const label = prompt('Enter labeled view name (e.g. Faucet Detail, Filter System, Night Ambient):');
        if (!label) return;
        const icon = prompt('Enter emoji icon for thumbnail (e.g. 🚰, 🔬, 🏠, 💧):', '💧') || '💧';
        const newId = 'gal-' + Date.now();
        product.gallery.push({
          id: newId,
          label: label.trim(),
          image: product.image,
          icon: icon.trim()
        });
        product.selectedGallery = newId;
        AquaStore.updateSpotlightProduct(product.id, { gallery: product.gallery, selectedGallery: newId });
        renderDetailModalContent(product);
        triggerAutoSaveIndicator();
      });

      // Delete Gallery Entry button
      detailBody.querySelectorAll('[data-action="delete-gallery"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const gId = btn.getAttribute('data-gallery-id');
          if (product.gallery.length <= 1) {
            showToast('A product must have at least one gallery entry.', 'warning');
            return;
          }
          product.gallery = product.gallery.filter(g => g.id !== gId);
          if (product.selectedGallery === gId) {
            product.selectedGallery = product.gallery[0].id;
          }
          AquaStore.updateSpotlightProduct(product.id, { gallery: product.gallery, selectedGallery: product.selectedGallery });
          renderDetailModalContent(product);
          triggerAutoSaveIndicator();
        });
      });
    }
  }

  // ---------------- ADMIN INLINE AUTH & CONTROLS ---------------- //
  function setupInlineAdmin() {
    // Top-right Admin button click
    headerAdminBtn?.addEventListener('click', () => {
      if (state.isAdmin) {
        showToast('Admin edit mode is already active! Click any product text to edit directly.', 'info');
      } else {
        const passInput = document.getElementById('admin-pass-input');
        if (passInput) passInput.value = '';
        adminPasswordModal?.classList.add('open');
      }
    });

    // Password Form Submit
    const passForm = document.getElementById('admin-password-form');
    passForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = document.getElementById('admin-pass-input').value.trim();
      const settings = AquaStore.getSettings();

      if (entered === settings.adminPass || entered === 'aqua2026') {
        state.isAdmin = true;
        sessionStorage.setItem('aqua_inline_admin', 'true');
        adminPasswordModal?.classList.remove('open');
        applyAdminModeUI();
        renderSpotlightProducts();
        if (state.activeDetailProduct) {
          renderDetailModalContent(state.activeDetailProduct);
        }
        showToast('🛠️ Admin Edit Mode unlocked! Click any product text to edit directly.', 'success');
      } else {
        showToast('Invalid password! Default prototype password is aqua2026', 'danger');
      }
    });

    // Exit Edit Mode Button
    document.getElementById('btn-admin-exit-edit')?.addEventListener('click', () => {
      state.isAdmin = false;
      sessionStorage.removeItem('aqua_inline_admin');
      applyAdminModeUI();
      renderSpotlightProducts();
      if (state.activeDetailProduct) {
        renderDetailModalContent(state.activeDetailProduct);
      }
      showToast('Exited Admin Edit Mode. Switched to customer view.', 'info');
    });

    // Add Purifier Button in Admin Bar
    document.getElementById('btn-admin-add-product')?.addEventListener('click', () => {
      const name = prompt('Enter new purifier model name:', 'Aqua Zenith AI Pro');
      if (!name) return;
      const priceStr = prompt('Enter selling price in ₹ (e.g. 15999):', '15999');
      const price = parseInt(priceStr, 10) || 15999;

      const newProd = {
        id: 'spot-' + Date.now(),
        name: name.trim(),
        category: 'Raindrop',
        price: price,
        originalPrice: Math.round(price * 1.4),
        rating: 5.0,
        reviewsCount: 1,
        description: 'New generation smart water purifier with multi-stage mineral balancing and high-flow filtration.',
        image: 'assets/images/hero-banner.jpg',
        types: [
          { id: 'wall', name: 'Wall-mounted', desc: 'Secure wall anchor mounting with concealed piping.' },
          { id: 'counter', name: 'Countertop', desc: 'Sleek non-slip countertop placement.' }
        ],
        selectedType: 'wall',
        colors: [
          { name: 'Sky Blue', code: '#38bdf8' },
          { name: 'White', code: '#ffffff' }
        ],
        selectedColor: 'Sky Blue',
        gallery: [
          { id: 'g1', label: 'Front View', image: 'assets/images/hero-banner.jpg', icon: '💧' },
          { id: 'g2', label: 'Installed View', image: 'assets/images/service-banner.jpg', icon: '🏠' }
        ]
      };

      AquaStore.addSpotlightProduct(newProd);
      renderSpotlightProducts();
      triggerAutoSaveIndicator();
      showToast(`Added "${newProd.name}" to the storefront!`, 'success');
    });
  }

  // ---------------- PRODUCT RENDERING ---------------- //
  function renderNormalProducts() {
    if (!normalGrid) return;
    const products = AquaStore.getNormalProducts();
    normalGrid.innerHTML = '';

    const filtered = filterProducts(products);

    if (filtered.length === 0) {
      normalGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p>No products found matching your search.</p>
        </div>`;
      return;
    }

    filtered.forEach(p => {
      normalGrid.appendChild(createProductCard(p));
    });
  }

  function renderRaindropProducts() {
    if (!raindropGrid) return;
    const products = AquaStore.getRaindropProducts();
    raindropGrid.innerHTML = '';

    const filtered = filterProducts(products);

    if (filtered.length === 0) {
      raindropGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p>No products found matching your search.</p>
        </div>`;
      return;
    }

    filtered.forEach(p => {
      raindropGrid.appendChild(createProductCard(p));
    });
  }

  function filterProducts(products) {
    return products.filter(p => {
      if (state.activeCategoryFilter !== 'all' && p.category.toLowerCase() !== state.activeCategoryFilter) {
        return false;
      }
      if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || 
               p.subtitle.toLowerCase().includes(q) || 
               p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }

  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = `product-card ${product.category.toLowerCase()}-card`;
    card.id = `prod-card-${product.id}`;

    // Selected color variant
    const currentColor = state.selectedVariants[product.id] || product.defaultColor || (product.colors[0] ? product.colors[0].name : 'Default');
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    // Color Swatches HTML
    const swatchesHtml = product.colors.map(c => `
      <div class="swatch-item ${c.name === currentColor ? 'active' : ''}" 
           style="background-color: ${c.code};" 
           title="${c.name}"
           data-prod-id="${product.id}"
           data-color="${c.name}"></div>
    `).join('');

    // Feature list HTML
    const featuresHtml = (product.features || []).slice(0, 3).map(f => `
      <li>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${f}</span>
      </li>
    `).join('');

    card.innerHTML = `
      <div class="product-badge-wrap">
        <span class="badge ${product.category === 'Raindrop' ? 'badge-raindrop' : 'badge-primary'}">${product.category} Series</span>
        ${discount > 0 ? `<span class="product-discount-pill">Save ${discount}%</span>` : ''}
      </div>

      <div class="product-img-box">
        <img src="${product.image}" alt="${product.name}" loading="lazy" id="img-${product.id}">
        <div class="variant-swatch-box">
          <span class="swatch-label" id="swatch-label-${product.id}">Color: ${currentColor}</span>
          ${swatchesHtml}
        </div>
      </div>

      <div class="product-content">
        <div class="product-rating">
          <span>★</span> <span>${product.rating || '4.8'}</span>
          <span class="review-count">(${product.reviewsCount || 100}+ reviews)</span>
        </div>

        <h3 class="product-title">${product.name}</h3>
        <p class="product-subtitle">${product.subtitle}</p>

        <ul class="product-features-mini">
          ${featuresHtml}
        </ul>

        <div class="product-price-row">
          <span class="product-price-current">₹${product.price.toLocaleString('en-IN')}</span>
          <span class="product-price-mrp">₹${product.originalPrice.toLocaleString('en-IN')}</span>
        </div>

        <div class="product-payment-tags">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
          <span>UPI & Cash on Delivery (COD)</span>
        </div>

        <div class="product-actions">
          <button class="btn ${product.category === 'Raindrop' ? 'btn-raindrop' : 'btn-primary'} btn-buy" data-action="buy-now" data-id="${product.id}">
            ⚡ Buy Now
          </button>
          <button class="btn btn-outline btn-sm" data-action="add-cart" data-id="${product.id}" title="Add to Cart">
            🛒 Add to Cart
          </button>
          <a href="${AquaStore.buildCallUrl()}" class="btn btn-action-call" title="Call directly">
            📞 Call
          </a>
          <a href="#" class="btn btn-action-wa" data-action="wa-inquiry" data-id="${product.id}" title="Inquire on WhatsApp">
            💬 WhatsApp
          </a>
        </div>
      </div>
    `;

    // Event listener for color swatch clicks
    card.querySelectorAll('.swatch-item').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        const prodId = swatch.getAttribute('data-prod-id');
        const color = swatch.getAttribute('data-color');
        state.selectedVariants[prodId] = color;

        // Update active class
        card.querySelectorAll('.swatch-item').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        // Update label
        const label = card.querySelector(`#swatch-label-${prodId}`);
        if (label) label.textContent = `Color: ${color}`;

        // Dynamic visual tint / feedback
        const img = card.querySelector(`#img-${prodId}`);
        if (img) {
          img.style.filter = color.toLowerCase().includes('black') ? 'contrast(1.2) brightness(0.85)' : 
                             color.toLowerCase().includes('blue') ? 'hue-rotate(15deg) saturate(1.2)' : 'none';
        }
      });
    });

    // Button actions
    card.querySelector('[data-action="buy-now"]').addEventListener('click', () => {
      openCheckoutModal(product, state.selectedVariants[product.id] || product.defaultColor);
    });

    card.querySelector('[data-action="add-cart"]').addEventListener('click', () => {
      const selectedColor = state.selectedVariants[product.id] || product.defaultColor;
      AquaStore.addToCart(product, selectedColor, 1);
      showToast(`Added ${product.name} (${selectedColor}) to Cart!`, 'success');
      animateCartBadge();
    });

    card.querySelector('[data-action="wa-inquiry"]').addEventListener('click', (e) => {
      e.preventDefault();
      const selectedColor = state.selectedVariants[product.id] || product.defaultColor;
      const settings = AquaStore.getSettings();
      const msg = `Hello Aqua Water Purifiers! I am interested in purchasing:\n*${product.name}* (${product.subtitle})\n- Selected Color: ${selectedColor}\n- Price: ₹${product.price.toLocaleString('en-IN')}\n\nPlease share availability and delivery time. Powered by Kotti`;
      window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    });

    return card;
  }

  // ---------------- SERVICES RENDERING ---------------- //
  function renderServices() {
    if (!servicesGrid) return;
    const services = AquaStore.getServices();
    servicesGrid.innerHTML = '';

    services.forEach(s => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.id = `srv-card-${s.id}`;

      const featuresHtml = (s.features || []).map(f => `
        <li>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${f}</span>
        </li>
      `).join('');

      card.innerHTML = `
        <div class="service-header">
          <div class="service-icon-box">
            ${getServiceSvgIcon(s.icon)}
          </div>
          <div class="service-meta">
            <h3>${s.name}</h3>
            <span class="service-price-tag">${s.startingTag}</span>
          </div>
        </div>

        <p class="service-desc">${s.shortDesc}</p>

        <ul class="service-features-list">
          ${featuresHtml}
        </ul>

        <div class="service-actions">
          <button class="btn btn-primary btn-sm" data-action="book-service" data-id="${s.id}">
            📅 Book Service
          </button>
          <a href="${AquaStore.buildCallUrl()}" class="btn btn-action-call btn-sm">
            📞 Call
          </a>
          <button class="btn btn-action-wa btn-sm" data-action="wa-service" data-id="${s.id}">
            💬 WhatsApp
          </button>
        </div>
      `;

      // Actions
      card.querySelector('[data-action="book-service"]').addEventListener('click', () => {
        openServiceModal(s);
      });

      card.querySelector('[data-action="wa-service"]').addEventListener('click', () => {
        const settings = AquaStore.getSettings();
        const msg = `Hello Aqua Water Purifiers! I need *${s.name}* at my address.\nPrice quoted: ${s.startingTag}.\nPlease confirm technician availability. Powered by Kotti`;
        window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
      });

      servicesGrid.appendChild(card);
    });
  }

  function getServiceSvgIcon(iconName) {
    switch (iconName) {
      case 'wrench':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
      case 'shield-check':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`;
      case 'layers':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`;
      case 'tool':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"></path></svg>`;
      case 'refresh-cw':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`;
      case 'activity':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`;
      case 'truck':
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>`;
      default:
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }
  }

  // ---------------- CART DRAWER ---------------- //
  function renderCart() {
    const cart = AquaStore.getCart();
    const { subtotal, count } = AquaStore.getCartTotal();

    // Update badges
    cartCountBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    if (cartSubtotalEl) {
      cartSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p>Your shopping cart is empty.</p>
          <button class="btn btn-primary btn-sm" id="btn-browse-purifiers">Browse Purifiers</button>
        </div>`;
      
      const browseBtn = cartItemsContainer.querySelector('#btn-browse-purifiers');
      if (browseBtn) {
        browseBtn.addEventListener('click', () => {
          closeCartDrawer();
          document.getElementById('shopping')?.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item" data-cart-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-color">Color: <strong>${item.color}</strong></div>
          <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          
          <div class="cart-item-controls">
            <button class="cart-qty-btn" data-action="dec" data-id="${item.id}">-</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${item.id}">+</button>
            <span class="cart-item-remove" data-action="remove" data-id="${item.id}">Remove</span>
          </div>
        </div>
      </div>
    `).join('');

    // Cart controls
    cartItemsContainer.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        const item = cart.find(i => i.id === id);
        if (!item) return;
        const newQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1;
        AquaStore.updateCartQuantity(id, newQty);
        renderCart();
      });
    });

    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        AquaStore.removeFromCart(id);
        renderCart();
        showToast('Item removed from cart', 'info');
      });
    });
  }

  function openCartDrawer() {
    if (cartDrawerBackdrop) {
      cartDrawerBackdrop.classList.add('open');
      renderCart();
    }
  }

  function closeCartDrawer() {
    if (cartDrawerBackdrop) {
      cartDrawerBackdrop.classList.remove('open');
    }
  }

  function animateCartBadge() {
    cartCountBadges.forEach(b => {
      b.classList.remove('anim-pulse');
      void b.offsetWidth; // trigger reflow
      b.classList.add('anim-pulse');
    });
  }

  // ---------------- CHECKOUT MODAL ---------------- //
  function openCheckoutModal(singleProduct = null, selectedColor = null) {
    closeCartDrawer();
    state.checkoutProduct = singleProduct ? { ...singleProduct, selectedColor } : null;

    let checkoutItems = [];
    let grandTotal = 0;

    if (singleProduct) {
      checkoutItems = [{
        name: singleProduct.name,
        color: selectedColor || singleProduct.defaultColor,
        price: singleProduct.price,
        quantity: 1
      }];
      grandTotal = singleProduct.price;
    } else {
      const cart = AquaStore.getCart();
      if (cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
      }
      checkoutItems = cart.map(i => ({
        id: i.productId,
        name: i.name,
        color: i.color,
        price: i.price,
        quantity: i.quantity
      }));
      grandTotal = AquaStore.getCartTotal().subtotal;
    }

    renderCheckoutForm(checkoutItems, grandTotal);
    if (checkoutModal) checkoutModal.classList.add('open');
  }

  function renderCheckoutForm(items, grandTotal) {
    const modalBody = document.getElementById('checkout-modal-body');
    if (!modalBody) return;

    const settings = AquaStore.getSettings();
    const upiQrUrl = AquaStore.generateUpiQrUrl(grandTotal, `Order for ${items[0].name}`);

    const itemsSummaryHtml = items.map(i => `
      <div style="display:flex; justify-content:space-between; margin-bottom:0.35rem; font-size:0.875rem;">
        <span><strong>${i.name}</strong> (${i.color}) x ${i.quantity}</span>
        <span style="font-weight:700;">₹${(i.price * i.quantity).toLocaleString('en-IN')}</span>
      </div>
    `).join('');

    modalBody.innerHTML = `
      <div style="background:var(--bg-muted); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.5rem; border:1px solid var(--border-color);">
        <h4 style="font-size:0.95rem; margin-bottom:0.75rem; color:var(--text-main);">Order Summary (${items.length} item${items.length > 1 ? 's' : ''})</h4>
        ${itemsSummaryHtml}
        <div style="border-top:1px dashed var(--border-color); margin-top:0.6rem; padding-top:0.6rem; display:flex; justify-content:space-between; font-weight:800; font-size:1.1rem; color:var(--primary);">
          <span>Total Payable:</span>
          <span>₹${grandTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <form id="checkout-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name *</label>
            <input type="text" class="form-input" id="checkout-name" placeholder="e.g. Rahul Sharma" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Mobile Number *</label>
            <input type="tel" class="form-input" id="checkout-phone" placeholder="e.g. 9876543210" pattern="[0-9]{10}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Delivery Address *</label>
          <textarea class="form-textarea" id="checkout-address" rows="2" placeholder="House/Flat No, Street, Landmark" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">City *</label>
            <input type="text" class="form-input" id="checkout-city" placeholder="e.g. Bangalore / Chennai" required>
          </div>
          <div class="form-group">
            <label class="form-label">Pincode *</label>
            <input type="text" class="form-input" id="checkout-pincode" placeholder="e.g. 560001" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Select Payment Method *</label>
          <div class="payment-methods-grid">
            <label class="payment-method-card selected" id="method-card-upi">
              <input type="radio" name="payment-method" value="UPI" checked>
              <div>
                <strong>UPI Payment</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">GPay, PhonePe, Paytm, QR</div>
              </div>
            </label>

            <label class="payment-method-card" id="method-card-cod">
              <input type="radio" name="payment-method" value="COD" ${settings.codEnabled ? '' : 'disabled'}>
              <div>
                <strong>Cash on Delivery</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">${settings.codEnabled ? 'Pay at your doorstep' : 'Disabled'}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Dynamic UPI Section -->
        <div class="upi-qr-container" id="upi-section">
          <div style="font-size:0.85rem; font-weight:700; margin-bottom:0.5rem; color:var(--text-main);">
            Scan to Pay ₹${grandTotal.toLocaleString('en-IN')} via any UPI App
          </div>
          <img src="${upiQrUrl}" alt="UPI QR Code" class="upi-qr-image">
          <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">
            UPI ID: <strong style="color:var(--primary);">${settings.upiId}</strong>
          </div>
          <a href="upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.upiName)}&am=${grandTotal}&cu=INR" class="btn btn-outline btn-sm">
            📱 Open Installed UPI App
          </a>
        </div>

        <div class="form-group">
          <label class="form-label">Special Instructions / Preferred Time (Optional)</label>
          <input type="text" class="form-input" id="checkout-notes" placeholder="e.g. Please install on Saturday morning">
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="padding:0.85rem; font-size:1.05rem;">
          Place Order & Get WhatsApp Confirmation
        </button>
      </form>
    `;

    // Radio switcher for UPI vs COD
    const upiRadio = modalBody.querySelector('input[value="UPI"]');
    const codRadio = modalBody.querySelector('input[value="COD"]');
    const upiSection = modalBody.querySelector('#upi-section');
    const cardUpi = modalBody.querySelector('#method-card-upi');
    const cardCod = modalBody.querySelector('#method-card-cod');

    upiRadio?.addEventListener('change', () => {
      upiSection.style.display = 'block';
      cardUpi.classList.add('selected');
      cardCod.classList.remove('selected');
    });

    codRadio?.addEventListener('change', () => {
      upiSection.style.display = 'none';
      cardCod.classList.add('selected');
      cardUpi.classList.remove('selected');
    });

    // Form submission
    const form = modalBody.querySelector('#checkout-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('checkout-name').value.trim();
      const phone = document.getElementById('checkout-phone').value.trim();
      const address = document.getElementById('checkout-address').value.trim();
      const city = document.getElementById('checkout-city').value.trim();
      const pincode = document.getElementById('checkout-pincode').value.trim();
      const paymentMethod = modalBody.querySelector('input[name="payment-method"]:checked').value;
      const notes = document.getElementById('checkout-notes').value.trim();

      const orderData = {
        customerName: name,
        phone: phone,
        address: `${address}, ${city} - ${pincode}`,
        items: items,
        total: grandTotal,
        paymentMethod: paymentMethod,
        notes: notes
      };

      const placedOrder = AquaStore.createOrder(orderData);
      renderOrderSuccess(placedOrder);
    });
  }

  function renderOrderSuccess(order) {
    const modalBody = document.getElementById('checkout-modal-body');
    if (!modalBody) return;

    const waUrl = AquaStore.buildWhatsAppOrderUrl(order);

    modalBody.innerHTML = `
      <div class="order-success-card">
        <div class="success-check-icon">✓</div>
        <h3 style="font-size:1.6rem; color:var(--text-main); margin-bottom:0.5rem;">Order Placed Successfully!</h3>
        <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
          Order ID: <strong style="color:var(--primary);">${order.id}</strong>
        </p>

        <div style="background:var(--bg-muted); border-radius:var(--radius-md); padding:1.25rem; text-align:left; margin-bottom:1.5rem; border:1px solid var(--border-color); font-size:0.875rem;">
          <div style="margin-bottom:0.5rem;"><strong>Recipient:</strong> ${order.customerName} (${order.phone})</div>
          <div style="margin-bottom:0.5rem;"><strong>Delivery Address:</strong> ${order.address}</div>
          <div style="margin-bottom:0.5rem;"><strong>Payment Method:</strong> ${order.paymentMethod} (${order.paymentStatus})</div>
          <div style="font-weight:800; font-size:1.05rem; color:var(--primary); margin-top:0.5rem;">
            Total: ₹${order.total.toLocaleString('en-IN')}
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <a href="${waUrl}" target="_blank" class="btn btn-action-wa" style="padding:0.85rem; font-size:1rem; font-weight:700;">
            💬 Send Order Details to WhatsApp Now
          </a>
          <a href="${AquaStore.buildCallUrl()}" class="btn btn-outline" style="padding:0.75rem;">
            📞 Call Support for Instant Confirmation
          </a>
          <button class="btn btn-sm" id="btn-close-order-success" style="color:var(--text-muted); margin-top:0.5rem;">
            Close & Continue Browsing
          </button>
        </div>
      </div>
    `;

    modalBody.querySelector('#btn-close-order-success')?.addEventListener('click', () => {
      if (checkoutModal) checkoutModal.classList.remove('open');
      renderCart();
    });
  }

  // ---------------- SERVICE BOOKING MODAL ---------------- //
  function openServiceModal(preselectedService = null) {
    const services = AquaStore.getServices();
    const modalBody = document.getElementById('service-modal-body');
    if (!modalBody) return;

    const optionsHtml = services.map(s => `
      <option value="${s.id}" ${preselectedService && preselectedService.id === s.id ? 'selected' : ''}>
        ${s.name} (${s.startingTag})
      </option>
    `).join('');

    // Pre-fill tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateStr = tomorrow.toISOString().split('T')[0];

    modalBody.innerHTML = `
      <form id="service-booking-form">
        <div class="form-group">
          <label class="form-label">Select Service Type *</label>
          <select class="form-select" id="book-service-id" required>
            ${optionsHtml}
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Preferred Date *</label>
            <input type="date" class="form-input" id="book-date" min="${minDateStr}" value="${minDateStr}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Preferred Time Slot *</label>
            <select class="form-select" id="book-time-slot" required>
              <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
              <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM)</option>
              <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Customer Name *</label>
            <input type="text" class="form-input" id="book-name" placeholder="Your Full Name" required>
          </div>
          <div class="form-group">
            <label class="form-label">WhatsApp Mobile Number *</label>
            <input type="tel" class="form-input" id="book-phone" placeholder="10-digit mobile number" pattern="[0-9]{10}" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Service Address *</label>
          <textarea class="form-textarea" id="book-address" rows="2" placeholder="Full service location with Flat / House No, Area & Landmark" required></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Purifier Brand & Model (if known)</label>
          <input type="text" class="form-input" id="book-brand" placeholder="e.g. Aqua Raindrop Model 1 / Kent / Aquaguard / Any">
        </div>

        <div class="form-group">
          <label class="form-label">Describe Issue / Specific Request</label>
          <textarea class="form-textarea" id="book-notes" rows="2" placeholder="e.g. Water taste changed, low pressure, regular 6-month servicing"></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-block" style="padding:0.85rem; font-size:1.05rem;">
          Confirm Booking & Send WhatsApp Notification
        </button>
      </form>
    `;

    const form = modalBody.querySelector('#service-booking-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const srvId = document.getElementById('book-service-id').value;
      const matchedService = AquaStore.getServiceById(srvId);

      const bookingData = {
        serviceId: srvId,
        serviceName: matchedService ? matchedService.name : 'Purifier Service',
        preferredDate: document.getElementById('book-date').value,
        timeSlot: document.getElementById('book-time-slot').value,
        customerName: document.getElementById('book-name').value.trim(),
        phone: document.getElementById('book-phone').value.trim(),
        address: document.getElementById('book-address').value.trim(),
        purifierBrand: document.getElementById('book-brand').value.trim(),
        notes: document.getElementById('book-notes').value.trim()
      };

      const booking = AquaStore.createBooking(bookingData);
      renderBookingSuccess(booking);
    });

    if (serviceModal) serviceModal.classList.add('open');
  }

  function renderBookingSuccess(booking) {
    const modalBody = document.getElementById('service-modal-body');
    if (!modalBody) return;

    const waUrl = AquaStore.buildWhatsAppBookingUrl(booking);

    modalBody.innerHTML = `
      <div class="order-success-card">
        <div class="success-check-icon">✓</div>
        <h3 style="font-size:1.6rem; color:var(--text-main); margin-bottom:0.5rem;">Service Booked Successfully!</h3>
        <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">
          Booking ID: <strong style="color:var(--primary);">${booking.id}</strong>
        </p>

        <div style="background:var(--bg-muted); border-radius:var(--radius-md); padding:1.25rem; text-align:left; margin-bottom:1.5rem; border:1px solid var(--border-color); font-size:0.875rem;">
          <div style="margin-bottom:0.5rem;"><strong>Service:</strong> ${booking.serviceName}</div>
          <div style="margin-bottom:0.5rem;"><strong>Scheduled Date:</strong> ${booking.preferredDate} (${booking.timeSlot})</div>
          <div style="margin-bottom:0.5rem;"><strong>Customer:</strong> ${booking.customerName} (${booking.phone})</div>
          <div style="margin-bottom:0.5rem;"><strong>Address:</strong> ${booking.address}</div>
          <div><strong>Purifier Model:</strong> ${booking.purifierBrand || 'All brands serviced'}</div>
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <a href="${waUrl}" target="_blank" class="btn btn-action-wa" style="padding:0.85rem; font-size:1rem; font-weight:700;">
            💬 Send Booking Details to WhatsApp Support
          </a>
          <a href="${AquaStore.buildCallUrl()}" class="btn btn-outline" style="padding:0.75rem;">
            📞 Call Service Manager Directly
          </a>
          <button class="btn btn-sm" id="btn-close-booking-success" style="color:var(--text-muted); margin-top:0.5rem;">
            Done
          </button>
        </div>
      </div>
    `;

    modalBody.querySelector('#btn-close-booking-success')?.addEventListener('click', () => {
      if (serviceModal) serviceModal.classList.remove('open');
    });
  }

  // ---------------- TDS WATER QUALITY CALCULATOR ---------------- //
  function setupTdsCalculator() {
    if (!tdsSlider) return;

    const updateTdsUI = () => {
      const val = parseInt(tdsSlider.value, 10);
      if (tdsNumberEl) tdsNumberEl.textContent = val;

      let tagText = '';
      let tagBg = '';
      let tagColor = '#ffffff';
      let adviceText = '';
      let recommendedSeries = '';

      if (val <= 150) {
        tagText = 'Excellent & Pure Water';
        tagBg = '#10b981';
        adviceText = 'Your water has optimal dissolved minerals. Standard UV or gentle Ultra-Filtration (Normal Series) is ideal to maintain mineral integrity.';
        recommendedSeries = 'Normal';
      } else if (val <= 300) {
        tagText = 'Good Drinking Water';
        tagBg = '#0284c7';
        adviceText = 'Acceptable for household use. An RO+UV active copper system is recommended to filter pesticides, chlorine and minor hardness.';
        recommendedSeries = 'Normal';
      } else if (val <= 600) {
        tagText = 'Hard Water (Needs RO)';
        tagBg = '#f59e0b';
        adviceText = 'Noticeable saltiness and scale build-up. We strongly recommend the Raindrop Series Multi-Stage Alkaline RO with active TDS balancer.';
        recommendedSeries = 'Raindrop';
      } else {
        tagText = 'Very High TDS (Borewell / Heavy)';
        tagBg = '#ef4444';
        adviceText = 'High risk of kidney stones, scale buildup, and heavy metals. Heavy-duty Borewell RO (Normal Model 9 or Raindrop Zenith 10) is mandatory.';
        recommendedSeries = 'Raindrop';
      }

      if (tdsStatusTag) {
        tdsStatusTag.textContent = tagText;
        tdsStatusTag.style.backgroundColor = tagBg;
        tdsStatusTag.style.color = tagColor;
      }

      if (tdsAdviceText) {
        tdsAdviceText.textContent = adviceText;
      }

      if (tdsMatchBtn) {
        tdsMatchBtn.textContent = `View Recommended ${recommendedSeries} Models →`;
        tdsMatchBtn.onclick = () => {
          const targetSection = recommendedSeries === 'Raindrop' ? 'shopping-raindrop' : 'shopping-normal';
          document.getElementById(targetSection)?.scrollIntoView({ behavior: 'smooth' });
        };
      }
    };

    tdsSlider.addEventListener('input', updateTdsUI);
    updateTdsUI();
  }

  // ---------------- EVENT LISTENERS ---------------- //
  function setupEventListeners() {
    // Cart open/close triggers
    document.querySelectorAll('.cart-toggle-btn, .mobile-bar-btn.cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    });

    document.getElementById('cart-drawer-close')?.addEventListener('click', closeCartDrawer);
    cartDrawerBackdrop?.addEventListener('click', (e) => {
      if (e.target === cartDrawerBackdrop) closeCartDrawer();
    });

    document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
      openCheckoutModal(null);
    });

    // Modals close buttons
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
          checkoutModal?.classList.remove('open');
          serviceModal?.classList.remove('open');
          detailModal?.classList.remove('open');
          adminPasswordModal?.classList.remove('open');
        }
      });
    });

    document.getElementById('detail-modal-close')?.addEventListener('click', () => {
      detailModal?.classList.remove('open');
    });

    // Catalog Tabs
    document.querySelectorAll('.catalog-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.catalog-tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeCategoryFilter = tab.getAttribute('data-filter') || 'all';
        renderNormalProducts();
        renderRaindropProducts();
      });
    });

    // Catalog Search
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderNormalProducts();
        renderRaindropProducts();
      });
    }

    // Announcement dismiss
    document.getElementById('announcement-close')?.addEventListener('click', () => {
      if (announcementBar) announcementBar.style.display = 'none';
    });

    // Mobile menu toggle
    if (mobileMenuToggle && mobileMenuDrawer) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenuDrawer.classList.toggle('open');
      });
      mobileMenuDrawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          mobileMenuDrawer.classList.remove('open');
        });
      });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-inquiry-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const phone = document.getElementById('contact-phone').value;
        const msg = document.getElementById('contact-msg').value;
        
        const settings = AquaStore.getSettings();
        const waMsg = `Hello Aqua Water Purifiers! Customer Inquiry:\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${msg}\nPowered by Kotti`;
        
        showToast('Thank you! Redirecting to WhatsApp support...', 'success');
        setTimeout(() => {
          window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`, '_blank');
          contactForm.reset();
        }, 800);
      });
    }
  }

  // ---------------- TOAST NOTIFICATION ---------------- //
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
