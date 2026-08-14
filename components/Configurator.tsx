'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Arrow } from './DesignSystem';

type FurnitureType = 'kitchen' | 'wardrobe' | 'closet' | 'living' | 'office';
type Material = 'enamel' | 'veneer' | 'solid';
type Hardware = 'standard' | 'premium' | 'architectural';
type Extra = 'lights' | 'appliances' | 'storage' | 'delivery' | 'installation';

type Estimate = {
  type: FurnitureType;
  configuration: string;
  width: number;
  height: number;
  depth: number;
  island: boolean;
  material: Material;
  worktop: string;
  hardware: Hardware;
  extras: Extra[];
};

const types: { id: FurnitureType; name: string; note: string }[] = [
  { id: 'kitchen', name: 'Кухня', note: 'Линейная, угловая, П-образная или с островом' },
  { id: 'wardrobe', name: 'Гардеробная', note: 'Открытая, встроенная или отдельная комната' },
  { id: 'closet', name: 'Встроенный шкаф', note: 'Фронт в нише или от стены до стены' },
  { id: 'living', name: 'Мебель для гостиной', note: 'Стеновая система, витрина или ТВ-зона' },
  { id: 'office', name: 'Домашний кабинет', note: 'Рабочая ниша или полноценная система хранения' },
];

const configurations: Record<FurnitureType, string[]> = {
  kitchen: ['Прямая', 'Угловая', 'П-образная', 'С островом'],
  wardrobe: ['Вдоль одной стены', 'Г-образная', 'П-образная', 'Отдельная комната'],
  closet: ['В нише', 'От стены до стены', 'Угловой'],
  living: ['Стеновая система', 'ТВ-зона', 'Витрина и хранение'],
  office: ['Рабочая ниша', 'Стол и шкафы', 'Кабинет по периметру'],
};

const labels = {
  material: { enamel: 'Матовая эмаль', veneer: 'Натуральный шпон', solid: 'Массив / рамочный фасад' },
  hardware: { standard: 'Надёжная', premium: 'Премиальная', architectural: 'Архитектурная' },
  extra: { lights: 'Интегрированная подсветка', appliances: 'Техника и технические модули', storage: 'Расширенная организация хранения', delivery: 'Доставка', installation: 'Монтаж' },
  type: Object.fromEntries(types.map((item) => [item.id, item.name])) as Record<FurnitureType, string>,
};

const defaults: Estimate = {
  type: 'kitchen', configuration: 'Прямая', width: 3200, height: 2600, depth: 600,
  island: false, material: 'enamel', worktop: 'Кварцевый агломерат', hardware: 'premium',
  extras: ['lights', 'storage', 'delivery', 'installation'],
};

