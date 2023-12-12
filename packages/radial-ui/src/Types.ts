import type { ButtonHTMLAttributes, AnchorHTMLAttributes , DetailedHTMLProps, MouseEventHandler , AriaAttributes, AriaRole, ReactNode } from 'react';
import type { CSSObject } from '@emotion/react';

export type Variant = 'contained' | 'outlined' | 'text';

export type Size = 'small' | 'medium' | 'large';

export interface Emotion extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'css'> {
  css?: CSSObject;
}