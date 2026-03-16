import './style.css';
import { GravitySimulation, Vec3 } from './gravity';
import { SimulationRenderer } from './renderer';
import { randUniform, randNormal, randLognormal } from './utils';

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
      <input type="range" id="n-slider" min="5" max="100" value="35">
      <span class="slider-label">100</span>
    </div>
    <span class="slider-value" id="n-value">35</span>
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

// Create text content
const content = document.createElement('div');
content.className = 'content';
content.innerHTML = `
  <div class="content-inner">
    <header class="header">
      <h1 class="name">Stanley Li</h1>
      <p class="blurb">My little corner of the galaxy.</p>
    </header>

    <section class="section">
      <h2 class="section-title">Projects</h2>
      
      <article class="project">
        <h3 class="project-title">Gravity Simulation</h3>
        <p class="project-desc">An N-body gravitational simulation running in your browser. Real physics, not just animation.</p>
        <div class="project-tags">
          <span class="tag">TypeScript</span>
          <span class="tag">Canvas</span>
          <span class="tag">Physics</span>
        </div>
      </article>

      <article class="project">
        <h3 class="project-title">Project Two</h3>
        <p class="project-desc">A brief description of another interesting project you've worked on.</p>
        <div class="project-tags">
          <span class="tag">Python</span>
          <span class="tag">Machine Learning</span>
        </div>
      </article>

      <article class="project">
        <h3 class="project-title">Project Three</h3>
        <p class="project-desc">Yet another project showcasing different skills and technologies.</p>
        <div class="project-tags">
          <span class="tag">React</span>
          <span class="tag">Node.js</span>
        </div>
      </article>
    </section>

    <section class="section">
      <h2 class="section-title">About</h2>
      <p class="about-text">
        A few words about yourself, your interests, and what drives you to build things.
      </p>
    </section>

    <section class="section">
      <h2 class="section-title">Contact</h2>
      <div class="links">
        <a href="https://github.com" class="link">GitHub</a>
        <a href="https://linkedin.com" class="link">LinkedIn</a>
        <a href="mailto:email@example.com" class="link">Email</a>
      </div>
    </section>
  </div>
`;
document.body.appendChild(content);

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





function spawnBodies(n: number) {
  sim = new GravitySimulation();
  renderer.sim = sim;

  // Central massive body (star)
  const starMass = 2500
  sim.createBody(0, 0, 500, 0, 0, 0, starMass, false, 15);

  // Spawn orbiting bodies
  for (let i = 0; i < n; i++) {
    /*
    const distance = randUniform(80, 300);
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.6;

    const x = distance * Math.cos(theta) * Math.cos(phi);
    const y = distance * Math.sin(theta) * Math.cos(phi);
    const z = 500 + distance * Math.sin(phi);

    const orbitalSpeed = Math.sqrt((sim.G * 500) / distance) * randUniform(0.4, 1.2);

    const vx = -Math.sin(theta) * orbitalSpeed;
    const vy = Math.cos(theta) * orbitalSpeed;
    const vz = randUniform(-0.2, 0.2) * orbitalSpeed;

    const mass = randUniform(5, 30);
    */

    // Orbital plane unit vector.
    const orbital_plane = new Vec3(1, -1, -1).normalize();
    
    const r_hat = orbital_plane.randomPerpendicular();
    const r = randUniform(150, 400);

    const v_hat = orbital_plane.cross(r_hat);
    const v = Math.sqrt((sim.G * starMass) / r) * randNormal(1.00, 0.05)

    const xf = r * r_hat.x;
    const yf = r * r_hat.y;
    const zf = 500 + r * r_hat.z;

    const vxf = v * v_hat.x;
    const vyf = v * v_hat.y;
    const vzf = v * v_hat.z;

    // Add some noise to the position and velocity
    const x = xf + randNormal(0, 0.1 * r)
    const y = yf + randNormal(0, 0.1 * r)
    const z = zf + randNormal(0, 0.1 * r)
    const vx = vxf + randNormal(0, 0.1 * v)
    const vy = vyf + randNormal(0, 0.1 * v)
    const vz = vzf + randNormal(0, 0.1 * v)

    const mass = randLognormal(2.5, 0.7) 
    sim.createBody(x, y, z, vx, vy, vz, mass);
    
  }
}

// Initial spawn
spawnBodies(35);

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
