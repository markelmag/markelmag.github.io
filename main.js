const data = {
  1: {
    tag: "Semiconductors",
    ticker: "NVDA",
    title: "Blackwell CoWoS Yield Analysis",
    body: "Our breakdown of TSMC's CoWoS-L capacity allocation suggests a 20% upside to consensus volume estimates. The yield issues reported in Q3 were largely due to a specific bonding tool alignment drift which has been rectified.",
    metrics: [
      { label: "Yield Rate", value: "99.4%" },
      { label: "Vol Upside", value: "+20%" }
    ]
  },
  2: {
    tag: "FinTech",
    ticker: "PYPL",
    title: "PYUSD Stablecoin Infrastructure Expansion",
    body: "PayPal's PYUSD stablecoin migration to Solana introduces sub-cent transaction costs ($0.0002 vs $2-5 on Ethereum), enabling micropayment viability. Cross-border settlement latency drops from T+2 to real-time, directly threatening correspondent banking revenue pools. Integration with Xoom positions PYPL to capture 15-20% of the $200B remittance TAM at 10x lower take rates than traditional rails.",
    metrics: [
      { label: "TX Cost Reduction", value: "-99.9%" },
      { label: "Remittance TAM", value: "$30B" }
    ]
  },
  3: {
    tag: "Software",
    ticker: "CRM",
    title: "Agentforce Autonomous Sales Agent Rollout",
    body: "Salesforce's Agentforce represents a fundamental shift from copilot to autonomous agent architecture. Early enterprise pilots show 40% reduction in SDR headcount requirements while maintaining conversion rates. The agent handles end-to-end lead qualification, meeting scheduling, and CRM hygiene—tasks consuming 60-70% of sales ops bandwidth. Pricing at $2/conversation vs $75/user/month for Sales Cloud creates a new margin structure with 85%+ gross margins and eliminates seat-based revenue ceiling.",
    metrics: [
      { label: "SDR Efficiency Gain", value: "+40%" },
      { label: "Gross Margin", value: "85%" }
    ]
  }
};

function loadSignal(id) {
  const signal = data[id];
  const container = document.getElementById('plat-content');

  // UI Active State
  document.querySelectorAll('.signal-item').forEach(el => el.classList.remove('active'));
  // Simple index check for demo
  const items = document.querySelectorAll('.signal-item');
  if (items[id - 1]) items[id - 1].classList.add('active');

  // Breadcrumb Update
  document.querySelector('.toolbar-crumbs').innerText = `Market Intelligence / ${signal.tag} / ${signal.ticker}`;

  // Render Clean Content
  container.innerHTML = `
        <div class="report-header">
            <span class="report-tag">${signal.tag}</span>
            <h1 class="report-title">${signal.title}</h1>
        </div>
        
        <div class="report-section">
            <span class="sec-label">INVESTMENT THESIS</span>
            <p class="sec-body">${signal.body}</p>
        </div>

        <div class="report-section">
            <span class="sec-label">KEY METRICS</span>
            <div class="metric-row">
                ${signal.metrics.map(m => `
                    <div class="metric-box">
                        <span class="metric-val">${m.value}</span>
                        <span class="metric-name">${m.label}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
  renderMobilePlatform();
  renderMobileProcess();
  window.addEventListener('resize', () => {
    renderMobilePlatform();
    renderMobileProcess();
  });
});

loadSignal(1);

// Form handling with Formspree
const FORMSPREE_URL = 'https://formspree.io/f/mojavory';

document.querySelectorAll('form').forEach(f => {
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = f.querySelector('button');
    const input = f.querySelector('input[type="email"]');
    const email = input.value;

    btn.disabled = true;
    btn.innerText = "Saving...";

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          source: f.id || 'hero'
        })
      });

      if (response.ok) {
        btn.innerText = "✓ Joined!";
        input.value = '';
        setTimeout(() => {
          btn.innerText = "Join the Waitlist";
          btn.disabled = false;
        }, 3000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      console.error('Waitlist error:', err);
      btn.innerText = "Error - Try Again";
      btn.disabled = false;
    }
  });
});

// Research Process Interactions
const steps = document.querySelectorAll('.proc-node');
const popups = document.querySelectorAll('.proc-popup');

if (steps.length && popups.length) {
  steps.forEach((step, index) => {
    // Note: index matches the popup order (0 -> popup-1)
    step.addEventListener('mouseenter', () => {
      popups.forEach(p => p.classList.remove('active')); // Reset others
      if (popups[index]) popups[index].classList.add('active');
    });

    step.addEventListener('mouseleave', () => {
      if (popups[index]) popups[index].classList.remove('active');
    });
  });
}

// Experimental: Interactive Data Grid
class GridAnimation {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.cells = [];
    this.cellSize = 60; // Wide squares as requested
    this.mouse = { x: -1000, y: -1000 };

