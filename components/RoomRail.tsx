'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRef} from 'react';

const rooms=[
  {name:'Кухни',note:'Рабочая линия, техника и хранение',image:'/images/unsplash-3.jpg',alt:'Светлая кухонная рабочая зона в естественном свете',href:'/projects/?room=kitchen'},
  {name:'Гардеробные',note:'Фронт, наполнение и ежедневные маршруты',image:'/images/room-bedroom-wood.jpg',alt:'Спальня с белым встроенным шкафом и деревянной панелью',href:'/projects/?room=wardrobe'},
  {name:'Гостиные',note:'Стеновые системы, витрины и техника',image:'/images/room-living-wide.jpg',alt:'Общая комната с длинной системой деревянного хранения',href:'/projects/?room=living'},
  {name:'Спальни',note:'Закрытые объёмы и спокойный свет',image:'/images/room-bedroom.jpg',alt:'Современная спальня со встроенным шкафом и рабочей нишей',href:'/projects/quiet-wardrobe/'},
  {name:'Прихожие',note:'Быстрый доступ и глубина хранения',image:'/images/room-shelves.jpg',alt:'Высокая встроенная система с закрытыми нижними секциями',href:'/contacts/?room=entry'},
  {name:'Рабочие зоны',note:'Стол, документы и техника в одной нише',image:'/images/room-office-warm.jpg',alt:'Домашняя рабочая зона со столом и настенными секциями',href:'/projects/?room=office'}
] as const;

export function RoomRail(){
  const rail=useRef<HTMLDivElement>(null);
  const move=(direction:number)=>rail.current?.scrollBy({left:direction*Math.min(rail.current.clientWidth*.72,620),behavior:'smooth'});
  return <section className="roomSection section" aria-labelledby="rooms-title">
    <div className="roomSectionHead"><div><p className="eyebrow">Навигация по дому</p><h2 id="rooms-title">Мебель по комнатам</h2></div><p>Не большой каталог, а шесть точек входа: от кухни и гардеробной до рабочей ниши.</p><div className="railArrows desktopOnly"><button type="button" onClick={()=>move(-1)} aria-label="Показать предыдущие комнаты">←</button><button type="button" onClick={()=>move(1)} aria-label="Показать следующие комнаты">→</button></div></div>
    <div className="roomRail" ref={rail}>{rooms.map((room,index)=><Link className={`roomCard roomCard--${index%3}`} href={room.href} prefetch={false} key={room.name}><div className="roomCardImage"><Image src={room.image} alt={room.alt} fill sizes="(max-width: 700px) 78vw, 34vw"/></div><span className="roomIndex">{String(index+1).padStart(2,'0')}</span><h3>{room.name}</h3><p>{room.note}</p><b aria-hidden="true">↗</b></Link>)}</div>
  </section>;
}
