import './style.css';
import { GravitySimulation } from './gravity';
import { SimulationRenderer } from './renderer';

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
      <input type="range" id="n-slider" min="5" max="100" value="20">
      <span class="slider-label">100</span>
    </div>
    <span class="slider-value" id="n-value">20</span>
  </div>
`;
document.body.appendChild(controls);

const z0Slider = document.getElementById('z0-slider') as HTMLInputElement;
const nSlider = document.getElementById('n-slider') as HTMLInputElement;
const z0Value = document.getElementById('z0-value') as HTMLSpanElement;
const nValue = document.getElementById('n-value') as HTMLSpanElement;

// Sizing
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Initialize simulation
let sim = new GravitySimulation();
const renderer = new SimulationRenderer(canvas, sim, 400);

// Spawn bodies helper
function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function spawnBodies(n: number) {
  sim = new GravitySimulation();
  renderer.sim = sim;

  // Central massive body (star)
  sim.createBody(0, 0, 500, 0, 0, 0, 500, false, 15);

  // Spawn orbiting bodies
  for (let i = 0; i < n; i++) {
    const distance = randomRange(80, 300);
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.6;

    const x = distance * Math.cos(theta) * Math.cos(phi);
    const y = distance * Math.sin(theta) * Math.cos(phi);
    const z = 500 + distance * Math.sin(phi);

    const orbitalSpeed = Math.sqrt((sim.G * 500) / distance) * 0.8;

    const vx = -Math.sin(theta) * orbitalSpeed;
    const vy = Math.cos(theta) * orbitalSpeed;
    const vz = randomRange(-0.2, 0.2) * orbitalSpeed;

    const mass = randomRange(5, 30);
    sim.createBody(x, y, z, vx, vy, vz, mass);
  }
}

// Initial spawn
spawnBodies(20);

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
  spawnBodies(n);
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
