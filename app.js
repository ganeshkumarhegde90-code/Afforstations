/**
 * GreenTrack – Community Afforestation Project
 * Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimatedCounters();
  initPlantShowcase();
  initGrowthVisualization();
  initQRScanner();
  initPlantModal();
  initScrollAnimations();
});

/* ==========================================================================
   1. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.site-nav');
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const allNavAnchors = document.querySelectorAll('.nav-links a');

  // Sticky shadow effect on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', !isExpanded);
      toggleBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open', !isExpanded);
    });

    // Close mobile menu on link click
    allNavAnchors.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. ANIMATED STATISTICS COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateCounts = () => {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounts();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('statistics');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   3. PLANT SHOWCASE, FILTERING & SEARCH
   ========================================================================== */
let activeFilter = 'all';
let searchQuery = '';

function initPlantShowcase() {
  const container = document.getElementById('plants-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('plant-search-input');
  const resultCount = document.getElementById('plant-results-count');

  if (!container) return;

  const renderPlants = () => {
    let filtered = GREEN_TRACK_PLANTS.filter(plant => {
      // Filter logic
      const matchesFilter = 
        activeFilter === 'all' ||
        (activeFilter === 'healthy' && (plant.healthClass === 'healthy' || plant.healthClass === 'flourishing')) ||
        (activeFilter === 'care' && plant.healthClass === 'care') ||
        (activeFilter === 'fast' && plant.growth >= 23);

      // Search logic
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        plant.name.toLowerCase().includes(query) ||
        plant.botanicalName.toLowerCase().includes(query) ||
        plant.id.toLowerCase().includes(query) ||
        plant.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });

    if (resultCount) {
      resultCount.textContent = `Showing ${filtered.length} of ${GREEN_TRACK_PLANTS.length} tagged plants`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-plants-state">
          <div class="empty-icon">🌱</div>
          <h3>No plants found</h3>
          <p>Try searching for a different plant name (e.g. "Neem", "Peepal") or clearing the active filter.</p>
          <button class="btn btn-secondary btn-sm" onclick="resetPlantFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(plant => `
      <article class="plant-card" data-plant-id="${plant.id}" tabindex="0">
        <div class="plant-card-media">
          <img src="${plant.image}" alt="${plant.name} sapling" loading="lazy" class="plant-img" onerror="this.src='assets/images/hero-tree.jpg'" />
          <span class="plant-id-badge">${plant.id}</span>
          <span class="health-pill ${plant.healthClass}">
            <span class="health-dot"></span>
            ${plant.healthStatus}
          </span>
        </div>
        
        <div class="plant-card-content">
          <div class="plant-card-header">
            <h3 class="plant-name">${plant.name}</h3>
            <span class="botanical-name">${plant.botanicalName}</span>
          </div>

          <div class="plant-meta-grid">
            <div class="meta-item">
              <span class="meta-label">Planted</span>
              <span class="meta-value">${plant.displayDate}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Current Height</span>
              <span class="meta-value highlight-green">${plant.currentHeight} cm</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Total Growth</span>
              <span class="meta-value growth-badge">+${plant.growth} cm</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Fence Status</span>
              <span class="meta-value"><span class="shield-dot">🛡️</span> Intact</span>
            </div>
          </div>

          <div class="plant-card-footer">
            <button class="btn btn-card-action" onclick="openPlantDetail('${plant.id}')">
              <span>View Plant</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button class="btn-qr-mini" title="Show QR Code" onclick="openPlantDetail('${plant.id}', 'qr'); event.stopPropagation();">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
                <path d="M10 7h1"></path>
                <path d="M7 10v1"></path>
                <path d="M17 10v1"></path>
                <path d="M10 17h1"></path>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');
  };

  // Filter click handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      renderPlants();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPlants();
    });
  }

  // Initial render
  renderPlants();
}

// Global reset helper for empty state
window.resetPlantFilters = function() {
  activeFilter = 'all';
  searchQuery = '';
  const searchInput = document.getElementById('plant-search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === 'all') btn.classList.add('active');
    else btn.classList.remove('active');
  });
  initPlantShowcase();
};

/* ==========================================================================
   4. INTERACTIVE GROWTH VISUALIZATION SECTION
   ========================================================================== */
