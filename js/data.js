/**
 * AQUA WATER PURIFIERS - Master Initial Dataset
 * Version 1.0 - Powered by Kotti
 */

const INITIAL_SETTINGS = {
  businessName: "Aqua Water Purifiers",
  tagline: "Pure Water, Healthier Life — Advanced RO, UV, UF & Alkaline Systems",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "support@aquawaterpurifiers.in",
  address: "Shop No. 14, Aqua Crest Avenue, Metro Pillar 128, Waterworks Colony, Chennai - 600001",
  workingHours: "Mon - Sun: 8:00 AM - 9:00 PM",
  upiId: "aquawaterpurifiers@okhdfcbank",
  upiName: "Aqua Water Purifiers",
  codEnabled: true,
  freeInstallation: true,
  announcementText: "💧 Special Offer: Flat 20% OFF on all Raindrop Models + Free Doorstep TDS Water Audit!",
  announcementActive: true,
  accentColor: "#0284c7", // Ocean Blue default
  footerCredit: "Powered by Kotti",
  adminUser: "admin",
  adminPass: "aqua2026",
  currency: "₹"
};

const INITIAL_SERVICES = [
  {
    id: "srv-1",
    name: "Installation Service",
    shortDesc: "Complete new water purifier setup with precision plumbing, inlet diverter fitting, and TDS check.",
    price: 399,
    startingTag: "Starting from ₹399",
    turnaround: "Same Day Service (within 2-4 hrs)",
    badge: "Most Popular",
    icon: "wrench",
    image: "assets/images/service-banner.jpg",
    features: [
      "Inlet & outlet food-grade piping connection",
      "Wall mount bracket alignment & drilling",
      "Leakage test & high-pressure pump calibration",
      "Complimentary Digital TDS water audit"
    ]
  },
  {
    id: "srv-2",
    name: "Annual Maintenance Contract (AMC)",
    shortDesc: "12-month worry-free protection including scheduled filter replacements, priority visits, and parts coverage.",
    price: 1999,
    startingTag: "Starting from ₹1,999 / year",
    turnaround: "Priority 2-Hour Dispatch",
    badge: "Best Value",
    icon: "shield-check",
    image: "assets/images/service-banner.jpg",
    features: [
      "3 Free periodic scheduled maintenance visits",
      "Free 1x Sediment + 1x Pre-Carbon filter kit",
      "Unlimited breakdown emergency call-outs",
      "Zero labor & service charges for 1 full year"
    ]
  },
  {
    id: "srv-3",
    name: "Filter / Membrane Replacement",
    shortDesc: "Genuine NSF-certified RO membrane, activated carbon filter, and spun sediment cartridge replacement.",
    price: 799,
    startingTag: "Starting from ₹799",
    turnaround: "Within 3 hours",
    badge: "Essential",
    icon: "layers",
    image: "assets/images/service-banner.jpg",
    features: [
      "80/100 GPD high-rejection RO membrane options",
      "Coconut shell activated post-carbon cartridge",
      "Polypropylene 5-micron pre-filter candle change",
      "Restores 98%+ TDS rejection and sweet taste"
    ]
  },
  {
    id: "srv-4",
    name: "Repair & Troubleshooting",
    shortDesc: "Diagnosis and fix for common issues: motor not working, continuous beep, slow flow, water leakage, or taste changes.",
    price: 299,
    startingTag: "Starting from ₹299",
    turnaround: "Quick 2-Hour Visit",
    badge: "Instant Fix",
    icon: "tool",
    image: "assets/images/service-banner.jpg",
    features: [
      "Booster pump electrical load diagnostic",
      "SMPS power adapter & Solenoid Valve testing",
      "Internal tube joint & leak seal repairs",
      "Transparent upfront estimate before work"
    ]
  },
  {
    id: "srv-5",
    name: "RO Service (General Servicing)",
    shortDesc: "Thorough deep cleaning, chemical tank descaling, internal flushing, and electronic health diagnostic.",
    price: 499,
    startingTag: "Starting from ₹499",
    turnaround: "Within 3-4 hours",
    badge: "Recommended",
    icon: "refresh-cw",
    image: "assets/images/service-banner.jpg",
    features: [
      "UV chamber sanitation & cleaning",
      "Water storage tank scrub & sterilization",
      "Pre-filter bowl washing & backwash flush",
      "Electrical wiring & float switch check"
    ]
  },
  {
    id: "srv-6",
    name: "Water Quality (TDS) Testing",
    shortDesc: "Certified digital TDS testing, pH scale audit, and chemical hardness evaluation right at your kitchen tap.",
    price: 99,
    startingTag: "Starting from ₹99 (Free with any service)",
    turnaround: "30-Minute Visit",
    badge: "Safety Check",
    icon: "activity",
    image: "assets/images/service-banner.jpg",
    features: [
      "Calibrated HM Digital TDS measurement",
      "pH alkalinity level strip test",
      "Total dissolved solids report & health advice",
      "Expert purifier recommendation for your water source"
    ]
  },
  {
    id: "srv-7",
    name: "Uninstallation / Relocation Service",
    shortDesc: "Safe dismantling, water line capping, bubble wrap packing, and re-installation at your new home or apartment.",
    price: 599,
    startingTag: "Starting from ₹599",
    turnaround: "Slot as per convenience",
    badge: "Moving Home",
    icon: "truck",
    image: "assets/images/service-banner.jpg",
    features: [
      "Safe drain and water tank depressurization",
      "Clean detachment without wall damage",
      "Careful transport preparation of sensitive filters",
      "Re-mounting & pressure setup at new premises"
    ]
  },
  {
    id: "srv-8",
    name: "Spare Parts Replacement",
    shortDesc: "100% authentic copper winded booster pumps, 24V/36V SMPS adaptors, low-pressure switches, and UV lamps.",
    price: 449,
    startingTag: "Starting from ₹449",
    turnaround: "Immediate with technician",
    badge: "Genuine Parts",
    icon: "cpu",
    image: "assets/images/service-banner.jpg",
    features: [
      "100 GPD Heavy-duty copper booster pumps",
      "Waterproof SMPS power supplies with surge fuse",
      "Food-grade push-fit John Guest fittings",
      "1-Year manufacturer replacement guarantee"
    ]
  }
];