export function Configurator() {
  const [step, setStep] = useState(1);
  const [value, setValue] = useState<Estimate>(defaults);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const saved = JSON.parse(localStorage.getItem('sloy52-estimate') || 'null');
      const source = saved && typeof saved === 'object' ? saved : {};
      const legacyLayout: Record<string, string> = { straight: 'Прямая', corner: 'Угловая', u: 'П-образная', island: 'С островом' };
      const legacyMaterial: Record<string, Material> = { paint: 'enamel', 'light-veneer': 'veneer', 'dark-veneer': 'veneer', frame: 'solid' };
      const fromUrl: Partial<Estimate> = {};
      if (params.get('type') && types.some((item) => item.id === params.get('type'))) fromUrl.type = params.get('type') as FurnitureType;
      if (params.get('configuration')) fromUrl.configuration = params.get('configuration')!;
      if (params.get('layout')) fromUrl.configuration = legacyLayout[params.get('layout')!] || defaults.configuration;
      if (params.get('width') || params.get('a')) fromUrl.width = Number(params.get('width') || params.get('a'));
      if (params.get('height')) fromUrl.height = Number(params.get('height'));
      if (params.get('depth')) fromUrl.depth = Number(params.get('depth'));
      if (params.get('material')) fromUrl.material = params.get('material') as Material;
      if (params.get('facade')) fromUrl.material = legacyMaterial[params.get('facade')!] || defaults.material;
      if (params.get('hardware')) fromUrl.hardware = params.get('hardware') as Hardware;
      if (params.get('worktop')) fromUrl.worktop = params.get('worktop')!;
      if (params.get('extras')) fromUrl.extras = params.get('extras')!.split(',') as Extra[];
      if (params.get('island')) fromUrl.island = params.get('island') === '1';
      const merged = { ...defaults, ...source, ...fromUrl };
      if (Number.isFinite(merged.width) && Number.isFinite(merged.height) && Number.isFinite(merged.depth)) setValue(merged);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem('sloy52-estimate', JSON.stringify(value));
    const params = serialize(value);
    window.history.replaceState(null, '', `${window.location.pathname}?${params}`);
  }, [value, ready]);

  const price = useMemo(() => calculate(value), [value]);
  const update = <K extends keyof Estimate>(key: K, next: Estimate[K]) => setValue((current) => ({ ...current, [key]: next }));

  function chooseType(type: FurnitureType) {
    setValue((current) => ({
      ...current,
      type,
      configuration: configurations[type][0],
      island: type === 'kitchen' && current.island,
      worktop: type === 'kitchen' ? current.worktop : 'Не требуется',
    }));
  }

  function toggle(extra: Extra) {
    update('extras', value.extras.includes(extra) ? value.extras.filter((item) => item !== extra) : [...value.extras, extra]);
  }

  async function copy() {
    const text = `${labels.type[value.type]} · ${value.configuration} · ${value.width} × ${value.height} × ${value.depth} мм · ${format(price.low)}–${format(price.high)}\n${window.location.href}`;
    try { await navigator.clipboard.writeText(text); setMessage('Расчёт и ссылка скопированы.'); }
    catch { setMessage('Не удалось скопировать автоматически. Ссылка сохранена в адресной строке.'); }
  }

  return (
    <div className="estimator">
      <div className="estimatorTopline">
        <span>Шаг {String(step).padStart(2, '0')} из 05</span>
        <div aria-label={`Шаг ${step} из 5`}><i style={{ width: `${step * 20}%` }} /></div>
      </div>
      <section className="estimatorWorkspace">
        <div className="estimatorForm">
          {step === 1 && (
            <Step title="Что будем проектировать?" text="Выберите один тип мебели. От него зависят доступные конфигурации, базовая стоимость погонного метра и следующие вопросы. Выбор можно изменить в любой момент.">
              <div className="choiceList choiceList--types">
                {types.map((item) => (
                  <button key={item.id} type="button" aria-pressed={value.type === item.id} onClick={() => chooseType(item.id)}>
                    <span>{item.name}</span><small>{item.note}</small><i aria-hidden="true">{value.type === item.id ? 'Выбрано' : 'Выбрать'}</i>
                  </button>
                ))}
              </div>
            </Step>
          )}
          {step === 2 && (
            <Step title="Конфигурация и размеры" text="Укажите общий габарит. Точные примыкания и секции уточняются после замера.">
              <fieldset className="choiceChips"><legend>Конфигурация</legend>{configurations[value.type].map((item) => <button key={item} type="button" aria-pressed={value.configuration === item} onClick={() => update('configuration', item)}>{item}</button>)}</fieldset>
              <div className="dimensionGrid">
                <NumberField label="Ширина / общая длина" value={value.width} min={1200} max={12000} onChange={(number) => update('width', number)} />
                <NumberField label="Высота" value={value.height} min={900} max={4000} onChange={(number) => update('height', number)} />
                <NumberField label="Глубина" value={value.depth} min={300} max={1200} onChange={(number) => update('depth', number)} />
              </div>
              {value.type === 'kitchen' && <label className="checkLine"><input type="checkbox" checked={value.island || value.configuration === 'С островом'} onChange={(event) => update('island', event.target.checked)} /><span><b>Добавить остров</b><small>Отдельный мебельный объём с хранением или рабочей зоной.</small></span></label>}
            </Step>
          )}
          {step === 3 && (
            <Step title="Материалы и фурнитура" text="Выберите основной уровень отделки. Для кухни отдельно учитывается категория столешницы.">
              <SelectGroup label="Фасады" value={value.material} items={Object.entries(labels.material)} onChange={(next) => update('material', next as Material)} />
              {value.type === 'kitchen' && <SelectGroup label="Столешница" value={value.worktop} items={['Компакт-плита', 'Кварцевый агломерат', 'Натуральный камень'].map((item) => [item, item])} onChange={(next) => update('worktop', next)} />}
              <SelectGroup label="Уровень фурнитуры" value={value.hardware} items={Object.entries(labels.hardware)} onChange={(next) => update('hardware', next as Hardware)} />
            </Step>
          )}
          {step === 4 && (
            <Step title="Дополнительное оснащение" text="Отметьте только то, что нужно включить в предварительный ориентир.">
              <div className="extraList">
                {(Object.entries(labels.extra) as [Extra, string][]).map(([id, name]) => (
                  <label key={id} className="checkLine"><input type="checkbox" checked={value.extras.includes(id)} onChange={() => toggle(id)} /><span><b>{name}</b><small>{extraNote(id, value.type)}</small></span></label>
                ))}
              </div>
            </Step>
          )}
          {step === 5 && (
            <Step title="Ориентир готов" text="Это предварительная вилка. Итог уточняется после замера, проекта и спецификации внутренних секций.">
              <dl className="estimateSummary">
                <div><dt>Тип и конфигурация</dt><dd>{labels.type[value.type]} · {value.configuration}</dd><button type="button" onClick={() => setStep(1)}>Изменить</button></div>
                <div><dt>Габарит</dt><dd>{value.width} × {value.height} × {value.depth} мм</dd><button type="button" onClick={() => setStep(2)}>Изменить</button></div>
                <div><dt>Материал</dt><dd>{labels.material[value.material]}{value.type === 'kitchen' ? ` · ${value.worktop}` : ''}</dd><button type="button" onClick={() => setStep(3)}>Изменить</button></div>
                <div><dt>Фурнитура</dt><dd>{labels.hardware[value.hardware]}</dd><button type="button" onClick={() => setStep(3)}>Изменить</button></div>
                <div><dt>Оснащение</dt><dd>{value.extras.length ? value.extras.map((item) => labels.extra[item]).join(' · ') : 'Без дополнительных позиций'}</dd><button type="button" onClick={() => setStep(4)}>Изменить</button></div>
              </dl>
              <div className="resultActions">
                <button type="button" className="actionLink actionLink--line" onClick={() => setStep(1)}><span>Изменить параметры</span><Arrow /></button>
                <button type="button" className="actionLink actionLink--line" onClick={copy}><span>Скопировать расчёт</span><Arrow /></button>
                <Link className="actionLink actionLink--primary" href={`/contacts/?estimate=${encodeURIComponent(serialize(value))}`}><span>Обсудить проект</span><Arrow /></Link>
              </div>
              <p className="copyStatus" aria-live="polite">{message}</p>
            </Step>
          )}
          <div className="stepNavigation">
            {step > 1 && <button type="button" onClick={() => setStep((current) => current - 1)}>Назад</button>}
            {step < 5 && <button type="button" onClick={() => setStep((current) => current + 1)}>Продолжить <Arrow /></button>}
          </div>
        </div>
        <aside className="liveEstimate">
          <p className="sectionLabel">Предварительный ориентир</p>
          <strong>{format(price.low)}<span> — {format(price.high)}</span></strong>
          <p>Диапазон пересчитывается сразу. Точная стоимость появляется после замера и проектирования.</p>
          <dl>
            <div><dt>Решение</dt><dd>{labels.type[value.type]}</dd></div>
            <div><dt>Конфигурация</dt><dd>{value.configuration}</dd></div>
            <div><dt>Материал</dt><dd>{labels.material[value.material]}</dd></div>
          </dl>
          <div className="priceDrivers"><span>Сильнее всего влияют</span><ul>{priceDrivers(value).map((driver) => <li key={driver}>{driver}</li>)}</ul></div>
        </aside>
      </section>
    </div>
  );
}

