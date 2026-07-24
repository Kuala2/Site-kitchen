'use client';

import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {demoNote,siteConfig} from '@/data/site';

const links=[['/projects','Проекты'],['/materials','Материалы'],['/about','Как работаем'],['/calculator','Расчёт кухни']];

export function Header(){
  const [open,setOpen]=useState(false);
  const menuButton=useRef<HTMLButtonElement>(null);
  const navigation=useRef<HTMLElement>(null);
  const close=()=>setOpen(false);

  useEffect(()=>{
    if(!open)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){event.preventDefault();close();menuButton.current?.focus();return;}
      if(event.key!=='Tab')return;
      const focusable=navigation.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
      if(!focusable?.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    window.addEventListener('keydown',onKeyDown);
    requestAnimationFrame(()=>navigation.current?.querySelector<HTMLElement>('a[href]')?.focus());
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener('keydown',onKeyDown)};
  },[open]);

  return <header className="header"><Link className="logo" href="/">СЛОЙ <b>52</b></Link><button ref={menuButton} className="menuBtn" aria-expanded={open} aria-controls="nav" onClick={()=>setOpen(value=>!value)}>{open?'Закрыть':'Меню'}</button><nav ref={navigation} id="nav" className={open?'nav open':'nav'} aria-label="Основная навигация">{links.map(([href,label])=><Link key={href} href={href} onClick={close}>{label}</Link>)}<Link className="button small" href="/contacts" onClick={close}>Обсудить проект</Link></nav></header>;
}

export function Footer(){return <footer><div><Link className="logo inverse" href="/">СЛОЙ <b>52</b></Link><p>{siteConfig.region}</p></div><nav aria-label="Навигация в подвале">{links.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}<Link href="/contacts">Контакты</Link><Link href="/about">О проекте</Link></nav><p className="demoFooter">{demoNote}<br/>Все изображения и параметры используются для портфолио разработчика.</p></footer>}
