'use client';

import {FormEvent,useMemo,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {calculate,dimensionSummary,parse} from '@/lib/configurator';
import {facades,countertops} from '@/data/materials';

const layoutNames={straight:'Прямая',corner:'Угловая',u:'П-образная',island:'С островом'} as const;

export function DemoForm(){
  const [sent,setSent]=useState(false);
  const params=useSearchParams();
  const config=useMemo(()=>parse(params.toString()),[params]);
  const result=config?calculate(config):null;
  function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();event.currentTarget.reset();setSent(true)}
  return <div><form className="contactForm" onSubmit={submit}>{config&&result&&<ConfigSummary config={config} low={result.low} high={result.high}/>}<p className="notice">Демо-режим: данные не сохраняются и никуда не отправляются.</p><label>Имя<input name="name" required autoComplete="name"/></label><label>Способ связи<input name="contact" required placeholder="Телефон, почта или мессенджер"/></label><label>Комментарий <small>необязательно</small><textarea name="message" rows={5}/></label><button className="button" type="submit">Показать демо-ответ</button><p className="status" aria-live="polite">{sent?'Спасибо. Это локальный демонстрационный ответ — данные очищены и не были отправлены.':''}</p></form><p className="contactNote">В рабочей версии на этом месте подключаются согласие, политика обработки данных и передача обращения в CRM.</p></div>;
}

function ConfigSummary({config,low,high}:{config:NonNullable<ReturnType<typeof parse>>;low:number;high:number}){
  const facade=facades.find(item=>item.id===config.facade)?.name;
  const top=countertops.find(item=>item.id===config.top)?.name;
  return <section className="contactSummary" aria-label="Параметры из расчёта"><p className="eyebrow">Черновик из расчёта</p><h2>Параметры уже рядом</h2><dl><div><dt>Планировка</dt><dd>{layoutNames[config.layout]}</dd></div><div><dt>Размеры</dt><dd>{dimensionSummary(config)}</dd></div><div><dt>Фасад</dt><dd>{facade}</dd></div><div><dt>Столешница</dt><dd>{top}</dd></div><div><dt>Комплектация</dt><dd>{config.options.length?config.options.length+' поз.':'без дополнительных позиций'}</dd></div><div><dt>Ориентир</dt><dd>{budgetRange(low,high)}</dd></div></dl></section>;
}

function budgetRange(low:number,high:number){return `${formatBudget(low)}–${formatBudget(high)}`}
function formatBudget(value:number){return value>=1_000_000?`${(value/1_000_000).toFixed(1).replace('.',',')} млн ₽`:`${Math.round(value/1_000)} тыс. ₽`}
