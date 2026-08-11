import type {Metadata} from 'next';
import {Suspense} from 'react';
import {ContactContext} from '@/components/ContactContext';
import {DemoForm} from '@/components/DemoForm';
import {InteriorHero} from '@/components/InteriorHero';

export const metadata:Metadata={title:'Обсудить мебельный проект — демо-форма',description:'Демонстрационная форма обсуждения мебели для кухни, гардеробной, гостиной, спальни или рабочей зоны.',alternates:{canonical:'/contacts/'}};

export default function Contacts(){return <div className="page immersivePage contactsPage"><InteriorHero image="/images/room-shelves.jpg" alt="Тёмная встроенная система хранения с открытыми полками" eyebrow="Следующий шаг" title="Начать с комнаты, а не с длинной анкеты" lead="Выберите направление, оставьте удобный канал связи и коротко опишите пространство. Черновик кухни или выбранный концепт уже останутся рядом." note="Демо-форма · данные не отправляются" position="center 46%" compact/><section className="contactStage section"><div className="contactStageIntro"><p className="eyebrow">Предметный разговор</p><h2>Что уже известно — прикладываем. Остальное уточняется потом.</h2><p>Форма показывает будущий сценарий обращения, но ничего не отправляет и не сохраняет персональные данные.</p></div><div className="contactGrid contactGrid--refined"><Suspense fallback={<div className="contactForm">Загружаем черновик…</div>}><DemoForm/></Suspense><Suspense fallback={null}><ContactContext/></Suspense></div></section></div>}
