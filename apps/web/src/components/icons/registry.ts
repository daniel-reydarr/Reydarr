/* The only list of icons the app may use (docs/design/05-icons-and-illustration.md).
   Add an icon here, in one line, and it becomes available through <Icon>. Never import
   from lucide-react anywhere else, and never import the whole set. */
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleX,
  Globe,
  House,
  Inbox,
  Info,
  LoaderCircle,
  Menu,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react';

export const ICONS = {
  alert: CircleAlert,
  back: ArrowLeft,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  close: X,
  home: House,
  menu: Menu,
  plus: Plus,
  requests: Inbox,
  search: Search,
  send: Send,
  settings: Settings,
  site: Globe,
  spinner: LoaderCircle,
  'status-danger': CircleX,
  'status-info': Info,
  'status-success': CircleCheck,
  'status-warning': TriangleAlert,
  zuri: Sparkles,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
