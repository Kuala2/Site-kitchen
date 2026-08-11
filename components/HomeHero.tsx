'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';

const slides=[
  {image:'/images/editorial-11.jpg',alt:'Тёмная встроенная кухня с цельной линией хранения',kicker:'Кухня и общая зона',title:'Мебель, собранная вокруг пространства',text:'Кухня, хранение и материалы читаются как части одной архитектуры.',href:'/projects/?room=kitchen'},
  {image:'/images/room-wardrobe.jpg',alt:'Спальня с длинным фронтом встроенных шкафов',kicker:'Гардеробная и спальня',title:'Хранение начинается с планировки',text:'Сначала проходы, глубина и ежедневные вещи. Затем — цвет и фактура.',href:'/projects/quiet-wardrobe/'},
  {image:'/images/room-living.jpg',alt:'Гостиная с камином и встроенными полками',kicker:'Гостиная и рабочая зона',title:'Одна логика для разных комнат',text:'Закрытые объёмы, открытые полки и рабочие ниши связывают дом без повторов.',href:'/projects/living-contour/'}
] as const;

export function HomeHero(){
  const [active,setActive]=useState(0);
  const [paused,setPaused]=useState(false);
  const [manual,setManual]=useState(false);
  const section=useRef<HTMLElement>(null);
  useEffect(()=>{
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce||paused||manual)return;
    const timer=window.setInterval(()=>setActive(value=>(value+1)%slides.length),7000);
    return()=>window.clearInterval(timer);
  },[paused,manual]);
  const choose=(index:number)=>{setActive(index);setManual(true)};
  const slide=slides[active];
  return <section ref={section} className="homeHero" aria-roledescription="карусель" aria-label="Решения для разных комнат" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={event=>{if(!section.current?.contains(event.relatedTarget as Node))setPaused(false)}}>
    <div className="homeHeroMedia">{slides.map((item,index)=><Image key={item.image} className={index===active?'heroSlide active':'heroSlide'} src={item.image} alt={index===active?item.alt:''} fill priority={index===0} loading={index===0?'eager':'lazy'} fetchPriority={index===0?'high':'auto'} sizes="100vw" aria-hidden={index!==active}/>)}</div>
    <div className="homeHeroShade"/>
    <div className="homeHeroContent" aria-live="polite">
      <p className="eyebrow">{slide.kicker}</p>
      <h1>{slide.title}</h1>
      <p className="heroLead">{slide.text}</p>
      <div className="heroActions"><Link className="button lightButton" href={slide.href}>Смотреть решения</Link><Link className="textButton lightTextButton" href="/calculator/">Прикинуть бюджет кухни</Link></div>
      <p className="heroDemo">Демонстрационный проект сайта для производителя мебели на заказ</p>
    </div>
    <div className="heroControls"><span className="heroCount">{String(active+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</span><div role="group" aria-label="Выбор слайда">{slides.map((item,index)=><button key={item.title} type="button" aria-label={`Слайд ${index+1}: ${item.kicker}`} aria-pressed={index===active} onClick={()=>choose(index)}><span>{String(index+1).padStart(2,'0')}</span></button>)}</div></div>
    <div className="heroFacts"><span>Решения по комнатам</span><span>Материалы рядом с проектом</span><span>Предварительный расчёт кухни</span><span>Черновик сохраняется</span></div>
  </section>;
}
