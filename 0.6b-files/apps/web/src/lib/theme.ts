/* Theme switching for Reydarr (R119). Light and dark, set as data-theme on <html>.
   Three user choices: light, dark, or system. A saved light or dark wins. System, or no
   saved choice, follows the device and keeps following it while the page is open.
   The only hex values outside palette.css are the two meta theme-color values below,
   because browsers need a literal color there. Keep them equal to --bg-page. The
   contrast test checks that. Tokens v2 (spec 0.6b). */

export type Theme = 'light' | 'dark';
export type ThemePreference = Theme | 'system';

export const THEME_STORAGE_KEY = 'reydarr-theme';
export const THEME_CHANGE_EVENT = 'reydarr-theme-change';

export const THEME_COLORS: Record<Theme, string> = {
  light: '#f5f2ea',
  dark: '#0a0f1f',
};

/* Runs in <head> before first paint so the page never flashes the wrong theme.
   It sets data-theme (the applied theme) and data-theme-pref (light, dark or system),
   keeps the browser theme-color in step with a manual choice, and follows device changes
   while the choice is system. Keep this string in sync with the functions below. */
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,k='${THEME_STORAGE_KEY}',c=${JSON.stringify(THEME_COLORS)},q=window.matchMedia('(prefers-color-scheme: dark)');function sys(){return q.matches?'dark':'light'}function saved(){try{var s=localStorage.getItem(k);return s==='light'||s==='dark'?s:null}catch(e){return null}}function meta(){var s=saved(),l=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<l.length;i++){var e=l[i];e.setAttribute('content',s?c[s]:((e.getAttribute('media')||'').indexOf('dark')>-1?c.dark:c.light))}}try{var s=saved();d.setAttribute('data-theme',s||sys());d.setAttribute('data-theme-pref',s||'system');meta();document.addEventListener('DOMContentLoaded',meta);if(q.addEventListener){q.addEventListener('change',function(){if(!saved()){d.setAttribute('data-theme',sys());meta();window.dispatchEvent(new Event('${THEME_CHANGE_EVENT}'))}})}}catch(e){d.setAttribute('data-theme','light');d.setAttribute('data-theme-pref','system')}})();`;

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

/* What the person chose: light, dark, or system (no saved choice). */
export function getThemePreference(): ThemePreference {
  if (typeof document === 'undefined') {
    return 'system';
  }
  const pref = document.documentElement.getAttribute('data-theme-pref');
  return pref === 'light' || pref === 'dark' ? pref : 'system';
}

/* Keep every theme-color meta in step. A manual choice sets all of them to that theme's
   color. System restores each one to its own media query's color. */
function syncThemeColorMeta(preference: ThemePreference): void {
  const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
  metas.forEach((meta) => {
    if (preference !== 'system') {
      meta.setAttribute('content', THEME_COLORS[preference]);
      return;
    }
    const media = meta.getAttribute('media') ?? '';
    meta.setAttribute('content', media.includes('dark') ? THEME_COLORS.dark : THEME_COLORS.light);
  });
}

/* Apply a choice and remember it. Storage can be blocked, so saving is best effort.
   Transitions are switched off for one frame so the swap does not animate every property. */
export function setTheme(preference: ThemePreference): void {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  const applied: Theme = preference === 'system' ? systemTheme() : preference;

  root.setAttribute('data-theme-switching', '');
  root.setAttribute('data-theme', applied);
  root.setAttribute('data-theme-pref', preference);
  try {
    if (preference === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    /* Private mode or blocked storage. The theme still applies for this visit. */
  }
  syncThemeColorMeta(preference);
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => root.removeAttribute('data-theme-switching'));
  });
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/* Forget the saved choice and follow the device setting again. Same as setTheme('system'). */
export function clearThemePreference(): void {
  setTheme('system');
}

/* Listen for theme changes, including device changes while the choice is system.
   Returns a function that stops listening. */
export function onThemeChange(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined;
  }
  window.addEventListener(THEME_CHANGE_EVENT, listener);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, listener);
}
