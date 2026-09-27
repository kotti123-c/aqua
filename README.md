# 🌊 AQUA WATER PURIFIERS
### Complete Website & Admin Portal / CRM Dashboard
**Version 1.0 — Powered by Kotti**

---

## 🌟 Executive Overview
**Aqua Water Purifiers** is a comprehensive, production-grade e-commerce storefront and CRM administration platform engineered specifically for water purifier retail, doorstep installation, and maintenance services.

- **Customer-Facing Storefront (`index.html`)**: Rich oceanic glassmorphism aesthetics, live TDS water quality analyzer, 20 distinct purifier models across **Normal** and **Raindrop** series, 8 doorstep services, interactive color variants, cart drawer, instant checkout with dynamic UPI QR codes, Cash on Delivery, and one-tap WhatsApp order dispatch.
- **Admin Portal & CRM Dashboard (`admin.html`)**: Complete back-office control panel with KPI metric widgets, interactive sales distribution charts, real-time product & service management (add/edit/delete), order status transitions (Confirmed, Dispatched, Delivered, Cancelled), service technician scheduling, printable tax invoices, unified CRM customer directory, and a live visual design customizer that updates storefront branding without touching code.
- **Footer Credit**: **"Powered by Kotti"** displayed across every page and document.

---

## 🚀 Quick Start Guide

### 1. Launch the Application Server
Open a terminal in the project directory and run:
```bash
# Using npm
npm start

# Or using Node.js directly (zero external dependencies required)
node server.js
```
The server will start instantly at:
- **Customer Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin Portal:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

### 2. Admin Credentials
| Role | Username | Password | Access Level |
|---|---|---|---|
| **Super Admin** | `admin` | `aqua2026` | Full CRUD on products, services, orders, CRM, and design customizer |
| **Staff Member** | `staff` | `aqua123` | Order processing and service booking management |

---

## 📂 Project Architecture

```
aqua/
├── index.html                    # Storefront (Home, Service, Shopping, Contact)
├── admin.html                    # Dedicated Admin Portal & CRM Dashboard
├── server.js                     # High-performance zero-dependency HTTP server
├── package.json                  # Project manifest with npm scripts
├── css/
│   ├── base.css                  # Oceanic palette, design tokens & animations
│   ├── components.css            # Product cards, service cards, cart drawer, modals
│   ├── pages.css                 # Hero banner, TDS analyzer, catalog layouts
│   └── admin.css                 # Dark-mode dashboard, data tables, invoices
├── js/
│   ├── data.js                   # Master catalog dataset (20 products, 8 services)
│   ├── store.js                  # Persistent reactive storage & WhatsApp builders
│   ├── app.js                    # Storefront UI, color switches, cart & checkout
│   └── admin.js                  # Admin portal management logic & invoice generator
└── assets/
    └── images/
        ├── hero-banner.jpg       # High-res luxury wall-mount RO+UV hero image
        ├── raindrop-series.jpg   # Sculptural raindrop curved smart purifier
        ├── normal-series.jpg     # Classic high-durability kitchen RO system
        ├── service-banner.jpg    # Certified service engineer with digital TDS meter
        ├── undersink-model.jpg   # Concealed under-the-counter hydro pure model
        └── black-model.jpg       # Matte black luxury digital ambient dispenser
```

---

## 🛍️ Product Catalogue Structure

Every product card features:
- High-resolution product imagery and multi-angle display
- Product specifications (stages of filtration, tank capacity, flow rate)
- Interactive **Color Swatch Selector**: customer clicks on color variants to instantly preview the option
- Dual action buttons: **⚡ Buy Now** (instant checkout) and **🛒 Add to Cart**
- **Click-to-Call** and direct **💬 WhatsApp Inquiry**

### 1. Normal Series — 10 Models
*Color Palette: White, Blue, Black*
1. **Normal Model 1** — RO + UV Active Copper Pure (₹8,999 / MRP ₹13,999)
2. **Normal Model 2** — Multi-Stage Alkaline Hydro Shield (₹9,499 / MRP ₹14,499)
3. **Normal Model 3** — Compact Kitchen Wall-Mount RO (₹8,299 / MRP ₹11,999)
4. **Normal Model 4** — High Capacity Mineralizer RO+UF (₹10,499 / MRP ₹15,999)
5. **Normal Model 5** — EcoSaver Ultra-Filtration System (₹7,799 / MRP ₹11,999)
6. **Normal Model 6** — Smart Digital TDS Display RO (₹11,999 / MRP ₹17,499)
7. **Normal Model 7** — Pro Copper Shield Infusion RO (₹10,999 / MRP ₹16,299)
8. **Normal Model 8** — Under-Sink Hydro Pure Concealed System (₹12,499 / MRP ₹18,499)
9. **Normal Model 9** — Heavy Duty Borewell Special RO+UV (₹13,999 / MRP ₹20,999)
10. **Normal Model 10** — Classic Family Pure 10L All-Rounder (₹8,499 / MRP ₹12,999)

