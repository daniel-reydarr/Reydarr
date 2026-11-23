/* Theme switching for Reydarr (R119). Light and dark, set as data-theme on <html>.
   A saved choice wins. With no saved choice the device setting decides.
   The only hex values outside palette.css are the two meta theme-color values below,
   because browsers need a literal color there. Keep them equal to --bg-page. */

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'reydarr-theme';

export const THEME_COLORS: Record<Theme, string> = {
  light: '#f5f2ea',
  dark: '#0a0f1f',
};

/* Runs in <head> before first paint so the page never flashes the wrong theme.
   Keep this string in sync with the functions below. */
export const THEME_INIT_SCRIPT = `(function(){try{var k='${THEME_STORAGE_KEY}';var s=null;try{s=localStorage.getItem(k);}catch(e){}var t=(s==='light'||s==='dark')?s:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

function systemTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/* The theme currently applied to the page. */
export function getTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/* Apply a theme and remember the choice. Storage can be blocked, so it is best effort. */
export function setTheme(theme: Theme): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Private mode or blocked storage. The theme still applies for this visit. */
  }
}

/* Forget the saved choice and follow the device setting again. */
export function clearThemePreference(): void {
  if (typeof document === 'undefined') {
    return;
  }
  try {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    /* Nothing to remove if storage is blocked. */
  }
  document.documentElement.setAttribute('data-theme', systemTheme());
}
