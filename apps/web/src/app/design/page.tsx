import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./design.module.css";
import { ThemeButtons } from "./ThemeButtons";

export const metadata: Metadata = {
  title: "Design tokens",
  robots: { index: false, follow: false },
};

const paletteNames = [
  "ink",
  "night",
  "bone",
  "ping",
  "ping-deep",
  "slate",
  "white",
  "navy-950",
  "navy-900",
  "navy-800",
  "navy-700",
  "navy-600",
  "navy-500",
  "navy-400",
  "navy-300",
  "bone-50",
  "bone-100",
  "bone-200",
  "bone-300",
  "bone-500",
  "ping-400",
  "ping-500",
  "ping-550",
  "ping-600",
  "ping-650",
  "ping-800",
  "green-700",
  "green-600",
  "green-100",
  "green-400",
  "green-300",
  "green-950",
  "rose-700",
  "rose-600",
  "rose-100",
  "rose-400",
  "rose-300",
  "rose-950",
  "amber-800",
  "amber-600",
  "amber-100",
  "amber-400",
  "amber-300",
  "amber-950",
  "blue-700",
  "blue-600",
  "blue-100",
  "blue-400",
  "blue-300",
  "blue-950",
];

const backgroundRoles = ["bg-page", "bg-surface", "bg-subtle", "bg-inverse", "overlay"];
const borderRoles = ["border-subtle", "border-strong"];
const textRoles = ["text-primary", "text-secondary", "text-disabled", "text-brand"];
const actionRoles = ["action-bg", "action-bg-hover", "action-bg-pressed"];
const focusRoles = ["focus-ring"];

const functionalGroups = [
  {
    name: "success",
    solid: "success-solid",
    onSolid: "success-on-solid",
    subtle: "success-subtle",
    text: "success-text",
  },
  {
    name: "danger",
    solid: "danger-solid",
    onSolid: "danger-on-solid",
    subtle: "danger-subtle",
    text: "danger-text",
  },
  {
    name: "warning",
    solid: "warning-solid",
    onSolid: "warning-on-solid",
    subtle: "warning-subtle",
    text: "warning-text",
  },
  {
    name: "info",
    solid: "info-solid",
    onSolid: "info-on-solid",
    subtle: "info-subtle",
    text: "info-text",
  },
];

const sizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"];
const spaces = ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"];
const radii = ["sm", "md", "lg", "xl", "full"];
const shadows = ["sm", "md", "lg"];
const weights = ["regular", "medium", "semibold", "bold"];
const weightValues = { regular: "400", medium: "500", semibold: "600", bold: "700" };

function ColorTile({ role }: { role: string }) {
  return (
    <li className={styles.tile}>
      <span className={styles.tileFill} style={{ background: `var(--${role})` }} />
      <span className={styles.tileName}>--{role}</span>
    </li>
  );
}

function TextTile({ role, background }: { role: string; background: string }) {
  return (
    <li className={styles.tile}>
      <span
        className={styles.tileText}
        style={{ background: `var(--${background})`, color: `var(--${role})` }}
      >
        Sample text 123
      </span>
      <span className={styles.tileName}>--{role}</span>
    </li>
  );
}

function BorderTile({ role, background }: { role: string; background: string }) {
  return (
    <li className={styles.tile}>
      <span
        className={styles.tileBorder}
        style={{ background: `var(--${background})`, borderColor: `var(--${role})` }}
      />
      <span className={styles.tileName}>--{role}</span>
    </li>
  );
}

function RingTile({ role, background }: { role: string; background: string }) {
  return (
    <li className={styles.tile}>
      <span
        className={styles.tileRing}
        style={{ background: `var(--${background})`, outlineColor: `var(--${role})` }}
      />
      <span className={styles.tileName}>--{role}</span>
    </li>
  );
}

