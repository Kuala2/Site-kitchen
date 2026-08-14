import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ActionLink, Arrow } from '@/components/DesignSystem';
import { projects, roomNames } from '@/data/projects';

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: project.name, description: project.description, alternates: { canonical: `/projects/${slug}/` } } : { title: 'Проект не найден' };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const gallery = project.gallery.filter((image) => !image.generated);
  const detail = gallery[1] ?? { src: '/images/room-living-detail.jpg', alt: 'Подсвеченная ниша встроенной системы', caption: 'Чистовой узел и встроенный свет' };
  const material = gallery[2] ?? { src: '/images/room-living-detail.jpg', alt: 'Чистовой мебельный узел с подсветкой и точным примыканием', caption: 'Материал и стык в готовом интерьере' };
  const calculatorHref = project.calculatorCompatible
    ? `/calculator/?type=kitchen&configuration=${encodeURIComponent(project.solution.replace(' кухня', ''))}&width=${project.dimensions.match(/[\d ]+/)?.[0].replaceAll(' ', '') || 3200}&material=${project.facade.includes('шпон') ? 'veneer' : project.facade.includes('рам') ? 'solid' : 'enamel'}`
    : `/calculator/?type=${project.category === 'wardrobe' ? 'wardrobe' : project.category === 'office' ? 'office' : 'living'}&width=${project.dimensions.match(/[\d ]+/)?.[0].replaceAll(' ', '') || 3200}`;

  return <article className="raCase">
    <section className="raCaseHero">
      <figure data-parallax><Image src={project.image} alt={project.alt} fill priority sizes="100vw" /></figure>
      <header><span>{roomNames[project.category]} · {project.solution}</span><h1>{project.name}</h1><p>{project.description}</p></header>
      <dl><div><dt>Геометрия</dt><dd>{project.dimensions}</dd></div><div><dt>Фасады</dt><dd>{project.facade}</dd></div><div><dt>Сочетание</dt><dd>{project.top}</dd></div></dl>
    </section>

    <section className="raCaseTask raFrame">
      <div><span>Исходная задача</span><h2>{project.task}</h2></div>
      <div><p>Решение начинается не с цвета фасада, а с маршрутов внутри комнаты: где открывается техника, как работает столешница и какие вещи нужны каждый день.</p><dl><div><dt>Пространство</dt><dd>{project.room}</dd></div><div><dt>Главное ограничение</dt><dd>{project.dimensions}</dd></div></dl></div>
    </section>

    <section className="raCaseSpace raFrame">
      <figure data-parallax><Image src={detail.src} alt={detail.alt} fill sizes="(max-width: 760px) 100vw, 62vw" /><figcaption>{detail.caption.replace(/^Референс /, '')}</figcaption></figure>
      <div><span>Логика пространства</span><h2>{project.storage}</h2><p>Фасады и внутренние секции подчинены одной линии. То, что используется постоянно, остаётся рядом; крупные объёмы собираются в спокойный фронт.</p><ol>{project.features.map((feature, featureIndex) => <li key={feature}><span>{String(featureIndex + 1).padStart(2, '0')}</span><p>{feature}</p></li>)}</ol></div>
    </section>

    <section className="raCaseMaterial raFrame">
      <header><span>Материальная пара</span><h2>Поверхность продолжает геометрию.</h2></header>
      <div className="raCaseMaterialBody"><figure data-parallax><Image src={material.src} alt={material.alt} fill sizes="(max-width: 760px) 100vw, 58vw" /><figcaption>{material.caption.replace(/^Референс /, '')}</figcaption></figure><dl><div><dt>Основной фронт</dt><dd>{project.facade}</dd></div><div><dt>Рабочая плоскость</dt><dd>{project.top}</dd></div><div><dt>Хранение</dt><dd>{project.storage}</dd></div><div><dt>Размер</dt><dd>{project.dimensions}</dd></div></dl></div>
    </section>

    <section className="raCaseResult raFrame"><div><span>Результат</span><h2>Один мебельный объём вместо набора отдельных модулей.</h2></div><div><p>Расчёт похожего решения учитывает тип мебели, общий габарит, материалы, фурнитуру и оснащение. Точные секции появляются после замера.</p><ActionLink href={calculatorHref}>Рассчитать похожее решение</ActionLink></div></section>

    <Link className="raCaseNext" href={`/projects/${next.slug}/`}><figure><Image src={next.image} alt="" fill sizes="(max-width: 760px) 34vw, 24vw" /></figure><span>Следующий проект</span><strong>{next.name}</strong><small>{roomNames[next.category]} · {next.solution}</small><Arrow /></Link>
  </article>;
}
