/* The Reydarr logo (docs/design/07-logo-and-brand-usage.md). Picks the file for the theme.
   Product code uses this component and never a brand file path.
   Mark detail follows size: 40px and up full, 17 to 39 compact, 16 and below micro. */
import { BRAND } from './files';
import { ThemedImage } from './ThemedImage';

type LogoProps = {
  variant?: 'lockup' | 'mark' | 'wordmark';
  /* Rendered height in px. The lockup should not go below 24. */
  height?: number;
  /* Set when the name already appears next to the logo, so screen readers skip it. */
  decorative?: boolean;
  priority?: boolean;
  className?: string;
};

function markAsset(height: number) {
  if (height >= 40) {
    return BRAND.mark;
  }
  return height >= 17 ? BRAND.markCompact : BRAND.markMicro;
}

export function Logo({
  variant = 'lockup',
  height = 28,
  decorative = false,
  priority = false,
  className,
}: LogoProps) {
  const asset =
    variant === 'lockup' ? BRAND.lockup : variant === 'wordmark' ? BRAND.wordmark : markAsset(height);
  return (
    <ThemedImage
      light={asset.light}
      dark={asset.dark}
      sourceWidth={asset.width}
      sourceHeight={asset.height}
      height={height}
      alt={decorative ? '' : 'Reydarr'}
      priority={priority}
      className={className}
    />
  );
}
