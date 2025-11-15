import "./styles/globals.css";
import { useState } from "react";
import { StatsCard } from "./components/StatsCard";
import { MonthResultCard } from "./components/MonthResultCard";
import { InfoCard } from "./components/InfoCard";
import { FloatingMenu } from "./components/FloatingMenu";
import { FloatingHeader } from "./components/FloatingHeader";
import { CachetsPage } from "./components/CachetsPage";
import { DepensesPage } from "./components/DepensesPage";
import { TrajetsPage } from "./components/TrajetsPage";
import { AemPage } from "./components/AemPage";
import { RevenuPage } from "./components/RevenuPage";
import { BilanAnnuelPage } from "./components/BilanAnnuelPage";
import { PreferencesPage } from "./components/PreferencesPage";
import { Toaster } from "./components/ui/sonner";
import { Wallet, TrendingDown, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "./components/ui/badge";

const revenueData = [
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

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster />
      <FloatingMenu currentPage={currentPage} onPageChange={setCurrentPage} />
      <FloatingHeader />

      <div className="flex flex-col flex-1 ml-64">
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-hidden">
          {currentPage === "dashboard" ? (
            <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-4">
              {/* Top Section: Stats Grid 2x3 + Month Result */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-shrink-0">
                {/* Left: 2x3 Stats Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatsCard
                    title="Revenus"
                    value="35 975,63 €"
                    subtitle="Moyenne : 3 597,56 € /mois"
                    icon={Wallet}
                    iconColor="text-primary"
                  />

                  <StatsCard
                    title="Dépenses"
                    value="1 086,74 €"
                    subtitle="Km parcourus : 990,64 Km"
                    icon={TrendingDown}
                    iconColor="text-orange-600 dark:text-orange-500"
                  />

                  <StatsCard
                    title="Heures"
                    value="362,00"
                    subtitle="Année précédente : 548,00 H"
                    icon={Clock}
                    iconColor="text-blue-600 dark:text-blue-500"
                  />

                  <StatsCard
                    title="Jours"
                    value="118"
                    subtitle="Moyenne : 11,80 J /mois"
                    icon={Calendar}
                    iconColor="text-emerald-600 dark:text-emerald-500"
                  />

                  <InfoCard
                    title="Indemnisation"
                    mainAmount="59,63 € net/jour"
                    items={[
                      { label: "AJ Brut", value: "62,44 €" },
                      { label: "Retraite compl.", value: "2,81 €" },
                      { label: "CSG/CRDS", value: "0,00 €" },
                    ]}
                  />

                  <InfoCard
                    title="Prévisions"
                    mainAmount="1 200,05 €"
                    items={[
                      { label: "Mois en cours", value: "Octobre 2025" },
                    ]}
                  />
                </div>

                {/* Right: Previous Month Result */}
                <MonthResultCard
                  month="Septembre 2025"
                  revenuBrut="5 720,50 €"
                  revenuNet="4 523,18 €"
                  allocation="1 197,32 €"
                  jours="16"
                  heures="42,00"
                />
              </div>

              {/* Chart */}
              <div className="flex-1 min-h-0">
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
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              </div>
            </div>
          ) : currentPage === "cachets" ? (
            <div className="max-w-[1800px] mx-auto h-full">
              <CachetsPage />
            </div>
          ) : currentPage === "depenses" ? (
            <div className="max-w-[1800px] mx-auto h-full">
              <DepensesPage />
            </div>
          ) : currentPage === "trajets" ? (
            <div className="max-w-[1800px] mx-auto h-full">
              <TrajetsPage />
            </div>
          ) : currentPage === "aem" ? (
            <div className="max-w-[1800px] mx-auto h-full">
              <AemPage />
            </div>
          ) : currentPage === "revenus" ? (
            <div className="max-w-[1800px] mx-auto h-full">
              <RevenuPage />
            </div>
          ) : currentPage === "bilan" ? (
            <div className="max-w-[1400px] mx-auto h-full overflow-y-auto">
              <BilanAnnuelPage />
            </div>
          ) : currentPage === "preferences" ? (
            <div className="max-w-[1200px] mx-auto h-full overflow-y-auto">
              <PreferencesPage />
            </div>
          ) : (
            <div className="max-w-[1600px] mx-auto h-full flex items-center justify-center">
              <p className="text-muted-foreground">Page en construction...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}