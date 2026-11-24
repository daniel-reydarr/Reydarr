/* Single list of brand files served from public/brand. Components read paths from here,
   and files.test.ts checks every path exists. Never write a brand path anywhere else. */
export const BRAND = {
  lockup: { light: '/brand/reydarr-lockup-light.svg', dark: '/brand/reydarr-lockup-dark.svg', width: 165.5, height: 64 },
  wordmark: { light: '/brand/reydarr-wordmark-ink.svg', dark: '/brand/reydarr-wordmark-bone.svg', width: 96, height: 24 },
  mark: { light: '/brand/reydarr-mark-light.svg', dark: '/brand/reydarr-mark-dark.svg', width: 64, height: 64 },
  markCompact: { light: '/brand/reydarr-mark-compact-light.svg', dark: '/brand/reydarr-mark-compact-dark.svg', width: 64, height: 64 },
  markMicro: { light: '/brand/reydarr-mark-micro-light.svg', dark: '/brand/reydarr-mark-micro-dark.svg', width: 64, height: 64 },
  zuriIcon: { light: '/brand/zuri-icon-ink.svg', dark: '/brand/zuri-icon-bone.svg', width: 96, height: 96 },
  zuriAvatar: { light: '/brand/zuri-avatar-ink-light.svg', dark: '/brand/zuri-avatar-bone-dark.svg', width: 512, height: 512 },
} as const;

export type BrandAsset = (typeof BRAND)[keyof typeof BRAND];
