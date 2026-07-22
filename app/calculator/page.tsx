import type {Metadata} from 'next';import {Configurator} from '@/components/Configurator';
export const metadata:Metadata={title:'Конфигуратор кухни',description:'Схематичная компоновка и демонстрационный расчёт диапазона бюджета.',alternates:{canonical:'/calculator'}};export default function Calculator(){return <Configurator/>}
