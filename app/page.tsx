import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ActionLink, Arrow } from '@/components/DesignSystem';
import { projects, roomNames } from '@/data/projects';

export const metadata: Metadata = { title: 'Мебель как часть архитектуры', description: 'Кухни, гардеробные и встроенные системы по индивидуальной геометрии пространства.', alternates: { canonical: '/' } };

const range = ['graphite-block', 'quiet-wardrobe', 'work-niche'].map((slug) => projects.find((project) => project.slug === slug)!);
const featured = projects.find((project) => project.slug === 'walnut-line')!;

export default function Home() {
  return <article className="raHome">
    <div className="raHomeHeroStage"><section className="raHomeHero" data-motion-hero>
      <Image src="/images/editorial-11.jpg" alt="Тёмная встроенная кухня с цельной линией фасадов и рабочей поверхностью" fill priority sizes="100vw" />
      <div className="raHomeHeroShade" />
      <div className="raHomeHeroCopy">
        <h1>Точность,<br />которую видно<br />в тишине.</h1>
        <p>Проектируем кухни и встроенные системы без модульных ограничений — под геометрию конкретного пространства.</p>
        <div className="raHomeHeroActions"><ActionLink href="/projects/">Смотреть проекты</ActionLink><ActionLink href="/calculator/" variant="inverse">Рассчитать ориентир</ActionLink></div>
      </div>
      <nav className="raHomeHeroRail" aria-label="Быстрые разделы">
        <Link href="/projects/"><span className="raHeroRailDesktop">Проекты по комнатам</span><span className="raHeroRailMobile">Проекты</span><Arrow /></Link>
        <Link href="/materials/"><span className="raHeroRailDesktop">Материалы и отделки</span><span className="raHeroRailMobile">Материалы</span><Arrow /></Link>
        <Link href="/about/"><span>Как проходит работа</span><Arrow /></Link>
        <Link href="/calculator/"><span>Рассчитать ориентир</span><Arrow /></Link>
      </nav>
    </section></div>

    <section className="raHomeThesis raFrame">
      <header><span>Почему на заказ</span><h2>Сначала задача и пространство. Потом — мебель.</h2><p>Комната не обязана подчиняться типовой сетке. Мы начинаем с маршрутов движения, света, открываний и вещей, которые должны исчезнуть из поля зрения.</p></header>
      <div className="raHomeThesisEvidence" aria-label="Сравнение типовой мебельной сетки и проектирования по геометрии комнаты">
        <div className="raPlanIntro"><span>План помещения · 18,6 м²</span><strong>Одна геометрия.<br />Два результата.</strong><p>Типовые модули оставляют случайные зазоры. Индивидуальная линия связывает хранение, проход и архитектуру.</p></div>
        <div className="raPlanPair">
          <article className="raPlan raPlan--module"><header><span>Типовая сетка</span><b>600 / 800</b></header><div className="raPlanCanvas"><i className="wall wall--a" /><i className="wall wall--b" /><i className="door" /><i className="unit unit--1" /><i className="unit unit--2" /><i className="unit unit--3" /><em>170</em><small>неиспользованный зазор</small></div></article>
          <article className="raPlan raPlan--custom"><header><span>По геометрии</span><b>единая линия</b></header><div className="raPlanCanvas"><i className="wall wall--a" /><i className="wall wall--b" /><i className="door" /><i className="unit unit--line" /><i className="route" /><em>900</em><small>чистый проход</small></div></article>
        </div>
      </div>
      <div className="raHomeThesisLedger">
        <article><h3>Архитектура</h3><p>Фронты, ниши и стеновые панели продолжают линии помещения.</p></article>
        <article><h3>Сценарий хранения</h3><p>Внутренние секции строятся от привычек, а не от каталожного модуля.</p></article>
        <article><h3>Материал в масштабе</h3><p>Фактуру проверяем на большой плоскости и рядом с реальным светом.</p></article>
        <article><h3>Один язык дома</h3><p>Кухня, гардеробная и кабинет продолжают друг друга без буквального повтора.</p></article>
      </div>
    </section>

    <section className="raHomeRange raFrame">
      <header><span>Диапазон решений</span><h2>Три пространства.<br />Три разных ответа.</h2><p>Не коллекция фасадов, а разные способы собрать хранение, технику и работу в архитектуру дома.</p></header>
      <div className="raHomeRangeGrid">
        {range.map((project, index) => <article key={project.slug} className={`raHomeRangeItem raHomeRangeItem--${index + 1}`}>
          <Link href={`/projects/${project.slug}/`}><figure data-parallax><Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></figure><div><span>{roomNames[project.category]}</span><h3>{project.name}</h3><p>{project.task}</p><span className="raCardAction">Смотреть проект <Arrow /></span></div></Link>
        </article>)}
      </div>
    </section>

    <section className="raHomeCase">
      <figure data-parallax><Image src={featured.image} alt={featured.alt} fill sizes="(max-width: 760px) 100vw, 64vw" /><figcaption>Ореховый шпон · камень · скрытый профиль</figcaption></figure>
      <div className="raHomeCaseCopy"><span>Разбор решения</span><h2>{featured.name}</h2><p>{featured.description}</p><dl><div><dt>Задача</dt><dd>{featured.task}</dd></div><div><dt>Геометрия</dt><dd>{featured.dimensions}</dd></div><div><dt>Хранение</dt><dd>{featured.storage}</dd></div></dl><ActionLink href={`/projects/${featured.slug}/`} variant="line">Открыть проект</ActionLink></div>
    </section>

    <section className="raHomeMaterial raFrame">
      <header><span>Материал в доме</span><h2>Поверхность меняется вместе со светом.</h2></header>
      <figure data-parallax><Image src="/images/room-shelves.jpg" alt="Тонированный шпон и подсвеченные ниши встроенной системы" fill sizes="(max-width: 760px) 100vw, 58vw" /></figure>
      <div><p>Шпон, эмаль и камень оцениваем не по маленькой плашке. Смотрим рисунок на фронте, кромку, соседство с металлом и то, как поверхность ведёт себя утром и вечером.</p><ActionLink href="/materials/" variant="line">Открыть лабораторию</ActionLink></div>
    </section>

    <section className="raHomeProcess" data-process-progress>
      <div className="raHomeProcessMedia"><Image src="/images/editorial-11.jpg" alt="Тёмная встроенная кухня с ровной сеткой фасадов и точными примыканиями" fill sizes="100vw" /></div>
      <div className="raHomeProcessHead raFrame"><span>Процесс</span><h2>Четыре контролируемых перехода.</h2></div>
      <ol className="raFrame">{[
        ['Диалог и эскиз', 'Фиксируем помещение, привычки и задачу хранения.'],
        ['Архитектурный замер', 'Проверяем углы, выводы, проходы и линии примыканий.'],
        ['Проект и производство', 'Собираем спецификацию, материалы и контрольные узлы.'],
        ['Чистовой монтаж', 'Сводим мебель с архитектурой помещения и проверяем механизмы.'],
      ].map(([title, text], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
    </section>

    <section className="raHomeDecision raFrame">
      <div><span>Предварительный ориентир</span><h2>Понять порядок бюджета до встречи.</h2><p>Пять коротких шагов: тип мебели, конфигурация, размеры, материалы и оснащение.</p><ActionLink href="/calculator/">Рассчитать ориентир</ActionLink></div>
      <aside><p>Для разговора достаточно плана, нескольких фотографий или примерных размеров.</p><Link href="/contacts/">Обсудить пространство <Arrow /></Link></aside>
    </section>
  </article>;
}
