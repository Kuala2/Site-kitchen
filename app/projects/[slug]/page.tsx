import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {projects,layoutNames} from '@/data/projects';
import {Lightbox} from '@/components/Lightbox';
import {KitchenDiagram} from '@/components/KitchenDiagram';
import {defaults} from '@/lib/configurator';

export function generateStaticParams(){return projects.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=projects.find(x=>x.slug===slug);return p?{title:p.name,description:p.description,alternates:{canonical:`/projects/${p.slug}`}}:{title:'Концепт не найден'}}

export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params,p=projects.find(x=>x.slug===slug);if(!p)notFound();
  const i=projects.indexOf(p),next=projects[(i+1)%projects.length];
  const c={...defaults,layout:p.layout,facade:p.facade.includes('шпон')?(p.facade.includes('тём')?'dark-veneer':'light-veneer'):p.facade.includes('рам')?'frame':'paint',top:p.top.includes('кварц')?'quartz':p.top.includes('искус')?'stone':'compact'} as typeof defaults;
  return <article className="projectPage">
    <section className="projectHero"><Lightbox images={p.gallery}/><div><p className="eyebrow">демонстрационный концепт</p><h1>{p.name}</h1><p className="lead">{p.description}</p></div></section>
    <div className="projectBody">
      <aside className="stickyFacts"><dl><div><dt>Планировка</dt><dd>{layoutNames[p.layout]}</dd></div><div><dt>Помещение</dt><dd>{p.room}</dd></div><div><dt>Фасад</dt><dd>{p.facade}</dd></div><div><dt>Столешница</dt><dd>{p.top}</dd></div></dl><Link className="button" href={`/calculator?layout=${p.layout}&facade=${c.facade}&top=${c.top}&a=3000`}>Взять за основу</Link></aside>
      <div className="projectStory">
        <section><p className="eyebrow">Задача</p><h2>{p.task}</h2><p>{p.description}</p></section>
        <div className="storyGallery">{p.gallery.slice(1).map(image=><figure key={image.src}><div><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 50vw"/></div><figcaption>{image.caption}</figcaption></figure>)}</div>
        <p className="galleryNote">Дополнительные кадры - материальные референсы концепта, а не фотографии одного реализованного объекта.</p>
        <section><h2>Хранение и детали</h2><p>{p.storage}</p><ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul></section>
        <section><h2>Условная 2D-схема</h2><KitchenDiagram config={c}/></section>
      </div>
    </div>
    <Link className="nextProject" href={`/projects/${next.slug}`}><span>Следующий концепт</span><b>{next.name} →</b></Link>
  </article>
}
