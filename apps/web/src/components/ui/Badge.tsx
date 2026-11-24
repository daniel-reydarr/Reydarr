import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/registry';
import styles from './Badge.module.css';

type Tone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

const TONE_ICON: Record<Exclude<Tone, 'neutral'>, IconName> = {
  success: 'status-success',
  danger: 'status-danger',
  warning: 'status-warning',
  info: 'status-info',
};

/* Status always has an icon and a text label. Color never carries meaning alone. */
export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`${styles.badge} ${styles[tone]}`}>
      {tone === 'neutral' ? null : <Icon name={TONE_ICON[tone]} size={16} />}
      {children}
    </span>
  );
}
