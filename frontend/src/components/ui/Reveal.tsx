import { Children, cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { useInView } from '../../hooks/useInView';

type Props = { children: ReactNode; className?: string; as?: 'div' | 'section' | 'header' | 'ul' | 'ol' };

/** Children rise in one after another the first time the block enters the viewport. */
export function Reveal({ children, className, as: Tag = 'div' }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.15 });
  let i = 0;
  const items = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ style?: CSSProperties }>;
    return cloneElement(el, { style: { ...el.props.style, ['--i' as string]: i++ } });
  });
  return (
    <Tag ref={ref as never} className={`reveal ${inView ? 'in' : ''} ${className ?? ''}`}>
      {items}
    </Tag>
  );
}
