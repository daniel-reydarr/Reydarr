'use client';

import { useSyncExternalStore } from 'react';
import {
  getTheme,
  getThemePreference,
  onThemeChange,
  setTheme,
  type Theme,
  type ThemePreference,
} from '@/lib/theme';
import styles from './design.module.css';

const OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

/* Three-state theme control. System is a real choice and follows the device live. */
export function ThemeSwitcher() {
  const preference = useSyncExternalStore(
    onThemeChange,
    getThemePreference,
    (): ThemePreference => 'system',
  );
  const applied = useSyncExternalStore(onThemeChange, getTheme, (): Theme => 'light');

  return (
    <div>
      <div className={styles.segmented} role="radiogroup" aria-label="Theme">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={preference === option.value}
            className={styles.segment}
            onClick={() => setTheme(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className={styles.note}>
        Your choice: {preference}. Applied now: {applied}.
      </p>
    </div>
  );
}
