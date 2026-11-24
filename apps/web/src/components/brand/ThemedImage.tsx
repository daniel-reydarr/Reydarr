/* Renders a light and a dark version of an image and lets CSS show the right one from
   <html data-theme>. No JavaScript, so there is no flash and no hydration mismatch.
   Internal to the brand components. Use Logo, ZuriMark or ZuriAvatar instead. */
import Image from 'next/image';
import styles from './ThemedImage.module.css';

type ThemedImageProps = {
  light: string;
  dark: string;
  /* Intrinsic size of the files, used for the aspect ratio. */
  sourceWidth: number;
  sourceHeight: number;
  /* Rendered height in px. Width follows the aspect ratio. */
  height: number;
  alt: string;
  priority?: boolean;
  className?: string;
};

export function ThemedImage({
  light,
  dark,
  sourceWidth,
  sourceHeight,
  height,
  alt,
  priority = false,
  className,
}: ThemedImageProps) {
  const width = Math.round((height * sourceWidth) / sourceHeight);
  const loading = priority ? 'eager' : 'lazy';
  const wrapper = className ? `${styles.wrap} ${className}` : styles.wrap;
  return (
    <span className={wrapper}>
      {/* SVG files are already optimized, so Next's image optimizer is skipped. */}
      <Image className={styles.light} src={light} alt={alt} width={width} height={height} loading={loading} unoptimized />
      <Image className={styles.dark} src={dark} alt={alt} width={width} height={height} loading={loading} unoptimized />
    </span>
  );
}