function initGrowthVisualization() {
  const selector = document.getElementById('growth-plant-select');
  const initialHeightEl = document.getElementById('growth-initial-height');
  const currentHeightEl = document.getElementById('growth-current-height');
  const deltaGrowthEl = document.getElementById('growth-delta');
  const percentageEl = document.getElementById('growth-percentage');
  const chartSvgContainer = document.getElementById('growth-chart-svg');
  const timelineMilestones = document.getElementById('growth-milestones');

  if (!selector) return;

  // Populate select options
  selector.innerHTML = GREEN_TRACK_PLANTS.map((plant, index) => `
    <option value="${plant.id}" ${index === 0 ? 'selected' : ''}>
      ${plant.id} - ${plant.name} (${plant.botanicalName})
    </option>
  `).join('');

  const updateGrowthDisplay = (plantId) => {
    const plant = GREEN_TRACK_PLANTS.find(p => p.id === plantId) || GREEN_TRACK_PLANTS[0];
    
    // Update metric numbers
    if (initialHeightEl) initialHeightEl.textContent = `${plant.initialHeight} cm`;
    if (currentHeightEl) currentHeightEl.textContent = `${plant.currentHeight} cm`;
    if (deltaGrowthEl) deltaGrowthEl.textContent = `+${plant.growth} cm Growth`;
    
    const percentage = Math.round(((plant.currentHeight - plant.initialHeight) / plant.initialHeight) * 100);
    if (percentageEl) percentageEl.textContent = `+${percentage}% overall growth`;

    // Render Growth SVG Chart
    renderSvgGrowthChart(plant, chartSvgContainer);

    // Render Milestone Pills
    if (timelineMilestones && plant.growthHistory) {
      timelineMilestones.innerHTML = plant.growthHistory.map((h, i) => `
        <div class="milestone-chip ${i === plant.growthHistory.length - 1 ? 'latest' : ''}">
          <span class="milestone-date">${h.date}</span>
          <span class="milestone-val">${h.height} cm</span>
        </div>
      `).join('');
    }
  };

  selector.addEventListener('change', (e) => {
    updateGrowthDisplay(e.target.value);
  });

  // Initial load
  updateGrowthDisplay(GREEN_TRACK_PLANTS[0].id);
}

