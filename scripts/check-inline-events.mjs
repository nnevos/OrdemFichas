import fs from 'node:fs';
import path from 'node:path';

const roots=['index.html','js'];
const files=[];
function walk(p){const stat=fs.statSync(p);if(stat.isDirectory())for(const x of fs.readdirSync(p))walk(path.join(p,x));else if(/\.(?:html|js)$/.test(p))files.push(p);}
roots.forEach(walk);
const bad=[];
const re=/\son(?:click|change|input|submit|blur|focus|keydown|keyup)\s*=/gi;
for(const file of files){const text=fs.readFileSync(file,'utf8');if(re.test(text))bad.push(file);}
if(bad.length){console.error('Handlers inline encontrados:',bad.join(', '));process.exit(1);}console.log(`OK: ${files.length} arquivos sem handlers inline.`);
