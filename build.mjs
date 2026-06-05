import { build } from 'esbuild';

await build({
  entryPoints: ['frontend/src/social-shell.tsx'],
  bundle: true,
  outfile: 'static/js/social-shell.js',
  format: 'iife',
  platform: 'browser',
  jsx: 'automatic',
  target: ['es2018'],
  minify: true,
});
