import Image from 'next/image';

type Props = { image: string; alt: string; eyebrow: string; title: string; lead: string; note?: string; position?: string; compact?: boolean };

export function InteriorHero({ image, alt, eyebrow, title, lead, note, position = 'center', compact = false }: Props) {
  return (
    <section className={`interiorHero${compact ? ' interiorHero--compact' : ''}`}>
      <div className="interiorHeroCopy">
        <p className="sectionLabel">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
        {note && <span>{note}</span>}
      </div>
      <figure>
        <Image src={image} alt={alt} fill priority sizes="(max-width: 760px) 100vw, 58vw" style={{ objectPosition: position }} />
      </figure>
    </section>
  );
}
