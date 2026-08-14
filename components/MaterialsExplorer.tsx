'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { facades, countertops, handles } from '@/data/materials';
import { Arrow } from './DesignSystem';

type Group = 'facade' | 'top' | 'handle';
const groupLabels: Record<Group, string> = { facade: 'Фасады', top: 'Столешницы', handle: 'Фурнитура' };
const descriptions: Record<string, string> = {
  paint: 'Ровная спокойная плоскость. Подходит для сложного цвета и цельного архитектурного фронта.',
  'light-veneer': 'Живой рисунок дерева работает рядом с дневным светом и мягкими нейтральными поверхностями.',
  'dark-veneer': 'Глубокий тон подчёркивает линии примыканий и требует внимательной раскладки шпона.',
  frame: 'Рельефный фасад даёт более камерный ритм и заметнее реагирует на боковой свет.',
  compact: 'Тонкий профиль и практичная кромка для лаконичной рабочей линии.',
  stone: 'Пластичный материал для спокойных стыков и интегрированных решений.',
  quartz: 'Выраженная минеральная поверхность с высокой бытовой стойкостью.',
  profile: 'Линия захвата без выступающей ручки сохраняет цельность фасада.',
  bar: 'Металлическая скоба становится точным графическим акцентом.',
  knob: 'Компактная ручка подходит для рамочного или более предметного фасада.',
};

export function MaterialsExplorer() {
  const [group, setGroup] = useState<Group>('facade');
  const [selected, setSelected] = useState({ facade: 'light-veneer', top: 'quartz', handle: 'profile' });
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem('sloy52-material-lab') || 'null'); if (saved?.facade) setSelected(saved); } catch {} }, []);
  useEffect(() => { localStorage.setItem('sloy52-material-lab', JSON.stringify(selected)); }, [selected]);
  const items = group === 'facade' ? facades : group === 'top' ? countertops : handles;
  const current = items.find((item) => item.id === selected[group]) || items[0];
  const sampleLabel = group === 'facade' ? 'Образец фасада' : group === 'top' ? 'Образец столешницы' : 'Схема фурнитуры';
  return <div className="materialWorkbench">
    <nav aria-label="Разделы лаборатории">{(Object.keys(groupLabels) as Group[]).map((id) => <button key={id} type="button" aria-pressed={group === id} onClick={() => setGroup(id)}>{groupLabels[id]}</button>)}</nav>
    <div className="materialOptions"><p className="sectionLabel">Лаборатория</p>{items.map((item) => <button key={item.id} type="button" aria-pressed={selected[group] === item.id} onClick={() => setSelected((value) => ({ ...value, [group]: item.id }))}>{item.name}</button>)}<Link href={`/calculator/?material=${selected.facade === 'paint' ? 'enamel' : selected.facade === 'frame' ? 'solid' : 'veneer'}&worktop=${encodeURIComponent(countertops.find((item) => item.id === selected.top)?.name || '')}`}>Использовать в расчёте <Arrow /></Link></div>
    <figure className={`materialPreview materialPreview--${group}`}>
      <div className="materialPreviewHeading"><span>{sampleLabel}</span><strong>{current.name}</strong></div>
      <div className={`materialSpecimen materialSpecimen--${current.id}`} aria-hidden="true">
        {group === 'facade' && <><i /><i /><i /><i /></>}
        {group === 'top' && <><i className="materialSlabEdge" /><i className="materialSlabLine" /></>}
        {group === 'handle' && <><i className="materialDoorLine" /><i className="materialHandle" /></>}
      </div>
      <figcaption><span>{groupLabels[group]}</span><strong>{current.note}</strong></figcaption>
    </figure>
    <aside><p className="sectionLabel">Выбранный материал</p><h2>{current.name}</h2><p>{descriptions[current.id]}</p><dl><div><dt>Подходит</dt><dd>{group === 'facade' ? 'Для крупных фасадов, стеновых панелей и встроенных объёмов.' : group === 'top' ? 'Для рабочих поверхностей и спокойных примыканий.' : 'Для выбранного характера открывания и ритма фасадов.'}</dd></div><div><dt>Проверяем</dt><dd>Реальный цвет, стык, свет и уход — только на физическом образце.</dd></div></dl></aside>
  </div>;
}
