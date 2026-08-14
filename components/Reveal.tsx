'use client';

export function Reveal({ 
  children, 
  className = ''
}: { 
  children: React.ReactNode, 
  className?: string, 
  delay?: 0 | 1 | 2 | 3 
}) {
  return (
    <div className={`reveal active ${className}`.trim()}>
      {children}
    </div>
  );
}
