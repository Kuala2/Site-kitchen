import Image from 'next/image';

const checks = [
  {
    image: '/images/editorial-13.jpg',
    alt: 'Ореховый шпон и камень в рабочей нише',
    title: 'Рисунок на большой плоскости',
    text: 'Смотрим, как повторяется рисунок шпона, насколько ровно нанесён тон и как фасад меняется при боковом свете.',
    note: 'Шпон · камень · встроенный свет',
  },
  {
    image: '/images/room-shelves.jpg',
    alt: 'Встроенная мебель при тёплом вечернем свете',
    title: 'Поверхность в ежедневном использовании',
    text: 'Проверяем места постоянного касания, очистку и влагу. Материал должен сохранять спокойный вид не только в день установки.',
    note: 'Касание · очистка · влага',
  },
  {
    image: '/images/room-living-detail.jpg',
    alt: 'Точное примыкание мебельных поверхностей',
    title: 'Стык, кромка и примыкание',
    text: 'Сопоставляем толщину кромки, профиль и зазор с соседними материалами. Именно в стыке отделка становится частью комнаты.',
    note: 'Кромка · зазор · профиль',
  },
];

export function MaterialScrollStory() {
  return <section className="raMaterialStory raFrame">
    <header><span>Проверка в интерьере</span><h2>Материал выбирают не по маленькому образцу.</h2><p>Каждую поверхность рассматриваем в трёх условиях, которые влияют на результат.</p></header>
    <div className="raMaterialStoryList">
      {checks.map((check, index) => <article key={check.title}>
        <figure><Image src={check.image} alt={check.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>{check.note}</figcaption></figure>
        <div><span>{String(index + 1).padStart(2, '0')}</span><h3>{check.title}</h3><p>{check.text}</p></div>
      </article>)}
    </div>
  </section>;
}
