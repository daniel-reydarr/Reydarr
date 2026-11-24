/* Guards the theme script. It must stay valid JavaScript and must carry the storage key. */
import { describe, expect, it } from 'vitest';
import { THEME_COLORS, THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from './theme';

describe('theme init script', () => {
  it('is valid JavaScript', () => {
    expect(() => new Function(THEME_INIT_SCRIPT)).not.toThrow();
  });

  it('uses the storage key and both theme colors', () => {
    expect(THEME_INIT_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(THEME_INIT_SCRIPT).toContain(THEME_COLORS.light);
    expect(THEME_INIT_SCRIPT).toContain(THEME_COLORS.dark);
  });

  it('sets both the applied theme and the saved preference', () => {
    expect(THEME_INIT_SCRIPT).toContain('data-theme');
    expect(THEME_INIT_SCRIPT).toContain('data-theme-pref');
  });
});
