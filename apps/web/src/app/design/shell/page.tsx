import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ZuriAvatar } from '@/components/brand/ZuriMark';
import { AppShell, type NavItem } from '@/components/shell/AppShell';
import { ListGroup, ListRow } from '@/components/shell/ListGroup';
import { PageHeader } from '@/components/shell/PageHeader';
import { ZuriMessage, ZuriPanel } from '@/components/shell/ZuriPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import styles from './shell.module.css';

export const metadata: Metadata = {
  title: 'App shell',
  robots: { index: false, follow: false },
};

/* Development preview of the app frame with a sample Today screen. Links are placeholders.
   Content is illustrative only. It must never show on the live site. */
const ITEMS: NavItem[] = [
  { key: 'today', label: 'Today', icon: 'home', href: '#today' },
  { key: 'site', label: 'Site', icon: 'site', href: '#site' },
  { key: 'requests', label: 'Requests', icon: 'requests', href: '#requests' },
  { key: 'zuri', label: 'Zuri', icon: 'zuri', href: '#zuri' },
];

export default function ShellPreview() {
  if (process.env.VERCEL_ENV === 'production') {
    notFound();
  }

  return (
    <AppShell
      items={ITEMS}
      activeKey="today"
      panel={
        <ZuriPanel>
          <ZuriMessage>What would you like to change on your site today?</ZuriMessage>
        </ZuriPanel>
      }
    >
      <PageHeader title="Today" description="Here is what needs your attention." />

      <Card>
        <div className={styles.zuriCard}>
          <ZuriAvatar size={44} decorative />
          <div className={styles.zuriText}>
            <h2>Zuri has post drafts ready</h2>
            <p>Add a photo to finish each one.</p>
          </div>
          <Button variant="primary" className={styles.cta}>
            Review drafts
          </Button>
        </div>
      </Card>

      <section className={styles.block} aria-labelledby="business">
        <h2 id="business">Your business</h2>
        <ListGroup label="Your business">
          <ListRow icon="site" title="Website" description="Draft ready for your review" trailing={<Badge tone="info">Draft</Badge>} href="#site" />
          <ListRow icon="requests" title="Requests" description="New messages from customers" trailing={<Badge tone="success">New</Badge>} href="#requests" />
          <ListRow icon="settings" title="Settings" description="Name, address and contact details" href="#settings" />
        </ListGroup>
      </section>

      <div className={styles.askBar}>
        <Input label="Ask Zuri" placeholder="Ask Zuri to change something" />
      </div>

      <p className={styles.note}>Illustrative content for the design review.</p>
    </AppShell>
  );
}
