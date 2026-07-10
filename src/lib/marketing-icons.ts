import {
  BarChart3,
  CreditCard,
  Eye,
  Globe,
  Layers,
  Lock,
  MessageCircle,
  RefreshCw,
  Send,
  Shield,
  Smartphone,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { MarketingIconKey } from "@/types/marketing";

export const MARKETING_ICONS: Record<MarketingIconKey, LucideIcon> = {
  layers: Layers,
  target: Target,
  zap: Zap,
  messageCircle: MessageCircle,
  barChart: BarChart3,
  eye: Eye,
  shield: Shield,
  creditCard: CreditCard,
  refreshCw: RefreshCw,
  globe: Globe,
  lock: Lock,
  smartphone: Smartphone,
  users: Users,
  send: Send,
};