    this.init();
    this.animate();
    this.addListeners();
  }

  init() {
    this.resize();
    this.createGrid();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.createGrid();
  }

  createGrid() {
    this.cells = [];
    const cols = Math.ceil(this.width / this.cellSize);
    const rows = Math.ceil(this.height / this.cellSize);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        this.cells.push({
          x: x * this.cellSize,
          y: y * this.cellSize,
          baseX: x * this.cellSize,
          baseY: y * this.cellSize,
          size: 1, // Scale factor
          opacity: 0
        });
      }
    }
  }

  addListeners() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.cells.forEach(cell => {
      // Distance from mouse
      const dx = this.mouse.x - (cell.baseX + this.cellSize / 2);
      const dy = this.mouse.y - (cell.baseY + this.cellSize / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 400; // Large radius for "wide" feel

      // Calculate effect based on proximity
      let targetSize = 1;
      let targetOpacity = 0.05; // Base visibility

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist; // 0 to 1
        // 3D-like effect: squares get smaller/further away or larger/closer?
        // Let's go with "scale up" to look like they are coming forward
        targetSize = 1 + (force * 0.8);
        targetOpacity = 0.05 + (force * 0.2);

        // Optional: Move slightly away from cursor for "repel" 3D feel
        // cell.x = cell.baseX - (dx * force * 0.1);
        // cell.y = cell.baseY - (dy * force * 0.1);
      } else {
        // Return to base
        // cell.x = cell.baseX;
        // cell.y = cell.baseY;
      }

      // Smooth lerp
      cell.size += (targetSize - cell.size) * 0.1;
      cell.opacity += (targetOpacity - cell.opacity) * 0.1;

      // Draw
      this.ctx.fillStyle = `rgba(15, 23, 42, ${cell.opacity})`; // Dark navy/slate color
      this.ctx.save();

      // Center scale
      this.ctx.translate(cell.baseX + this.cellSize / 2, cell.baseY + this.cellSize / 2);
      this.ctx.scale(cell.size, cell.size);

      // Draw square
      this.ctx.fillRect(-this.cellSize / 2 + 2, -this.cellSize / 2 + 2, this.cellSize - 4, this.cellSize - 4);

      this.ctx.restore();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Start animation
new GridAnimation();

// Mobile Platform Cards Renderer
function renderMobilePlatform() {
  const container = document.getElementById('plat-content');
  if (!container) return;

  if (window.innerWidth <= 768) {
    // Render all cards for horizontal scroll
    const cards = Object.keys(data).map(id => {
      const signal = data[id];
      return `
        <div class="mobile-platform-card">
          <div class="mobile-card-ticker">${signal.ticker}</div>
          <div class="mobile-card-tag">${signal.tag}</div>
          <div class="mobile-card-title">${signal.title}</div>
          <div class="mobile-card-body">${signal.body.substring(0, 150)}...</div>
          <div class="mobile-card-metrics">
            ${signal.metrics.map(m => `
              <div class="mobile-metric">
                <span class="mobile-metric-val">${m.value}</span>
                <span class="mobile-metric-label">${m.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `<div class="mobile-platform-cards">${cards}</div>`;
  } else {
    // On desktop, we just load the first signal (or keep current state)
    // For simplicity, we default to signal 1
    loadSignal(1);
  }
}

// Mobile Process Steps Renderer
function renderMobileProcess() {
  const processSection = document.querySelector('.research-process .container');
  if (!processSection || window.innerWidth > 768) return;

  const steps = [
    {
      num: '01',
      title: 'Expert Selection',
      text: 'We source operational experts with P&L responsibility, not market observers. Current or former leaders who directly impact business outcomes in their field.'
    },
    {
      num: '02',
      title: 'Insight Formation',
      text: 'Experts write detailed notes on specific topics within their domain. Each note follows a consistent structure to ensure clarity and investment relevance.'
    },
    {
      num: '03',
      title: 'Financial Translation',
      text: 'Our equity analysts collaborate with experts to translate insights into financial impact. Technical developments are connected to their effects on company fundamentals.'
    },
    {
      num: '04',
      title: 'Investment Context',
      text: 'Independent experts verify technical accuracy and economic soundness. Published on Sapexa platform with timely delivery to institutional investors.'
    }
  ];

  const mobileSteps = steps.map(step => `
    <div class="mobile-process-card">
      <div class="mobile-process-header">
        <span class="mobile-process-num">${step.num}</span>
        <h3 class="mobile-process-title">${step.title}</h3>
      </div>
      <p class="mobile-process-desc">${step.text}</p>
    </div>
  `).join('');

  // Check if mobile steps already exist
  if (!document.querySelector('.mobile-process-steps')) {
    const visualDiv = processSection.querySelector('.process-visual');
    if (visualDiv) {
      visualDiv.insertAdjacentHTML('afterend', `<div class="mobile-process-steps">${mobileSteps}</div>`);
    }
  }
}