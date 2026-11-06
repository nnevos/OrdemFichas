const fs=require('fs'),assert=require('assert');
const r=fs.readFileSync('js/tabletop/renderer.js','utf8'),m=fs.readFileSync('js/tabletop/mobile-ui.js','utf8'),c=fs.readFileSync('css/tabletop.css','utf8'),i=fs.readFileSync('index.html','utf8');
assert.match(r,/tabletop-mobile-nav/);assert.match(r,/V15\.(24|25|26|35|38|39|42)/);
assert.match(m,/setTabletopMobilePanel/);assert.match(c,/max-width:850px/);assert.match(c,/quick-action-columns/);
assert.match(i,/mobile-ui\.js\?v=15\.(24|25|26|35|38|39|42)/);
console.log('v15.23 mobile freeze ok');