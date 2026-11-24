/* The only place the Zuri mark is rendered (R144). The Zuri icon is a placeholder until a
   planned redesign, so the swap must touch only the files in files.ts and this component.
   ZuriMark is the bare icon. ZuriAvatar is the rounded square used in chat and panels. */
import { BRAND } from './files';
import { ThemedImage } from './ThemedImage';
import styles from './ZuriMark.module.css';

type ZuriMarkProps = {
  height?: number;
  decorative?: boolean;
  className?: string;
};

export function ZuriMark({ height = 24, decorative = false, className }: ZuriMarkProps) {
  const a = BRAND.zuriIcon;
  return (
    <ThemedImage
      light={a.light}
      dark={a.dark}
      sourceWidth={a.width}
      sourceHeight={a.height}
      height={height}
      alt={decorative ? '' : 'Zuri'}
      className={className}
    />
  );
}

type ZuriAvatarProps = {
  size?: 24 | 32 | 44 | 64;
  decorative?: boolean;
};

export function ZuriAvatar({ size = 44, decorative = false }: ZuriAvatarProps) {
  const a = BRAND.zuriAvatar;
  return (
    <ThemedImage
      light={a.light}
      dark={a.dark}
      sourceWidth={a.width}
      sourceHeight={a.height}
      height={size}
      alt={decorative ? '' : 'Zuri'}
      className={styles.avatar}
    />
  );
}
