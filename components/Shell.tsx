'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/data/site';
import { Arrow } from './DesignSystem';

const links = [
  ['/projects/', 'Проекты'],
  ['/materials/', 'Материалы'],
  ['/about/', 'Процесс'],
  ['/calculator/', 'Стоимость'],
  ['/contacts/', 'Контакты'],
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const isHome = pathname === '/';

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }
    const updateHeader = () => setScrolled(window.scrollY > 16);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, [isHome]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>('a')?.focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
      if (event.key !== 'Tab') return;
      const panelItems = [...(panel.current?.querySelectorAll<HTMLElement>('a,button') || [])];
      const items = button.current ? [...panelItems, button.current] : panelItems;
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', keydown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', keydown);
    };
  }, [open]);

  const active = (href: string) => {
    const section = href.replace(/^\//, '').replace(/\/$/, '');
    const current = (pathname || '/').replace(/^\//, '').split('/')[0];
    return current === section;
  };

  return (
    <header className={`siteHeader${isHome ? ' siteHeader--home' : ''}${scrolled ? ' siteHeader--scrolled' : ''}${open ? ' siteHeader--open' : ''}`}>
      <Link className="brand" href="/" aria-label="СЛОЙ 52 — главная">
        <b>СЛОЙ 52</b>
        <span>Ателье мебели · Нижний Новгород</span>
      </Link>
      <nav ref={panel} className="mainNav" aria-label="Основная навигация" id="main-nav">
        {links.map(([href, label]) => (
          <Link key={href} href={href} aria-current={active(href) ? 'page' : undefined}>
            {label}
          </Link>
        ))}
        <Link className="mobileProjectLink" href="/contacts/">Обсудить проект <Arrow /></Link>
      </nav>
      <Link className="headerAction" href="/contacts/">
        <span>Обсудить проект</span><Arrow />
      </Link>
      <button
        ref={button}
        className="menuButton"
        type="button"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Закрыть' : 'Меню'}
      </button>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerLead">
        <Link className="brand brand--light" href="/">
          <b>СЛОЙ 52</b><span>Ателье мебели · Нижний Новгород</span>
        </Link>
        <h2>Мебель как часть архитектуры.</h2>
      </div>
      <div className="footerGrid">
        <div>
          <p className="footerLabel">Навигация</p>
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </div>
        <div>
          <p className="footerLabel">Связь</p>
          <p>{siteConfig.phoneDisplay}</p>
          <p>{siteConfig.email}</p>
          <p>{siteConfig.region}</p>
          <p className="demoDisclaimer">Демонстрационный проект — контактные данные вымышлены</p>
        </div>
        <div>
          <p className="footerLabel">О проекте</p>
          <p>{siteConfig.description}</p>
        </div>
      </div>
      <div className="footerBottom">
        <span>© 2026 СЛОЙ 52</span>
        <span>Нижний Новгород · проектирование, производство и монтаж</span>
      </div>
    </footer>
  );
}
