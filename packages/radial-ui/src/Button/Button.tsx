import type { ButtonHTMLAttributes, AnchorHTMLAttributes , DetailedHTMLProps, MutableRefObject, MouseEvent, MouseEventHandler } from 'react';
import React, { forwardRef } from 'react';

type ButtonVariant = 'contained' | 'outlined' | 'text';
const ButtonColorArray: string[] = ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonPropsBase  {
  type?: ButtonType,
  children: React.ReactNode;
  variant?: ButtonVariant;
  ariaLabel?: string;
  color?: string;
  href?: string;
  role?: React.AriaRole;
  'aria-disabled'?: React.AriaAttributes['aria-disabled'];
  tabIndex?: number;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement> | MouseEventHandler<HTMLAnchorElement>;
}


type AnchorProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type Props = ButtonPropsBase & (AnchorProps | ButtonProps);


const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, Props>(
  (
    {
      type = 'button',
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

    if (href) {
      const { type: _removedType, ...anchorProps } = otherProps as AnchorProps;

      return (
        <a
          aria-label={ariaLabel}
          className={`${getButtonStyle()} ${getColorStyle()}`}
          href={href}
          onClick={handleClick}
          {...anchorProps}
          ref={ref as MutableRefObject<HTMLAnchorElement>}
        >
          {children}
        </a>
      );
    }

    const { ...buttonProps } = otherProps as ButtonProps;


    return (
      <button
        aria-label={ariaLabel}
        className={`${getButtonStyle()} ${getColorStyle()}`}
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
