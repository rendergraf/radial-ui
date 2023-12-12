import type { ButtonHTMLAttributes, AnchorHTMLAttributes , DetailedHTMLProps, MouseEventHandler , AriaAttributes, AriaRole, ReactNode } from 'react';
import type { CSSObject } from '@emotion/react';
import type { Variant } from '../Types';

export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonPropsBase {
  ariaLabel?: string;
  children: ReactNode;
  color?: string;
  disabled?: boolean;
  href?: string;
  'aria-disabled'?: AriaAttributes['aria-disabled'];
  onClick: MouseEventHandler<HTMLButtonElement> | MouseEventHandler<HTMLAnchorElement>;
  role?: AriaRole;
  size?: ButtonSize;
  tabIndex?: number;
  type?: ButtonType;
  variant?: Variant;
  sx?: CSSObject;
}

export type AnchorProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
