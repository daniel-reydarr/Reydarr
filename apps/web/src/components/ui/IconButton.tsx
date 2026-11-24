import type { ButtonHTMLAttributes } from 'react';
import { Icon } from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/registry';
import styles from './Button.module.css';
import type { ButtonSize } from './Button';

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> & {
  icon: IconName;
  /* Required. An icon-only button has no visible text. */
  label: string;
  variant?: 'secondary' | 'ghost';
  size?: ButtonSize;
};

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], styles.iconOnly, className ?? '']
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} aria-label={label} {...rest}>
      <Icon name={icon} size={size === 'lg' ? 24 : 20} />
    </button>
  );
}
