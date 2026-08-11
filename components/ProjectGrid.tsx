'use client';

import Image from 'next/image';
import Link from 'next/link';
import {usePathname,useRouter,useSearchParams} from 'next/navigation';
import {projects,roomNames,type RoomId} from '@/data/projects';

const roomFilters:[string,string][]=[['all','Все комнаты'],['kitchen',roomNames.kitchen],['wardrobe',roomNames.wardrobe],['living',roomNames.living],['office',roomNames.office]];
const solutionFilters=[['all','Все решения'],['linear','Линейные'],['corner','Угловые'],['u','П-образные'],['island','С островом'],['built-in','Встроенные'],['wall-system','Стеновые системы'],['workspace','Рабочие ниши']];

export function ProjectGrid(){
  const router=useRouter(),path=usePathname(),params=useSearchParams();
  const roomRaw=params.get('room')||'all';
  const solutionRaw=params.get('solution')||params.get('filter')||'all';
  const room=roomFilters.some(([id])=>id===roomRaw)?roomRaw:'all';
  const solution=solutionFilters.some(([id])=>id===solutionRaw)?solutionRaw:'all';
  const list=projects.filter(project=>(room==='all'||project.category===room)&&(solution==='all'||project.solutionId===solution));
  function setFilter(key:'room'|'solution',value:string){const next=new URLSearchParams(params);next.delete('filter');if(value==='all')next.delete(key);else next.set(key,value);router.push(`${path}${next.size?'?'+next:''}`,{scroll:false})}
  return <>
    <div className="filterBlock"><p className="filterLabel">Комната</p><div className="filters" role="group" aria-label="Фильтр по комнате">{roomFilters.map(([id,label])=><button type="button" key={id} aria-pressed={room===id} onClick={()=>setFilter('room',id)}>{label}</button>)}</div></div>
    <div className="filterBlock filterBlock--secondary"><p className="filterLabel">Тип решения</p><div className="filters" role="group" aria-label="Фильтр по типу решения">{solutionFilters.map(([id,label])=><button type="button" key={id} aria-pressed={solution===id} onClick={()=>setFilter('solution',id)}>{label}</button>)}</div></div>
    <p className="filterResult" aria-live="polite">Показано: {list.length} {list.length===1?'концепт':list.length<5?'концепта':'концептов'}</p>
    <div className="projectGrid">{list.map((project,index)=><article className={`projectCard card${index%4}`} key={project.slug}><Link href={`/projects/${project.slug}/`} aria-label={`Смотреть концепт: ${project.name}`}><div className="projectImage"><Image src={project.image} alt={project.alt} fill sizes="(max-width: 720px) 100vw, 50vw"/></div><div className="cardMeta"><span>{roomNames[project.category as RoomId]}</span><span>{project.solution}</span></div><h2>{project.name}</h2><p>{project.task}</p><small>{project.dimensions} · {project.facade}</small><span className="cardAction">Смотреть концепт →</span></Link></article>)}</div>
  </>;
}
