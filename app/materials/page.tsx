import type { Metadata } from 'next';
import { MaterialsExplorer } from '@/components/MaterialsExplorer';
import { MaterialScrollStory } from '@/components/MaterialScrollStory';
import { ActionLink } from '@/components/DesignSystem';

export const metadata: Metadata = { title: 'Лаборатория материалов', description: 'Фасады, столешницы и фурнитура в масштабе мебельной композиции.', alternates: { canonical: '/materials/' } };

export default function Materials() {
  return <article className="raMaterials">
    <section className="raMaterialLab raFrame">
      <header><div><span>Лаборатория материалов</span><h1>Материал проверяют в масштабе дома.</h1></div><p>Сравнивайте фасады, столешницы и фурнитуру рядом с крупной плоскостью, светом и соседними фактурами.</p></header>
      <MaterialsExplorer />
    </section>

    <MaterialScrollStory />

    <section className="raMaterialRequest raFrame"><div><span>Следующий шаг</span><h2>Соберём набор материалов для вашего пространства.</h2></div><div><p>На встрече образцы смотрят рядом и при разном свете. Экран остаётся только первым ориентиром.</p><ActionLink href="/contacts/" variant="line">Записаться на просмотр</ActionLink></div></section>
  </article>;
}
