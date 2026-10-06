# GreenTrack – Community Afforestation Project 🌱

> **“Growing a Greener Tomorrow, One Plant at a Time.”**  
> An initiative by 4 college students to plant, protect, and track the growth of trees through modern technology.

---

## 🌿 Overview

**GreenTrack** is a college community afforestation initiative that pairs physical environmental restoration with digital telemetry. Twenty native saplings have been planted across college sectors, shielded by 100% protective enclosures, and equipped with individual weatherproof QR codes. 

When visitors or campus members scan a plant’s QR code with any smartphone camera, they can view:
- Plant identity (Common name, Botanical name, Category, Tag ID)
- Date planted and age
- Initial height vs. Current height (+ growth in cm and percentage)
- Health status and vitality metrics (Soil moisture, Sunlight exposure)
- Fencing integrity and physical protection log
- Interactive growth timeline and milestone progression
- Weatherproof digital QR badge

---

## 🚀 Live Preview & Running Locally

The project is lightweight, zero-dependency, and built using semantic HTML5, modern CSS3 (Custom Properties & Flex/Grid), and vanilla JavaScript (ES6+).

### Quick Start
To run the project with Python’s built-in server:
```bash
python -m http.server 8000
```
Then open your browser at:
```
http://localhost:8000
```
Or open [`index.html`](file:///c:/Users/ganes/Downloads/afforestation/index.html) directly in any modern browser.

---

## 📁 Architecture & File Structure

```text
afforestation/
│
├── index.html                 # Semantic, responsive homepage
├── css/
│   └── styles.css             # Eco-tech design system & tokens
├── js/
│   ├── plants-data.js         # Reusable, database-ready plant dataset
│   └── app.js                 # Interactive controls, SVG charts, modals, and QR scanner
├── assets/
│   ├── images/
│   │   └── hero-tree.jpg      # High-res sapling with telemetry HUD overlay
│   └── icons/
└── README.md                  # Project documentation & schema guide
```

---

## 💾 Reusable Data Model (`js/plants-data.js`)

The dataset is structured so that the exact same schema can seamlessly power:
1. **Homepage Showcase & Filtering**
2. **Plant Directory / Archive Page**
3. **Dedicated QR Profile Pages (`/plant/{id}`)**
4. **Growth Analytics & History Charts**
5. **Admin / Field Inspection Dashboard**

### Sample Plant Record
```javascript
{
  id: "GT-01",
  name: "Neem",
  botanicalName: "Azadirachta indica",
  category: "Medicinal & Shade",
  plantedDate: "2026-08-12",
  displayDate: "12 Aug 2026",
  initialHeight: 25,       // cm
  currentHeight: 48,       // cm
  growth: 23,              // cm
  growthRate: "+4.1 cm/mo",
  healthStatus: "Healthy",
  healthClass: "healthy",
  healthScore: 97,         // %
  soilMoisture: "78%",
  sunlightExposure: "Full Sun (6-8 hrs)",
  zone: "Zone A – South Quad Green Belt",
  coordinates: "12.9716° N, 77.5946° E",
  fencingType: "Treated Timber & Wire Mesh Guard",
  fencingStatus: "Secure & Stable",
  plantedBy: "Cohort Group 1 (Arjun & Priya)",
  lastInspected: "2026-10-04",
  image: "...",
  description: "...",
  growthHistory: [
    { date: "12 Aug 2026", height: 25, note: "Initial planting and protective fence installation." },
    { date: "26 Aug 2026", height: 29, note: "Root system stabilized." },
    { date: "09 Sep 2026", height: 35, note: "Organic vermicompost applied." },
    { date: "23 Sep 2026", height: 42, note: "Rapid apical growth after monsoon." },
    { date: "04 Oct 2026", height: 48, note: "Fencing checked and tied." }
  ]
}
```

---

## ✨ Features Included

1. **Modern Eco-Tech Interface**:
   - Palette: Deep Forest Green (`#0D3B23`), Primary Emerald (`#15803D`), Natural Off-white (`#F8FAF8`), and warm earthy accents.
   - Clean startup aesthetics with crisp typography, subtle frosted-glass headers, and rounded cards.

2. **Hero Section**:
   - Hero badge: `🌱 Community Afforestation Initiative`
   - Real sapling image with protective fencing and telemetry HUD nodes.
   - Direct CTA buttons: `[ Explore Our Plants ]` and `[ Scan a Plant QR ]`.

3. **Animated Viewport Counters**:
   - 20 Plants Planted • 20 QR Tagged • 18 Healthy Plants • 4 Student Members.

4. **Our Mission 4 Steps**:
   - `🌱 Plant` → `🛡️ Protect` → `📱 Track` → `📈 Grow`.

5. **Meet Our Plants Showcase**:
   - Status filters (`All`, `🟢 Healthy`, `🟡 Under Care`, `🚀 Rapid Growth`).
   - Real-time search by plant name or tag ID (`GT-01` to `GT-12`).
   - Detailed telemetry cards with quick-access `View Plant` and `QR` actions.

6. **Interactive Growth Section (“Every Centimeter Tells a Story”)**:
   - Dropdown selector to switch between different campus saplings.
   - Dynamic comparison banner showing Initial Height (25 cm) → Current Height (48 cm) with +23 cm (+92%) delta.
   - Interactive SVG line chart with gradient fill and milestone timeline pills.

7. **QR Technology Section & Built-in Optical Scanner**:
   - Weatherproof plaque preview with vector QR code.
   - Dual-mode QR Scanner modal: Camera viewfinder simulation + Instant demo quick-test chips for desktop testing.

8. **Project Impact & 4-Student Team Showcase**:
   - Impact metrics for saplings, fencing coverage, telemetry records, and student involvement.
   - Team cards for Arjun Verma, Priya Sundaram, Rohan Kulkarni, and Kavya Menon.
