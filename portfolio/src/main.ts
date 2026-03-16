import './style.css';
import { GravitySimulation } from './gravity';
import { SimulationRenderer } from './renderer';
import { initPortfolio } from './portfolio';
import { Arcball } from './math';

// Create fullscreen canvas
const canvas = document.createElement('canvas');
canvas.id = 'simulation';
document.body.appendChild(canvas);

// Create controls UI
const controls = document.createElement('div');
controls.className = 'controls';
controls.innerHTML = `
  <div class="slider-group">
    <span class="slider-title">FOV</span>
    <div class="slider-row">
      <span class="slider-label">100</span>
      <input type="range" id="z0-slider" min="100" max="1000" value="400">
      <span class="slider-label">1000</span>
    </div>
    <span class="slider-value" id="z0-value">400</span>
  </div>
  <div class="slider-group">
    <span class="slider-title">N</span>
    <div class="slider-row">
      <span class="slider-label">5</span>
      <input type="range" id="n-slider" min="5" max="200" value="75">
      <span class="slider-label">200</span>
    </div>
    <span class="slider-value" id="n-value">75</span>
  </div>
`;
document.body.appendChild(controls);

// Create toggle button for controls
controls.className = 'controls hidden';
const toggleBtn = document.createElement('button');
toggleBtn.className = 'controls-toggle';
toggleBtn.textContent = '⚙';
toggleBtn.addEventListener('click', () => {
  controls.classList.toggle('hidden');
});
document.body.appendChild(toggleBtn);

// Create toggle button for simulation visibility
const simToggleBtn = document.createElement('button');
simToggleBtn.className = 'sim-toggle';
simToggleBtn.textContent = '←';
simToggleBtn.addEventListener('click', () => {
  const portfolio = document.querySelector('.portfolio');
  const isHidden = canvas.classList.toggle('hidden');
  controls.classList.add('hidden');
  
  if (isHidden) {
    simToggleBtn.textContent = '→';
    portfolio?.classList.add('centered');
    toggleBtn.style.display = 'none';
  } else {
    simToggleBtn.textContent = '←';
    portfolio?.classList.remove('centered');
    toggleBtn.style.display = '';
  }
});
document.body.appendChild(simToggleBtn);

// Initialize portfolio
initPortfolio();

const z0Slider = document.getElementById('z0-slider') as HTMLInputElement;
const nSlider = document.getElementById('n-slider') as HTMLInputElement;
const z0Value = document.getElementById('z0-value') as HTMLSpanElement;
const nValue = document.getElementById('n-value') as HTMLSpanElement;

// Initialize simulation
const sim = new GravitySimulation();
const renderer = new SimulationRenderer(canvas, sim, 400);

// Initialize arcball for camera control
const arcball = new Arcball(window.innerWidth, window.innerHeight);

// Sizing
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const isMobile = window.innerWidth <= 640;
  
  // Arcball dimensions and center should match where the star is rendered
  const arcballWidth = isMobile ? window.innerWidth : window.innerWidth * 0.55;
  const centerX = isMobile ? canvas.width / 2 : canvas.width / 3;
  const centerY = isMobile ? canvas.height / 4 : canvas.height / 2;
  arcball.setSize(arcballWidth, canvas.height, centerX, centerY);
}

// Mouse event handlers for arcball camera control
canvas.addEventListener('mousedown', (e) => {
  // Only start drag if clicking in the gravity area (left 55% on desktop)
  const isMobile = window.innerWidth <= 640;
  const gravityAreaWidth = isMobile ? window.innerWidth : window.innerWidth * 0.55;
  
  if (e.clientX <= gravityAreaWidth) {
    arcball.startDrag(e.clientX, e.clientY);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (arcball.isDragging()) {
    arcball.drag(e.clientX, e.clientY);
    renderer.cameraRotation = arcball.rotation;
  }
});

canvas.addEventListener('mouseup', () => {
  arcball.endDrag();
});

canvas.addEventListener('mouseleave', () => {
  arcball.endDrag();
});

resize();
window.addEventListener('resize', resize);


// Initial spawn and set camera center
sim.reset(75);
renderer.cameraCenter = sim.getStarPosition();

// Update FOV helper
function setFOV(value: number) {
  const clamped = Math.max(100, Math.min(1000, value));
  renderer.z0 = clamped;
  z0Slider.value = String(clamped);
  z0Value.textContent = String(Math.round(clamped));
}

// Slider event listeners
z0Slider.addEventListener('input', () => {
  const val = parseInt(z0Slider.value, 10);
  renderer.z0 = val;
  z0Value.textContent = String(val);
});

nSlider.addEventListener('input', () => {
  const n = parseInt(nSlider.value, 10);
  nValue.textContent = String(n);
  sim.reset(n);
});

// Mouse wheel zoom for FOV
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -15 : 15; // Scroll down = zoom out (lower FOV)
  setFOV(renderer.z0 + delta);
}, { passive: false });

// Physics timestep
const PHYSICS_DT = 0.3;
const STEPS_PER_FRAME = 3;

// Main loop
function loop() {
  for (let i = 0; i < STEPS_PER_FRAME; i++) {
    sim.computeAccelerations();
    sim.step(PHYSICS_DT);
  }

  renderer.render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
