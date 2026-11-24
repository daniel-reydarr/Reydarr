import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CSSProperties, ReactNode } from 'react';
import { Icon } from '@/components/icons/Icon';
import { ICONS, type IconName } from '@/components/icons/registry';
import { Logo } from '@/components/brand/Logo';
import { ZuriAvatar, ZuriMark } from '@/components/brand/ZuriMark';
import { Badge } from '@/components/ui/Badge';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { SettingsCard } from '@/components/ui/Card';
import { MotionDemo } from './MotionDemo';
import { ThemeSwitcher } from './ThemeSwitcher';
import styles from './design.module.css';

export const metadata: Metadata = {
  title: 'Design tokens',
  robots: { index: false, follow: false },
};

/* Development style guide. It must never show on the live site. */
const BRAND_NAMES = ['ink', 'night', 'bone', 'ping', 'ping-deep', 'slate', 'white'];
const SCALES: Array<{ title: string; names: string[] }> = [
  { title: 'Navy', names: ['navy-950', 'navy-900', 'navy-800', 'navy-700', 'navy-600', 'navy-500', 'navy-450', 'navy-400', 'navy-350', 'navy-300'] },
  { title: 'Bone', names: ['bone-50', 'bone-100', 'bone-150', 'bone-200', 'bone-300', 'bone-500'] },
  { title: 'Ping', names: ['ping-400', 'ping-500', 'ping-600', 'ping-700', 'ping-800'] },
  { title: 'Green', names: ['green-950', 'green-700', 'green-600', 'green-400', 'green-300', 'green-100'] },
  { title: 'Rose', names: ['rose-950', 'rose-700', 'rose-600', 'rose-400', 'rose-300', 'rose-100'] },
  { title: 'Amber', names: ['amber-950', 'amber-800', 'amber-600', 'amber-400', 'amber-300', 'amber-100'] },
  { title: 'Blue', names: ['blue-950', 'blue-700', 'blue-600', 'blue-400', 'blue-300', 'blue-100'] },
];

type Role = { name: string; kind: 'bg' | 'border' | 'text' | 'action'; on?: string };
const ROLE_GROUPS: Array<{ title: string; roles: Role[] }> = [
  {
    title: 'Backgrounds',
    roles: ['bg-page', 'bg-surface', 'bg-subtle', 'bg-hover', 'bg-selected', 'bg-raised', 'bg-inverse'].map(
      (name): Role => ({ name, kind: 'bg' }),
    ),
  },
  {
    title: 'Borders',
    roles: [
      { name: 'border-subtle', kind: 'border' },
      { name: 'border-strong', kind: 'border' },
      { name: 'focus-ring', kind: 'border' },
      { name: 'action-edge', kind: 'border' },
    ],
  },
  {
    title: 'Text',
    roles: [
      { name: 'text-primary', kind: 'text' },
      { name: 'text-secondary', kind: 'text' },
      { name: 'text-tertiary', kind: 'text' },
      { name: 'text-disabled', kind: 'text' },
      { name: 'text-brand', kind: 'text' },
      { name: 'text-on-inverse', kind: 'text', on: 'bg-inverse' },
      { name: 'text-on-action', kind: 'text', on: 'action-bg' },
    ],
  },
  {
    title: 'Action',
    roles: ['action-bg', 'action-bg-hover', 'action-bg-pressed'].map((name): Role => ({ name, kind: 'action' })),
  },
];
const FUNCTIONAL = ['success', 'danger', 'warning', 'info'] as const;

const TYPE_STYLES: Array<{ name: string; sample: string }> = [
  { name: 'display-xl', sample: 'Run the map.' },
  { name: 'display-lg', sample: 'Run the map.' },
  { name: 'h1', sample: 'Run the map.' },
  { name: 'h2', sample: 'Run the map.' },
  { name: 'h3', sample: 'Run the map.' },
  { name: 'h4', sample: 'Run the map.' },
  { name: 'body-lg', sample: 'The owner approves every page before it goes live.' },
  { name: 'body', sample: 'The owner approves every page before it goes live.' },
  { name: 'ui', sample: 'The owner approves every page before it goes live.' },
  { name: 'ui-strong', sample: 'The owner approves every page before it goes live.' },
  { name: 'caption', sample: 'The owner approves every page before it goes live.' },
  { name: 'eyebrow', sample: 'AI visibility for small businesses' },
  { name: 'stat', sample: '12,480' },
];

const SPACES = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'];
const RADII = ['sm', 'md', 'lg', 'xl', '2xl', 'full'];
const SECTIONS = ['theme', 'palette', 'roles', 'type', 'space', 'elevation', 'motion', 'icons', 'controls', 'brand'];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function RoleTile({ role }: { role: Role }) {
  let tile: CSSProperties = {};
  let text = '';
  if (role.kind === 'bg') {
    tile = { background: `var(--${role.name})` };
  } else if (role.kind === 'border') {
    tile = { background: 'var(--bg-surface)', border: `3px solid var(--${role.name})` };
  } else if (role.kind === 'action') {
    tile = { background: `var(--${role.name})`, color: 'var(--text-on-action)' };
    text = 'Button';
  } else {
    tile = { background: `var(--${role.on ?? 'bg-surface'})`, color: `var(--${role.name})` };
    text = 'Aa 123';
  }
  return (
    <div className={styles.roleItem}>
      <div className={styles.roleTile} style={tile}>
        {text}
      </div>
      <code className={styles.token}>--{role.name}</code>
    </div>
  );
}

