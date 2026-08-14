import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectGrid } from '@/components/ProjectGrid';
import { ActionLink } from '@/components/DesignSystem';

export const metadata: Metadata = { title: 'Проекты', description: 'Каталог кухонь, гардеробных и встроенных мебельных систем.', alternates: { canonical: '/projects/' } };

export default function Projects() {
  return <article className="raProjects">
    <header className="raArchiveHead raFrame"><div><span>Архив решений</span><h1>Проекты для конкретного пространства.</h1></div><p>Выберите тип помещения и откройте кейс: внутри — задача, геометрия, материалы, хранение и узлы.</p></header>
    <section className="raArchive raFrame"><Suspense fallback={<p>Загружаем проекты…</p>}><ProjectGrid /></Suspense></section>
    <section className="raArchitectInvite raFrame"><div><span>Для архитекторов и дизайнеров</span><h2>Работаем от чертежа и авторской идеи.</h2></div><div><p>Пришлите план, развёртки и спецификацию. На первом разговоре определим вопросы, которые влияют на производство и монтаж.</p><ActionLink href="/contacts/?room=office" variant="line">Отправить проект</ActionLink></div></section>
  </article>;
}
