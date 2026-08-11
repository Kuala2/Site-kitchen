import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';

const port=3600;
const origin=`http://127.0.0.1:${port}`;
const out=path.resolve('audit/final');
const routes=[
  ['home','/'],
  ['projects','/projects/'],
  ['linen-light','/projects/linen-light/'],
  ['walnut-line','/projects/walnut-line/'],
  ['chalk-frame','/projects/chalk-frame/'],
  ['olive-island','/projects/olive-island/'],
  ['ash-corner','/projects/ash-corner/'],
  ['graphite-block','/projects/graphite-block/'],
  ['quiet-wardrobe','/projects/quiet-wardrobe/'],
  ['living-contour','/projects/living-contour/'],
  ['work-niche','/projects/work-niche/'],
  ['materials','/materials/'],
  ['about','/about/'],
  ['calculator','/calculator/'],
  ['contacts','/contacts/'],
  ['missing-page','/missing-page/']
];
const primaryViewports=[['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]];
const requiredViewports=[[2560,1300],[1920,1080],[1440,900],[1024,768],[768,1024],[390,844],[360,800]];
const server=spawn(process.execPath,['scripts/serve-out.mjs',String(port)],{stdio:'ignore'});
let ready=false;
for(let attempt=0;attempt<80;attempt++){
  try{if((await fetch(origin)).ok){ready=true;break}}catch{}
  await new Promise(resolve=>setTimeout(resolve,250));
}
if(!ready){server.kill();throw new Error('Static preview did not start');}

await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(path.join(out,'desktop'),{recursive:true});
await fs.mkdir(path.join(out,'mobile'),{recursive:true});
await fs.mkdir(path.join(out,'viewports'),{recursive:true});
const browser=await chromium.launch({headless:true});
const report=[];

async function auditPage(page,route){
  const errors=[];
  page.on('pageerror',error=>errors.push(`page: ${error.message}`));
  page.on('console',message=>{if(message.type()==='error'&&route!=='/missing-page/')errors.push(`console: ${message.text()}`)});
  page.on('response',response=>{
    if(response.status()>=400&&!(route==='/missing-page/'&&response.status()===404))errors.push(`${response.status()} ${response.url()}`);
  });
  const response=await page.goto(`${origin}${route}`,{waitUntil:'load',timeout:45_000});
  await page.waitForTimeout(500);
  const metrics=await page.evaluate(()=>({
    h1:document.querySelectorAll('h1').length,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,
    brokenImages:[...document.images].filter(image=>image.complete&&image.naturalWidth===0).map(image=>image.src),
    externalResources:[...performance.getEntriesByType('resource')].map(entry=>entry.name).filter(url=>!url.startsWith(location.origin)),
    title:document.title
  }));
  return {status:response?.status(),errors,...metrics};
}

for(const [viewportName,viewport] of primaryViewports){
  for(const [name,route] of routes){
    const page=await browser.newPage({viewport});
    const result=await auditPage(page,route);
    await page.screenshot({path:path.join(out,viewportName,`${name}-first.png`)});
    await page.evaluate(async()=>{
      for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(window.innerHeight*.8,500)){
        window.scrollTo(0,y);
        await new Promise(resolve=>setTimeout(resolve,80));
      }
      window.scrollTo(0,0);
    });
    await page.waitForTimeout(250);
    await page.screenshot({path:path.join(out,viewportName,`${name}-full.png`),fullPage:true});
    report.push({viewport:viewportName,width:viewport.width,height:viewport.height,route,...result});
    await page.close();
  }
}

for(const [width,height] of requiredViewports){
  const page=await browser.newPage({viewport:{width,height}});
  const result=await auditPage(page,'/');
  await page.screenshot({path:path.join(out,'viewports',`home-${width}x${height}-first.png`)});
  report.push({viewport:'required',width,height,route:'/',...result});
  await page.close();
}

async function makeContactSheet(viewportName){
  const directory=path.join(out,viewportName);
  const html=path.join(directory,'contact-sheet.html');
  const cards=routes.map(([name,route])=>`<figure><img src="./${name}-first.png" alt=""><figcaption>${route}</figcaption></figure>`).join('');
  await fs.writeFile(html,`<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#171714;color:#f3efe5;font:14px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}figure{margin:0;background:#292923;padding:8px}img{display:block;width:100%;height:auto}figcaption{padding:8px 2px 2px;overflow-wrap:anywhere}</style><div class="grid">${cards}</div>`);
  const page=await browser.newPage({viewport:{width:1600,height:900}});
  await page.goto(pathToFileURL(html).href,{waitUntil:'load'});
  await page.screenshot({path:path.join(out,`${viewportName}-contact-sheet.png`),fullPage:true});
  await page.close();
}

await makeContactSheet('desktop');
await makeContactSheet('mobile');
await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));
await browser.close();
server.kill();

const failures=report.filter(item=>item.errors.length||item.h1!==1||item.overflow||item.brokenImages.length||item.externalResources.length||(!item.route.includes('missing-page')&&item.status!==200));
console.log(JSON.stringify({pages:report.length,failures},null,2));
if(failures.length)process.exitCode=1;
