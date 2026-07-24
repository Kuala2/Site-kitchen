'use client';

import {useState} from 'react';
import Link from 'next/link';
import {countertops,facades,handles} from '@/data/materials';

type MaterialSet={facade:string;top:string;handle:string};

const initial:MaterialSet={facade:'light-veneer',top:'compact',handle:'profile'};

export function MaterialsExplorer(){
  const [draft,setDraft]=useState<MaterialSet>(initial);
  const [savedA,setSavedA]=useState<MaterialSet>(initial);
  const [savedB,setSavedB]=useState<MaterialSet>(initial);
  const [activePreview,setActivePreview]=useState<'a'|'b'>('a');
  const query=(set:MaterialSet)=>`layout=straight&a=3000&facade=${set.facade}&top=${set.top}`;
  const update=(key:keyof MaterialSet,value:string)=>setDraft(current=>({...current,[key]:value}));
  const save=(slot:'a'|'b')=>{if(slot==='a')setSavedA(draft);else setSavedB(draft);setActivePreview(slot)};

  return <div className="materialsExplorer materialLab">
    <div className="materialLabIntro"><p className="eyebrow">Лаборатория сочетаний</p><h2>Соберите два варианта рядом</h2><p>Сохраните текущую комбинацию как A, измените материалы и сохраните B. Это сравнение — ориентир перед просмотром реальных образцов.</p></div>
    <div className="previewTabs" role="tablist" aria-label="Варианты материалов"><button type="button" role="tab" aria-selected={activePreview==='a'} onClick={()=>setActivePreview('a')}>A</button><button type="button" role="tab" aria-selected={activePreview==='b'} onClick={()=>setActivePreview('b')}>B</button></div>
    <div className="materialLabPreviews">
      <MaterialPreview label="A" set={savedA} active={activePreview==='a'}/>
      <MaterialPreview label="B" set={savedB} active={activePreview==='b'}/>
    </div>
    <div className="materialControls">
      <Choice title="Фасады" items={facades} value={draft.facade} set={value=>update('facade',value)}/>
      <Choice title="Столешницы" items={countertops} value={draft.top} set={value=>update('top',value)}/>
      <Choice title="Ручки" items={handles} value={draft.handle} set={value=>update('handle',value)}/>
      <div className="materialSaveActions"><button className="button secondary" type="button" onClick={()=>save('a')}>Сохранить как A</button><button className="button secondary" type="button" onClick={()=>save('b')}>Сохранить как B</button></div>
      <div className="materialUseActions"><Link className="button" href={`/calculator?${query(savedA)}`}>Использовать A в расчёте</Link><Link className="button" href={`/calculator?${query(savedB)}`}>Использовать B в расчёте</Link></div>
    </div>
  </div>;
}

function MaterialPreview({label,set,active}:{label:'A'|'B';set:MaterialSet;active:boolean}){
  const facade=facades.find(item=>item.id===set.facade)?.name;
  const top=countertops.find(item=>item.id===set.top)?.name;
  const handle=handles.find(item=>item.id===set.handle)?.name;
  return <article className="materialLabPreview" data-active={active} aria-label={`Вариант ${label}: ${facade}, ${top}, ручка ${handle}`}>
    <p className="eyebrow">Вариант {label}</p>
    <svg viewBox="0 0 700 430" role="img" aria-label={`Стилизованная развёртка варианта ${label}`}><rect width="700" height="430" fill="#e8e2d8"/><g className={`svgFacade ${set.facade}`}><rect x="80" y="80" width="540" height="280"/><path d="M80 210h540M210 80v280M350 80v280M490 80v280"/></g><rect className={`svgTop ${set.top}`} x="70" y="200" width="560" height="18"/><g className={`svgHandle ${set.handle}`}><path d="M150 232v50M290 232v50M430 232v50M570 232v50"/></g></svg>
    <dl><div><dt>Фасад</dt><dd>{facade}</dd></div><div><dt>Столешница</dt><dd>{top}</dd></div><div><dt>Ручка</dt><dd>{handle}</dd></div></dl>
  </article>;
}

function Choice({title,items,value,set}:{title:string;items:readonly {id:string;name:string;note:string;texture?:string}[];value:string;set:(value:string)=>void}){
  return <fieldset><legend>{title}</legend>{items.map(item=><button type="button" aria-pressed={value===item.id} key={item.id} onClick={()=>set(item.id)}>{item.texture&&<i className={`texture ${item.texture}`}/>}<span><b>{item.name}</b><small>{item.note}</small></span></button>)}</fieldset>;
}
