import type {MetadataRoute} from 'next';

export const dynamic='force-static';
export default function manifest():MetadataRoute.Manifest{return {name:'СЛОЙ 52 — кухни на заказ',short_name:'СЛОЙ 52',description:'Демонстрационный концепт сайта кухонь на заказ.',start_url:'/',display:'standalone',background_color:'#f3efe7',theme_color:'#20211d',lang:'ru',icons:[{src:'/icon',sizes:'64x64',type:'image/png'}]}}
