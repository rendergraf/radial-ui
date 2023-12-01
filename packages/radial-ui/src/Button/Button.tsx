import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

type ButtonVariant = 'contained' | 'outlined' | 'text';
const ButtonColorArray: string[] = ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];

interface ButtonPropsBase {
  children: React.ReactNode;
  variant?: ButtonVariant;
  ariaLabel?: string;
  color?: string;
  href?: string;
}

type AnchorProps = ButtonPropsBase & AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonProps = ButtonPropsBase & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      disabled = false,
      onClick,
      className = '',
      color,
      ariaLabel,
      variant = 'contained',
      href,
      ...otherProps
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick && !disabled) {
        onClick(event);
      }
    };

    const getButtonStyle = (): string => {
      switch (variant) {
        case 'outlined':
          return `RadialUI-button-outlined ${className}`;
        case 'text':
          return `RadialUI-button-text ${className}`;
        default:
          return `RadialUI-button ${className}`;
      }
    };

    const getColorStyle = (): string => {
      if (typeof color === 'string' && ButtonColorArray.indexOf(color) !== -1) {
        return color;
      }
      return 'primary';
    };

    if (href) {
      const { href: _anchorHref, ...anchorProps } = otherProps as AnchorProps;

      return (
        <a
          aria-label={ariaLabel}
          className={`${getButtonStyle()} ${getColorStyle()}`}
          href={href}
          {...anchorProps}
          ref={ref as React.MutableRefObject<HTMLAnchorElement>}
        >
          {children}
        </a>
      );
    }

    const { type: _deletedType, ...buttonProps } = otherProps as ButtonProps;

    return (
      <button
        aria-label={ariaLabel}
        className={`${getButtonStyle()} ${getColorStyle()}`}
        disabled={disabled}
        onClick={handleClick}
        ref={ref as React.MutableRefObject<HTMLButtonElement>}
        type="button"
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
