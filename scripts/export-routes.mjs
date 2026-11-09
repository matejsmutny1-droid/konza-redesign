import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const pages=JSON.parse(await readFile('app/content/pages.json','utf8'));
const routes=['studium','uchadzaci','koncerty','skola','studenti','kontakt',...pages.map(p=>'informacie/'+p.key)];
const html=await readFile('dist/index.html','utf8');
for(const route of routes){const dir=path.join('dist',route);await mkdir(dir,{recursive:true});await writeFile(path.join(dir,'index.html'),html);}
await writeFile('dist/404.html',html);await writeFile('dist/.nojekyll','');
console.log(`Exported ${routes.length+1} pages for static hosting.`);
