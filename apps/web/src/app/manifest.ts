import type { MetadataRoute } from 'next';
import { THEME_COLORS } from '@/lib/theme';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Reydarr',
    short_name: 'Reydarr',
    description: 'Websites for small businesses in Nigeria, built with Zuri.',
    start_url: '/',
    display: 'standalone',
    background_color: THEME_COLORS.light,
    theme_color: THEME_COLORS.light,
    icons: [
      { src: '/icons/reydarr-app-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/reydarr-app-icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/reydarr-app-icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
