'use client';

import {useState} from 'react';
import Link from 'next/link';
import {countertops,facades,handles} from '@/data/materials';
import {defaults,HandleId,KitchenConfig} from '@/lib/configurator';
import {KitchenFront} from './KitchenFront';

type MaterialSet={facade:KitchenConfig['facade'];top:KitchenConfig['top'];handle:HandleId};
const initial:MaterialSet={facade:'light-veneer',top:'compact',handle:'profile'};

export function MaterialsExplorer(){
  const [variants,setVariants]=useState<{a:MaterialSet;b:MaterialSet}>({a:initial,b:{facade:'frame',top:'quartz',handle:'bar'}});
  const [active,setActive]=useState<'a'|'b'>('a');
  const [view,setView]=useState<'scene'|'detail'>('scene');
  const selected=variants[active];
  const setMaterial=(key:keyof MaterialSet,value:string)=>setVariants(current=>({...current,[active]:{...current[active],[key]:value}}));
  const config=(set:MaterialSet)=>({...defaults,facade:set.facade,top:set.top,handle:set.handle});
  const query=(set:MaterialSet)=>`layout=straight&a=3000&facade=${set.facade}&top=${set.top}&handle=${set.handle}`;
  const details=(set:MaterialSet)=>({facade:facades.find(item=>item.id===set.facade)?.name,top:countertops.find(item=>item.id===set.top)?.name,handle:handles.find(item=>item.id===set.handle)?.name});
  const current=details(selected);
  return <div className="materialsExplorer materialVisualizer">
    <aside className="materialStudio">
      <div className="variantTabs" role="tablist" aria-label="Редактируемый вариант"><button type="button" role="tab" aria-selected={active==='a'} onClick={()=>setActive('a')}>Вариант A</button><button type="button" role="tab" aria-selected={active==='b'} onClick={()=>setActive('b')}>Вариант B</button></div>
      <p className="editingState" aria-live="polite">Сейчас редактируется вариант {active.toUpperCase()}. Изменения сохраняются автоматически.</p>
      <div className="previewModeTabs" role="tablist" aria-label="Представление кухни"><button type="button" role="tab" aria-selected={view==='scene'} onClick={()=>setView('scene')}>Общий вид</button><button type="button" role="tab" aria-selected={view==='detail'} onClick={()=>setView('detail')}>Крупный план</button></div>
      <MaterialScene config={config(selected)} view={view}/>
      <dl className="currentMaterials"><div><dt>Фасад</dt><dd>{current.facade}</dd></div><div><dt>Столешница</dt><dd>{current.top}</dd></div><div><dt>Ручка</dt><dd>{current.handle}</dd></div></dl>
      <Link className="button" href={`/calculator?${query(selected)}`}>Использовать {active.toUpperCase()} в расчёте</Link>
      <div className="variantComparison" aria-label="Сравнение вариантов A и B"><p className="eyebrow">Сравнение</p>{(['a','b'] as const).map(slot=>{const values=details(variants[slot]);return <div key={slot}><b>Вариант {slot.toUpperCase()}</b><span>{values.facade} · {values.top} · {values.handle}</span><Link href={`/calculator?${query(variants[slot])}`}>В расчёт</Link></div>})}</div>
      <p className="materialDisclaimer">Экран показывает сочетание, а цвет зависит от устройства. Реальный материал проверяют по образцу и при разном свете.</p>
    </aside>
    <section className="materialControls"><p className="eyebrow">Настройка варианта</p><h2>Материалы и фурнитура</h2><Choice title="Фасады" items={facades} value={selected.facade} set={value=>setMaterial('facade',value)}/><Choice title="Столешницы" items={countertops} value={selected.top} set={value=>setMaterial('top',value)}/><Choice title="Ручки" items={handles} value={selected.handle} set={value=>setMaterial('handle',value)} handles/></section>
  </div>;
}

export function MaterialScene({config,view}:{config:KitchenConfig;view:'scene'|'detail'}){return <div className={`materialScene materialScene--${view}`} role="tabpanel"><KitchenFront config={config} label={view==='scene'?'Общий вид выбранной кухни':'Крупный план выбранных материалов'}/>{view==='detail'&&<div className="materialDetail" aria-hidden="true"><span className={`detailFacade ${config.facade}`}/><span className={`detailTop ${config.top}`}/><span className={`detailHandle ${config.handle}`}/><i/></div>}</div>}

function Choice({title,items,value,set,handles:showHandles=false}:{title:string;items:readonly {id:string;name:string;note:string;texture?:string}[];value:string;set:(value:string)=>void;handles?:boolean}){return <fieldset><legend>{title}</legend>{items.map(item=><button type="button" aria-pressed={value===item.id} key={item.id} onClick={()=>set(item.id)}>{showHandles?<i className={`handleSwatch ${item.id}`}/>:item.texture&&<i className={`texture ${item.texture}`}/>}<span><b>{item.name}</b><small>{item.note}</small></span>{value===item.id&&<em aria-hidden="true">Выбрано</em>}</button>)}</fieldset>}