function renderSvgGrowthChart(plant, container) {
  if (!container) return;
  const history = plant.growthHistory || [
    { date: "Planting", height: plant.initialHeight },
    { date: "Current", height: plant.currentHeight }
  ];

  const width = 680;
  const height = 260;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 45;

  const minVal = Math.max(0, Math.min(...history.map(h => h.height)) - 10);
  const maxVal = Math.max(...history.map(h => h.height)) + 12;

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const getX = (idx) => padLeft + (idx / (history.length - 1)) * plotW;
  const getY = (val) => padTop + plotH - ((val - minVal) / (maxVal - minVal)) * plotH;

  // Build points
  const points = history.map((h, i) => ({
    x: getX(i),
    y: getY(h.height),
    date: h.date,
    height: h.height,
    note: h.note || ""
  }));

  // Path SVG
  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  // Area fill path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + plotH} L ${points[0].x} ${padTop + plotH} Z`;

  // Grid horizontal lines
  const gridSteps = 4;
  let gridLines = '';
  for (let i = 0; i <= gridSteps; i++) {
    const val = Math.round(minVal + (i / gridSteps) * (maxVal - minVal));
    const y = getY(val);
    gridLines += `
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="rgba(15, 67, 42, 0.08)" stroke-dasharray="4 4" stroke-width="1" />
      <text x="${padLeft - 10}" y="${y + 4}" fill="#4A6354" font-size="11" font-weight="500" text-anchor="end">${val}cm</text>
    `;
  }

  // Dots & Labels
  const dotsAndLabels = points.map((pt, i) => `
    <g class="chart-data-node" data-index="${i}">
      <!-- Vertical guide line on hover -->
      <line x1="${pt.x}" y1="${padTop}" x2="${pt.x}" y2="${padTop + plotH}" stroke="rgba(21, 128, 61, 0.15)" stroke-width="1" stroke-dasharray="3 3"/>
      
      <!-- Date label below axis -->
      <text x="${pt.x}" y="${height - 12}" fill="#4A6354" font-size="11" font-weight="500" text-anchor="middle">${pt.date.split(' ').slice(0, 2).join(' ')}</text>
      
      <!-- Height pill badge above dot -->
      <rect x="${pt.x - 22}" y="${pt.y - 28}" width="44" height="20" rx="10" fill="#0D3B23" />
      <text x="${pt.x}" y="${pt.y - 14}" fill="#FFFFFF" font-size="11" font-weight="600" text-anchor="middle">${pt.height}cm</text>

      <!-- Outer halo dot -->
      <circle cx="${pt.x}" cy="${pt.y}" r="6" fill="#15803D" fill-opacity="0.25" />
      <!-- Core dot -->
      <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#15803D" stroke="#FFFFFF" stroke-width="2" />
    </g>
  `).join('');

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" class="interactive-growth-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#15803D" stop-opacity="0.32"/>
          <stop offset="100%" stop-color="#15803D" stop-opacity="0.01"/>
        </linearGradient>
      </defs>
      
      <!-- Grid -->
      ${gridLines}

      <!-- Bottom Axis Base -->
      <line x1="${padLeft}" y1="${padTop + plotH}" x2="${width - padRight}" y2="${padTop + plotH}" stroke="rgba(15, 67, 42, 0.2)" stroke-width="1.5" />

      <!-- Gradient Area Fill -->
      <path d="${areaD}" fill="url(#chartGradient)" />

      <!-- Line Graph -->
      <path d="${pathD}" fill="none" stroke="#15803D" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Nodes -->
      ${dotsAndLabels}
    </svg>
  `;
}

/* ==========================================================================
   5. PLANT DETAIL MODAL WITH FULL TELEMETRY
   ========================================================================== */
let activeModalPlant = null;

function initPlantModal() {
  const modal = document.getElementById('plant-detail-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const backdrop = document.querySelector('.modal-backdrop');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    activeModalPlant = null;
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

window.openPlantDetail = function(plantId, initialTab = 'overview') {
  const plant = GREEN_TRACK_PLANTS.find(p => p.id === plantId);
  if (!plant) return;

  activeModalPlant = plant;
  const modal = document.getElementById('plant-detail-modal');
  const modalContent = document.getElementById('modal-body-dynamic');

  if (!modal || !modalContent) return;

  // Render modal structure
  modalContent.innerHTML = `
    <div class="modal-plant-hero">
      <div class="modal-hero-img-wrap">
        <img src="${plant.image}" alt="${plant.name}" class="modal-hero-img" onerror="this.src='assets/images/hero-tree.jpg'" />
        <div class="modal-badge-group">
          <span class="plant-id-badge large">${plant.id}</span>
          <span class="health-pill ${plant.healthClass} large">
            <span class="health-dot"></span>
            ${plant.healthStatus} (${plant.healthScore}%)
          </span>
        </div>
      </div>
      
      <div class="modal-hero-info">
        <span class="modal-category-tag">${plant.category}</span>
        <h2 class="modal-plant-title">${plant.name}</h2>
        <p class="modal-botanical-name">Botanical: <em>${plant.botanicalName}</em></p>
        <p class="modal-description">${plant.description}</p>
        
        <div class="modal-quick-stats">
          <div class="quick-stat-box">
            <span class="stat-lbl">Current Height</span>
            <span class="stat-val text-green">${plant.currentHeight} cm</span>
            <span class="stat-sub">Planted at ${plant.initialHeight} cm</span>
          </div>
          <div class="quick-stat-box">
            <span class="stat-lbl">Net Growth</span>
            <span class="stat-val text-emerald">+${plant.growth} cm</span>
            <span class="stat-sub">${plant.growthRate}</span>
          </div>
          <div class="quick-stat-box">
            <span class="stat-lbl">Planted Date</span>
            <span class="stat-val">${plant.displayDate}</span>
            <span class="stat-sub">Campus Cohort 2026</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="modal-tabs">
      <button class="modal-tab-btn ${initialTab === 'overview' ? 'active' : ''}" onclick="switchModalTab('overview')">Telemetry & Environment</button>
      <button class="modal-tab-btn ${initialTab === 'timeline' ? 'active' : ''}" onclick="switchModalTab('timeline')">Growth Timeline (${plant.growthHistory ? plant.growthHistory.length : 0})</button>
      <button class="modal-tab-btn ${initialTab === 'qr' ? 'active' : ''}" onclick="switchModalTab('qr')">QR Digital Badge</button>
    </div>

    <!-- Tab 1: Overview -->
    <div id="tab-overview" class="tab-pane ${initialTab === 'overview' ? 'active' : ''}">
      <div class="telemetry-grid">
        <div class="telemetry-card">
          <div class="t-icon">📍</div>
          <div class="t-details">
            <span class="t-title">Campus Zone & Sector</span>
            <strong class="t-val">${plant.zone}</strong>
            <span class="t-meta">GPS: ${plant.coordinates}</span>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="t-icon">🛡️</div>
          <div class="t-details">
            <span class="t-title">Protective Fencing Structure</span>
            <strong class="t-val">${plant.fencingType}</strong>
            <span class="t-meta">Fence Condition: <strong>${plant.fencingStatus}</strong></span>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="t-icon">💧</div>
          <div class="t-details">
            <span class="t-title">Soil Moisture & Moisture Sensor</span>
            <strong class="t-val">${plant.soilMoisture} (Optimal Range)</strong>
            <span class="t-meta">Root hydration verified weekly</span>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="t-icon">☀️</div>
          <div class="t-details">
            <span class="t-title">Sunlight & Exposure</span>
            <strong class="t-val">${plant.sunlightExposure}</strong>
            <span class="t-meta">Direct canopy photosynthesis</span>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="t-icon">👥</div>
          <div class="t-details">
            <span class="t-title">Student Planting Cohort</span>
            <strong class="t-val">${plant.plantedBy}</strong>
            <span class="t-meta">GreenTrack College Initiative</span>
          </div>
        </div>

        <div class="telemetry-card">
          <div class="t-icon">📋</div>
          <div class="t-details">
            <span class="t-title">Latest Physical Inspection</span>
            <strong class="t-val">${plant.lastInspected}</strong>
            <span class="t-meta">Verified stem rigidity & zero pests</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Timeline -->
    <div id="tab-timeline" class="tab-pane ${initialTab === 'timeline' ? 'active' : ''}">
      <div class="timeline-wrapper">
        ${(plant.growthHistory || []).map((step, idx) => `
          <div class="timeline-entry ${idx === plant.growthHistory.length - 1 ? 'latest' : ''}">
            <div class="timeline-marker">
              <span class="marker-dot"></span>
              <span class="marker-line"></span>
            </div>
            <div class="timeline-box">
              <div class="timeline-box-header">
                <span class="timeline-date">${step.date}</span>
                <span class="timeline-height-badge">${step.height} cm</span>
              </div>
              <p class="timeline-note">${step.note}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Tab 3: QR Badge -->
    <div id="tab-qr" class="tab-pane ${initialTab === 'qr' ? 'active' : ''}">
      <div class="qr-detail-wrapper">
        <div class="qr-card-physical">
          <div class="qr-card-header">
            <span class="qr-logo-tag">GREEN TRACK 🌱</span>
            <span class="qr-badge-num">${plant.id}</span>
          </div>
          <div class="qr-visual-box">
            ${generateSvgQr(plant.id)}
          </div>
          <div class="qr-card-footer">
            <p class="qr-card-name">${plant.name} • ${plant.botanicalName}</p>
            <p class="qr-scan-instr">Scan with phone camera to view live telemetry</p>
          </div>
        </div>

        <div class="qr-actions-box">
          <h4>Unique Digital Identity</h4>
          <p>Every plant on campus has this weatherproof QR plaque affixed to its protective fence. Scanning brings visitors straight to this live profile.</p>
          <div class="qr-actions-row">
            <button class="btn btn-primary btn-sm" onclick="copyPlantLink('${plant.id}')">
              <span>Copy Plant Link</span>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.print()">
              <span>Print QR Plate</span>
            </button>
          </div>
          <div class="qr-meta-link">
            <code>https://greentrack.college.edu/plant/${plant.id}</code>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.classList.add('modal-open');
};

window.switchModalTab = function(tabName) {
  document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

  const targetBtn = Array.from(document.querySelectorAll('.modal-tab-btn')).find(b => 
    b.getAttribute('onclick').includes(tabName)
  );
  if (targetBtn) targetBtn.classList.add('active');

  const targetPane = document.getElementById(`tab-${tabName}`);
  if (targetPane) targetPane.classList.add('active');
};

/* ==========================================================================
   6. INTERACTIVE QR SCANNER & LIVE SIMULATOR
   ========================================================================== */
function initQRScanner() {
  const scannerModal = document.getElementById('qr-scanner-modal');
  const openButtons = document.querySelectorAll('.trigger-qr-scanner');
  const closeButton = document.getElementById('scanner-close-btn');
  const scannerBackdrop = document.querySelector('.scanner-backdrop');
  const manualInput = document.getElementById('manual-plant-id-input');
  const manualSubmit = document.getElementById('manual-plant-id-submit');
  const quickTestChips = document.querySelectorAll('.quick-scan-chip');

  if (!scannerModal) return;

  const openScanner = () => {
    scannerModal.classList.add('open');
    document.body.classList.add('modal-open');
    // Start camera simulation / viewfinder animation
    startScannerLaser();
  };

  const closeScanner = () => {
    scannerModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    stopScannerLaser();
  };

  openButtons.forEach(btn => btn.addEventListener('click', openScanner));
  if (closeButton) closeButton.addEventListener('click', closeScanner);
  if (scannerBackdrop) scannerBackdrop.addEventListener('click', closeScanner);

  // Quick test chip clicks
  quickTestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const plantId = chip.getAttribute('data-id');
      triggerSimulatedScan(plantId);
    });
  });

  // Manual code entry
  if (manualSubmit && manualInput) {
    const handleManual = () => {
      const code = manualInput.value.trim().toUpperCase();
      if (!code) return;
      const found = GREEN_TRACK_PLANTS.find(p => p.id === code || p.id === `GT-${code.replace(/\D/g, '').padStart(2, '0')}`);
      if (found) {
        triggerSimulatedScan(found.id);
      } else {
        showToast(`Plant ID "${code}" not found. Try GT-01 to GT-12.`, 'warning');
      }
    };

    manualSubmit.addEventListener('click', handleManual);
    manualInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleManual();
    });
  }
}

let scannerLaserInterval = null;
function startScannerLaser() {
  const viewfinder = document.querySelector('.scanner-viewfinder');
  if (viewfinder) {
    viewfinder.classList.add('scanning');
  }
}

function stopScannerLaser() {
  const viewfinder = document.querySelector('.scanner-viewfinder');
  if (viewfinder) {
    viewfinder.classList.remove('scanning');
  }
}

function triggerSimulatedScan(plantId) {
  const scannerModal = document.getElementById('qr-scanner-modal');
  const viewfinder = document.querySelector('.scanner-viewfinder');
  
  if (viewfinder) {
    viewfinder.classList.add('scan-success');
  }

  showToast(`QR Code Scanned: Plant #${plantId}!`, 'success');

  setTimeout(() => {
    if (viewfinder) viewfinder.classList.remove('scan-success');
    if (scannerModal) scannerModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    
    // Open target plant's full profile modal
    openPlantDetail(plantId, 'overview');
  }, 500);
}

/* ==========================================================================
   7. QR CODE VECTOR GENERATOR (SVG)
   ========================================================================== */
function generateSvgQr(plantId) {
  // Deterministic aesthetic QR code matrix generator for plant badge
  return `
    <svg viewBox="0 0 160 160" width="160" height="160" class="qr-svg-matrix" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="160" fill="#FFFFFF" rx="10" />
      
      <!-- Top Left Finder Pattern -->
      <rect x="15" y="15" width="40" height="40" rx="6" fill="#0D3B23" />
      <rect x="23" y="23" width="24" height="24" rx="3" fill="#FFFFFF" />
      <rect x="29" y="29" width="12" height="12" rx="2" fill="#15803D" />

      <!-- Top Right Finder Pattern -->
      <rect x="105" y="15" width="40" height="40" rx="6" fill="#0D3B23" />
      <rect x="113" y="23" width="24" height="24" rx="3" fill="#FFFFFF" />
      <rect x="119" y="29" width="12" height="12" rx="2" fill="#15803D" />

      <!-- Bottom Left Finder Pattern -->
      <rect x="15" y="105" width="40" height="40" rx="6" fill="#0D3B23" />
      <rect x="23" y="113" width="24" height="24" rx="3" fill="#FFFFFF" />
      <rect x="29" y="119" width="12" height="12" rx="2" fill="#15803D" />

      <!-- QR Data Matrix Dots -->
      <g fill="#1F3D2B">
        <!-- Top row modules -->
        <rect x="65" y="18" width="6" height="6" rx="1.5" />
        <rect x="75" y="18" width="6" height="6" rx="1.5" />
        <rect x="85" y="18" width="6" height="6" rx="1.5" />
        <rect x="65" y="28" width="6" height="6" rx="1.5" />
        <rect x="85" y="28" width="6" height="6" rx="1.5" />
        <rect x="75" y="38" width="6" height="6" rx="1.5" />
        <rect x="85" y="48" width="6" height="6" rx="1.5" />

        <!-- Mid section data modules -->
        <rect x="18" y="65" width="6" height="6" rx="1.5" />
        <rect x="28" y="65" width="6" height="6" rx="1.5" />
        <rect x="38" y="65" width="6" height="6" rx="1.5" />
        <rect x="48" y="65" width="6" height="6" rx="1.5" />
        <rect x="58" y="65" width="6" height="6" rx="1.5" />
        <rect x="95" y="65" width="6" height="6" rx="1.5" />
        <rect x="105" y="65" width="6" height="6" rx="1.5" />
        <rect x="115" y="65" width="6" height="6" rx="1.5" />
        <rect x="135" y="65" width="6" height="6" rx="1.5" />

        <rect x="18" y="75" width="6" height="6" rx="1.5" />
        <rect x="38" y="75" width="6" height="6" rx="1.5" />
        <rect x="58" y="75" width="6" height="6" rx="1.5" />
        <rect x="95" y="75" width="6" height="6" rx="1.5" />
        <rect x="115" y="75" width="6" height="6" rx="1.5" />
        <rect x="125" y="75" width="6" height="6" rx="1.5" />

        <rect x="18" y="85" width="6" height="6" rx="1.5" />
        <rect x="28" y="85" width="6" height="6" rx="1.5" />
        <rect x="48" y="85" width="6" height="6" rx="1.5" />
        <rect x="95" y="85" width="6" height="6" rx="1.5" />
        <rect x="105" y="85" width="6" height="6" rx="1.5" />
        <rect x="135" y="85" width="6" height="6" rx="1.5" />

        <!-- Bottom right data modules -->
        <rect x="65" y="95" width="6" height="6" rx="1.5" />
        <rect x="75" y="95" width="6" height="6" rx="1.5" />
        <rect x="105" y="95" width="6" height="6" rx="1.5" />
        <rect x="115" y="95" width="6" height="6" rx="1.5" />
        <rect x="125" y="95" width="6" height="6" rx="1.5" />

        <rect x="65" y="105" width="6" height="6" rx="1.5" />
        <rect x="85" y="105" width="6" height="6" rx="1.5" />
        <rect x="105" y="105" width="6" height="6" rx="1.5" />
        <rect x="135" y="105" width="6" height="6" rx="1.5" />

        <rect x="65" y="115" width="6" height="6" rx="1.5" />
        <rect x="75" y="115" width="6" height="6" rx="1.5" />
        <rect x="85" y="115" width="6" height="6" rx="1.5" />
        <rect x="115" y="115" width="6" height="6" rx="1.5" />

        <rect x="75" y="125" width="6" height="6" rx="1.5" />
        <rect x="105" y="125" width="6" height="6" rx="1.5" />
        <rect x="125" y="125" width="6" height="6" rx="1.5" />
        <rect x="135" y="125" width="6" height="6" rx="1.5" />

        <rect x="65" y="135" width="6" height="6" rx="1.5" />
        <rect x="85" y="135" width="6" height="6" rx="1.5" />
        <rect x="115" y="135" width="6" height="6" rx="1.5" />
      </g>

      <!-- Center Logo / Seed Emblem -->
      <circle cx="80" cy="80" r="14" fill="#0D3B23" />
      <circle cx="80" cy="80" r="11" fill="#15803D" />
      <path d="M78 85 C 75 80, 77 74, 83 72 C 84 76, 83 82, 78 85 Z" fill="#FFFFFF" />
    </svg>
  `;
}

/* ==========================================================================
   8. TOAST NOTIFICATIONS & UTILITIES
   ========================================================================== */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
    <span class="toast-text">${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

window.copyPlantLink = function(plantId) {
  const url = `https://greentrack.college.edu/plant/${plantId}`;
  navigator.clipboard.writeText(url).then(() => {
    showToast(`Copied QR URL for ${plantId} to clipboard!`, 'success');
  }).catch(() => {
    showToast(`URL: ${url}`, 'info');
  });
};

/* ==========================================================================
   9. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
