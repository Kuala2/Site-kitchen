import Link from 'next/link';

export function Arrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  return <span className={`arrow arrow--${direction}`} aria-hidden="true" />;
}

export function SectionIntro({
  label,
  title,
  text,
  className = '',
}: {
  label: string;
  title: string;
  text?: string;
  className?: string;
}) {
  return (
    <header className={`sectionIntro ${className}`.trim()}>
      <p className="sectionLabel">{label}</p>
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
    </header>
  );
}

export function ActionLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'line' | 'inverse';
}) {
  return (
    <Link className={`actionLink actionLink--${variant}`} href={href} prefetch={false}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}
