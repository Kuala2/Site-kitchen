'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { projects, roomNames } from '@/data/projects';
import { Arrow } from './DesignSystem';

const filters = [
  ['all', 'Все'], ['kitchen', 'Кухни'], ['wardrobe', 'Гардеробные'],
  ['living', 'Гостиные'], ['office', 'Кабинеты'],
] as const;

export function ProjectGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const raw = params?.get('room') || 'all';
  const room = filters.some(([id]) => id === raw) ? raw : 'all';
  const list = projects.filter((project) => room === 'all' || project.category === room);

  function select(value: string) {
    const next = new URLSearchParams(params?.toString() || '');
    if (value === 'all') next.delete('room'); else next.set('room', value);
    router.push(`${pathname || '/projects'}${next.size ? `?${next}` : ''}`, { scroll: false });
  }

  return (
    <>
      <div className="raArchiveControls">
        <p>Пространство</p>
        <div role="group" aria-label="Фильтр проектов">
          {filters.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={room === id} onClick={() => select(id)}>{label}</button>
          ))}
        </div>
        <span aria-live="polite">{list.length} {list.length === 1 ? 'проект' : list.length < 5 ? 'проекта' : 'проектов'}</span>
      </div>
      {list.length ? (
        <div className="raProjectList">
          {list.map((project, index) => (
            <article className="raProjectRecord" key={project.slug}>
              <Link href={`/projects/${project.slug}/`}>
                <figure data-parallax>
                  <Image src={project.image} alt={project.alt} fill priority={index === 0} sizes="(max-width: 760px) 100vw, 60vw" />
                  <figcaption>{String(index + 1).padStart(2, '0')}</figcaption>
                </figure>
                <div className="raProjectRecordCopy">
                  <span>{roomNames[project.category]} · {project.solution}</span>
                  <h2>{project.name}</h2>
                  <p>{project.task}</p>
                  <dl><div><dt>Материал</dt><dd>{project.facade}</dd></div><div><dt>Габарит</dt><dd>{project.dimensions}</dd></div></dl>
                  <span className="raProjectRecordAction">Открыть проект <Arrow /></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="raArchiveEmpty"><h2>Здесь пока нет совпадений.</h2><button type="button" onClick={() => select('all')}>Показать все проекты</button></div>
      )}
    </>
  );
}
