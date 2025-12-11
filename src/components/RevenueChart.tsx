import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "./ui/badge";

const data = [
  { month: "Janvier", salaire: 1200, revenuNet: 2100, jours: 12 },
  { month: "Février", salaire: 950, revenuNet: 1800, jours: 8 },
  { month: "Mars", salaire: 1500, revenuNet: 5200, jours: 15 },
  { month: "Avril", salaire: 1100, revenuNet: 2800, jours: 10 },
  { month: "Mai", salaire: 1800, revenuNet: 5800, jours: 18 },
  { month: "Juin", salaire: 2200, revenuNet: 6200, jours: 22 },
  { month: "Juillet", salaire: 1400, revenuNet: 3800, jours: 14 },
  { month: "Août", salaire: 800, revenuNet: 2200, jours: 8 },
  { month: "Septembre", salaire: 1600, revenuNet: 5100, jours: 16 },
  { month: "Octobre", salaire: 1300, revenuNet: 4600, jours: 13 },
  { month: "Novembre", salaire: 0, revenuNet: 0, jours: 0 },
  { month: "Décembre", salaire: 0, revenuNet: 0, jours: 0 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-lg">
        <p className="text-sm mb-2">{payload[0].payload.month}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value.toLocaleString()}€</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <Card className="border-0 shadow-sm h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-0 flex-shrink-0">
        <div>
          <CardTitle className="text-base">Revenus mensuels</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Évolution sur l'année</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-2">
            <div className="h-2 w-2 rounded-full bg-[#5B5FED]" />
            Salaire Mensuel BRUT
          </Badge>
          <Badge variant="outline" className="gap-2">
            <div className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
            Revenus Mensuels NET
          </Badge>
          <Badge variant="outline" className="gap-2">
            <div className="h-2 w-2 rounded-full bg-[#10B981]" />
            Jours travaillés
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4 pt-4">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => value.substring(0, 3)}
            />
            <YAxis
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => `${value}€`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="salaire" fill="#5B5FED" radius={[8, 8, 0, 0]} maxBarSize={40} />
            <Bar yAxisId="left" dataKey="revenuNet" fill="#8B5CF6" radius={[8, 8, 0, 0]} maxBarSize={40} />
            <Bar yAxisId="right" dataKey="jours" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}