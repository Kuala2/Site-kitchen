/* eslint-disable @next/next/no-img-element -- Yandex.Metrika requires a raw noscript tracking pixel. */
import type {Metadata} from 'next';
import Script from 'next/script';
import '@fontsource-variable/onest/wght.css';
import '@fontsource-variable/ibm-plex-sans/wght.css';
import './globals.css';
import './reart.css';
import {Header,Footer} from '@/components/Shell';
import {SiteMotion} from '@/components/SiteMotion';
import {siteConfig} from '@/data/site';

export const metadata:Metadata={metadataBase:new URL(siteConfig.domain),title:{default:'СЛОЙ 52 — мебель на заказ для всего дома',template:'%s — СЛОЙ 52'},description:siteConfig.description,keywords:['мебель на заказ','встроенная мебель','гардеробная','кухня на заказ','системы хранения','расчёт кухни'],alternates:{canonical:'/'},openGraph:{title:'СЛОЙ 52 — мебель вокруг пространства',description:siteConfig.description,url:'/',siteName:'СЛОЙ 52',locale:'ru_RU',type:'website',images:[{url:'/og-image-square-v3.png',width:1024,height:1024,alt:'Знак СЛОЙ 52 для компактного превью ссылки'}]},twitter:{card:'summary',title:'СЛОЙ 52 — мебель вокруг пространства',description:siteConfig.description,images:['/og-image-square-v3.png']}};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body><Script id="yandex-metrika" strategy="afterInteractive">{`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=111067823','ym');ym(111067823,'init',{ssr:true,clickmap:true,ecommerce:'dataLayer',referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});`}</Script><noscript><div><img src="https://mc.yandex.ru/watch/111067823" style={{position:'absolute',left:'-9999px'}} alt=""/></div></noscript><a className="skip" href="#content">К содержанию</a><Header/><main id="content">{children}</main><Footer/><SiteMotion/></body></html>}
