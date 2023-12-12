import { forwardRef } from 'react';
import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import type { MutableRefObject, MouseEvent, MouseEventHandler } from 'react';
import { getButtonSize, getColorStyle } from '../utils'
import type { Emotion } from '../Types'
import type { ButtonPropsBase, AnchorProps, ButtonProps } from './Button.Types';

interface ModifiedStyles {
  name: string;
  styles: string;
};

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
      type,
      size,
      variant = 'contained',
      sx,
      ...otherProps
    },
    ref
  ) => {

    const getButtonStyle = (): string => {
      const buttonSize = size ? getButtonSize(size) : 'RadialUI-size-medium';
      switch (variant) {
        case 'outlined':
          return `RadialUI-button-outlined ${className} ${buttonSize}`;
        case 'text':
          return `RadialUI-button-text ${className} ${buttonSize}`;
        default:
          return `RadialUI-button ${className} ${buttonSize}`;
      }
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

    const withButtonPrefix = (styles: SerializedStyles): ModifiedStyles | null => {
      if (styles.styles && styles.name) {
        const modifiedName = `RadialUI-Button-${styles.name}`;
        const modifiedStyles = styles.styles.replace(/(?:\.css-\w+)/g, `$&-RadialUI-Button`);
        return {
          name: modifiedName,
          styles: modifiedStyles,
        };
      }
      return null;
    };

    if (sx) {
      mergedStyles = withButtonPrefix(css`${sx}`) as SerializedStyles | undefined;
    }

    if (href) {
      const { type: _removedType, ...anchorProps } = otherProps as Emotion & AnchorProps;

      return (
        <a
          aria-label={ariaLabel}
          className={`${getButtonStyle()} ${color ? getColorStyle(color) : ''}`}
          href={href}
          onClick={handleClick}
          {...anchorProps}
          {...(sx ? { css: mergedStyles } : null)}
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
        className={`${getButtonStyle()} ${color ? getColorStyle(color) : ''}`}
        {...(sx ? { css: mergedStyles } : null)}
        disabled={disabled}
        onClick={handleClick}
        ref={ref as MutableRefObject<HTMLButtonElement>}
        type={type ?? 'button'}
        {...buttonProps}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
