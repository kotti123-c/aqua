/**
 * AQUA WATER PURIFIERS - Store & State Management
 * Persistent reactive storage with real-time cross-tab synchronization.
 * Powered by Kotti
 */

const STORAGE_KEYS = {
  SETTINGS: 'aqua_settings_v1',
  NORMAL_PRODUCTS: 'aqua_normal_products_v1',
  RAINDROP_PRODUCTS: 'aqua_raindrop_products_v1',
  SPOTLIGHT_PRODUCTS: 'aqua_spotlight_products_v1',
  SERVICES: 'aqua_services_v1',
  ORDERS: 'aqua_orders_v1',
  BOOKINGS: 'aqua_bookings_v1',
  CART: 'aqua_cart_v1',
  AUTH: 'aqua_admin_session_v1'
};

const AquaStore = {
  // Event listeners for real-time reactivity
  listeners: [],

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  },

  notify(event, data) {
    this.listeners.forEach(cb => {
      try {
        cb(event, data);
      } catch (err) {
        console.error("Store listener error:", err);
      }
    });
  },

  init() {
    // Check if initial data exists, if not seed it
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS) || !localStorage.getItem(STORAGE_KEYS.SPOTLIGHT_PRODUCTS)) {
      this.resetToDefaults();
    }

    // Listen to cross-tab storage events
    window.addEventListener('storage', (e) => {
      if (Object.values(STORAGE_KEYS).includes(e.key)) {
        this.notify('storage_sync', { key: e.key });
      }
    });
  },

  resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.NORMAL_PRODUCTS, JSON.stringify(INITIAL_NORMAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.RAINDROP_PRODUCTS, JSON.stringify(INITIAL_RAINDROP_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SPOTLIGHT_PRODUCTS, JSON.stringify(INITIAL_SPOTLIGHT_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    this.notify('reset', null);
  },

  // SETTINGS
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...INITIAL_SETTINGS, ...JSON.parse(data) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  saveSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.applyThemeColors(updated.accentColor);
    this.notify('settings_updated', updated);
    return updated;
  },

  applyThemeColors(accentColor) {
    if (!accentColor) return;
    document.documentElement.style.setProperty('--primary', accentColor);
    // Calculate light glow
    document.documentElement.style.setProperty('--primary-glow', `${accentColor}44`);
  },

  // PRODUCTS
  getAllProducts() {
    const normal = this.getNormalProducts();
    const raindrop = this.getRaindropProducts();
    return [...normal, ...raindrop];
  },

  getNormalProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NORMAL_PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_NORMAL_PRODUCTS;
    } catch {
      return INITIAL_NORMAL_PRODUCTS;
    }
  },

  getRaindropProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RAINDROP_PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_RAINDROP_PRODUCTS;
    } catch {
      return INITIAL_RAINDROP_PRODUCTS;
    }
  },

  getProductById(id) {
    return this.getAllProducts().find(p => p.id === id) || null;
  },

  saveProduct(product) {
    const isRaindrop = product.category === 'Raindrop';
    const key = isRaindrop ? STORAGE_KEYS.RAINDROP_PRODUCTS : STORAGE_KEYS.NORMAL_PRODUCTS;
    let list = isRaindrop ? this.getRaindropProducts() : this.getNormalProducts();

    if (!product.id) {
      product.id = (isRaindrop ? 'rain-' : 'norm-') + Date.now();
      list.push(product);
    } else {
      const idx = list.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...product };
      } else {
        // If moved category, remove from other
        const otherKey = isRaindrop ? STORAGE_KEYS.NORMAL_PRODUCTS : STORAGE_KEYS.RAINDROP_PRODUCTS;
        let otherList = isRaindrop ? this.getNormalProducts() : this.getRaindropProducts();
        otherList = otherList.filter(p => p.id !== product.id);
        localStorage.setItem(otherKey, JSON.stringify(otherList));
        list.push(product);
      }
    }

    localStorage.setItem(key, JSON.stringify(list));
    this.notify('products_updated', { product });
    return product;
  },

  deleteProduct(id) {
    let normal = this.getNormalProducts().filter(p => p.id !== id);
    let raindrop = this.getRaindropProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.NORMAL_PRODUCTS, JSON.stringify(normal));
    localStorage.setItem(STORAGE_KEYS.RAINDROP_PRODUCTS, JSON.stringify(raindrop));
    this.notify('products_updated', { deletedId: id });
  },

  // SPOTLIGHT PRODUCTS (4-Product Grid with Inline Editing)
  getSpotlightProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SPOTLIGHT_PRODUCTS);
      return data ? JSON.parse(data) : INITIAL_SPOTLIGHT_PRODUCTS;
    } catch {
      return INITIAL_SPOTLIGHT_PRODUCTS;
    }
  },

  getSpotlightProductById(id) {
    return this.getSpotlightProducts().find(p => p.id === id) || null;
  },

  saveSpotlightProducts(products) {
    localStorage.setItem(STORAGE_KEYS.SPOTLIGHT_PRODUCTS, JSON.stringify(products));
    this.notify('spotlight_updated', products);
  },

  updateSpotlightProduct(id, updates) {
    let list = this.getSpotlightProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.saveSpotlightProducts(list);
      return list[idx];
    }
    return null;
  },

  reorderSpotlightProduct(id, direction) {
    let list = this.getSpotlightProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx < 0) return list;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return list;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    this.saveSpotlightProducts(list);
    return list;
  },

  addSpotlightProduct(product) {
    let list = this.getSpotlightProducts();
    if (!product.id) {
      product.id = 'spot-' + Date.now();
    }
    list.push(product);
    this.saveSpotlightProducts(list);
    return product;
  },

  deleteSpotlightProduct(id) {
    let list = this.getSpotlightProducts().filter(p => p.id !== id);
    this.saveSpotlightProducts(list);
  },

  // SERVICES
  getServices() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return data ? JSON.parse(data) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  },

  getServiceById(id) {
    return this.getServices().find(s => s.id === id) || null;
  },

  saveService(service) {
    let list = this.getServices();
    if (!service.id) {
      service.id = 'srv-' + Date.now();
      list.push(service);
    } else {
      const idx = list.findIndex(s => s.id === service.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...service };
      } else {
        list.push(service);
      }
    }
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
    this.notify('services_updated', { service });
    return service;
  },

  deleteService(id) {
    let list = this.getServices().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
    this.notify('services_updated', { deletedId: id });
  },

  // ORDERS
  getOrders() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  createOrder(orderData) {
    const list = this.getOrders();
    const newOrder = {
      id: "ORD-" + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString(),
      orderStatus: "Confirmed",
      paymentStatus: orderData.paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      ...orderData
    };
    list.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
    this.clearCart();
    this.notify('order_created', newOrder);
    return newOrder;
  },

  updateOrderStatus(orderId, status, notes = null) {
    const list = this.getOrders();
    const order = list.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      if (notes !== null) order.notes = notes;
      if (status === 'Delivered') order.paymentStatus = 'Paid';
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(list));
      this.notify('order_updated', order);
    }
    return order;
  },

  // BOOKINGS
  getBookings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  createBooking(bookingData) {
    const list = this.getBookings();
    const newBooking = {
      id: "BK-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString(),
      status: "New",
      technician: "Unassigned",
      ...bookingData
    };
    list.unshift(newBooking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
    this.notify('booking_created', newBooking);
    return newBooking;
  },

  updateBookingStatus(bookingId, status, technician = null, notes = null) {
    const list = this.getBookings();
    const booking = list.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      if (technician !== null) booking.technician = technician;
      if (notes !== null) booking.notes = notes;
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
      this.notify('booking_updated', booking);
    }
    return booking;
  },

  // CART
  getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart_updated', cart);
  },

  addToCart(product, selectedColor, quantity = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      item => item.productId === product.id && item.color === selectedColor
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: 'cart-' + Date.now(),
        productId: product.id,
        name: product.name,
        subtitle: product.subtitle,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        color: selectedColor,
        image: product.image,
        quantity: quantity
      });
    }

    this.saveCart(cart);
  },

  updateCartQuantity(cartItemId, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      cart = cart.filter(item => item.id !== cartItemId);
    } else {
      const item = cart.find(item => item.id === cartItemId);
      if (item) item.quantity = newQty;
    }
    this.saveCart(cart);
  },

  removeFromCart(cartItemId) {
    const cart = this.getCart().filter(item => item.id !== cartItemId);
    this.saveCart(cart);
  },

  clearCart() {
    this.saveCart([]);
  },

  getCartTotal() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, count };
  },

  // AUTH SESSION (Admin Portal)
  getSession() {
    try {
      const session = sessionStorage.getItem(STORAGE_KEYS.AUTH);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  loginAdmin(username, password) {
    const settings = this.getSettings();
    if (
      (username === settings.adminUser && password === settings.adminPass) ||
      (username === 'staff' && password === 'aqua123')
    ) {
      const session = {
        username: username,
        role: username === 'staff' ? 'Staff' : 'Super Admin',
        loggedInAt: new Date().toISOString()
      };
      sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
      return { success: true, session };
    }
    return { success: false, error: 'Invalid username or password' };
  },

  logoutAdmin() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // WHATSAPP & PHONE HELPERS
  buildWhatsAppOrderUrl(order) {
    const settings = this.getSettings();
    const itemsList = order.items
      .map((item, idx) => `${idx + 1}. *${item.name}* (Color: ${item.color}, Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
      .join('\n');

    const msg = 
`🌊 *NEW ORDER - AQUA WATER PURIFIERS*
----------------------------------------
*Order ID:* ${order.id}
*Customer Name:* ${order.customerName}
*Phone:* ${order.phone}
*Address:* ${order.address}

*Ordered Items:*
${itemsList}

*Total Amount:* ₹${order.total.toLocaleString('en-IN')}
*Payment Method:* ${order.paymentMethod}
*Payment Status:* ${order.paymentStatus}
${order.notes ? `*Notes:* ${order.notes}` : ''}
----------------------------------------
_Thank you for choosing Aqua Water Purifiers! Powered by Kotti_`;

    return `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  },

  buildWhatsAppBookingUrl(booking) {
    const settings = this.getSettings();
    const msg = 
`🔧 *SERVICE BOOKING REQUEST - AQUA WATER PURIFIERS*
----------------------------------------
*Booking ID:* ${booking.id}
*Service:* ${booking.serviceName}
*Customer Name:* ${booking.customerName}
*Phone:* ${booking.phone}
*Address:* ${booking.address}
*Preferred Date:* ${booking.preferredDate}
*Time Slot:* ${booking.timeSlot}
*Purifier Model/Brand:* ${booking.purifierBrand || 'Not Specified'}
${booking.notes ? `*Issue / Details:* ${booking.notes}` : ''}
----------------------------------------
_Please confirm my service appointment. Powered by Kotti_`;

    return `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  },

  buildWhatsAppDirectUrl(customMessage = "Hello Aqua Water Purifiers! I would like to know more about your purifiers & services.") {
    const settings = this.getSettings();
    return `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customMessage)}`;
  },

  buildCallUrl() {
    const settings = this.getSettings();
    return `tel:${settings.phone.replace(/[^0-9+]/g, '')}`;
  },

  generateUpiQrUrl(amount, note = "Aqua Water Purifier Order") {
    const settings = this.getSettings();
    const upiString = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(settings.upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiString)}&margin=8`;
  }
};

// Initialize Store
AquaStore.init();
