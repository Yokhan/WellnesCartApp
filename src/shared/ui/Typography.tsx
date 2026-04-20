import type { ComponentChildren, JSX } from 'preact';
import { C, ff } from './tokens';

interface TypoProps {
  children: ComponentChildren;
  style?: JSX.CSSProperties;
}

export function H2({ children, style }: TypoProps): JSX.Element {
  return (
    <h2 style={{
      fontFamily: ff.serif,
      fontSize: 26,
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: -0.3,
      color: C.text,
      margin: 0,
      ...style,
    }}>
      {children}
    </h2>
  );
}

export function H3({ children, style }: TypoProps): JSX.Element {
  return (
    <h3 style={{
      fontFamily: ff.serif,
      fontSize: 17,
      fontWeight: 600,
      lineHeight: 1.3,
      color: C.text,
      margin: 0,
      ...style,
    }}>
      {children}
    </h3>
  );
}

export function P({ children, style }: TypoProps): JSX.Element {
  return (
    <p style={{
      fontSize: 14.5,
      lineHeight: 1.75,
      color: C.mid,
      margin: 0,
      ...style,
    }}>
      {children}
    </p>
  );
}

interface LabelProps extends TypoProps {
  color?: string;
}

export function Label({ children, color, style }: LabelProps): JSX.Element {
  return (
    <span style={{
      fontSize: 10.5,
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: 1.6,
      color: color ?? C.muted,
      ...style,
    }}>
      {children}
    </span>
  );
}
