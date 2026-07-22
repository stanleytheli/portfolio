import './blog.css';
import 'katex/dist/katex.min.css';
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

/**
 * A blog post parsed from a Markdown file in ./posts.
 *
 * To add a writing: drop a `.md` file into `src/blog/posts/` with a
 * frontmatter block at the top:
 *
 *   ---
 *   title: My Story
 *   date: 2026-07-21
 *   group: Fiction
 *   summary: A one-line teaser shown on the index.
 *   ---
 *
 *   Markdown body goes here...
 *
 * The file is picked up automatically at build time — no registration needed.
 */
interface Post {
  slug: string;
  title: string;
  date: string;
  group: string;
  summary: string;
  body: string;
}

// The order groups appear in on the index. Unknown groups are appended after.
const GROUP_ORDER = ['AI Research', 'Fiction', 'Random'];

// Eagerly import every markdown file as raw text at build time.
const rawPosts = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Eagerly import every image under ./posts so Vite fingerprints/bundles it and
// hands back the final URL. Lets posts reference co-located images by a path
// relative to the posts/ folder, e.g. ![](images/diagram.png).
const postImages = import.meta.glob(
  './posts/**/*.{png,jpg,jpeg,gif,webp,svg,avif}',
  { import: 'default', eager: true }
) as Record<string, string>;

/**
 * Resolve an image `src` written in a post to a usable URL.
 * - Absolute URLs, root-relative (`/foo.png` from public/), and data URIs pass
 *   through untouched.
 * - Anything else is treated as relative to the posts/ folder and looked up in
 *   the bundled-image map.
 */
function resolveImageSrc(src: string): string {
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) {
    return src;
  }
  const normalized = src.replace(/^\.\//, '').replace(/^\/+/, '');
  const key = `./posts/${normalized}`;
  return postImages[key] ?? src;
}

function slugFromPath(path: string): string {
  return path.replace(/^.*\/posts\//, '').replace(/\.md$/, '');
}

const posts: Post[] = Object.entries(rawPosts)
  .map(([path, raw]) => {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    const meta: Record<string, string> = {};
    let body = raw;
    if (match) {
      body = match[2] ?? '';
      for (const line of match[1].split(/\r?\n/)) {
        const i = line.indexOf(':');
        if (i === -1) continue;
        const key = line.slice(0, i).trim();
        const value = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
        if (key) meta[key] = value;
      }
    }
    const slug = slugFromPath(path);
    return {
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      group: meta.group || 'Random',
      summary: meta.summary || '',
      body,
    };
  })
  // Newest first.
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

// LaTeX math: `$...$` renders inline, `$$...$$` renders as a display block.
marked.use(markedKatex({ throwOnError: false }));

// Rewrite relative image sources to their bundled URLs during rendering.
marked.use({
  renderer: {
    image({ href, title, text }) {
      const src = resolveImageSrc(href ?? '');
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(src)}" alt="${escapeHtml(text ?? '')}"${titleAttr} loading="lazy">`;
    },
  },
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const root = document.getElementById('blog') as HTMLElement;

function renderIndex(): void {
  const groups = new Map<string, Post[]>();
  for (const post of posts) {
    if (!groups.has(post.group)) groups.set(post.group, []);
    groups.get(post.group)!.push(post);
  }

  const sortedGroupNames = [...groups.keys()].sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a);
    const bi = GROUP_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const groupsHtml = sortedGroupNames
    .map((name) => {
      const items = groups
        .get(name)!
        .map(
          (p) => `
        <li class="post-item">
          <a class="post-link" href="#${encodeURIComponent(p.slug)}">
            <span class="post-title">${escapeHtml(p.title)}</span>
            ${p.date ? `<span class="post-date">${escapeHtml(formatDate(p.date))}</span>` : ''}
          </a>
          ${p.summary ? `<p class="post-summary">${escapeHtml(p.summary)}</p>` : ''}
        </li>`
        )
        .join('');
      return `
      <section class="group" data-group="${escapeHtml(name)}">
        <h2 class="group-title">${escapeHtml(name)}</h2>
        <ul class="post-list">${items}</ul>
      </section>`;
    })
    .join('');

  // Group selector: "All" plus one chip per group.
  const navHtml = sortedGroupNames.length
    ? `
      <nav class="group-nav">
        <button class="group-chip is-active" data-filter="__all__">All</button>
        ${sortedGroupNames
          .map(
            (name) =>
              `<button class="group-chip" data-filter="${escapeHtml(name)}">${escapeHtml(name)}</button>`
          )
          .join('')}
      </nav>`
    : '';

  root.innerHTML = `
    <div class="blog-inner">
      <header class="blog-header">
        <h1 class="blog-name">Stanley's Blog</h1>
        <p class="blog-tagline">and stuff</p>
        <a class="home-link" href="/">← Back home</a>
      </header>
      ${navHtml}
      <main class="blog-groups">
        ${posts.length ? groupsHtml : '<p class="empty">No writings yet.</p>'}
      </main>
    </div>
  `;
  window.scrollTo(0, 0);

  // Wire up the group selector: filter which sections are shown.
  const chips = root.querySelectorAll<HTMLButtonElement>('.group-chip');
  const sections = root.querySelectorAll<HTMLElement>('.group');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter!;
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      sections.forEach((section) => {
        const show = filter === '__all__' || section.dataset.group === filter;
        section.style.display = show ? '' : 'none';
      });
    });
  });
}

function renderPost(slug: string): void {
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    renderIndex();
    return;
  }

  // Wrap tables so wide ones scroll horizontally instead of overflowing.
  const html = (marked.parse(post.body, { async: false }) as string)
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, '</table></div>');
  document.title = `${post.title} — Stanley Li`;

  root.innerHTML = `
    <div class="blog-inner">
      <nav class="post-nav">
        <a class="home-link" href="#">← All writings</a>
      </nav>
      <article class="post">
        <header class="post-header">
          <span class="post-group-tag">${escapeHtml(post.group)}</span>
          <h1 class="post-heading">${escapeHtml(post.title)}</h1>
          ${post.date ? `<time class="post-meta-date">${escapeHtml(formatDate(post.date))}</time>` : ''}
        </header>
        <div class="post-content">${html}</div>
      </article>
    </div>
  `;
  window.scrollTo(0, 0);
}

function route(): void {
  const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  if (hash) {
    renderPost(hash);
  } else {
    document.title = 'Blog — Stanley Li';
    renderIndex();
  }
}

window.addEventListener('hashchange', route);
route();
