'use client';

import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {usePathname} from 'next/navigation';
import {demoNote,siteConfig} from '@/data/site';

const links=[['/projects/','Проекты'],['/materials/','Материалы'],['/about/','Как начинается проект'],['/calculator/','Расчёт кухни']];

export function Header(){
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const pathname=usePathname();
  const isHome=pathname==='/';
  const menuButton=useRef<HTMLButtonElement>(null);
  const navigation=useRef<HTMLElement>(null);
  const close=()=>setOpen(false);

  useEffect(()=>{
    const update=()=>setScrolled(window.scrollY>48);
    update();window.addEventListener('scroll',update,{passive:true});
    return()=>window.removeEventListener('scroll',update);
  },[]);

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

  const active=(href:string)=>href==='/projects/'?pathname==='/projects'||pathname.startsWith('/projects/'):pathname===href.slice(0,-1);
  const classes=['header',isHome?'header--home':'',scrolled?'header--scrolled':'',open?'header--menu-open':''].filter(Boolean).join(' ');
  return <header className={classes}><Link className="logo" href="/" aria-label="СЛОЙ 52 — главная">СЛОЙ <b>52</b></Link><div className="headerActions"><Link className="headerContact" href="/contacts/">Обсудить</Link><button ref={menuButton} className="menuBtn" aria-expanded={open} aria-controls="nav" onClick={()=>setOpen(value=>!value)}>{open?'Закрыть':'Меню'}</button></div><nav ref={navigation} id="nav" className={open?'nav open':'nav'} aria-label="Основная навигация">{links.map(([href,label])=><Link key={href} href={href} aria-current={active(href)?'page':undefined} onClick={close}>{label}</Link>)}<Link className="button small" href="/contacts/" aria-current={pathname==='/contacts'?'page':undefined} onClick={close}>Обсудить проект</Link></nav></header>;
}

export function Footer(){return <footer><div><Link className="logo inverse" href="/">СЛОЙ <b>52</b></Link><p>{siteConfig.region}</p><p className="footerAuthor">Концепция и разработка · George</p></div><nav aria-label="Навигация в подвале">{links.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}<Link href="/contacts/">Контакты</Link></nav><p className="demoFooter">{demoNote}<br/>Изображения — лицензированные референсы, параметры и проекты — демонстрационные. Реальному производителю понадобятся собственные проекты, материалы, контакты и производственные данные.</p></footer>}
