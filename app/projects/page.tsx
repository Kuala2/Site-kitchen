import type {Metadata} from 'next';
import Image from 'next/image';
import {Suspense} from 'react';
import {ProjectGrid} from '@/components/ProjectGrid';

export const metadata:Metadata={title:'Концепты мебели для разных комнат',description:'Девять демонстрационных концептов кухонь, гардеробных, гостиных и рабочих зон.',alternates:{canonical:'/projects/'}};

export default function Projects(){return <div className="page section"><div className="pageHead pageHeadVisual"><p className="eyebrow">Комнаты и типы решений</p><div><h1>Девять сценариев для всего дома</h1><p className="pageLead">Фильтруйте по комнате и типу решения. Карточки показывают геометрию, материалы и одну конкретную задачу хранения — без вымышленных клиентов и реализованных объектов.</p></div><figure><Image src="/images/room-living-detail.jpg" alt="Встроенная мебельная ниша с мягкой подсветкой" fill sizes="(max-width: 900px) 100vw, 25vw"/><figcaption>09 концептов · 6 направлений</figcaption></figure></div><Suspense><ProjectGrid/></Suspense></div>}
