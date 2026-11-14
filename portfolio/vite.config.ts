import { defineConfig, type Connect, type Plugin } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

// In production Vercel serves blog.html at /blog (`cleanUrls` in vercel.json).
// Mirror that in `vite dev` and `vite preview`, which would otherwise fall
// back to index.html for /blog.
function cleanUrls(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url && /^\/blog\/?($|\?)/.test(req.url)) {
      req.url = req.url.replace(/^\/blog\/?/, '/blog.html');
    }
    next();
  };
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig({
  plugins: [cleanUrls()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        blog: resolve(root, 'blog.html'),
      },
    },
  },
});