### 2. Raindrop Series — 10 Models
*Color Palette: Sky Blue, White, Transparent-Blue*
1. **Raindrop Model 1** — Raindrop Aero Crystal RO+UV (₹13,999 / MRP ₹19,999)
2. **Raindrop Model 2** — Raindrop Wave Smart IoT Touch (₹15,499 / MRP ₹22,499)
3. **Raindrop Model 3** — Raindrop Pearl Hydro Pure (₹14,799 / MRP ₹21,000)
4. **Raindrop Model 4** — Raindrop Cascade Ambient Glow (₹16,999 / MRP ₹24,999)
5. **Raindrop Model 5** — Raindrop Mist Ultra-Slim Elegance (₹13,999 / MRP ₹20,500)
6. **Raindrop Model 6** — Raindrop Glacier Pure Glaze RO+UV (₹17,499 / MRP ₹25,999)
7. **Raindrop Model 7** — Raindrop Deluxe Dual Dispense (Ambient & Cold) (₹18,999 / MRP ₹27,499)
8. **Raindrop Model 8** — Raindrop AquaShield Prime RO+UF (₹15,999 / MRP ₹23,000)
9. **Raindrop Model 9** — Raindrop Oceanic Luxury Glass Touch (₹21,499 / MRP ₹30,999)
10. **Raindrop Model 10** — Raindrop Zenith AI Flagship Balancer (₹23,999 / MRP ₹34,999)

---

## 🔧 Service Section (8 Offerings)

Each service card includes transparent pricing, service duration, inclusion checklist, **Book Service**, **Call Now**, and **WhatsApp Dispatch**:
1. **Installation Service** — New purifier setup, bracket drilling & plumbing (Starting ₹399)
2. **Annual Maintenance Contract (AMC)** — 1-Year comprehensive coverage with 3 free visits & filter replacements (Starting ₹1,999/yr)
3. **Filter / Membrane Replacement** — Genuine NSF RO membrane, spun sediment & carbon cartridges (Starting ₹799)
4. **Repair & Troubleshooting** — Diagnostic & fix for low pressure, motor, SMPS, and leakage (Starting ₹299)
5. **RO Service (General Servicing)** — Full tank sanitation, chemical descaling, internal flushing (Starting ₹499)
6. **Water Quality (TDS) Testing** — Calibrated digital TDS, pH scale & hardness tap audit (Starting ₹99 / Free)
7. **Uninstallation / Relocation Service** — Safe dismantling and re-installation at new home (Starting ₹599)
8. **Spare Parts Replacement** — Copper booster pumps, SMPS, solenoid valves, UV lamps (Starting ₹449)

---

## 💳 Payment & Ordering Flow

1. **UPI Payment Gateway**:
   - Customer checkout generates a live dynamic QR code (`upi://pay?pa=...`) containing the configured UPI ID and order total.
   - Includes one-tap "Open Installed UPI App" intent for mobile customers.
2. **Cash on Delivery (COD)**:
   - Pay-on-delivery toggleable from Admin Settings.
3. **Automated WhatsApp Integration**:
   - On placing an order or booking a service, formatted messages with Order ID, customer name, delivery address, selected color variant, and total amount are automatically pre-filled for immediate dispatch to the business WhatsApp.

---

## ⚙️ Admin Portal Modules

1. **Dashboard Overview**: Metrics cards (Total Orders, Service Bookings, Revenue ₹, Catalog Count) and sales distribution charts.
2. **Product Management**: Real-time Add/Edit/Delete products under Normal & Raindrop categories, edit prices, descriptions, specs, and color swatches.
3. **Service Management**: Manage service cards, pricing tags, and inclusions.
4. **Orders Management**: Order status dropdown (Confirmed, Dispatched, Delivered, Cancelled), direct WhatsApp chat with customer, and printable branded Tax Invoices.
5. **Service Bookings**: Track appointments, assign technicians, and update status.
6. **CRM Customer Directory**: Unified list of clients aggregated across sales and service calls with lifetime spend tracking.
7. **Website Design Customizer**: Edit announcement banner, select primary accent theme color (Ocean Blue, Aqua Cyan, Sky Blue, Emerald, Cobalt), modify tagline, address, and footer credit.
8. **WhatsApp, Phone & UPI Settings**: Configure business phone, WhatsApp number, UPI ID, and COD availability.
9. **Restore Demo Data**: 1-click button to reload default 20 products and 8 services anytime.

---

*Engineered with precision for Aqua Water Purifiers.*  
**Powered by Kotti**
