import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Ban,
  BarChart3,
  Bell,
  Box,
  Building2,
  Camera,
  FileText,
  LayoutGrid,
  Scale,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Coins,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  Flag,
  Globe,
  Home,
  ImageIcon,
  Info,
  Key,
  Link2,
  ListFilter,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  Minus,
  Package,
  Pencil,
  Phone,
  PhoneCall,
  Plus,
  Printer,
  QrCode,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Share2,
  Shield,
  Signal,
  Sparkles,
  Star,
  Store,
  Tag,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Truck,
  Upload,
  User,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import type { IconName } from "@/types/icon";
import type { SVGProps } from "react";

type IconComponent = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

const WhatsAppIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.5-4.4a8.4 8.4 0 1 1 15.5-4.4z" />
  </svg>
);

/* Lucide removed brand marks, so the social glyphs are drawn here. */

const FacebookIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M14.5 8.5H17V5h-2.5C12.6 5 11 6.6 11 8.6V11H8.5v3.5H11V21h3.5v-6.5h2.6l.4-3.5h-3V9.2c0-.4.3-.7.7-.7z" />
  </svg>
);

const InstagramIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TelegramIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden {...props}>
    <path d="M21 4 3 11l5 2 2 6 3-4 5 4z" />
    <path d="m8 13 9-6-6 8" />
  </svg>
);

const XSocialIcon: IconComponent = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M17.2 3h3.3l-7.2 8.2L21.8 21h-6.6l-4.3-5.6L5.9 21H2.6l7.7-8.8L2.2 3h6.8l3.9 5.2zm-1.2 16h1.8L8.1 4.9H6.1z" />
  </svg>
);

export const iconMap: Record<IconName, IconComponent> = {
  bolt: (props) => <Zap {...props} />,
  camera: (props) => <Camera {...props} />,
  arrowRight: (props) => <ArrowRight {...props} />,
  arrowLeft: (props) => <ArrowLeft {...props} />,
  check: (props) => <Check {...props} />,
  x: (props) => <X {...props} />,
  plus: (props) => <Plus {...props} />,
  minus: (props) => <Minus {...props} />,
  flag: (props) => <Flag {...props} />,
  wallet: (props) => <Wallet {...props} />,
  shield: (props) => <Shield {...props} />,
  whatsapp: WhatsAppIcon,
  truck: (props) => <Truck {...props} />,
  users: (props) => <Users {...props} />,
  key: (props) => <Key {...props} />,
  signal: (props) => <Signal {...props} />,
  globe: (props) => <Globe {...props} />,
  coins: (props) => <Coins {...props} />,
  card: (props) => <CreditCard {...props} />,
  mapPin: (props) => <MapPin {...props} />,
  menu: (props) => <Menu {...props} />,
  clock: (props) => <Clock {...props} />,
  spark: (props) => <Sparkles {...props} />,
  lock: (props) => <Lock {...props} />,
  trash: (props) => <Trash2 {...props} />,
  refresh: (props) => <RefreshCw {...props} />,
  undo: (props) => <RotateCcw {...props} />,
  upload: (props) => <Upload {...props} />,
  star: (props) => <Star {...props} />,
  info: (props) => <Info {...props} />,
  alert: (props) => <AlertTriangle {...props} />,
  chevronDown: (props) => <ChevronDown {...props} />,
  eye: (props) => <Eye {...props} />,
  thumbsUp: (props) => <ThumbsUp {...props} />,
  thumbsDown: (props) => <ThumbsDown {...props} />,
  phone: (props) => <Phone {...props} />,
  bank: (props) => <Building2 {...props} />,
  user: (props) => <User {...props} />,
  store: (props) => <Store {...props} />,
  call: (props) => <PhoneCall {...props} />,
  message: (props) => <MessageCircle {...props} />,
  copy: (props) => <Copy {...props} />,
  qr: (props) => <QrCode {...props} />,
  print: (props) => <Printer {...props} />,
  download: (props) => <Download {...props} />,
  open: (props) => <ExternalLink {...props} />,
  edit: (props) => <Pencil {...props} />,
  link: (props) => <Link2 {...props} />,
  share: (props) => <Share2 {...props} />,
  image: (props) => <ImageIcon {...props} />,
  chart: (props) => <BarChart3 {...props} />,
  mail: (props) => <Mail {...props} />,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  telegram: TelegramIcon,
  xSocial: XSocialIcon,
  home: (props) => <Home {...props} />,
  tag: (props) => <Tag {...props} />,
  package: (props) => <Package {...props} />,
  megaphone: (props) => <Megaphone {...props} />,
  settings: (props) => <Settings {...props} />,
  search: (props) => <Search {...props} />,
  bell: (props) => <Bell {...props} />,
  box: (props) => <Box {...props} />,
  chevronRight: (props) => <ChevronRight {...props} />,
  filter: (props) => <ListFilter {...props} />,
  layoutGrid: (props) => <LayoutGrid {...props} />,
  scale: (props) => <Scale {...props} />,
  ban: (props) => <Ban {...props} />,
  fileText: (props) => <FileText {...props} />,
};
