import type { Metadata } from 'next';
import { Configurator } from '@/components/Configurator';

export const metadata: Metadata = { title: 'Калькулятор стоимости', description: 'Предварительный ориентир стоимости кухни и встроенной мебели.', alternates: { canonical: '/calculator/' } };

export default function CalculatorPage() {
  return <article className="raCalculator">
    <header className="raCalculatorHead raFrame"><div><span>Предварительная стоимость</span><h1>Рабочий расчёт без длинной анкеты.</h1></div><p>Тип мебели, конфигурация, габарит, материалы и оснащение. Диапазон пересчитывается сразу и сохраняется в ссылке.</p></header>
    <section className="raCalculatorWorkspace raFrame"><Configurator /></section>
    <section className="raCalculatorNotes raFrame"><article><h2>Ориентир, не смета</h2><p>Вилка показывает порядок бюджета до замера и проектирования внутренних секций.</p></article><article><h2>Параметры сохраняются</h2><p>Расчёт остаётся в браузере и URL: к нему можно вернуться или приложить к обсуждению.</p></article><article><h2>Следующий шаг понятен</h2><p>После результата можно изменить исходные данные, скопировать расчёт или перейти к встрече.</p></article></section>
  </article>;
}
