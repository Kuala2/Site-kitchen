'use client';

import {useMemo} from 'react';
import {useSearchParams} from 'next/navigation';
import {defaults,dimensionSummary,parse} from '@/lib/configurator';
import {KitchenDiagram} from './KitchenDiagram';

const layoutNames={straight:'Прямая кухня',corner:'Угловая кухня',u:'П-образная кухня',island:'Прямая кухня с островом'} as const;

export function ContactContext(){
  const params=useSearchParams(),config=useMemo(()=>parse(params.toString()),[params]),scenario=config||defaults;
  const title=config?`${layoutNames[config.layout]} · ${dimensionSummary(config)}`:'Стартовый сценарий · прямая кухня';
  return <aside className="contactContext">
    <div className="contactSketch"><KitchenDiagram config={scenario}/><span>{title}</span></div>
    <p className="eyebrow">Что будет дальше</p><h2>{config?'Ваш сценарий уже в работе':'Начнём с понятной отправной точки'}</h2>
    <ol className="contactSteps"><li><span>01</span><div><b>Сверяем вводные</b><p>{config?'Планировка, зоны и материалы из вашего расчёта уже приложены.':'Размеры, техника и задачи хранения — без лишней анкеты.'}</p></div></li><li><span>02</span><div><b>Находим рабочую планировку</b><p>Обсуждаем, что сохранить в сценарии и что изменить.</p></div></li><li><span>03</span><div><b>Фиксируем следующий шаг</b><p>Понятно, какие данные и решения нужны для проекта.</p></div></li></ol>
    <p className="contactFine">Можно приложить фото помещения, но для первого разговора это не обязательно.</p><p className="contactPrivacy">Демо-форма не отправляет и не сохраняет персональные данные.</p>
  </aside>;
}
