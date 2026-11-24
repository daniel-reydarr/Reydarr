import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/registry';
import styles from './ListGroup.module.css';

/* One card, rows separated by hairlines. Rows are 56px or more on touch. */
export function ListGroup({ children, label }: { children: ReactNode; label: string }) {
  return (
    <ul className={styles.group} aria-label={label}>
      {children}
    </ul>
  );
}

type ListRowProps = {
  title: string;
  description?: string;
  icon?: IconName;
  /* Usually a Badge. */
  trailing?: ReactNode;
  /* When given, the whole row is a link with a chevron. */
  href?: string;
};

export function ListRow({ title, description, icon, trailing, href }: ListRowProps) {
  const body = (
    <>
      {icon ? <Icon name={icon} size={20} className={styles.icon} /> : null}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
      {href ? <Icon name="chevron-right" size={16} className={styles.chevron} /> : null}
    </>
  );
  return (
    <li className={styles.item}>
      {href ? (
        <a href={href} className={`${styles.row} ${styles.link}`}>
          {body}
        </a>
      ) : (
        <div className={styles.row}>{body}</div>
      )}
    </li>
  );
}
