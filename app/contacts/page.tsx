import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';
import { DemoForm } from '@/components/DemoForm';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = { title: 'Контакты и встреча', description: 'Обсудить мебельный проект и записаться на просмотр материалов.', alternates: { canonical: '/contacts/' } };

export default function Contacts() {
  return <article className="raContacts">
    <section className="raContactTop raFrame">
      <header><span>Контакты и встреча</span><h1>Начнём с того, что уже известно.</h1><p>План, фотографии или примерные размеры — этого достаточно для первого предметного разговора.</p></header>
      <div><dl><div><dt>Телефон</dt><dd>{siteConfig.phoneDisplay}</dd></div><div><dt>Email</dt><dd>{siteConfig.email}</dd></div><div><dt>Регион работы</dt><dd>{siteConfig.region}</dd></div><div><dt>Формат</dt><dd>Встреча по предварительной записи</dd></div></dl><p className="demoDisclaimer">Демонстрационный проект — контактные данные вымышлены</p></div>
    </section>

    <section className="raContactVisit raFrame"><figure><Image src="/images/room-shelves.jpg" alt="Встроенная система из шпона с подсвеченными нишами" fill priority sizes="100vw" /><figcaption>Материалы и фактуры смотрят рядом, а не по отдельным образцам</figcaption></figure><div><span>Что взять на встречу</span><ul><li>план помещения или обмер;</li><li>несколько фотографий пространства;</li><li>ссылки на близкие по настроению решения;</li><li>перечень техники и важных сценариев хранения.</li></ul></div></section>

    <section className="raContactForm raFrame"><header><span>Запись и обсуждение</span><h2>Расскажите, что важно учесть.</h2><p>Опишите помещение, желаемый состав мебели и то, что должно быть удобно каждый день. Контактные данные нужны, чтобы вернуться с уточняющими вопросами.</p></header><Suspense fallback={<p>Загружаем форму…</p>}><DemoForm /></Suspense></section>

    <section className="raContactNext raFrame"><header><span>После обращения</span><h2>Три понятных действия.</h2></header><ol><li><span>01</span><p>Сверим тип мебели, помещение и исходные материалы.</p></li><li><span>02</span><p>Определим, нужен ли замер или сначала достаточно эскиза.</p></li><li><span>03</span><p>Зафиксируем состав следующего этапа без скрытых обязательств.</p></li></ol></section>
  </article>;
}
