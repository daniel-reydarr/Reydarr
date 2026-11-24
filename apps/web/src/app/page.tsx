import { Logo } from '@/components/brand/Logo';
import styles from './page.module.css';

/* Holding page. The real home page comes with the marketing site. */
export default function Home() {
  return (
    <main className={styles.page}>
      <h1 className={styles.logo}>
        <Logo variant="lockup" height={48} priority />
      </h1>
      <p className={`type-body-lg ${styles.line}`}>
        Websites for small businesses in Nigeria, built with Zuri.
      </p>
    </main>
  );
}
