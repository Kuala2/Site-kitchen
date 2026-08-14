import type { Metadata } from 'next';
import Image from 'next/image';
import { ActionLink } from '@/components/DesignSystem';

export const metadata: Metadata = { title: 'Процесс и производство', description: 'От первого разговора до чистового монтажа мебели.', alternates: { canonical: '/about/' } };

const chapters = [
  ['Диалог и эскиз', 'Комната, привычки и ограничения превращаются в рабочую гипотезу.', '/images/room-office-warm.jpg'],
  ['Архитектурный замер', 'Фиксируем геометрию стен, углы, выводы, открывания и проходы.', '/images/room-office.jpg'],
  ['Проект и материалы', 'Сводим внутренние секции, фасады, камень, профиль и свет в одну спецификацию.', '/images/room-living-wide.jpg'],
  ['Производство и контроль', 'Проверяем размеры, рисунок материала и ключевые узлы до выезда на объект.', '/images/editorial-11.jpg'],
  ['Чистовой монтаж', 'Собираем мебель, сводим примыкания и проверяем работу механизмов.', '/images/room-living-detail.jpg'],
];

export default function About() {
  return <article className="raAbout">
    <section className="raAboutLead">
      <figure><Image src="/images/room-office-warm.jpg" alt="Точно собранная встроенная рабочая система из эмали и дерева" fill priority sizes="100vw" /></figure>
      <div><span>Процесс и контроль</span><h1>Точность начинается до производства.</h1><p>Готовый результат зависит от того, насколько последовательно проверены исходные данные, материалы и узлы.</p></div>
    </section>

    <section className="raAboutProof raFrame"><header><span>Принцип работы</span><h2>Контролируем не обещание, а каждый переход.</h2></header><div><p>Один миллиметр важен только тогда, когда он привязан к чертежу, фактической стене и понятной ответственности между проектом, производством и монтажом.</p><dl><div><dt>1 мм</dt><dd>контролируемая точность примыкания</dd></div><div><dt>1 документ</dt><dd>чертёж, материалы и комплектация в одной версии</dd></div></dl></div></section>

    <section className="raProcessJournal raFrame" data-process-progress><header><span>Журнал проекта</span><h2>Пять точек, где решение становится точнее.</h2></header><div>{chapters.map(([title, text, image], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div><figure data-parallax><Image src={image} alt={`Этап проекта: ${title}`} fill sizes="(max-width: 760px) 100vw, 38vw" /></figure></article>)}</div></section>

    <section className="raQualityLedger raFrame"><header><span>Перед передачей объекта</span><h2>Проверяем не только фасад.</h2></header><ul><li>соответствие чертежу и спецификации;</li><li>рисунок шпона и направление текстуры;</li><li>геометрию зазоров, открываний и примыканий;</li><li>работу механизмов и встроенного света;</li><li>чистоту монтажа и передачу готового объекта.</li></ul><ActionLink href="/contacts/" variant="line">Обсудить текущий этап</ActionLink></section>
  </article>;
}
