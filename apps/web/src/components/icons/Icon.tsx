/* One icon component for the whole app. Stroke 1.5, sizes 16, 20 or 24, color from the
   surrounding text role. Decorative unless a label is given. */
import { ICONS, type IconName } from './registry';

type IconProps = {
  name: IconName;
  size?: 16 | 20 | 24;
  /* Give a label only when the icon stands alone and carries meaning. */
  label?: string;
  className?: string;
};

export function Icon({ name, size = 20, label, className }: IconProps) {
  const Glyph = ICONS[name];
  return (
    <Glyph
      size={size}
      strokeWidth={1.5}
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    />
  );
}
