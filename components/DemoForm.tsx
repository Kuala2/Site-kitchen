'use client';

import { FormEvent, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { projects, roomNames } from '@/data/projects';
import { siteConfig } from '@/data/site';

export function DemoForm() {
  const params = useSearchParams();
  const concept = projects.find((project) => project.slug === params?.get('concept'));
  const estimate = params?.get('estimate');
  const [channel, setChannel] = useState('Телефон');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get('name') || '').trim()) next.name = 'Укажите, как к вам обращаться.';
    if (!String(data.get('contact') || '').trim()) next.contact = `Укажите ${channel.toLowerCase()}.`;
    setErrors(next);
    setSent(!Object.keys(next).length);
  }

  return <form className="contactForm" noValidate onSubmit={submit}>
    {(concept || estimate) && <div className="formContext"><p className="sectionLabel">Контекст уже приложен</p><h3>{concept ? concept.name : 'Предварительный расчёт'}</h3><p>{concept ? `${concept.solution} · ${concept.dimensions}` : 'Параметры сохранены в ссылке и будут доступны при возвращении к расчёту.'}</p></div>}
    <label><span>Имя</span><input name="name" autoComplete="name" aria-invalid={!!errors.name} onInput={() => setErrors((value) => ({ ...value, name: '' }))} />{errors.name && <small>{errors.name}</small>}</label>
    <label><span>Предпочтительный канал</span><select value={channel} onChange={(event) => setChannel(event.target.value)}><option>Телефон</option><option>Telegram</option><option>Email</option></select></label>
    <label><span>{channel}</span><input name="contact" autoComplete={channel === 'Email' ? 'email' : 'tel'} placeholder={channel === 'Email' ? 'name@example.com' : channel === 'Telegram' ? '@username' : '+7 900 000-00-00'} aria-invalid={!!errors.contact} onInput={() => setErrors((value) => ({ ...value, contact: '' }))} />{errors.contact && <small>{errors.contact}</small>}</label>
    <label><span>Тип пространства</span><select name="room" defaultValue={concept?.category || params?.get('room') || 'kitchen'}>{Object.entries(roomNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
    <label><span>Что важно учесть</span><textarea name="message" rows={5} placeholder="Примерные размеры, задача хранения, этап ремонта или ссылка на проект." /></label>
    <label className="fileField"><span>План или фотографии</span><input type="file" disabled /><small>Файлы можно приложить к письму после заполнения основных данных.</small></label>
    <button className="submitButton" type="submit">Подготовить запрос <span aria-hidden="true">→</span></button>
    {sent && <div className="formSuccess" role="status"><strong>Основные данные заполнены.</strong><p>В демонстрационной версии запрос не отправляется. Контакт для макета: {siteConfig.email}.</p><p className="demoDisclaimer">Демонстрационный проект — контактные данные вымышлены</p></div>}
  </form>;
}
