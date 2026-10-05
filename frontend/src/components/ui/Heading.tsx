import type { ReactNode } from 'react';

/** Two-part heading: the second part carries the saffron accent. */
export function Heading({ a, b, level = 2, className }: { a: ReactNode; b?: ReactNode; level?: 1 | 2; className?: string }) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <Tag className={className}>
      {a}
      {b ? (
        <>
          {' '}
          <span className="accent">{b}</span>
        </>
      ) : null}
    </Tag>
  );
}
