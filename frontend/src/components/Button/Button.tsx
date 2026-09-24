import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost';

interface Common {
  variant?: Variant;
  children: ReactNode;
  /** Trailing arrow glyph — omitted for actions that do not go anywhere. */
  arrow?: '→' | '↗' | null;
  block?: boolean;
  busy?: boolean;
  className?: string;
}

function classes({ variant = 'ghost', block, busy, className }: Common) {
  return [styles.base, styles[variant], block ? styles.block : '', busy ? styles.busy : '', className]
    .filter(Boolean)
    .join(' ');
}

export function ButtonLink({
  href,
  external,
  ...props
}: Common & { href: string; external?: boolean } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'>) {
  const { children, arrow = '→', variant, block, busy, className, ...rest } = props;
  return (
    <a
      href={href}
      className={classes({ variant, block, busy, className, children, arrow })}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : null)}
      {...rest}
    >
      {children}
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          {arrow}
        </span>
      )}
    </a>
  );
}

export function Button({
  ...props
}: Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>) {
  const { children, arrow = null, variant, block, busy, className, ...rest } = props;
  return (
    <button className={classes({ variant, block, busy, className, children, arrow })} {...rest}>
      {children}
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          {arrow}
        </span>
      )}
    </button>
  );
}
