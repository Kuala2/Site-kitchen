import type {KitchenConfig, Layout} from './configurator';

export type WallId = 'a'|'b'|'c'|'island';
export type ZoneId = 'fridge'|'sink'|'cooktop';
export type ZonePlacement = {wall:WallId;module:number};
export type KitchenModule = {wall:WallId;index:number;kind:'base'|'tall'|'island';width:number;zone?:ZoneId;column?:boolean};
export type KitchenWall = {id:WallId;label:string;length:number;modules:KitchenModule[]};
export type KitchenModel = {layout:Layout;walls:KitchenWall[];zones:Record<ZoneId,ZonePlacement>;moduleWidth:number};

const labels:Record<WallId,string>={a:'Стена A',b:'Стена B',c:'Стена C',island:'Остров'};
const zoneOrder:ZoneId[]=['fridge','sink','cooktop'];

function wallIds(layout:Layout):WallId[]{
  if(layout==='straight') return ['a'];
  if(layout==='corner') return ['a','b'];
  if(layout==='u') return ['a','b','c'];
  return ['a','island'];
}

function lengthFor(config:KitchenConfig,id:WallId){
  if(id==='a') return config.dimensions.a;
  if(id==='b') return config.dimensions.b||0;
  if(id==='c') return config.dimensions.c||0;
  return config.dimensions.islandLength||0;
}

export function moduleCount(length:number){return Math.max(2,Math.floor(length/600));}

export function defaultZones(layout:Layout):Record<ZoneId,ZonePlacement>{
  if(layout==='straight') return {fridge:{wall:'a',module:0},sink:{wall:'a',module:2},cooktop:{wall:'a',module:4}};
  if(layout==='corner') return {fridge:{wall:'a',module:0},sink:{wall:'a',module:2},cooktop:{wall:'b',module:1}};
  if(layout==='u') return {fridge:{wall:'a',module:0},sink:{wall:'b',module:1},cooktop:{wall:'c',module:1}};
  return {fridge:{wall:'a',module:0},sink:{wall:'a',module:2},cooktop:{wall:'island',module:1}};
}

export function normalizeZones(config:KitchenConfig,zones:Record<ZoneId,ZonePlacement>=defaultZones(config.layout)){
  const allowed=wallIds(config.layout);
  const used=new Set<string>();
  return zoneOrder.reduce((result,zone)=>{
    const requested=zones[zone];
    const wall=allowed.includes(requested?.wall)?requested.wall:allowed[0];
    const count=moduleCount(lengthFor(config,wall));
    let moduleIndex=Math.max(0,Math.min(count-1,requested?.module??0));
    while(used.has(`${wall}:${moduleIndex}`)) moduleIndex=(moduleIndex+1)%count;
    used.add(`${wall}:${moduleIndex}`);
    result[zone]={wall,module:moduleIndex};
    return result;
  },{} as Record<ZoneId,ZonePlacement>);
}

export function normalizeColumn(config:KitchenConfig,placement=config.column):ZonePlacement{
  const zones=normalizeZones(config,config.zones),walls=wallIds(config.layout).filter((id):id is Exclude<WallId,'island'>=>id!=='island');
  const isFree=(wall:WallId,module:number)=>!Object.values(zones).some(zone=>zone.wall===wall&&zone.module===module);
  if(placement&&walls.includes(placement.wall as Exclude<WallId,'island'>)&&placement.module>=0&&placement.module<moduleCount(lengthFor(config,placement.wall))&&isFree(placement.wall,placement.module))return placement;
  for(const wall of walls)for(let slot=0;slot<moduleCount(lengthFor(config,wall));slot++)if(isFree(wall,slot))return {wall,module:slot};
  return {wall:'a',module:0};
}

export function buildKitchenModel(config:KitchenConfig):KitchenModel{
  const zones=normalizeZones(config,config.zones);
  const column=normalizeColumn({...config,zones},config.column);
  const walls=wallIds(config.layout).map(id=>{
    const length=lengthFor(config,id),count=moduleCount(length);
    const modules:Array<KitchenModule>=Array.from({length:count},(_,index)=>({
      wall:id,index,width:length/count,kind:zones.fridge.wall===id&&zones.fridge.module===index?'tall':id==='island'?'island':'base',
      zone:zoneOrder.find(zone=>zones[zone].wall===id&&zones[zone].module===index),
      column:config.options.includes('columns')&&column.wall===id&&column.module===index
    }));
    return {id,label:labels[id],length,modules};
  });
  return {layout:config.layout,walls,zones,moduleWidth:600};
}

export function availableWalls(config:KitchenConfig){return buildKitchenModel(config).walls.map(({id,label,modules})=>({id,label,modules:modules.length}));}
