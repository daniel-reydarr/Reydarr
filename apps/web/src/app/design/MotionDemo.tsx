'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './design.module.css';

const ROWS = [
  { label: 'Fast', token: '--duration-fast', className: styles.fast },
  { label: 'Base', token: '--duration-base', className: styles.base },
  { label: 'Slow', token: '--duration-slow', className: styles.slow },
  { label: 'Enter with spring', token: '--duration-enter', className: styles.enter },
];

/* Moves with transform only. Reduced motion makes every move instant through the tokens. */
export function MotionDemo() {
  const [on, setOn] = useState(false);
  return (
    <div data-on={on}>
      <Button variant="secondary" onClick={() => setOn((value) => !value)}>
        {on ? 'Reset' : 'Play'}
      </Button>
      <div className={styles.motionRows}>
        {ROWS.map((row) => (
          <div key={row.token} className={styles.motionRow}>
            <span className={styles.motionLabel}>{row.label}</span>
            <div className={styles.track}>
              <span className={`${styles.dot} ${row.className}`} />
            </div>
            <code className={styles.token}>{row.token}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
