import {
  ArrowRight,
  BarChart3,
  Check,
  CreditCard,
  Eye,
  Globe,
  HelpCircle,
  Layers,
  Lock,
  MessageCircle,
  RefreshCw,
  Send,
  Shield,
  Smartphone,
  Target,
  Users,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  check: Check,
  x: X,
  arrowRight: ArrowRight,
  zap: Zap,
  shield: Shield,
  eye: Eye,
  messageCircle: MessageCircle,
  barChart: BarChart3,
  globe: Globe,
  smartphone: Smartphone,
  creditCard: CreditCard,
  target: Target,
  helpCircle: HelpCircle,
  layers: Layers,
  lock: Lock,
  users: Users,
  refreshCw: RefreshCw,
  send: Send,
};

export type IconName = keyof typeof iconMap;

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? HelpCircle;
}
