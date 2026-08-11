import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {projects,roomNames} from '@/data/projects';
import {Lightbox} from '@/components/Lightbox';
import {KitchenDiagram} from '@/components/KitchenDiagram';
import {FurniturePlan} from '@/components/FurniturePlan';
import {defaults} from '@/lib/configurator';

export function generateStaticParams(){return projects.map(project=>({slug:project.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const project=projects.find(item=>item.slug===slug);return project?{title:project.name,description:project.description,alternates:{canonical:`/projects/${project.slug}/`},openGraph:{title:project.name,description:project.description,type:'article',images:[{url:project.image,alt:project.alt}]}}:{title:'Концепт не найден',robots:{index:false,follow:false}}}

export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const project=projects.find(item=>item.slug===slug);
  if(!project)notFound();
  const index=projects.indexOf(project),next=projects[(index+1)%projects.length];
  const family=project.composition==='kitchen'?(project.layout==='straight'?'linear':project.layout==='island'?'island':'corner'):project.composition;
  const config={...defaults,layout:project.layout,facade:project.facade.includes('шпон')?(project.facade.includes('тём')?'dark-veneer':'light-veneer'):project.facade.includes('рам')?'frame':'paint',top:project.top.includes('кварц')?'quartz':project.top.includes('кам')?'stone':'compact'} as typeof defaults;
  const plan=project.composition==='kitchen'?<KitchenDiagram config={config}/>:<FurniturePlan type={project.composition} label={`Условная фронтальная схема концепта «${project.name}»`}/>;
  return <article className={`projectPage projectPage--${family}`}>
    <section className="projectHero"><Lightbox images={project.gallery}/><div><p className="eyebrow">демонстрационный концепт · {roomNames[project.category]}</p><h1>{project.name}</h1><p className="lead">{project.description}</p></div></section>
    <div className="projectBody"><aside className="stickyFacts"><dl><div><dt>Комната</dt><dd>{project.room}</dd></div><div><dt>Тип решения</dt><dd>{project.solution}</dd></div><div><dt>Основные размеры</dt><dd>{project.dimensions}</dd></div><div><dt>Основной материал</dt><dd>{project.facade}</dd></div><div><dt>{project.calculatorCompatible?'Столешница':'Сочетание'}</dt><dd>{project.top}</dd></div></dl>{project.calculatorCompatible?<Link className="button" href={`/calculator/?layout=${project.layout}&facade=${config.facade}&top=${config.top}&a=3000`}>Взять за основу</Link>:<Link className="button" href={`/contacts/?room=${project.category}&concept=${project.slug}`}>Обсудить концепт</Link>}</aside>
      <div className="projectStory"><section><p className="eyebrow">Задача</p><h2>{project.task}</h2><p>{project.description}</p></section><section className="diagramSection"><h2>{project.composition==='kitchen'?'Условный план сверху':'Фронтальная проекция'}</h2>{plan}</section><div className="storyGallery">{project.gallery.slice(1).map(image=><figure key={image.src}><div><Image src={image.src} alt={image.alt} fill sizes="(max-width: 700px) 100vw, 50vw"/></div><figcaption>{image.caption}</figcaption></figure>)}</div><p className="galleryNote">Визуальная подборка помогает проверить характер материалов и хранения. Это референсы концепта, а не серия фотографий одного реализованного объекта.</p><section className="storageSection"><h2>Хранение и детали</h2><p>{project.storage}</p><ul>{project.features.map(feature=><li key={feature}>{feature}</li>)}</ul></section></div></div>
    <Link className="nextProject" href={`/projects/${next.slug}/`}><span>Смотреть следующий концепт</span><b>{next.name} →</b></Link>
  </article>;
}
