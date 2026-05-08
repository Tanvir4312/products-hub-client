import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: string;
  description?: string; // e.g. "+12% from last month"
  className?: string;
}

const StatsCard = ({
  title,
  value,
  iconName,
  description,
  className,
}: StatsCardProps) => {
  const Icon = getIconComponent(iconName);

  const isPositive = description?.includes("+");
  const isNegative = description?.includes("-");

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {/* subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardHeader className="relative flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent className="relative space-y-1">
        <div className="text-3xl font-bold tracking-tight">
          {value}
        </div>

        {description && (
          <p
            className={cn(
              "text-xs font-medium",
              isPositive && "text-green-500",
              isNegative && "text-red-500",
              !isPositive && !isNegative && "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;