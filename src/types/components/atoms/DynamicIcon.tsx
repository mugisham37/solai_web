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
} from "lucide-react";
import type { IconName } from "@/lib/icons";

interface DynamicIconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function DynamicIcon({ name, className, size = 20 }: DynamicIconProps) {
  const props = { className, size, strokeWidth: 1.5 as const };

  switch (name) {
    case "check":
      return <Check {...props} />;
    case "x":
      return <X {...props} />;
    case "arrowRight":
      return <ArrowRight {...props} />;
    case "zap":
      return <Zap {...props} />;
    case "shield":
      return <Shield {...props} />;
    case "eye":
      return <Eye {...props} />;
    case "messageCircle":
      return <MessageCircle {...props} />;
    case "barChart":
      return <BarChart3 {...props} />;
    case "globe":
      return <Globe {...props} />;
    case "smartphone":
      return <Smartphone {...props} />;
    case "creditCard":
      return <CreditCard {...props} />;
    case "target":
      return <Target {...props} />;
    case "helpCircle":
      return <HelpCircle {...props} />;
    case "layers":
      return <Layers {...props} />;
    case "lock":
      return <Lock {...props} />;
    case "users":
      return <Users {...props} />;
    case "refreshCw":
      return <RefreshCw {...props} />;
    case "send":
      return <Send {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
}
