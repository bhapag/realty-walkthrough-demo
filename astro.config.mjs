import { defineConfig } from 'astro/config';

export default defineConfig({
  trailingSlash: 'always',
  // Root sends visitors to the English (default) site.
  redirects: { '/': '/en/' },
});
