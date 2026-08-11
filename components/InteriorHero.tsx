import Image from 'next/image';

type InteriorHeroProps={
  image:string;
  alt:string;
  eyebrow:string;
  title:string;
  lead:string;
  note?:string;
  position?:string;
  compact?:boolean;
};

export function InteriorHero({image,alt,eyebrow,title,lead,note,position='center',compact=false}:InteriorHeroProps){
  return <section className={`interiorHero${compact?' interiorHero--compact':''}`}>
    <Image src={image} alt={alt} fill priority sizes="100vw" style={{objectPosition:position}}/>
    <div className="interiorHeroVeil"/>
    <div className="interiorHeroCopy"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{lead}</p></div>
    {note&&<p className="interiorHeroNote">{note}</p>}
  </section>;
}