const ICON_NAMES = Object.keys(ICONS) as IconName[];

const VARIANT_LABELS: Array<{ variant: ButtonVariant; label: string }> = [
  { variant: 'primary', label: 'Publish site' },
  { variant: 'secondary', label: 'Preview' },
  { variant: 'ghost', label: 'Skip' },
  { variant: 'destructive', label: 'Delete page' },
];

export default function DesignPage() {
  if (process.env.VERCEL_ENV === 'production') {
    notFound();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Design tokens</h1>
        <p className={styles.lead}>
          The Reydarr style guide. A checking tool for tokens, type, components and brand. Rules live in
          docs/design. Product screens use one Ping primary action. This page shows many only to display states.
        </p>
      </header>
      <nav className={styles.nav} aria-label="Sections">
        {SECTIONS.map((id) => (
          <a key={id} href={`#${id}`} className={styles.navLink}>
            {id}
          </a>
        ))}
      </nav>

      <Section id="theme" title="Theme">
        <ThemeSwitcher />
      </Section>

      <Section id="palette" title="Palette">
        <p className={styles.note}>Raw values from palette.css. Components never read these.</p>
        <h3 className={styles.group}>Brand</h3>
        <div className={styles.swatchGrid}>
          {BRAND_NAMES.map((name) => (
            <div key={name} className={styles.swatch}>
              <span className={styles.chip} style={{ background: `var(--palette-${name})` }} />
              <code className={styles.token}>{name}</code>
            </div>
          ))}
        </div>
        {SCALES.map((scale) => (
          <div key={scale.title}>
            <h3 className={styles.group}>{scale.title}</h3>
            <div className={styles.swatchGrid}>
              {scale.names.map((name) => (
                <div key={name} className={styles.swatch}>
                  <span className={styles.chip} style={{ background: `var(--palette-${name})` }} />
                  <code className={styles.token}>{name}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      <Section id="roles" title="Roles">
        {ROLE_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className={styles.group}>{group.title}</h3>
            <div className={styles.roleGrid}>
              {group.roles.map((role) => (
                <RoleTile key={role.name} role={role} />
              ))}
            </div>
          </div>
        ))}
        <h3 className={styles.group}>Functional</h3>
        <div className={styles.roleGrid}>
          {FUNCTIONAL.map((tone) => (
            <div key={tone} className={styles.roleItem}>
              <div className={styles.pair}>
                <span className={styles.pairHalf} style={{ background: `var(--${tone}-solid)`, color: `var(--${tone}-on-solid)` }}>
                  Solid
                </span>
                <span className={styles.pairHalf} style={{ background: `var(--${tone}-subtle)`, color: `var(--${tone}-text)` }}>
                  Subtle
                </span>
              </div>
              <code className={styles.token}>{tone}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section id="type" title="Typography">
        <p className={styles.note}>Manrope for headings and numbers. DM Sans for body and interface.</p>
        {TYPE_STYLES.map((style) => (
          <div key={style.name} className={styles.typeRow}>
            <code className={styles.token}>type-{style.name}</code>
            <p className={`type-${style.name} ${styles.typeSample}`}>{style.sample}</p>
          </div>
        ))}
        <h3 className={styles.group}>Tabular figures</h3>
        <p className={styles.note}>Left uses data-numeric. Right does not. Compare how the digits line up.</p>
        <div className={styles.numbers}>
          <div className={styles.numberBox} data-numeric>
            <span>1,234.50</span>
            <span>11,111.11</span>
            <span>8,888.88</span>
          </div>
          <div className={styles.numberBox}>
            <span>1,234.50</span>
            <span>11,111.11</span>
            <span>8,888.88</span>
          </div>
          <div className={`${styles.numberBox} type-stat`} data-numeric>
            <span>1,234.50</span>
            <span>11,111.11</span>
            <span>8,888.88</span>
          </div>
        </div>
      </Section>

      <Section id="space" title="Spacing and radius">
        <div className={styles.bars}>
          {SPACES.map((n) => (
            <div key={n} className={styles.barRow}>
              <code className={styles.token}>--space-{n}</code>
              <span className={styles.bar} style={{ width: `var(--space-${n})` }} />
            </div>
          ))}
        </div>
        <h3 className={styles.group}>Radius</h3>
        <div className={styles.roleGrid}>
          {RADII.map((name) => (
            <div key={name} className={styles.roleItem}>
              <div className={styles.radiusBox} style={{ borderRadius: `var(--radius-${name})` }} />
              <code className={styles.token}>--radius-{name}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section id="elevation" title="Elevation">
        <p className={styles.note}>
          Light separates with hairlines. Dark uses lighter surfaces, a border and a faint top edge. Switch the theme to compare.
        </p>
        <div className={styles.elevRow}>
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={styles.elev}
              style={{
                boxShadow: `var(--elev-${level})`,
                background: level === 1 ? 'var(--bg-surface)' : 'var(--bg-raised)',
              }}
            >
              <code className={styles.token}>--elev-{level}</code>
              <span>{level === 1 ? 'Cards' : level === 2 ? 'Menus' : 'Dialogs'}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="motion" title="Motion">
        <p className={styles.note}>Each dot moves with transform and its own duration. Reduced motion makes the move instant.</p>
        <MotionDemo />
      </Section>

      <Section id="icons" title="Icons">
        <p className={styles.note}>One set, stroke 1.5, sizes 16, 20 and 24, through the Icon component only.</p>
        <div className={styles.iconGrid}>
          {ICON_NAMES.map((name) => (
            <div key={name} className={styles.iconItem}>
              <Icon name={name} size={24} />
              <code className={styles.token}>{name}</code>
            </div>
          ))}
        </div>
        <div className={styles.row}>
          <Icon name="site" size={16} />
          <Icon name="site" size={20} />
          <Icon name="site" size={24} />
        </div>
      </Section>

      <Section id="controls" title="Controls">
        <h3 className={styles.group}>Buttons and their states</h3>
        {VARIANT_LABELS.map(({ variant, label }) => (
          <div key={variant} className={styles.stateBlock}>
            <code className={styles.token}>{variant}</code>
            <div className={styles.row}>
              <Button variant={variant}>{label}</Button>
              <Button variant={variant} demoState="hover">Hover</Button>
              <Button variant={variant} demoState="pressed">Pressed</Button>
              <Button variant={variant} demoState="focus">Focus</Button>
              <Button variant={variant} disabled>Disabled</Button>
              <Button variant={variant} loading>Loading</Button>
            </div>
          </div>
        ))}
        <h3 className={styles.group}>Sizes, icons and icon-only</h3>
        <div className={styles.row}>
          <Button variant="secondary" size="sm">Small</Button>
          <Button variant="secondary" size="md">Medium</Button>
          <Button variant="secondary" size="lg">Large</Button>
          <Button variant="secondary" leadingIcon="plus">Add page</Button>
          <Button variant="secondary" trailingIcon="chevron-right">Continue</Button>
          <IconButton icon="settings" label="Settings" />
          <IconButton icon="search" label="Search" variant="secondary" />
        </div>
        <p className={styles.note}>Controls are 32, 36 and 40px with a mouse and 44px on touch.</p>

        <h3 className={styles.group}>Inputs</h3>
        <div className={styles.formGrid}>
          <Input label="Business name" placeholder="Your business name" />
          <Input label="Focus" placeholder="Focused look" demoState="focus" />
          <Input label="Phone number" error="Enter a number like +234 801 234 5678." defaultValue="0801" />
          <Input label="Disabled" disabled defaultValue="Not available" />
          <Input label="Website address" prefixText="https://" helper="Use letters, numbers and dashes." />
          <Input label="Tagline" optional placeholder="Optional" />
        </div>

        <h3 className={styles.group}>Badges</h3>
        <div className={styles.row}>
          <Badge tone="success">Published</Badge>
          <Badge tone="danger">Failed</Badge>
          <Badge tone="warning">Needs review</Badge>
          <Badge tone="info">Draft</Badge>
          <Badge>Neutral</Badge>
        </div>

        <h3 className={styles.group}>Settings card</h3>
        <div className={styles.stack}>
          <SettingsCard
            title="Website address"
            description="This is where customers find your site."
            footerText="Use letters, numbers and dashes."
            action={<Button variant="secondary" disabled>Save</Button>}
          >
            <Input label="Address" prefixText="https://" placeholder="your-business" />
          </SettingsCard>
          <SettingsCard
            title="Business name"
            description="Shown on your site and in Zuri's posts."
            footerText="Changes go live after you approve."
            action={<Button variant="primary">Save changes</Button>}
          >
            <Input label="Name" defaultValue="Your business name" />
          </SettingsCard>
        </div>
      </Section>

      <Section id="brand" title="Brand">
        <p className={styles.note}>Logo picks its file from the theme. Mark detail follows size.</p>
        <div className={styles.row}>
          <Logo variant="lockup" height={28} />
          <Logo variant="lockup" height={48} />
          <Logo variant="wordmark" height={24} />
        </div>
        <div className={styles.row}>
          <Logo variant="mark" height={16} />
          <Logo variant="mark" height={32} />
          <Logo variant="mark" height={56} />
        </div>
        <h3 className={styles.group}>Zuri (placeholder mark)</h3>
        <div className={styles.row}>
          <ZuriMark height={24} />
          <ZuriMark height={40} />
          <ZuriAvatar size={24} />
          <ZuriAvatar size={32} />
          <ZuriAvatar size={44} />
          <ZuriAvatar size={64} />
        </div>
      </Section>
    </main>
  );
}
