import type { ButtonHTMLAttributes, AnchorHTMLAttributes , DetailedHTMLProps, MouseEventHandler , AriaAttributes, AriaRole, ReactNode } from 'react';
import type { CSSObject } from '@emotion/react';

export type ButtonVariant = 'contained' | 'outlined' | 'text';
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
  variant?: ButtonVariant;
  sx?: CSSObject;
}

export interface Emotion extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'css'> {
  css?: CSSObject;
}

export interface ModifiedStyles {
  name: string;
  styles: string;
};

export type AnchorProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export type Props = ButtonPropsBase & (AnchorProps | ButtonProps);