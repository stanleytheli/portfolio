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

        <section class="portfolio-section">
          <h2 class="section-title">About</h2>
          <p class="about-text">
            A few words about yourself, your interests, and what drives you to build things.
          </p>
        </section>

        <section class="portfolio-section">
          <h2 class="section-title">Contact</h2>
          <div class="links">
            <a href="https://github.com" class="link">GitHub</a>
            <a href="https://linkedin.com" class="link">LinkedIn</a>
            <a href="mailto:email@example.com" class="link">Email</a>
          </div>
        </section>
      </div>
    </div>
  `;
  document.body.appendChild(content);

  // Scroll reveal functionality
  const sections = content.querySelector('.portfolio-sections') as HTMLElement;
  const scrollHint = content.querySelector('.scroll-hint') as HTMLElement;

  content.addEventListener('scroll', () => {
    const scrollTop = content.scrollTop;
    
    // Reveal sections when scrolled
    if (scrollTop > 20) {
      sections.classList.add('revealed');
      scrollHint.classList.add('hidden');
    } else {
      sections.classList.remove('revealed');
      scrollHint.classList.remove('hidden');
    }
  });
}
