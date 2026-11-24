/* The app frame (R141, docs/design/03-layout-and-density.md).
   Phones: bottom tab bar. Tablets: icon rail. Laptops: sidebar. A right panel (Zuri) shows
   from 1280px when given. All three navs are the same links, shown by CSS only. */
import type { ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import type { IconName } from '@/components/icons/registry';
import { Logo } from '@/components/brand/Logo';
import styles from './AppShell.module.css';

export type NavItem = {
  key: string;
  label: string;
  icon: IconName;
  href: string;
};

type AppShellProps = {
  items: NavItem[];
  activeKey: string;
  children: ReactNode;
  /* Optional right panel, shown from 1280px. */
  panel?: ReactNode;
};

type Variant = 'tabs' | 'rail' | 'sidebar';

function NavLinks({ items, activeKey, variant }: { items: NavItem[]; activeKey: string; variant: Variant }) {
  return (
    <ul className={styles[`${variant}List`]}>
      {items.map((item) => {
        const active = item.key === activeKey;
        return (
          <li key={item.key} className={styles[`${variant}Cell`]}>
            <a
              href={item.href}
              className={styles[variant === 'tabs' ? 'tab' : variant === 'rail' ? 'railLink' : 'sideLink']}
              aria-current={active ? 'page' : undefined}
              title={variant === 'rail' ? item.label : undefined}
            >
              <Icon name={item.icon} size={variant === 'sidebar' ? 20 : 24} />
              <span className={variant === 'rail' ? styles.srOnly : undefined}>{item.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function AppShell({ items, activeKey, children, panel }: AppShellProps) {
  return (
    <div className={`${styles.shell} ${panel ? styles.withPanel : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Logo variant="lockup" height={28} priority />
        </div>
        <nav aria-label="Main">
          <NavLinks items={items} activeKey={activeKey} variant="sidebar" />
        </nav>
      </aside>
      <aside className={styles.rail}>
        <div className={styles.railBrand}>
          <Logo variant="mark" height={32} />
        </div>
        <nav aria-label="Main">
          <NavLinks items={items} activeKey={activeKey} variant="rail" />
        </nav>
      </aside>
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
      </div>
      {panel ? <aside className={styles.panel}>{panel}</aside> : null}
      <nav className={styles.tabbar} aria-label="Main">
        <NavLinks items={items} activeKey={activeKey} variant="tabs" />
      </nav>
    </div>
  );
}
