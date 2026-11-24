import type { ReactNode } from 'react';
import styles from './Card.module.css';

type CardProps = {
  children: ReactNode;
  className?: string;
};

/* Elevation 1: a hairline border in light, a lighter surface plus a faint top edge in dark. */
export function Card({ children, className }: CardProps) {
  return <div className={className ? `${styles.card} ${className}` : styles.card}>{children}</div>;
}

type SettingsCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /* Help text on the left of the footer. */
  footerText?: string;
  /* The footer action, normally a Save button. */
  action?: ReactNode;
  headingLevel?: 2 | 3;
};

/* The settings card pattern: title, one line description, the control, and a footer with
   help on the left and the action on the right. The footer stacks on phones. */
export function SettingsCard({
  title,
  description,
  children,
  footerText,
  action,
  headingLevel = 2,
}: SettingsCardProps) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <section className={styles.card}>
      <div className={styles.body}>
        <Heading className={styles.title}>{title}</Heading>
        {description ? <p className={styles.description}>{description}</p> : null}
        <div className={styles.control}>{children}</div>
      </div>
      {footerText || action ? (
        <div className={styles.footer}>
          {footerText ? <p className={styles.footerText}>{footerText}</p> : <span />}
          {action ? <div className={styles.action}>{action}</div> : null}
        </div>
      ) : null}
    </section>
  );
}