function Step({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return <div className="estimateStep"><h2>{title}</h2><p className="stepLead">{text}</p>{children}</div>;
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  const invalid = !Number.isFinite(value) || value < min || value > max;
  return <label className="numberField"><span>{label}</span><span><input type="number" value={Number.isFinite(value) ? value : ''} min={min} max={max} step={50} aria-invalid={invalid} onChange={(event) => onChange(event.target.valueAsNumber)} /><i>мм</i></span>{invalid && <small>Укажите значение от {min} до {max} мм.</small>}</label>;
}

function SelectGroup({ label, value, items, onChange }: { label: string; value: string; items: [string, string][]; onChange: (value: string) => void }) {
  return <fieldset className="selectGroup"><legend>{label}</legend>{items.map(([id, name]) => <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)}><span>{name}</span><i>{value === id ? '●' : '○'}</i></button>)}</fieldset>;
}

function calculate(value: Estimate) {
  const safeWidth = Number.isFinite(value.width) ? value.width : defaults.width;
  const length = Math.max(1.2, safeWidth / 1000);
  const base = { kitchen: 270000, wardrobe: 190000, closet: 175000, living: 205000, office: 185000 }[value.type];
  const material = { enamel: 1, veneer: 1.17, solid: 1.32 }[value.material];
  const hardware = { standard: 0.9, premium: 1.08, architectural: 1.25 }[value.hardware];
  const configuration = value.configuration.includes('Угл') || value.configuration.includes('Г-') ? 1.1 : value.configuration.includes('П-') || value.configuration.includes('периметру') ? 1.2 : 1;
  const worktop = value.type !== 'kitchen' ? 1 : value.worktop === 'Натуральный камень' ? 1.18 : value.worktop === 'Кварцевый агломерат' ? 1.1 : 1;
  const extraPrices: Record<Extra, number> = { lights: 70000, appliances: 110000, storage: 90000, delivery: 45000, installation: 120000 };
  const extras = value.extras.reduce((sum, item) => sum + extraPrices[item], 0) + (value.island ? 240000 : 0);
  const core = length * base * material * hardware * configuration * worktop + extras;
  const round = (number: number) => Math.round(number / 50000) * 50000;
  return { low: round(core * 0.9), high: round(core * 1.18) };
}

