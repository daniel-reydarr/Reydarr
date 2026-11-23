"use client";

import { useSyncExternalStore } from "react";
import styles from "./design.module.css";
import { clearThemePreference, getTheme, setTheme, type Theme } from "@/lib/theme";

/* The applied theme lives on <html>, outside React. This store lets the label
   follow it without setting state from an effect. */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

export function ThemeButtons() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme);

  function choose(next: Theme) {
    setTheme(next);
    notify();
  }

  function followSystem() {
    clearThemePreference();
    notify();
  }

  return (
    <div className={styles.themeBlock}>
      <div className={styles.controlRow}>
        <button type="button" className={styles.secondaryButton} onClick={() => choose("light")}>
          Light
        </button>
        <button type="button" className={styles.secondaryButton} onClick={() => choose("dark")}>
          Dark
        </button>
        <button type="button" className={styles.secondaryButton} onClick={followSystem}>
          System
        </button>
      </div>
      <p className={styles.note}>Current theme: {theme}</p>
    </div>
  );
}