export default function DesignPage() {
  if (process.env.VERCEL_ENV === "production") {
    notFound();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Design tokens</h1>
        <p className={styles.lead}>
          A checking tool for the Reydarr tokens. Colors here come from role tokens, except the
          palette section.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Theme</h2>
        <ThemeButtons />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Palette</h2>
        <p className={styles.note}>
          Raw values from palette.css. Components never read these.
        </p>
        <ul className={styles.tileGrid}>
          {paletteNames.map((name) => (
            <li key={name} className={styles.tile}>
              <span
                className={styles.tileFill}
                style={{ background: `var(--palette-${name})` }}
              />
              <span className={styles.tileName}>--palette-{name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Roles</h2>

        <h3 className={styles.groupTitle}>Backgrounds</h3>
        <ul className={styles.tileGrid}>
          {backgroundRoles.map((role) => (
            <ColorTile key={role} role={role} />
          ))}
        </ul>

        <h3 className={styles.groupTitle}>Borders</h3>
        <ul className={styles.tileGrid}>
          {borderRoles.map((role) => (
            <BorderTile key={role} role={role} background="bg-surface" />
          ))}
        </ul>

        <h3 className={styles.groupTitle}>Text</h3>
        <ul className={styles.tileGrid}>
          {textRoles.map((role) => (
            <TextTile key={role} role={role} background="bg-surface" />
          ))}
          <TextTile role="text-on-inverse" background="bg-inverse" />
          <TextTile role="text-on-action" background="action-bg" />
        </ul>

        <h3 className={styles.groupTitle}>Action</h3>
        <ul className={styles.tileGrid}>
          {actionRoles.map((role) => (
            <li key={role} className={styles.tile}>
              <span className={styles.tileText} style={{ background: `var(--${role})`, color: "var(--text-on-action)" }}>
                Button
              </span>
              <span className={styles.tileName}>--{role}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.groupTitle}>Focus ring</h3>
        <ul className={styles.tileGrid}>
          {focusRoles.map((role) => (
            <RingTile key={role} role={role} background="bg-surface" />
          ))}
        </ul>

        <h3 className={styles.groupTitle}>Functional</h3>
        {functionalGroups.map((group) => (
          <div key={group.name} className={styles.functionalGroup}>
            <p className={styles.groupLabel}>{group.name}</p>
            <ul className={styles.tileGrid}>
              <li className={styles.tile}>
                <span
                  className={styles.tileText}
                  style={{ background: `var(--${group.solid})`, color: `var(--${group.onSolid})` }}
                >
                  Solid
                </span>
                <span className={styles.tileName}>
                  --{group.solid} / --{group.onSolid}
                </span>
              </li>
              <li className={styles.tile}>
                <span
                  className={styles.tileText}
                  style={{ background: `var(--${group.subtle})`, color: `var(--${group.text})` }}
                >
                  Subtle
                </span>
                <span className={styles.tileName}>
                  --{group.subtle} / --{group.text}
                </span>
              </li>
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Typography</h2>
        <p className={styles.note}>Heading font, Manrope 600 and 700.</p>
        <ul className={styles.typeList}>
          {sizes.map((size) => (
            <li key={`heading-${size}`} className={styles.typeRow}>
              <span className={styles.typeLabel}>--text-{size}</span>
              <span
                className={styles.typeHeadingSample}
                style={{ fontSize: `var(--text-${size}-size)`, lineHeight: `var(--text-${size}-line)` }}
              >
                Run the map.
              </span>
            </li>
          ))}
        </ul>

        <p className={styles.note}>Body font, DM Sans 400, 500 and 600.</p>
        <ul className={styles.typeList}>
          {sizes.map((size) => (
            <li key={`body-${size}`} className={styles.typeRow}>
              <span className={styles.typeLabel}>--text-{size}</span>
              <span
                className={styles.typeBodySample}
                style={{ fontSize: `var(--text-${size}-size)`, lineHeight: `var(--text-${size}-line)` }}
              >
                The owner approves every page before it goes live.
              </span>
            </li>
          ))}
        </ul>

        <p className={styles.note}>Weights.</p>
        <ul className={styles.typeList}>
          {weights.map((weight) => (
            <li key={weight} className={styles.typeRow}>
              <span className={styles.typeLabel}>
                {weightValues[weight as keyof typeof weightValues]}
              </span>
              <span
                className={styles.weightSample}
                style={{ fontWeight: `var(--weight-${weight})` }}
              >
                Run the map. The owner approves it.
              </span>
            </li>
          ))}
        </ul>

        <p className={styles.note}>Tabular figures. Left column uses data-numeric.</p>
        <div className={styles.numbers}>
          <ul className={styles.numberColumn} data-numeric>
            <li>1,234.50</li>
            <li>11,111.11</li>
            <li>8,888.88</li>
          </ul>
          <ul className={styles.numberColumn}>
            <li>1,234.50</li>
            <li>11,111.11</li>
            <li>8,888.88</li>
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Spacing, radius and shadow</h2>

        <h3 className={styles.groupTitle}>Spacing</h3>
        <ul className={styles.spacingList}>
          {spaces.map((step) => (
            <li key={step} className={styles.spacingRow}>
              <span className={styles.spacingLabel}>--space-{step}</span>
              <span className={styles.spacingBar} style={{ width: `var(--space-${step})` }} />
            </li>
          ))}
        </ul>

        <h3 className={styles.groupTitle}>Radius</h3>
        <ul className={styles.radiusList}>
          {radii.map((radius) => (
            <li key={radius} className={styles.radiusItem}>
              <span
                className={styles.radiusBox}
                style={{ borderRadius: `var(--radius-${radius})` }}
              />
              <span className={styles.tileName}>--radius-{radius}</span>
            </li>
          ))}
        </ul>

        <h3 className={styles.groupTitle}>Shadow</h3>
        <ul className={styles.shadowList}>
          {shadows.map((shadow) => (
            <li
              key={shadow}
              className={styles.shadowCard}
              style={{ boxShadow: `var(--shadow-${shadow})` }}
            >
              <span className={styles.tileName}>--shadow-{shadow}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>6. Motion</h2>
        <p className={styles.note}>
          Each box moves with its own duration and the standard easing. With reduced motion on,
          the move is instant.
        </p>
        <div className={styles.motionBlock}>
          <input type="checkbox" id="motion-play" className={styles.motionToggle} />
          <label htmlFor="motion-play" className={styles.playButton}>
            Play
          </label>
          <div className={styles.motionRows}>
            <div className={styles.motionRow}>
              <span className={styles.motionLabel}>Fast</span>
              <span className={styles.track}>
                <span className={`${styles.box} ${styles.boxFast}`} />
              </span>
              <span className={styles.motionValue}>--duration-fast</span>
            </div>
            <div className={styles.motionRow}>
              <span className={styles.motionLabel}>Base</span>
              <span className={styles.track}>
                <span className={`${styles.box} ${styles.boxBase}`} />
              </span>
              <span className={styles.motionValue}>--duration-base</span>
            </div>
            <div className={styles.motionRow}>
              <span className={styles.motionLabel}>Slow</span>
              <span className={styles.track}>
                <span className={`${styles.box} ${styles.boxSlow}`} />
              </span>
              <span className={styles.motionValue}>--duration-slow</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>7. Controls</h2>

        <h3 className={styles.groupTitle}>Primary button</h3>
        <div className={styles.controlRow}>
          <button type="button" className={styles.primaryButton}>
            Publish
          </button>
          <span className={styles.look}>
            <button type="button" className={`${styles.primaryButton} ${styles.primaryHover}`}>
              Hover
            </button>
            <span className={styles.tileName}>hover look</span>
          </span>
          <span className={styles.look}>
            <button type="button" className={`${styles.primaryButton} ${styles.primaryPressed}`}>
              Pressed
            </button>
            <span className={styles.tileName}>pressed look</span>
          </span>
          <span className={styles.look}>
            <button type="button" className={styles.primaryButton} disabled>
              Disabled
            </button>
            <span className={styles.tileName}>disabled look</span>
          </span>
        </div>

        <h3 className={styles.groupTitle}>Secondary button</h3>
        <div className={styles.controlRow}>
          <button type="button" className={styles.secondaryButton}>
            Preview
          </button>
        </div>

        <h3 className={styles.groupTitle}>Text input</h3>
        <div className={styles.controlRow}>
          <input
            className={styles.textInput}
            type="text"
            placeholder="Business name"
            aria-label="Business name"
          />
        </div>

        <h3 className={styles.groupTitle}>Status chips</h3>
        <ul className={styles.chipRow}>
          <li className={`${styles.chip} ${styles.chipSuccess}`}>
            <span className={styles.chipIcon} aria-hidden="true">
              &#10003;
            </span>
            Published
          </li>
          <li className={`${styles.chip} ${styles.chipDanger}`}>
            <span className={styles.chipIcon} aria-hidden="true">
              &#10005;
            </span>
            Failed
          </li>
          <li className={`${styles.chip} ${styles.chipWarning}`}>
            <span className={styles.chipIcon} aria-hidden="true">
              !
            </span>
            Needs review
          </li>
          <li className={`${styles.chip} ${styles.chipInfo}`}>
            <span className={styles.chipIcon} aria-hidden="true">
              i
            </span>
            Draft
          </li>
        </ul>
      </section>
    </main>
  );
}
