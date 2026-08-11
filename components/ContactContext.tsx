'use client';

import {useMemo} from 'react';
import {useSearchParams} from 'next/navigation';
import {defaults,dimensionSummary,parse} from '@/lib/configurator';
import {KitchenDiagram} from './KitchenDiagram';
import {FurniturePlan} from './FurniturePlan';
import {projects} from '@/data/projects';

const layoutNames={straight:'Прямая кухня',corner:'Угловая кухня',u:'П-образная кухня',island:'Прямая кухня с островом'} as const;

export function ContactContext(){
  const params=useSearchParams(),hasKitchenConfig=['layout','a','facade','top'].some(key=>params.has(key)),config=useMemo(()=>hasKitchenConfig?parse(params.toString()):null,[params,hasKitchenConfig]),scenario=config||defaults,concept=projects.find(project=>project.slug===params.get('concept'));
  const title=config?`${layoutNames[config.layout]} · ${dimensionSummary(config)}`:concept?`${concept.solution} · ${concept.dimensions}`:'Стартовый сценарий · мебельная композиция';
  return <aside className="contactContext">
    <div className="contactSketch">{config?<KitchenDiagram config={scenario}/>:<FurniturePlan type={concept?.composition||'storage'} label="Условная схема для обсуждения мебельного проекта"/>}<span>{title}</span></div>
    <p className="eyebrow">Что будет дальше</p><h2>{config||concept?'Контекст уже рядом':'Начнём с понятной отправной точки'}</h2>
    <ol className="contactSteps"><li><span>01</span><div><b>Сверяем вводные</b><p>{config?'Планировка, зоны и материалы из расчёта уже приложены.':concept?`Концепт «${concept.name}» приложен как отправная точка.`:'Размеры, комната и задачи хранения — без лишней анкеты.'}</p></div></li><li><span>02</span><div><b>Находим рабочую планировку</b><p>Обсуждаем, что сохранить в сценарии и что изменить.</p></div></li><li><span>03</span><div><b>Фиксируем следующий шаг</b><p>Понятно, какие данные и решения нужны для проекта.</p></div></li></ol>
    <p className="contactFine">Можно приложить фото помещения, но для первого разговора это не обязательно.</p><p className="contactPrivacy">Демо-форма не отправляет и не сохраняет персональные данные.</p>
  </aside>;
}
