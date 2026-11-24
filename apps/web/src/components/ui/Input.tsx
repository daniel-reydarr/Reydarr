import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Icon } from '@/components/icons/Icon';
import styles from './Input.module.css';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> & {
  /* Always visible, above the field. A placeholder is never the label. */
  label: string;
  helper?: string;
  /* An error replaces the helper text and adds an icon. */
  error?: string;
  optional?: boolean;
  prefixText?: string;
  /* Forces a look so the design page can show it. Never used in product code. */
  demoState?: 'focus';
};

export function Input({
  label,
  helper,
  error,
  optional = false,
  prefixText,
  demoState,
  id,
  className,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const hasMessage = Boolean(error ?? helper);
  const wrapper = className ? `${styles.root} ${className}` : styles.root;
  return (
    <div className={wrapper}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {optional ? <span className={styles.optional}>Optional</span> : null}
      </label>
      <div className={`${styles.field} ${error ? styles.invalid : ''}`} data-demo={demoState}>
        {prefixText ? <span className={styles.prefix}>{prefixText}</span> : null}
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          {...rest}
        />
      </div>
      {error ? (
        <p id={messageId} className={styles.error}>
          <Icon name="status-danger" size={16} />
          <span>{error}</span>
        </p>
      ) : helper ? (
        <p id={messageId} className={styles.helper}>
          {helper}
        </p>
      ) : null}
    </div>
  );
}
