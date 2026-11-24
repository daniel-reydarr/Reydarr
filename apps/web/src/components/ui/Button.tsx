import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/registry';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  fullWidth?: boolean;
  /* Forces a look so the design page can show it. Never used in product code. */
  demoState?: 'hover' | 'pressed' | 'focus';
};

/* One primary button per screen (R139). The label is a verb. */
export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  demoState,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : '',
    loading ? styles.loading : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  const iconSize = size === 'lg' ? 20 : 16;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-demo={demoState}
      {...rest}
    >
      {loading ? (
        <Icon name="spinner" size={iconSize} className={styles.spinner} />
      ) : leadingIcon ? (
        <Icon name={leadingIcon} size={iconSize} />
      ) : null}
      <span>{children}</span>
      {trailingIcon && !loading ? <Icon name={trailingIcon} size={iconSize} /> : null}
    </button>
  );
}
