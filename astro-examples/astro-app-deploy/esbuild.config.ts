import { build } from 'esbuild'

build({
  entryPoints: ['src/test.ts'], // Your function entry
  outfile: 'dist/test.js', // Output in dist/
  platform: 'node',
  target: 'node18',
  // Ensures dependencies are included
  bundle: true,
  // Exclude Vercel runtime dependencies. Vercel builds the function from this output
  external: ['@vercel/functions'],
  // Helps with debugging
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  format: 'esm',
}).catch(() => process.exit(1))
