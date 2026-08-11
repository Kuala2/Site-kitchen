import type {Metadata} from 'next';
import {Suspense} from 'react';
import {ProjectGrid} from '@/components/ProjectGrid';
import {InteriorHero} from '@/components/InteriorHero';

export const metadata:Metadata={title:'Концепты мебели для разных комнат',description:'Девять демонстрационных концептов кухонь, гардеробных, гостиных и рабочих зон.',alternates:{canonical:'/projects/'}};

export default function Projects(){return <div className="page immersivePage projectsPage"><InteriorHero image="/images/room-living-wide.jpg" alt="Общая комната с протяжённой встроенной системой хранения" eyebrow="Комнаты и типы решений" title="Мебель, которая становится частью комнаты" lead="Девять разных сценариев: от кухни и гардеробной до гостиной и рабочей ниши. Каждый начинается с пространства, а не с готового гарнитура." note="09 концептов · 06 направлений" position="center 55%"/><section className="projectArchive section"><div className="archiveIntro"><p className="eyebrow">Каталог концептов</p><h2>Смотрите не фасад, а всю композицию</h2><p>Фотографии задают характер, схема объясняет геометрию, а подписи фиксируют конкретную задачу хранения. Все проекты остаются демонстрационными концептами.</p></div><Suspense><ProjectGrid/></Suspense></section></div>}