function priceDrivers(value: Estimate) {
  const drivers = [`Габарит ${Math.round(value.width / 100) / 10} м и конфигурация «${value.configuration.toLowerCase()}»`];
  if (value.material !== 'enamel') drivers.push(labels.material[value.material]);
  if (value.hardware !== 'standard') drivers.push(`${labels.hardware[value.hardware]} фурнитура`);
  if (value.island) drivers.push('Отдельный островной объём');
  else if (value.extras.includes('installation')) drivers.push('Монтаж и точные примыкания');
  return drivers.slice(0, 3);
}

function serialize(value: Estimate) {
  const params = new URLSearchParams({ type: value.type, configuration: value.configuration, width: String(value.width), height: String(value.height), depth: String(value.depth), material: value.material, hardware: value.hardware, worktop: value.worktop, extras: value.extras.join(',') });
  if (value.island) params.set('island', '1');
  return params.toString();
}

function format(number: number) {
  return number >= 1_000_000 ? `${(number / 1_000_000).toFixed(2).replace('.', ',')} млн ₽` : `${Math.round(number / 1000)} тыс. ₽`;
}

function extraNote(id: Extra, type: FurnitureType) {
  if (id === 'appliances') return type === 'kitchen' ? 'Колонны, встроенная техника и технические модули.' : 'Розетки, кабель-каналы и технические ниши.';
  if (id === 'storage') return 'Внутренние ящики, разделители и специальные механизмы.';
  if (id === 'lights') return 'Линейный свет в нишах и рабочих зонах.';
  if (id === 'delivery') return 'Доставка в пределах Нижнего Новгорода.';
  return 'Сборка, примыкания и чистовая установка.';
}
