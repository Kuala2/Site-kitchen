import type {KitchenConfig} from '@/lib/configurator';

const facadeFill={paint:'#aca99a','light-veneer':'#c5a87b','dark-veneer':'#594033',frame:'#d0c7b0'} as const;
const topFill={compact:'#343632',stone:'#d9d3c8',quartz:'#b9b1a7'} as const;

export function KitchenFront({config,label='Вид спереди кухни'}:{config:KitchenConfig;label?:string}){
  const upper=config.options.includes('uppers'),columns=config.options.includes('columns'),drawers=config.options.includes('drawers'),lights=config.options.includes('lights'),island=config.options.includes('island')&&config.layout==='island';
  const facade=facadeFill[config.facade],top=topFill[config.top],frame=config.facade==='frame';
  const texture=config.facade.includes('veneer')?'woodgrain':config.facade==='paint'?'paintgrain':'framegrain';
  return <svg className="kitchenFront" viewBox="0 0 760 440" role="img" aria-label={label} data-lights={lights?'true':'false'} data-drawers={drawers?'true':'false'} data-uppers={upper?'true':'false'}>
    <defs><pattern id="woodgrain" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 5C7 1 15 9 22 4M0 16c8-6 14 3 22-3" fill="none" stroke="#604b36" strokeOpacity=".32" strokeWidth="1.4"/></pattern><pattern id="paintgrain" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" fill="#fff" opacity=".18"/></pattern><pattern id="framegrain" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 11H22" stroke="#706857" strokeOpacity=".12"/></pattern></defs>
    <rect width="760" height="440" fill="#ebe5db"/><path d="M55 378H705" stroke="#8a877e" strokeWidth="3"/>
    {columns&&<Cabinet x={70} y={70} width={112} height={300} facade={facade} texture={texture} frame={frame} handle={config.handle} tall/>}
    <g transform={`translate(${columns?194:70} 0)`}>
      {upper&&<><Cabinet x={0} y={76} width={108} height={112} facade={facade} texture={texture} frame={frame} handle={config.handle}/><Cabinet x={112} y={76} width={108} height={112} facade={facade} texture={texture} frame={frame} handle={config.handle}/><Cabinet x={224} y={76} width={108} height={112} facade={facade} texture={texture} frame={frame} handle={config.handle}/>{lights&&<path d="M0 194H332" stroke="#e1b66c" strokeWidth="5" opacity=".82"/>}</>}
      <rect x="-7" y="252" width="346" height={config.top==='compact'?14:config.top==='stone'?22:18} rx="2" fill={top}/><path d="M-7 266H339" stroke="#242521" strokeOpacity=".48" strokeWidth="2"/>
      <Cabinet x={0} y={272} width={108} height={98} facade={facade} texture={texture} frame={frame} handle={config.handle} drawers={drawers}/><Cabinet x={112} y={272} width={108} height={98} facade={facade} texture={texture} frame={frame} handle={config.handle} drawers={drawers}/><Cabinet x={224} y={272} width={108} height={98} facade={facade} texture={texture} frame={frame} handle={config.handle}/>
      <rect x="18" y="225" width="82" height="24" rx="10" fill="#cac6bc" stroke="#20211d" strokeWidth="2"/><path d="M58 224v-20q0-16 15-16" fill="none" stroke="#20211d" strokeWidth="3"/><rect x="240" y="220" width="72" height="29" rx="4" fill="#373833" stroke="#20211d" strokeWidth="2"/><circle cx="258" cy="234" r="6" fill="none" stroke="#ded8ca"/><circle cx="294" cy="234" r="6" fill="none" stroke="#ded8ca"/>
      <rect x="-7" y="370" width="346" height="10" fill="#4c4d46"/>
    </g>
    {island&&<g transform="translate(500 275)"><rect width="150" height="16" rx="2" fill={top}/><Cabinet x={8} y={18} width={134} height={70} facade={facade} texture={texture} frame={frame} handle={config.handle} drawers={drawers}/><rect x="8" y="88" width="134" height="8" fill="#4c4d46"/><text x="75" y="120" textAnchor="middle" fontSize="13" fill="#20211d">остров</text></g>}
    <path d={`M${columns?194:70} 46H${columns?526:402}`} stroke="#b7afa0" strokeWidth="16"/><path d={`M${columns?194:70} 45H${columns?526:402}`} stroke="#fff" strokeOpacity=".5" strokeWidth="1"/>
  </svg>;
}

function Cabinet({x,y,width,height,facade,texture,frame,handle,tall=false,drawers=false}:{x:number;y:number;width:number;height:number;facade:string;texture:string;frame:boolean;handle:KitchenConfig['handle'];tall?:boolean;drawers?:boolean}){
  const rows=drawers?3:tall?2:1;
  return <g><rect x={x} y={y} width={width} height={height} fill={facade} stroke="#20211d" strokeWidth="2"/>{frame&&<rect x={x+8} y={y+8} width={width-16} height={height-16} fill="none" stroke="#817865" strokeWidth="5"/>}<rect x={x} y={y} width={width} height={height} fill={`url(#${texture})`} opacity=".55"/>{Array.from({length:rows-1},(_,i)=><path key={i} d={`M${x} ${y+height*(i+1)/rows}h${width}`} stroke="#20211d" strokeOpacity=".5"/>)}<Handle x={x} y={y} width={width} height={height} type={handle} rows={rows}/></g>;
}
function Handle({x,y,width,height,type,rows}:{x:number;y:number;width:number;height:number;type:KitchenConfig['handle'];rows:number}){return <g fill="none" stroke="#20211d" strokeWidth="3">{Array.from({length:rows},(_,index)=>{const rowY=y+height*(index+.5)/rows;if(type==='profile')return <path key={index} d={`M${x+10} ${y+height*index/rows+8}h${width-20}`} strokeWidth="4"/>;if(type==='bar')return <path key={index} d={`M${x+width/2-18} ${rowY-11}v22m36-22v22m-36-11h36`}/>;return <circle key={index} cx={x+width-16} cy={rowY} r="5" fill="#20211d"/>})}</g>}
