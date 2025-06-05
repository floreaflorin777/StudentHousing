import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarDays, 
  CheckCircle, 
  ShoppingCart, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: "red" | "green" | "amber" | "blue";
  subtitle?: string;
}

const iconMap = {
  "calendar-day": CalendarDays,
  "check-circle": CheckCircle,
  "shopping-cart": ShoppingCart,
  "users": Users,
};

const colorMap = {
  red: "bg-orange-pantone text-white",
  green: "bg-hunyadi-yellow text-charcoal",
  amber: "bg-lapis-lazuli text-white",
  blue: "bg-carolina-blue text-charcoal",
};

export function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || CalendarDays;
  
  return (
    <Card className="shadow-lg rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal">{title}</p>
            <p className="text-2xl font-semibold text-charcoal mt-1">{value}</p>
          </div>
          <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", colorMap[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {subtitle && (
          <div className="mt-4 flex items-center text-sm">
            {color === "red" && (
              <span className="text-red-600 font-medium">{subtitle.split(' ')[0]} {subtitle.split(' ')[1]}</span>
            )}
            {color === "green" && (
              <span className="text-green-600 font-medium">+20%</span>
            )}
            {color === "amber" && (
              <span className="text-slate-600">You owe</span>
            )}
            {color === "blue" && (
              <span className="text-slate-600">{subtitle}</span>
            )}
            {subtitle.includes('from') && (
              <span className="text-slate-500 ml-2">from last week</span>
            )}
            {subtitle.includes('$') && color === "amber" && (
              <span className="text-amber-600 font-medium ml-1">$12.25</span>
            )}
            {subtitle.includes('tasks') && (
              <span className="text-slate-500 ml-2">tasks pending</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
