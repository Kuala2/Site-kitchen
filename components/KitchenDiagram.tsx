import type {KitchenConfig} from '@/lib/configurator';
import {buildKitchenModel,type KitchenWall,type ZoneId} from '@/lib/kitchen-model';

const facadeFill={paint:'#aaa997','light-veneer':'#c9b28e','dark-veneer':'#5b463b',frame:'#cbc4b1'} as const;
const topFill={compact:'#353631',stone:'#d6d1c7',quartz:'#bbb4aa'} as const;
const zoneLabel:Record<ZoneId,string>={fridge:'Х',sink:'М',cooktop:'В'};
const zoneName:Record<ZoneId,string>={fridge:'холодильник',sink:'мойка',cooktop:'варочная поверхность'};

type Shape={x:number;y:number;width:number;height:number;horizontal:boolean};
function shapeFor(id:KitchenWall['id']):Shape{
  if(id==='a')return {x:120,y:76,width:480,height:72,horizontal:true};
  if(id==='b')return {x:120,y:148,width:72,height:212,horizontal:false};
  if(id==='c')return {x:528,y:148,width:72,height:212,horizontal:false};
  return {x:270,y:272,width:220,height:72,horizontal:true};
}

export function KitchenDiagram({config,large=false}:{config:KitchenConfig;large?:boolean}){
  const model=buildKitchenModel(config),facade=facadeFill[config.facade],counter=topFill[config.top];
  const zones=Object.entries(model.zones).map(([zone,place])=>`${zoneName[zone as ZoneId]}: ${place.wall.toUpperCase()}-${place.module+1}`).join(', ');
  return <svg className={large?'diagram large':'diagram'} viewBox="0 0 720 440" role="img" aria-label={`План кухни. ${zones}.`} data-layout={config.layout}>
    <defs><pattern id="plan-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#20211d" strokeOpacity=".06"/></pattern><marker id="dimension-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M6 0 0 3 6 6" fill="none" stroke="currentColor" strokeWidth="1"/></marker></defs>
    <rect width="720" height="440" fill="#eee9df"/><rect x="66" y="42" width="588" height="340" fill="url(#plan-grid)"/>
    <path d="M66 382V42H654V382" fill="none" stroke="#20211d" strokeWidth="2"/><path d="M308 42h104M308 37h104" fill="none" stroke="#20211d"/>
    {model.walls.map(wall=><Wall key={wall.id} wall={wall} facade={facade} counter={counter}/>) }
    <path d="M120 28H600" stroke="#20211d" markerStart="url(#dimension-arrow)" markerEnd="url(#dimension-arrow)"/><text x="360" y="22" textAnchor="middle" fontSize="12" fill="#20211d">A · {config.dimensions.a} мм</text>
    {config.layout!=='straight'&&<><path d="M88 148V360" stroke="#20211d" markerStart="url(#dimension-arrow)" markerEnd="url(#dimension-arrow)"/><text x="76" y="254" textAnchor="middle" transform="rotate(-90 76 254)" fontSize="12">B · {config.dimensions.b} мм</text></>}
    {config.layout==='u'&&<><path d="M632 148V360" stroke="#20211d" markerStart="url(#dimension-arrow)" markerEnd="url(#dimension-arrow)"/><text x="645" y="254" textAnchor="middle" transform="rotate(90 645 254)" fontSize="12">C · {config.dimensions.c} мм</text></>}
    {config.layout==='island'&&<><path d="M270 364H490" stroke="#20211d" markerStart="url(#dimension-arrow)" markerEnd="url(#dimension-arrow)"/><text x="380" y="379" textAnchor="middle" fontSize="12">остров · {config.dimensions.islandLength} мм</text></>}
    <g fill="none" stroke="#c55235" strokeWidth="1.5" strokeDasharray="5 5"><path d="M150 112 300 112 455 112Z"/></g>
    <text x="68" y="414" fontSize="11" fill="#20211d">Х холодильник · М мойка · В варочная · модуль ≈ 600 мм</text>
  </svg>;
}

function Wall({wall,facade,counter}:{wall:KitchenWall;facade:string;counter:string}){
  const shape=shapeFor(wall.id),size=shape.horizontal?shape.width:shape.height;
  return <g data-wall={wall.id}><rect {...shape} rx="2" fill={facade} stroke="#20211d" strokeWidth="1.5"/>
    {wall.modules.map(module=>{const at=size/wall.modules.length*module.index;const x=shape.horizontal?shape.x+at:shape.x,y=shape.horizontal?shape.y:shape.y+at,w=shape.horizontal?size/wall.modules.length:shape.width,h=shape.horizontal?shape.height:size/wall.modules.length;return <g key={module.index} data-module={`${wall.id}-${module.index}`}><rect x={x} y={y} width={w} height={h} fill="none" stroke="#20211d" strokeOpacity=".45"/>{module.zone&&<Zone zone={module.zone} x={x+w/2} y={y+h/2}/>}</g>})}
    <path d={shape.horizontal?`M${shape.x+4} ${shape.y+6}H${shape.x+shape.width-4}`:`M${shape.x+6} ${shape.y+4}V${shape.y+shape.height-4}`} stroke={counter} strokeWidth="9"/>
  </g>;
}

function Zone({zone,x,y}:{zone:ZoneId;x:number;y:number}){return <g aria-label={zoneName[zone]}><circle cx={x} cy={y} r="14" fill="#eee9df" stroke="#c55235" strokeWidth="2"/><text x={x} y={y+4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#20211d">{zoneLabel[zone]}</text></g>}
