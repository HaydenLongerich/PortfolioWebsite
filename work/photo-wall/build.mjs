import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
const out=fileURLToPath(new URL('../apex/dist/',import.meta.url));
await build({entryPoints:[root+'src/PhotoWall.jsx'],bundle:true,minify:true,format:'esm',target:'es2020',outfile:out+'photo-wall.js',define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'});
execFileSync(process.execPath,[root+'node_modules/@tailwindcss/cli/dist/index.mjs','-i',root+'src/photo-wall.css','-o',out+'photo-wall.css','--minify'],{cwd:root,stdio:'inherit'});
