import type { ReactNode } from 'react';
import { Link } from '../../lib/router';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost' | 'text';

type Common = {
  variant?: Variant;
  arrow?: string | null;
  full?: boolean;
  className?: string;
  children: ReactNode;
};

type Props =
  | (Common & { to: string; href?: never; onClick?: never; type?: never; disabled?: never })
  | (Common & { href: string; to?: never; onClick?: never; type?: never; disabled?: never })
  | (Common & { to?: never; href?: never; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean });

export function Button({ variant = 'primary', arrow = '→', full, className, children, ...rest }: Props) {
  const cls = [styles.btn, styles[variant], full ? styles.full : '', className ?? ''].join(' ');
  const inner = (
    <>
      <span>{children}</span>
      {arrow ? (
        <span className={styles.arrow} aria-hidden="true">
          {arrow}
        </span>
      ) : null}
    </>
  );
  if ('to' in rest && rest.to) {
    return (
      <Link to={rest.to} className={cls}>
        {inner}
      </Link>
    );
  }
  if ('href' in rest && rest.href) {
    return (
      <a href={rest.href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  const { onClick, type = 'button', disabled } = rest as { onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean };
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}