const INITIAL_NORMAL_PRODUCTS = [
  {
    id: "norm-1",
    name: "Normal Model 1",
    subtitle: "RO + UV Active Copper Pure",
    category: "Normal",
    price: 8999,
    originalPrice: 13999,
    rating: 4.8,
    reviewsCount: 142,
    stock: 24,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "White",
    image: "assets/images/normal-series.jpg",
    features: [
      "8-Stage RO + UV + Copper Infusion",
      "10 Liters Large Storage Tank",
      "Active TDS Control Valve",
      "Food-Grade ABS Enclosure"
    ],
    specs: {
      capacity: "10 Liters",
      filtrationRate: "15 L/hr",
      powerConsumption: "40 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-2",
    name: "Normal Model 2",
    subtitle: "Multi-Stage Alkaline Hydro Shield",
    category: "Normal",
    price: 9499,
    originalPrice: 14499,
    rating: 4.9,
    reviewsCount: 198,
    stock: 19,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "Blue",
    image: "assets/images/normal-series.jpg",
    features: [
      "Bio-Alkaline pH Booster (8.0 - 8.5 pH)",
      "Multi-Layer Sediment + Activated Carbon",
      "Smart Auto Water Cut-off Sensor",
      "Purifies Tap, Borewell & Tanker Water"
    ],
    specs: {
      capacity: "9 Liters",
      filtrationRate: "16 L/hr",
      powerConsumption: "45 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-3",
    name: "Normal Model 3",
    subtitle: "Compact Kitchen Wall-Mount RO",
    category: "Normal",
    price: 8299,
    originalPrice: 12499,
    rating: 4.7,
    reviewsCount: 88,
    stock: 15,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "White",
    image: "assets/images/normal-series.jpg",
    features: [
      "Ultra-Slim Wall Space Saving Design",
      "6-Stage High Rejection Membrane",
      "Transparent Water Level Indicator",
      "Low Power Consumption Eco-Drive"
    ],
    specs: {
      capacity: "8 Liters",
      filtrationRate: "12 L/hr",
      powerConsumption: "35 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-4",
    name: "Normal Model 4",
    subtitle: "High Capacity Mineralizer RO+UF",
    category: "Normal",
    price: 10499,
    originalPrice: 15999,
    rating: 4.8,
    reviewsCount: 112,
    stock: 28,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "Black",
    image: "assets/images/normal-series.jpg",
    features: [
      "Mineral Fortification (Calcium + Magnesium)",
      "High-Flow 18 L/hr Purification",
      "Dual RO + UF Biological Filter",
      "Overfill & Dry Run Protection"
    ],
    specs: {
      capacity: "12 Liters",
      filtrationRate: "18 L/hr",
      powerConsumption: "48 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-5",
    name: "Normal Model 5",
    subtitle: "EcoSaver Ultra-Filtration System",
    category: "Normal",
    price: 7799,
    originalPrice: 11999,
    rating: 4.6,
    reviewsCount: 75,
    stock: 12,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "White",
    image: "assets/images/normal-series.jpg",
    features: [
      "50% Water Recovery High Efficiency",
      "RO + UF Membrane Protection",
      "Ergonomic Push Tap Dispenser",
      "Budget-friendly Household Champion"
    ],
    specs: {
      capacity: "8 Liters",
      filtrationRate: "14 L/hr",
      powerConsumption: "36 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-6",
    name: "Normal Model 6",
    subtitle: "Smart Digital TDS Display RO",
    category: "Normal",
    price: 11999,
    originalPrice: 17499,
    rating: 4.9,
    reviewsCount: 164,
    stock: 21,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "Black",
    image: "assets/images/hero-banner.jpg",
    features: [
      "Real-time Digital TDS Readout Panel",
      "Filter Life Alert & Replacement Buzzer",
      "9-Stage Advanced Purification Cycle",
      "UV in-tank 24x7 Disinfection"
    ],
    specs: {
      capacity: "10 Liters",
      filtrationRate: "15 L/hr",
      powerConsumption: "45 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-7",
    name: "Normal Model 7",
    subtitle: "Pro Copper Shield Infusion RO",
    category: "Normal",
    price: 10999,
    originalPrice: 16299,
    rating: 4.8,
    reviewsCount: 135,
    stock: 17,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "Blue",
    image: "assets/images/normal-series.jpg",
    features: [
      "99.9% Pure Active Copper Cartridge",
      "Immunity-Boosting Ayurvedic Water Flow",
      "Child-Safe Anti-Drip Dispensing Faucet",
      "Handles TDS up to 2500 ppm"
    ],
    specs: {
      capacity: "10 Liters",
      filtrationRate: "15 L/hr",
      powerConsumption: "42 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-8",
    name: "Normal Model 8",
    subtitle: "Under-Sink Hydro Pure Concealed System",
    category: "Normal",
    price: 12499,
    originalPrice: 18499,
    rating: 4.9,
    reviewsCount: 92,
    stock: 14,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "Black",
    image: "assets/images/undersink-model.jpg",
    features: [
      "Clutter-Free Under-the-Counter Mount",
      "Solid Brass Chrome Goose-Neck Faucet",
      "Hydrostatic Pressurized Tank Included",
      "Zero Kitchen Counter Noise"
    ],
    specs: {
      capacity: "12 Liters Pressurized",
      filtrationRate: "20 L/hr",
      powerConsumption: "50 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-9",
    name: "Normal Model 9",
    subtitle: "Heavy Duty Borewell Special RO+UV",
    category: "Normal",
    price: 13999,
    originalPrice: 20999,
    rating: 4.8,
    reviewsCount: 153,
    stock: 16,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "White",
    image: "assets/images/normal-series.jpg",
    features: [
      "Ultra Heavy Duty 125 GPD RO Membrane",
      "Tested for Borewell TDS up to 3500 ppm",
      "Iron & Heavy Metal Remover Pre-Filter",
      "Reinforced High-Pressure Booster Pump"
    ],
    specs: {
      capacity: "11 Liters",
      filtrationRate: "18 L/hr",
      powerConsumption: "55 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "norm-10",
    name: "Normal Model 10",
    subtitle: "Classic Family Pure 10L All-Rounder",
    category: "Normal",
    price: 8499,
    originalPrice: 12999,
    rating: 4.7,
    reviewsCount: 110,
    stock: 30,
    inStock: true,
    colors: [
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Blue", code: "#1e40af", border: "#1e3a8a" },
      { name: "Black", code: "#18181b", border: "#27272a" }
    ],
    defaultColor: "Blue",
    image: "assets/images/normal-series.jpg",
    features: [
      "All-in-one RO+UV+UF+TDS Balancer",
      "Detachable Easy-Clean Water Storage Tank",
      "Low Maintenance Replacement Filters",
      "Dual Installation: Wall & Countertop"
    ],
    specs: {
      capacity: "10 Liters",
      filtrationRate: "14 L/hr",
      powerConsumption: "40 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  }
];

const INITIAL_RAINDROP_PRODUCTS = [
  {
    id: "rain-1",
    name: "Raindrop Model 1",
    subtitle: "Raindrop Aero Crystal RO+UV",
    category: "Raindrop",
    price: 13999,
    originalPrice: 19999,
    rating: 4.9,
    reviewsCount: 220,
    stock: 22,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "Sky Blue",
    image: "assets/images/raindrop-series.jpg",
    features: [
      "Iconic Sculptural Raindrop Curved Silhouette",
      "Translucent Blue Tank with LED Backlighting",
      "Micro-Droplet Multi-Stage Purification",
      "Touch-Free Optical Sensor Dispense"
    ],
    specs: {
      capacity: "10 Liters",
      filtrationRate: "16 L/hr",
      powerConsumption: "42 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-2",
    name: "Raindrop Model 2",
    subtitle: "Raindrop Wave Smart IoT Touch",
    category: "Raindrop",
    price: 15499,
    originalPrice: 22499,
    rating: 5.0,
    reviewsCount: 178,
    stock: 18,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "Transparent-Blue",
    image: "assets/images/raindrop-series.jpg",
    features: [
      "OLED Touch Screen with Live TDS & Liters Purified",
      "Smart Auto-Flushing RO Membrane Care",
      "Mineral Rich Alkaline Wave Technology",
      "Quiet Whisper-Drive Motor Operation"
    ],
    specs: {
      capacity: "10 Liters",
      filtrationRate: "18 L/hr",
      powerConsumption: "45 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-3",
    name: "Raindrop Model 3",
    subtitle: "Raindrop Pearl Hydro Pure",
    category: "Raindrop",
    price: 14799,
    originalPrice: 21000,
    rating: 4.8,
    reviewsCount: 140,
    stock: 16,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "White",
    image: "assets/images/raindrop-series.jpg",
    features: [
      "Pearl Lustre Anti-Scratch Exterior",
      "Pure Copper & Zinc Mineral Fortifier",
      "Zero Spill Rapid Fill Chrome Tap",
      "Handles up to 2500 TDS with sweet taste"
    ],
    specs: {
      capacity: "9.5 Liters",
      filtrationRate: "15 L/hr",
      powerConsumption: "40 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-4",
    name: "Raindrop Model 4",
    subtitle: "Raindrop Cascade Ambient Glow",
    category: "Raindrop",
    price: 16999,
    originalPrice: 24999,
    rating: 4.9,
    reviewsCount: 195,
    stock: 14,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "Transparent-Blue",
    image: "assets/images/raindrop-series.jpg",
    features: [
      "Illuminated Ambient Night-Light Cascade",
      "Dual UV LED In-Tank Bacteriostatic Protection",
      "Triple Micron Sediment & Granular Carbon",
      "Food-Grade Polycarbonate Window"
    ],
    specs: {
      capacity: "11 Liters",
      filtrationRate: "18 L/hr",
      powerConsumption: "46 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-5",
    name: "Raindrop Model 5",
    subtitle: "Raindrop Mist Ultra-Slim Elegance",
    category: "Raindrop",
    price: 13999,
    originalPrice: 20500,
    rating: 4.7,
    reviewsCount: 96,
    stock: 20,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "Sky Blue",
    image: "assets/images/raindrop-series.jpg",
    features: [
      "Ultra-Compact Minimalist Depth (only 17cm)",
      "High Rejection Dow Filmtec RO Membrane",
      "Quick-Turn Filter Cartridge Replacement",
      "Energy Star Efficient Power Saving"
    ],
    specs: {
      capacity: "8.5 Liters",
      filtrationRate: "15 L/hr",
      powerConsumption: "38 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-6",
    name: "Raindrop Model 6",
    subtitle: "Raindrop Glacier Pure Glaze RO+UV",
    category: "Raindrop",
    price: 17499,
    originalPrice: 25999,
    rating: 4.9,
    reviewsCount: 167,
    stock: 15,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "Transparent-Blue",
    image: "assets/images/raindrop-series.jpg",
    features: [
      "Glacial Mineral Retention Architecture",
      "Real-Time Water Purity Optical Ring",
      "100 GPD Turbo Filtration Engine",
      "Double Safety Protection against high voltage"
    ],
    specs: {
      capacity: "11 Liters",
      filtrationRate: "19 L/hr",
      powerConsumption: "48 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-7",
    name: "Raindrop Model 7",
    subtitle: "Raindrop Deluxe Dual Dispense",
    category: "Raindrop",
    price: 18999,
    originalPrice: 27499,
    rating: 4.9,
    reviewsCount: 132,
    stock: 11,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "White",
    image: "assets/images/black-model.jpg",
    features: [
      "Dual Spout: Instant Purified Ambient & Cold Dispense",
      "Instant Electronic Compressor Cooling",
      "Micro-Controlled Portion Dispensing (200ml / 500ml / Cont.)",
      "Copper Fortified Water Line"
    ],
    specs: {
      capacity: "10 Liters (8L Ambient + 2L Chilled)",
      filtrationRate: "20 L/hr",
      powerConsumption: "90 Watts (Cooling active)",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-8",
    name: "Raindrop Model 8",
    subtitle: "Raindrop AquaShield Prime RO+UF",
    category: "Raindrop",
    price: 15999,
    originalPrice: 23000,
    rating: 4.8,
    reviewsCount: 148,
    stock: 25,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "Sky Blue",
    image: "assets/images/raindrop-series.jpg",
    features: [
      "Auto Self-Cleaning Membrane Flush Mode",
      "Extended 24-Month Membrane Lifespan",
      "Alkaline pH 8.5 Mineral Balancing",
      "Zero Chemical Residue Technology"
    ],
    specs: {
      capacity: "10.5 Liters",
      filtrationRate: "16 L/hr",
      powerConsumption: "44 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-9",
    name: "Raindrop Model 9",
    subtitle: "Raindrop Oceanic Luxury Glass Touch",
    category: "Raindrop",
    price: 21499,
    originalPrice: 30999,
    rating: 5.0,
    reviewsCount: 204,
    stock: 10,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "Transparent-Blue",
    image: "assets/images/raindrop-series.jpg",
    features: [
      "Sleek Tempered Glass Front Facade",
      "Interactive Digital Water Balance Dashboard",
      "Multi-Ion Micro-Alkaline Infusion Chamber",
      "Child Lock Safety Dispense Switch"
    ],
    specs: {
      capacity: "12 Liters",
      filtrationRate: "22 L/hr",
      powerConsumption: "52 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  },
  {
    id: "rain-10",
    name: "Raindrop Model 10",
    subtitle: "Raindrop Zenith AI Flagship Balancer",
    category: "Raindrop",
    price: 23999,
    originalPrice: 34999,
    rating: 5.0,
    reviewsCount: 310,
    stock: 8,
    inStock: true,
    colors: [
      { name: "Sky Blue", code: "#38bdf8", border: "#0284c7" },
      { name: "White", code: "#ffffff", border: "#cbd5e1" },
      { name: "Transparent-Blue", code: "#0ea5e9", border: "#0369a1", isTransparent: true }
    ],
    defaultColor: "Sky Blue",
    image: "assets/images/hero-banner.jpg",
    features: [
      "AI Purity Optimizer: Dynamic TDS Auto-Adjustment",
      "Copper + Alkaline + Hydrogen-Rich Ionizer",
      "Dual Tank Storage with In-Tank UV-C LED",
      "10-Stage Military Grade Filtration Array"
    ],
    specs: {
      capacity: "14 Liters",
      filtrationRate: "25 L/hr",
      powerConsumption: "55 Watts",
      warranty: "1 Year Comprehensive Onsite"
    }
  }
];

const INITIAL_ORDERS = [
  {
    id: "ORD-94821",
    customerName: "Ramesh Sharma",
    phone: "9876512340",
    address: "Plot 42, Green Glen Layout, Bellandur, Bangalore - 560103",
    items: [
      {
        id: "rain-1",
        name: "Raindrop Model 1",
        color: "Transparent-Blue",
        price: 13999,
        quantity: 1
      }
    ],
    total: 13999,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Dispatched",
    date: "2026-09-25T11:30:00.000Z",
    notes: "Customer requested installation on Saturday morning."
  },
  {
    id: "ORD-94820",
    customerName: "Pooja Venkatesh",
    phone: "9840123987",
    address: "Flat 302, Sai Residency, Velachery Main Road, Chennai - 600042",
    items: [
      {
        id: "norm-1",
        name: "Normal Model 1",
        color: "White",
        price: 8999,
        quantity: 1
      }
    ],
    total: 8999,
    paymentMethod: "COD",
    paymentStatus: "Pending",
    orderStatus: "Confirmed",
    date: "2026-09-25T16:45:00.000Z",
    notes: "Call before dispatch."
  },
  {
    id: "ORD-94819",
    customerName: "Dr. Arvind Menon",
    phone: "9820543210",
    address: "Bungalow 7, Palm Beach Road, Vashi, Navi Mumbai - 400703",
    items: [
      {
        id: "rain-10",
        name: "Raindrop Model 10",
        color: "Sky Blue",
        price: 23999,
        quantity: 1
      }
    ],
    total: 23999,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-09-24T10:15:00.000Z",
    notes: "Delivered & installed with free TDS audit."
  }
];

const INITIAL_BOOKINGS = [
  {
    id: "BK-8291",
    customerName: "Sunita Iyer",
    phone: "9884511223",
    address: "24/B, 3rd Seaward Road, Valmiki Nagar, Thiruvanmiyur, Chennai - 600041",
    serviceId: "srv-1",
    serviceName: "Installation Service",
    preferredDate: "2026-09-27",
    timeSlot: "Morning (9:00 AM - 12:00 PM)",
    purifierBrand: "Aqua Raindrop Model 1",
    notes: "New home move-in, need drill mount.",
    status: "Assigned",
    technician: "Karthik (Tech ID: TK-04)",
    date: "2026-09-25T14:10:00.000Z"
  },
  {
    id: "BK-8290",
    customerName: "Vikram Malhotra",
    phone: "9910023456",
    address: "Tower 4, Apt 1102, DLF Phase 5, Gurgaon - 122002",
    serviceId: "srv-3",
    serviceName: "Filter / Membrane Replacement",
    preferredDate: "2026-09-26",
    timeSlot: "Afternoon (1:00 PM - 4:00 PM)",
    purifierBrand: "Aqua Normal Model 4",
    notes: "TDS increased to 280 ppm, needs fresh RO membrane.",
    status: "New",
    technician: "Unassigned",
    date: "2026-09-26T09:30:00.000Z"
  },
  {
    id: "BK-8289",
    customerName: "Ananya Reddy",
    phone: "9701145678",
    address: "Plot 88, Road No. 12, Banjara Hills, Hyderabad - 500034",
    serviceId: "srv-2",
    serviceName: "Annual Maintenance Contract (AMC)",
    preferredDate: "2026-09-28",
    timeSlot: "Evening (4:00 PM - 7:00 PM)",
    purifierBrand: "Aqua Raindrop Zenith",
    notes: "Purchased 1-Year Comprehensive AMC plan.",
    status: "Completed",
    technician: "Rajesh (Tech ID: TK-02)",
    date: "2026-09-24T18:00:00.000Z"
  }
];

const INITIAL_SPOTLIGHT_PRODUCTS = [
  {
    id: "spot-1",
    name: "Aqua Raindrop Aero Smart",
    category: "Raindrop",
    price: 13999,
    originalPrice: 19999,
    rating: 4.9,
    reviewsCount: 220,
    description: "Curved crystal silhouette with glowing translucent blue tank, digital TDS readout, and touch-free dispense sensor.",
    image: "assets/images/raindrop-series.jpg",
    types: [
      {
        id: "wall",
        name: "Wall-mounted",
        desc: "Sleek wall-hung installation with hidden brackets, freeing up complete counter area."
      },
      {
        id: "counter",
        name: "Countertop",
        desc: "Sturdy non-slip base for placement directly next to kitchen sink with zero drilling."
      },
      {
        id: "under",
        name: "Under-sink",
        desc: "Concealed installation with an elegant chrome goose-neck counter tap."
      }
    ],
    selectedType: "wall",
    colors: [
      { name: "Sky Blue", code: "#38bdf8" },
      { name: "Pearl White", code: "#ffffff" },
      { name: "Transparent-Blue", code: "#0ea5e9" }
    ],
    selectedColor: "Sky Blue",
    gallery: [
      { id: "g1", label: "Front View", image: "assets/images/raindrop-series.jpg", icon: "💧" },
      { id: "g2", label: "Installed View", image: "assets/images/hero-banner.jpg", icon: "🏠" },
      { id: "g3", label: "Angle View", image: "assets/images/raindrop-series.jpg", icon: "📐" },
      { id: "g4", label: "Internal Filters", image: "assets/images/service-banner.jpg", icon: "🔬" }
    ]
  },
  {
    id: "spot-2",
    name: "Aqua Normal Pro Copper RO",
    category: "Normal",
    price: 8999,
    originalPrice: 13999,
    rating: 4.8,
    reviewsCount: 180,
    description: "Multi-stage RO + UV filtration infused with 99.9% active copper ions. Heavy-duty ABS food-grade cabinet.",
    image: "assets/images/normal-series.jpg",
    types: [
      {
        id: "wall",
        name: "Wall-mounted",
        desc: "Heavy-duty wall mounting with secure anchor bolts and easy water inlet connection."
      },
      {
        id: "counter",
        name: "Countertop",
        desc: "Compact footprint fits under standard kitchen overhead cabinets."
      }
    ],
    selectedType: "wall",
    colors: [
      { name: "Pure White", code: "#ffffff" },
      { name: "Deep Navy Blue", code: "#1e40af" },
      { name: "Midnight Black", code: "#18181b" }
    ],
    selectedColor: "Pure White",
    gallery: [
      { id: "g1", label: "Front View", image: "assets/images/normal-series.jpg", icon: "💧" },
      { id: "g2", label: "Installed View", image: "assets/images/hero-banner.jpg", icon: "🏠" },
      { id: "g3", label: "Copper Chamber", image: "assets/images/service-banner.jpg", icon: "🪙" }
    ]
  },
  {
    id: "spot-3",
    name: "Aqua Hydro Concealed Under-Sink",
    category: "Normal",
    price: 12499,
    originalPrice: 18499,
    rating: 4.9,
    reviewsCount: 95,
    description: "Zero kitchen counter clutter. High-flow pressurized tank and 304-grade stainless steel designer goose-neck faucet.",
    image: "assets/images/undersink-model.jpg",
    types: [
      {
        id: "under",
        name: "Under-sink",
        desc: "Placed completely inside the kitchen cabinet with pressurized bladder tank and dedicated faucet."
      },
      {
        id: "wall",
        name: "Utility Wall Mount",
        desc: "Can be mounted in a utility balcony with direct line routed to the kitchen."
      }
    ],
    selectedType: "under",
    colors: [
      { name: "Matte Black", code: "#18181b" },
      { name: "Brushed Chrome", code: "#94a3b8" },
      { name: "Polar White", code: "#ffffff" }
    ],
    selectedColor: "Matte Black",
    gallery: [
      { id: "g1", label: "Installed View", image: "assets/images/undersink-model.jpg", icon: "🏠" },
      { id: "g2", label: "Faucet View", image: "assets/images/hero-banner.jpg", icon: "🚰" },
      { id: "g3", label: "Filter System", image: "assets/images/service-banner.jpg", icon: "🔬" }
    ]
  },
  {
    id: "spot-4",
    name: "Aqua Ambient Deluxe Dispenser",
    category: "Raindrop",
    price: 18999,
    originalPrice: 27499,
    rating: 5.0,
    reviewsCount: 140,
    description: "Instant dual temperature ambient and cold purified water dispense with digital touch controls and ambient night illumination.",
    image: "assets/images/black-model.jpg",
    types: [
      {
        id: "counter",
        name: "Countertop",
        desc: "Luxury countertop appliance with rapid cooling compressor and touch dispensing."
      },
      {
        id: "table",
        name: "Island Tabletop",
        desc: "Designed as an architectural centerpiece for open-concept kitchens and dining bars."
      }
    ],
    selectedType: "counter",
    colors: [
      { name: "Matte Black & Rose Gold", code: "#18181b" },
      { name: "Glacier White", code: "#ffffff" },
      { name: "Sky Blue", code: "#38bdf8" }
    ],
    selectedColor: "Matte Black & Rose Gold",
    gallery: [
      { id: "g1", label: "Countertop View", image: "assets/images/black-model.jpg", icon: "✨" },
      { id: "g2", label: "Touch Panel", image: "assets/images/hero-banner.jpg", icon: "📱" },
      { id: "g3", label: "Dispense Stream", image: "assets/images/service-banner.jpg", icon: "💧" }
    ]
  }
];

