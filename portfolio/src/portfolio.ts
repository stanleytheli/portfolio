import './portfolio.css';

export function initPortfolio(): void {
  const content = document.createElement('div');
  content.className = 'portfolio';
  content.innerHTML = `
    <div class="portfolio-inner">
      <header class="portfolio-header">
        <h1 class="portfolio-name">Stanley Li</h1>
        <p class="portfolio-blurb">My little corner of the galaxy.</p>
        <div class="scroll-hint">Scroll<span class="scroll-arrow">↓</span></div>
      </header>


      <div class="portfolio-sections">
        <section class="portfolio-section">
          <h2 class="section-title"><span class="section-toggle">−</span> About</h2>
          <div class="section-content">
            <p class="about-text">
              Hello! My name's Stanley Li. I'm currently studying Math and CS at UC Berkeley.
              I'm passionate about creating things and doing science. 
              <br><br>
              Currently at: Microsoft
              <br>
              Career Interests: AI/ML, Engineering/Research, Tech, Quant, Startups
              <br>
              Regular Interests: <a href="https://www.substack.com/@stanleytheli">Creative Writing</a>, Climbing, Traveling, Math, Science, Philosophy, History
              <br><br>
              Fun fact: I type <a href="https://www.monkeytype.com/profile/istanmonkeytype">200+ words per minute</a>!
              <br><br>
              Links:
              <br>
              <a href="https://github.com/stanleytheli" class="link">GitHub</a>
              <br>
              <a href="https://linkedin.com/in/stanleytheli" class="link">LinkedIn</a>
            </p>
          </div>
        </section>

        <section class="portfolio-section">
          <h2 class="section-title"><span class="section-toggle">−</span> Experience</h2>
          <div class="section-content">
            <article class="experience">
              <div class="experience-header">
                <img src="https://pngimg.com/uploads/microsoft/microsoft_PNG13.png" alt="Company logo" class="experience-logo">
                <div class="experience-info">
                  <h3 class="experience-title">Microsoft</h3>
                  <span class="experience-company">Software Engineer Intern</span>
                  <span class="experience-date">Incoming May 2026 - August 2026</span>
                </div>
              </div>
              <p class="experience-desc">Will be on the CoreAI team!</p>
            </article>

            <article class="experience">
              <div class="experience-header">
                <img src="https://media.licdn.com/dms/image/v2/C4E0BAQFfc1NOEp9DgA/company-logo_100_100/company-logo_100_100/0/1640018826417/lawrence_berkeley_national_laboratory_logo?e=1775088000&v=beta&t=gqHaPeE1K2NiIAf5EaGB1EC_Tnl_4bTgaVlVj6K0e9s" alt="Company logo" class="experience-logo">
                <div class="experience-info">
                  <h3 class="experience-title">Lawrence Berkeley Lab</h3>
                  <span class="experience-company">Undergraduate Researcher</span>
                  <span class="experience-date">August 2025 - January 2026</span>
                </div>
              </div>
              <p class="experience-desc">Astrophysics research with the Perlmutter group, studying dark matter & energy. 
              Using JAX to optimize GIGALens model across multiple GPU nodes.</p>
            </article>

            <article class="experience">
              <div class="experience-header">
                <img src="https://media.licdn.com/dms/image/v2/D4E0BAQE4FugdFAOu1w/company-logo_100_100/B4EZv8IRHXJAAQ-/0/1769461584805/thumo_logo?e=1775088000&v=beta&t=11RqXKff10kfBdRCahDFVvTqlfxzMyCHfftPajcIiNg" alt="Company logo" class="experience-logo">
                <div class="experience-info">
                  <h3 class="experience-title">Swoop</h3>
                  <span class="experience-company">Software Engineer Intern</span>
                  <span class="experience-date">December 2025 - January 2026</span>
                </div>
              </div>
              <p class="experience-desc">Food delivery startup with significant VC backing.
              Worked on backend engineering - building apps/services using Django/DRF, Elasticsearch, Docker, Redis caching.</p>
            </article>

            <article class="experience">
              <div class="experience-header">
                <img src="https://sp26.datastructur.es/assets/images/bee.webp" alt="Company logo" class="experience-logo">
                <div class="experience-info">
                  <h3 class="experience-title">Tutor</h3>
                  <span class="experience-company">UC Berkeley</span>
                  <span class="experience-date">May 2025 - August 2025</span>
                </div>
              </div>
              <p class="experience-desc">Course staff for CS 61B (Data Structures & Algorithms) here at UC Berkeley.</p>
            </article>
          </div>
        </section>

        <section class="portfolio-section">
          <h2 class="section-title"><span class="section-toggle">−</span> Projects</h2>
          <div class="section-content">
            <article class="project">
              <h3 class="project-title"><a href="https://github.com/stanleytheli/cubegpt">CubeGPT</a></h3>
              <p class="project-desc">
              Trained transformers to solve Rubik's Cubes. Designed custom tokenization, eval metrics, training pipeline. 
              Performed dozens of experiments. Also built the 3D renderer from scratch!
              <br><br>
              Achieved average solve length of 21.1 (Optimal solvers achieve about 17.7). 
              </p>
              <img src="https://raw.githubusercontent.com/stanleytheli/cubegpt/refs/heads/main/images/scrambledArrowSolved.png" alt="Gravity Simulation screenshot" class="project-image">
            </article>

            <article class="project">
              <h3 class="project-title"><a href="https://github.com/stanleytheli/mini-ml">Mini-ML</a></h3>
              <p class="project-desc">An ML library built from scratch using only NumPy and SciPy. Derived and implemented custom backprop engine. Implemented DNNs/CNNs/ResNets architectures, RMSProp/Adam optimizers, saving/loading models, multiple loss functions, multiple data augmentation methods, etc. 
              <br><br>
              Image shown: Trained an autoencoder to reduce MNIST digits. These are images interpolated in encoded space, and they mix coherently instead of just blending pixels!</p>
              <img src="https://media.discordapp.net/attachments/501162564013522956/1412318902301622393/image.png?ex=69b847b9&is=69b6f639&hm=234d8c6379b5be71d00e6072203dbb583cab19e13e392ad71f038d0ab1f02a4e&=&format=webp&quality=lossless&width=1035&height=591" alt="Project Two screenshot" class="project-image">
            </article>

          </div>
        </section>


        <section class="portfolio-section">
          <h2 class="section-title"><span class="section-toggle">−</span>Links</h2>
          <div class="section-content">
            <div class="links">
              <a href="https://github.com/stanleytheli" class="link">GitHub</a>
              <a href="https://linkedin.com/in/stanleytheli" class="link">LinkedIn</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
  document.body.appendChild(content);

  // Scroll reveal functionality
  const sections = content.querySelector('.portfolio-sections') as HTMLElement;
  const scrollHint = content.querySelector('.scroll-hint') as HTMLElement;
  const isMobile = () => window.innerWidth <= 640;

  // Desktop: portfolio element scrolls
  content.addEventListener('scroll', () => {
    if (isMobile()) return;
    const scrollTop = content.scrollTop;
    
    if (scrollTop > 20) {
      sections.classList.add('revealed');
      scrollHint.classList.add('hidden');
    } else {
      sections.classList.remove('revealed');
      scrollHint.classList.remove('hidden');
    }
  });

  // Mobile: window scrolls
  window.addEventListener('scroll', () => {
    if (!isMobile()) return;
    
    if (window.scrollY > 20) {
      sections.classList.add('revealed');
      scrollHint.classList.add('hidden');
    } else {
      sections.classList.remove('revealed');
      scrollHint.classList.remove('hidden');
    }
  });

  // Section collapse/expand functionality
  const sectionTitles = content.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    title.addEventListener('click', () => {
      const section = title.closest('.portfolio-section');
      const toggle = title.querySelector('.section-toggle');
      if (section && toggle) {
        section.classList.toggle('collapsed');
        toggle.textContent = section.classList.contains('collapsed') ? '+' : '−';
      }
    });
  });

  // Mobile: fade canvas on scroll
  const canvas = document.getElementById('simulation');

  if (canvas) {
    window.addEventListener('scroll', () => {
      if (isMobile()) {
        if (window.scrollY > 50) {
          canvas.classList.add('faded');
        } else {
          canvas.classList.remove('faded');
        }
      }
    });
  }
}
