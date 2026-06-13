import React from 'react';
import {
  Bed, Droplets, Wifi, ShieldCheck, Compass, Briefcase, Utensils, Fan,
  Tv, Wind, Mountain, Flame, Sparkles, Sun, Trees, Heart, Coffee, Car,
  MapPin, Activity, Moon, Calendar, Bath, BedDouble, ArrowRight, Maximize2,
  Leaf, Zap, Users, ChevronLeft, ChevronRight, Star, Check, Shield, Eye,
  Lock, FileText, ArrowLeft, ShieldAlert, AlertTriangle, Scale, Globe,
  UtensilsCrossed, Wine
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  Bed, Droplets, Wifi, ShieldCheck, Compass, Briefcase, Utensils, Fan,
  Tv, Wind, Mountain, Flame, Sparkles, Sun, Trees, Heart, Coffee, Car,
  MapPin, Activity, Moon, Calendar, Bath, BedDouble, ArrowRight, Maximize2,
  Leaf, Zap, Users, ChevronLeft, ChevronRight, Star, Check, Shield, Eye,
  Lock, FileText, ArrowLeft, ShieldAlert, AlertTriangle, Scale, Globe,
  UtensilsCrossed, Wine
};

export interface DynamicIconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

export function DynamicIcon({ name, className = "h-4 w-4", strokeWidth = 1.5 }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    // Default fallback if not found or empty
    return <Sparkles className={className} strokeWidth={strokeWidth} />;
  }
  return <IconComponent className={className} strokeWidth={strokeWidth} />;
}

export default DynamicIcon;
