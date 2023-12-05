/** @jsxImportSource @emotion/react */
import type { ButtonHTMLAttributes, AnchorHTMLAttributes , DetailedHTMLProps, MutableRefObject, MouseEvent, MouseEventHandler } from 'react';
import React, { forwardRef,  } from 'react';
import type { SerializedStyles , CSSObject } from '@emotion/react';
import { css } from '@emotion/react';

type ButtonVariant = 'contained' | 'outlined' | 'text';
type ButtonType = 'button' | 'submit' | 'reset';
type ButtonSize = 'small' | 'medium' | 'large';
const ButtonColorArray: string[] = ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];

interface ButtonPropsBase {
  ariaLabel?: string;
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
  href?: string;
  'aria-disabled'?: React.AriaAttributes['aria-disabled'];
  onClick: MouseEventHandler<HTMLButtonElement> | MouseEventHandler<HTMLAnchorElement>;
  role?: React.AriaRole;
  size?: ButtonSize;
  tabIndex?: number;
  type?: ButtonType;
  variant?: ButtonVariant;
  sx?: any;
}

interface Emotion extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'css'> {
  css?: CSSObject;
}

type AnchorProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type Props = ButtonPropsBase & (AnchorProps | ButtonProps);

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  (
    {
      ariaLabel,
      children,
      className = '',
      color,
      disabled = false,
      href,
      onClick,
      type = 'button',
      size = 'medium',
      variant = 'contained',
      sx,
      ...otherProps
    },
    ref
  ) => {
    const getButtonSize = (): string => {
      return `RadialUI-${size || 'medium'}`;
    };

    const getButtonStyle = (): string => {
      switch (variant) {
        case 'outlined':
          return `RadialUI-button-outlined ${className} ${getButtonSize()}`;
        case 'text':
          return `RadialUI-button-text ${className} ${getButtonSize()}`;
        default:
          return `RadialUI-button ${className} ${getButtonSize()}`;
      }
    };

    const getColorStyle = (): string => {
      if (typeof color === 'string' && ButtonColorArray.includes(color)) {
        return color;
      }
      return 'primary';
    };

    const handleClick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = (event): void => {
      if (!disabled) {
        if (href) {
          event.preventDefault();
        }
        if (typeof onClick === 'function') {
          (onClick as MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>)(event as MouseEvent<HTMLButtonElement | HTMLAnchorElement>);
        }
      }
    };

    let mergedStyles: SerializedStyles | undefined;

    if (sx) {
      mergedStyles = css`${sx}`;
    }

    if (href) {
      const { type: _removedType, ...anchorProps } = otherProps as Emotion & AnchorProps;

      return (
        <a
          aria-label={ariaLabel}
          className={`${getButtonStyle()} ${getColorStyle()}`}
          href={href}
          onClick={handleClick}
          {...anchorProps}
          css={mergedStyles}
          ref={ref as MutableRefObject<HTMLAnchorElement>}
        >
          {children}
        </a>
      );
    }

    const { ...buttonProps } = otherProps as Emotion & ButtonProps;


    return (
      <button
        aria-label={ariaLabel}
        className={`${getButtonStyle()} ${getColorStyle()}`}
        css={mergedStyles}
        disabled={disabled}
        onClick={handleClick}
        ref={ref as MutableRefObject<HTMLButtonElement>}
        type={type}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
