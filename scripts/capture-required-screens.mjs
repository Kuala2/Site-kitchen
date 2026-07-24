import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';

const port=3500;
const out='audit/required-screens';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p',String(port)],{stdio:'ignore'});
for(let attempt=0;attempt<80;attempt++){try{if((await fetch(`http://127.0.0.1:${port}/`)).ok)break}catch{}await new Promise(resolve=>setTimeout(resolve,250))}
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const routes=['/','/projects','/projects/linen-light','/projects/walnut-line','/projects/chalk-frame','/projects/olive-island','/projects/ash-corner','/projects/graphite-block','/materials','/about','/contacts','/missing-page'];
const viewports=[['desktop',{width:1440,height:1000}],['mobile',{width:390,height:844}]];
const report=[];
for(const [name,viewport] of viewports)for(const route of routes){const page=await browser.newPage({viewport});const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error'&&!message.text().includes('404'))errors.push(message.text())});await page.goto(`http://127.0.0.1:${port}${route}`,{waitUntil:'networkidle'});const metrics=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,broken:[...document.images].filter(image=>image.complete&&image.naturalWidth===0).length}));await page.screenshot({path:`${out}/${name}${route==='/'?'-home':route.replaceAll('/','-')}.png`,fullPage:true});report.push({name,route,errors,metrics});await page.close()}
for(const [name,viewport] of viewports){const page=await browser.newPage({viewport});await page.goto(`http://127.0.0.1:${port}/calculator`,{waitUntil:'networkidle'});await page.screenshot({path:`${out}/${name}-calculator-step-1.png`,fullPage:true});const next=page.getByRole('button',{name:'Продолжить'});await next.click();await page.screenshot({path:`${out}/${name}-calculator-materials.png`,fullPage:true});await next.click();await next.click();await page.screenshot({path:`${out}/${name}-calculator-result.png`,fullPage:true});await page.emulateMedia({media:'print'});await page.pdf({path:`${out}/${name}-calculator-print.pdf`,format:'A4',printBackground:true});await page.close()}
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));
await browser.close();server.kill();
console.log(JSON.stringify(report,null,2));
