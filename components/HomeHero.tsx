import Image from 'next/image';
import { ActionLink } from './DesignSystem';

export function HomeHero() {
  return (
    <section className="homeHero">
      <div className="homeHeroMedia">
        <Image
          src="/images/room-living.jpg"
          alt="Гостиная с камином и встроенной системой хранения"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="homeHeroCopy">
        <p className="sectionLabel">Мебель как часть архитектуры</p>
        <h1>Точность,<br />которую видно<br />в тишине.</h1>
        <p>Проектируем кухни и встроенные системы без модульных ограничений — под геометрию конкретного пространства.</p>
        <div className="heroActions">
          <ActionLink href="/projects/">Смотреть решения</ActionLink>
          <ActionLink href="/calculator/" variant="line">Узнать ориентир</ActionLink>
        </div>
      </div>
      <div className="heroProof" aria-label="Ключевые особенности">
        <span>Собственное проектирование</span>
        <span>Нижний Новгород · производство и монтаж</span>
        <span>Точность примыканий до 1 мм</span>
      </div>
    </section>
  );
}
