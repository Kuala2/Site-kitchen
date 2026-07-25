import type {Metadata} from 'next';
import {Suspense} from 'react';
import {ContactContext} from '@/components/ContactContext';
import {DemoForm} from '@/components/DemoForm';

export const metadata:Metadata={title:'Обсудить проект — демо-форма',description:'Демонстрационная форма обсуждения конфигурации кухни.',alternates:{canonical:'/contacts'}};

export default function Contacts(){return <div className="page section"><div className="pageHead contactPageHead"><p className="eyebrow">Следующий шаг</p><div><h1>Обсудить проект</h1><p className="pageLead">Не анкета ради анкеты, а начало предметного разговора о вашей кухне. Черновик из калькулятора уже остаётся рядом.</p></div><p>Достаточно оставить удобный канал связи и пару слов о пространстве — остальное уточняется в диалоге.</p></div><div className="contactGrid contactGrid--refined"><Suspense fallback={<div className="contactForm">Загружаем черновик…</div>}><DemoForm/></Suspense><Suspense fallback={null}><ContactContext/></Suspense></div></div>}
