import { StatsCard } from "./components/StatsCard";
import { MonthResultCard } from "./components/MonthResultCard";
import { RevenueChart } from "./components/RevenueChart";
import { InfoCard } from "./components/InfoCard";
import { FloatingMenu } from "./components/FloatingMenu";
import { FloatingHeader } from "./components/FloatingHeader";
import { Wallet, TrendingDown, Clock, Calendar } from "lucide-react";

export default function App() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <FloatingMenu />
      <FloatingHeader />
      
      <div className="flex flex-col flex-1 ml-64">
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-hidden">
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
                  items={[
                    { label: "Indemnisation pour le mois de Septembre", value: "0 €" },
                    { label: "Ici ma prévision pour le mois en cours", value: "" },
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
              <RevenueChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


