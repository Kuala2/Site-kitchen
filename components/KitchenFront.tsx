import type {KitchenConfig} from '@/lib/configurator';
import {buildKitchenModel,type WallId,type ZoneId} from '@/lib/kitchen-model';

const facadeFill={paint:'#aca99a','light-veneer':'#c5a87b','dark-veneer':'#594033',frame:'#d0c7b0'} as const;
const topFill={compact:'#343632',stone:'#d9d3c8',quartz:'#b9b1a7'} as const;
const zoneTitle:Record<ZoneId,string>={fridge:'Холодильник',sink:'Мойка',cooktop:'Варочная'};

export function KitchenFront({config,label='Развёртка кухни',wallId}:{config:KitchenConfig;label?:string;wallId?:WallId}){
  const model=buildKitchenModel(config),wall=model.walls.find(item=>item.id===wallId)||model.walls[0];
  const upper=config.options.includes('uppers'),columns=config.options.includes('columns'),drawers=config.options.includes('drawers'),lights=config.options.includes('lights');
  const facade=facadeFill[config.facade],top=topFill[config.top],frame=config.facade==='frame';
  const texture=config.facade.includes('veneer')?'woodgrain':config.facade==='paint'?'paintgrain':'framegrain';
  const hasTall=columns||wall.modules.some(module=>module.kind==='tall');
  const unit=Math.min(112,570/wall.modules.length),start=(760-unit*wall.modules.length)/2;
  return <svg className="kitchenFront" viewBox="0 0 760 440" role="img" aria-label={`${label}: ${wall.label}.`} data-wall={wall.id} data-modules={wall.modules.length} data-lights={lights?'true':'false'} data-drawers={drawers?'true':'false'} data-uppers={upper?'true':'false'}>
    <defs><pattern id="woodgrain" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 5C7 1 15 9 22 4M0 16c8-6 14 3 22-3" fill="none" stroke="#604b36" strokeOpacity=".32" strokeWidth="1.4"/></pattern><pattern id="paintgrain" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="#fff" opacity=".18"/></pattern><pattern id="framegrain" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 11H22" stroke="#706857" strokeOpacity=".12"/></pattern></defs>
    <rect width="760" height="440" fill="#ebe5db"/><path d="M55 378H705" stroke="#8a877e" strokeWidth="3"/>
    {wall.modules.map((module,index)=>{const x=start+index*unit,tall=hasTall&&(module.kind==='tall'||(columns&&index===0));return <g key={module.index}>{tall?<Cabinet x={x} y={70} width={unit-4} height={300} facade={facade} texture={texture} frame={frame} handle={config.handle}/>:<><>{upper&&<Cabinet x={x} y={76} width={unit-4} height={112} facade={facade} texture={texture} frame={frame} handle={config.handle}/>}</><Cabinet x={x} y={272} width={unit-4} height={98} facade={facade} texture={texture} frame={frame} handle={config.handle} drawers={drawers}/>{module.zone&&<Appliance zone={module.zone} x={x} width={unit-4}/>}</>}</g>})}
    <rect x={start-7} y="252" width={unit*wall.modules.length+7} height={config.top==='compact'?14:config.top==='stone'?22:18} rx="2" fill={top}/><path d={`M${start-7} 266H${start+unit*wall.modules.length}`} stroke="#242521" strokeOpacity=".48" strokeWidth="2"/>
    {upper&&lights&&<path d={`M${start} 194H${start+unit*wall.modules.length-4}`} stroke="#e1b66c" strokeWidth="5" opacity=".82"/>}<rect x={start-7} y="370" width={unit*wall.modules.length+7} height="10" fill="#4c4d46"/>
    <path d={`M${start} 46H${start+unit*wall.modules.length-4}`} stroke="#b7afa0" strokeWidth="16"/><path d={`M${start} 45H${start+unit*wall.modules.length-4}`} stroke="#fff" strokeOpacity=".5" strokeWidth="1"/>
    <text x="380" y="414" textAnchor="middle" fontSize="13" fill="#20211d">{wall.label} · {wall.length} мм · {wall.modules.length} условных модулей</text>
  </svg>;
}

function Appliance({zone,x,width}:{zone:ZoneId;x:number;width:number}){const cx=x+width/2;if(zone==='sink')return <g aria-label={zoneTitle[zone]}><rect x={x+7} y="225" width={Math.max(34,width-14)} height="24" rx="10" fill="#cac6bc" stroke="#20211d" strokeWidth="2"/><path d={`M${cx} 224v-20q0-16 15-16`} fill="none" stroke="#20211d" strokeWidth="3"/></g>;if(zone==='cooktop')return <g aria-label={zoneTitle[zone]}><rect x={x+7} y="220" width={Math.max(34,width-14)} height="29" rx="4" fill="#373833" stroke="#20211d" strokeWidth="2"/><circle cx={cx-12} cy="234" r="6" fill="none" stroke="#ded8ca"/><circle cx={cx+12} cy="234" r="6" fill="none" stroke="#ded8ca"/></g>;return null;}
function Cabinet({x,y,width,height,facade,texture,frame,handle,drawers=false}:{x:number;y:number;width:number;height:number;facade:string;texture:string;frame:boolean;handle:KitchenConfig['handle'];drawers?:boolean}){const rows=drawers?3:1;return <g><rect x={x} y={y} width={width} height={height} fill={facade} stroke="#20211d" strokeWidth="2"/>{frame&&<rect x={x+7} y={y+7} width={width-14} height={height-14} fill="none" stroke="#817865" strokeWidth="4"/>}<rect x={x} y={y} width={width} height={height} fill={`url(#${texture})`} opacity=".55"/>{Array.from({length:rows-1},(_,i)=><path key={i} d={`M${x} ${y+height*(i+1)/rows}h${width}`} stroke="#20211d" strokeOpacity=".5"/>)}<Handle x={x} y={y} width={width} height={height} type={handle} rows={rows}/></g>}
function Handle({x,y,width,height,type,rows}:{x:number;y:number;width:number;height:number;type:KitchenConfig['handle'];rows:number}){return <g fill="none" stroke="#20211d" strokeWidth="3">{Array.from({length:rows},(_,index)=>{const rowY=y+height*(index+.5)/rows;if(type==='profile')return <path key={index} d={`M${x+7} ${y+height*index/rows+8}h${width-14}`} strokeWidth="4"/>;if(type==='bar')return <path key={index} d={`M${x+width/2-14} ${rowY-9}v18m28-18v18m-28-9h28`}/>;return <circle key={index} cx={x+width-12} cy={rowY} r="4" fill="#20211d"/>})}</g>}
