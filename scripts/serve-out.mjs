import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {extname,resolve,sep} from 'node:path';

const root=resolve('out');
const port=Number(process.argv[2]||3200);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};

function safePath(pathname){const decoded=decodeURIComponent(pathname.split('?')[0]);const target=resolve(root,`.${decoded}`);return target===root||target.startsWith(root+sep)?target:null}
async function fileFor(pathname){const target=safePath(pathname);if(!target)return null;try{const info=await stat(target);if(info.isDirectory()){const index=resolve(target,'index.html');await stat(index);return index}return target}catch{if(!extname(target)){const index=resolve(target,'index.html');try{await stat(index);return index}catch{return null}}const decoded=decodeURIComponent(pathname.split('?')[0]);const leaf=decoded.slice(decoded.lastIndexOf('/')+1);const flattened=leaf.match(/^(__next\.[^.]+)\.(.+)\.txt$/);if(flattened){const base=decoded.slice(0,decoded.lastIndexOf('/')+1);const nested=safePath(`${base}${flattened[1]}/${flattened[2].replaceAll('.','/')}.txt`);if(nested)try{await stat(nested);return nested}catch{return null}}return null}}

const server=createServer(async(request,response)=>{try{const candidate=await fileFor(request.url||'/');if(candidate){const body=await readFile(candidate);response.writeHead(200,{'content-type':mime[extname(candidate)]||'application/octet-stream','cache-control':'no-store'});if(request.method==='HEAD')response.end();else response.end(body);return}const fallback=await readFile(resolve(root,'404.html'));response.writeHead(404,{'content-type':'text/html; charset=utf-8','cache-control':'no-store'});response.end(request.method==='HEAD'?undefined:fallback)}catch(error){response.writeHead(500,{'content-type':'text/plain; charset=utf-8'});response.end(`Preview error: ${error instanceof Error?error.message:'unknown'}`)}});

server.listen(port,'127.0.0.1',()=>console.log(`Static preview: http://127.0.0.1:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));
