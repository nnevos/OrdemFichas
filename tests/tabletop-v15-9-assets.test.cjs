const test=require('node:test'); const assert=require('node:assert/strict'); const fs=require('node:fs'); const path=require('node:path');
const root=path.join(__dirname,'..');
test('tabletop css is linked explicitly before runtime',()=>{const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/css\/tabletop\.css\?v=15\.(24|25|26|35|38|39|42)/);});
test('late tabletop css import was removed',()=>{const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');assert.doesNotMatch(css,/@import\s+url\(['\"]\.\/css\/tabletop\.css/);});
test('tabletop scripts are cache-busted',()=>{const html=fs.readFileSync(path.join(root,'index.html'),'utf8'); const refs=[...html.matchAll(/src="(js\/tabletop\/[^\"]+)"/g)].map(x=>x[1]); assert.ok(refs.length>8); for(const ref of refs) assert.match(ref,/\?v=15\.(24|25|26|35|38|39|42)$/);});
test('visible build marker exists',()=>{const r=fs.readFileSync(path.join(root,'js/tabletop/renderer.js'),'utf8');assert.match(r,/MESA \+ COMBATE · V15\.(24|25|26|35|38|39|42)/);});
