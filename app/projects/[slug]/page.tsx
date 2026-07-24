import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {projects,layoutNames} from '@/data/projects';
import {Lightbox} from '@/components/Lightbox';
import {KitchenDiagram} from '@/components/KitchenDiagram';
import {defaults} from '@/lib/configurator';

export function generateStaticParams(){return projects.map(project=>({slug:project.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=projects.find(item=>item.slug===slug);return project?{title:project.name,description:project.description,alternates:{canonical:`/projects/${project.slug}`}}:{title:'Концепт не найден'}}

export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const project=projects.find(item=>item.slug===slug);
  if(!project)notFound();
  const index=projects.indexOf(project),next=projects[(index+1)%projects.length];
  const family=project.layout==='straight'?'linear':project.layout==='island'?'island':'corner';
  const diagramFirst=project.layout==='corner'||project.layout==='u';
  const config={...defaults,layout:project.layout,facade:project.facade.includes('шпон')?(project.facade.includes('тём')?'dark-veneer':'light-veneer'):project.facade.includes('рам')?'frame':'paint',top:project.top.includes('кварц')?'quartz':project.top.includes('искус')?'stone':'compact'} as typeof defaults;
  const storage=<section className="storageSection"><h2>Хранение и детали</h2><p>{project.storage}</p><ul>{project.features.map(feature=><li key={feature}>{feature}</li>)}</ul></section>;
  const diagram=<section className="diagramSection"><h2>Условная 2D-схема</h2><KitchenDiagram config={config}/></section>;
  return <article className={`projectPage projectPage--${family}`}>
    <section className="projectHero"><Lightbox images={project.gallery}/><div><p className="eyebrow">демонстрационный концепт</p><h1>{project.name}</h1><p className="lead">{project.description}</p></div></section>
    <div className="projectBody"><aside className="stickyFacts"><dl><div><dt>Планировка</dt><dd>{layoutNames[project.layout]}</dd></div><div><dt>Помещение</dt><dd>{project.room}</dd></div><div><dt>Основные размеры</dt><dd>{project.dimensions}</dd></div><div><dt>Фасад</dt><dd>{project.facade}</dd></div><div><dt>Столешница</dt><dd>{project.top}</dd></div></dl><Link className="button" href={`/calculator?layout=${project.layout}&facade=${config.facade}&top=${config.top}&a=3000`}>Взять за основу</Link></aside>
      <div className="projectStory"><section><p className="eyebrow">Задача</p><h2>{project.task}</h2><p>{project.description}</p></section>{diagramFirst&&diagram}<div className="storyGallery">{project.gallery.slice(1).map(image=><figure key={image.src}><div><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 50vw"/></div><figcaption>{image.caption}</figcaption></figure>)}</div><p className="galleryNote">Материальная подборка. Кадры показывают сочетание фасада, столешницы и света, а не фотографии одного реализованного объекта.</p>{storage}{!diagramFirst&&diagram}</div></div>
    <Link className="nextProject" href={`/projects/${next.slug}`}><span>Следующий концепт</span><b>{next.name} →</b></Link>
  </article>;
}
