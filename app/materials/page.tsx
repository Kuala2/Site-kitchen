import type {Metadata} from 'next';
import Image from 'next/image';
import {MaterialsExplorer} from '@/components/MaterialsExplorer';

export const metadata:Metadata={title:'Лаборатория мебельных материалов',description:'Сравнение фасадов, корпусов, столешниц, ручек, профилей, стекла и деревянных поверхностей.',alternates:{canonical:'/materials/'}};

const groups=['Фасады','Корпуса','Столешницы','Ручки и профили','Стекло','Дерево и шпон','Матовые поверхности'];

export default function Materials(){return <div className="page section materialsPage"><div className="pageHead pageHeadVisual"><p className="eyebrow">Поверхности и фурнитура</p><div><h1>Материал виден в системе, а не в одиночном образце</h1><p className="pageLead">Фасад, корпус, профиль и стекло меняют друг друга. Экран передаёт только общее впечатление: реальный цвет и фактуру проверяют по образцам в комнате.</p></div><figure><Image src="/images/editorial-12.jpg" alt="Светлый шпон, столешница и мойка крупным планом" fill sizes="(max-width: 900px) 100vw, 25vw"/><figcaption>шпон · камень · профиль</figcaption></figure></div><div className="materialGroupRail" aria-label="Категории материалов">{groups.map(group=><span key={group}>{group}</span>)}</div><div className="materialLabNote"><p className="eyebrow">Глубокий пример</p><p>Интерактивная лаборатория ниже остаётся кухонной: два сочетания можно сравнить, сохранить локально и передать совместимые параметры в расчёт кухни.</p></div><MaterialsExplorer/></div>}
