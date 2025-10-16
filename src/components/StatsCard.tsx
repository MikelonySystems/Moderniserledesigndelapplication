import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, iconColor = "text-primary" }: StatsCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-0 flex flex-row items-start justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className={`p-3 rounded-xl bg-muted/40 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-3xl mb-1.5">{value}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
