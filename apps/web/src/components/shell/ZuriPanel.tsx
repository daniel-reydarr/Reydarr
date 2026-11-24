/* Zuri's chat surface (visual only in this package). A side panel on large laptops and a
   full screen on phones later. Messages are children. */
import type { ReactNode } from 'react';
import { ZuriAvatar } from '@/components/brand/ZuriMark';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import styles from './ZuriPanel.module.css';

export function ZuriMessage({ from = 'zuri', children }: { from?: 'zuri' | 'owner'; children: ReactNode }) {
  return (
    <p className={`${styles.message} ${from === 'owner' ? styles.owner : styles.zuri}`}>{children}</p>
  );
}

export function ZuriPanel({ children }: { children: ReactNode }) {
  return (
    <section className={styles.panel} aria-label="Zuri">
      <header className={styles.header}>
        <ZuriAvatar size={32} decorative />
        <h2>Zuri</h2>
      </header>
      <div className={styles.messages}>{children}</div>
      <div className={styles.composer}>
        <Input label="Ask Zuri" placeholder="Ask Zuri to change something" />
        <IconButton icon="send" label="Send message" variant="secondary" />
      </div>
    </section>
  );
}
