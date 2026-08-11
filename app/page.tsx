import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {projects,roomNames} from '@/data/projects';
import {Compare} from '@/components/Compare';
import {KitchenDiagram} from '@/components/KitchenDiagram';
import {HomeHero} from '@/components/HomeHero';
import {RoomRail} from '@/components/RoomRail';
import {defaults} from '@/lib/configurator';
import {facades,countertops} from '@/data/materials';

export const metadata:Metadata={title:'Мебель на заказ для всего дома — демонстрационный сайт',description:'Оригинальный демонстрационный проект сайта мебели на заказ: кухни, гардеробные, гостиные, спальни и рабочие зоны.',alternates:{canonical:'/'}};

const selected=['quiet-wardrobe','olive-island','living-contour','linen-light','work-niche'].map(slug=>projects.find(project=>project.slug===slug)!);

export default function Home(){return <>
  <HomeHero/>
  <RoomRail/>
  <section className="selectedProjects section"><div className="selectedProjectsHead"><p className="eyebrow">Демонстрационные концепты</p><h2>Разные комнаты.<br/>Один язык материалов.</h2><p>Каждый проект показывает одну задачу хранения или использования. Это концепты, а не фотографии выполненных заказов.</p><Link className="textButton" href="/projects/">Все девять концептов</Link></div><div className="projectEditorialGrid">{selected.map((project,index)=><Link className={`editorialProject editorialProject--${index}`} href={`/projects/${project.slug}/`} key={project.slug}><div><Image src={project.image} alt={project.alt} fill sizes="(max-width: 700px) 100vw, 55vw"/></div><p><span>{roomNames[project.category]} · {project.solution}</span><b>{project.name}</b><small>{project.task}</small><i>Смотреть концепт ↗</i></p></Link>)}</div></section>
  <Compare/>
  <section className="section materialStrip"><div className="sectionHead"><p className="eyebrow">Лаборатория материалов</p><h2>Поверхность работает вместе с геометрией</h2><p>Фасады, корпуса, столешницы, ручки и профили сравниваются рядом. Экран передаёт только общее впечатление — реальный цвет проверяют по образцу.</p></div><p className="railHint">Листайте образцы в сторону →</p><div className="texturesRail">{[...facades,...countertops].map(material=><article key={material.id}><i className={`texture ${material.texture}`}/><h3>{material.name}</h3><p>{material.note}</p></article>)}</div><Link className="textButton" href="/materials/">Открыть лабораторию материалов</Link></section>
  <section className="section process homeProcess"><div className="processIntro"><p className="eyebrow">Как начинается проект</p><h2>Сначала задача и пространство</h2><Image src="/images/workshop.jpg" alt="Рабочий стол с образцами дерева" width={700} height={900}/></div><ol>{[['01','Разговор','Фиксируем комнату, привычки и то, что сейчас мешает.'],['02','Замер пространства','Проверяем геометрию, выводы, проходы и открывания.'],['03','Планировка и хранение','Распределяем объёмы до выбора декоративных деталей.'],['04','Материалы','Сопоставляем тактильность, уход, свет и условный бюджет.'],['05','Согласование','Собираем чертёж, комплектацию и привязки в один документ.'],['06','Изготовление и монтаж','Для реального производителя сайт показывает этот этап без вымышленных сроков и гарантий.']].map(([number,title,text])=><li key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></li>)}</ol><Image className="processImage" src="/images/editorial-12.jpg" alt="Светлый шпон и рабочая зона у мойки" width={900} height={1200}/></section>
  <section className="calCta"><div><p className="eyebrow">Отдельный глубокий пример</p><h2>Предварительный расчёт кухни</h2><p>Пять шагов помогают собрать форму, размеры, зоны, материалы и оснащение. Расчёт остаётся кухонным и служит ориентиром для первого разговора.</p><Link className="button" href="/calculator/">Собрать черновик кухни</Link></div><KitchenDiagram config={defaults}/></section>
  <section className="finalCta"><p className="eyebrow">Следующий шаг</p><h2>Начнём с комнаты, а не с каталога</h2><p>Выберите концепт, приложите известные размеры и расскажите, что должно измениться в хранении.</p><div className="heroActions"><Link className="button" href="/projects/">Смотреть решения</Link><Link className="textButton" href="/contacts/">Обсудить свою задачу</Link></div></section>
</>}
