import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowUp, 
  ArrowDown, 
  Calendar as CalendarIcon, 
  Pencil, 
  Trash2,
  Clock as Timeline,
  BarChart3,
  LayoutList,
  Euro,
  TrendingUp,
  Wallet,
  X,
  Plus,
  Briefcase,
  PiggyBank,
  Activity
} from "lucide-react";
import { format } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Line,
  LineChart
} from "recharts";

// Données d'exemple
const revenuMockData = [
  {
    id: 1,
    date: "2025-09-15",
    employeur: "Théâtre National de Paris",
    type: "Cachet",
    montant: 1847.20,
    netAPayer: 1425.30,
    netImposable: 1663.48,
    prelevementSource: 166.35,
    description: "Spectacle 'Hamlet' - 12 représentations"
  },
  {
    id: 2,
    date: "2025-09-28",
    employeur: "France Travail",
    type: "ARE",
    montant: 1580.00,
    netAPayer: 1380.00,
    netImposable: 1580.00,
    prelevementSource: 158.00,
    description: "Allocation mensuelle septembre"
  },
  {
    id: 3,
    date: "2025-08-20",
    employeur: "Opéra Bastille",
    type: "Cachet",
    montant: 1231.50,
    netAPayer: 950.65,
    netImposable: 1108.35,
    prelevementSource: 110.84,
    description: "Production 'Carmen' - 8 jours"
  },
  {
    id: 4,
    date: "2025-08-28",
    employeur: "France Travail",
    type: "ARE",
    montant: 1580.00,
    netAPayer: 1380.00,
    netImposable: 1580.00,
    prelevementSource: 158.00,
    description: "Allocation mensuelle août"
  },
  {
    id: 5,
    date: "2025-07-10",
    employeur: "Festival d'Avignon",
    type: "Cachet",
    montant: 2309.80,
    netAPayer: 1782.57,
    netImposable: 2078.82,
    prelevementSource: 207.88,
    description: "Festival - 15 jours"
  },
  {
    id: 6,
    date: "2025-07-28",
    employeur: "France Travail",
    type: "ARE",
    montant: 1580.00,
    netAPayer: 1380.00,
    netImposable: 1580.00,
    prelevementSource: 158.00,
    description: "Allocation mensuelle juillet"
  },
  {
    id: 7,
    date: "2025-11-12",
    employeur: "Philharmonie de Paris",
    type: "Cachet",
    montant: 2155.60,
    netAPayer: 1663.58,
    netImposable: 1940.04,
    prelevementSource: 194.00,
    description: "Concert symphonique - 14 jours"
  },
  {
    id: 8,
    date: "2025-10-18",
    employeur: "Bataclan",
    type: "Cachet",
    montant: 1385.40,
    netAPayer: 1069.17,
    netImposable: 1246.86,
    prelevementSource: 124.69,
    description: "Concert live - 9 jours"
  },
  {
    id: 9,
    date: "2025-10-28",
    employeur: "France Travail",
    type: "ARE",
    montant: 1580.00,
    netAPayer: 1380.00,
    netImposable: 1580.00,
    prelevementSource: 158.00,
    description: "Allocation mensuelle octobre"
  },
  {
    id: 10,
    date: "2025-06-15",
    employeur: "Zénith Paris",
    type: "Cachet",
    montant: 1539.00,
    netAPayer: 1187.61,
    netImposable: 1385.10,
    prelevementSource: 138.51,
    description: "Tournée nationale - 10 jours"
  },
];

type SortOrder = "asc" | "desc" | null;
type TypeFilter = "tous" | "Cachet" | "ARE";

export function RevenuPage() {
  const [view, setView] = useState<"timeline" | "graph" | "table">("timeline");
  const [revenus, setRevenus] = useState(revenuMockData);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("tous");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  // Tri
  const handleSort = () => {
    let newSortOrder: SortOrder;
    if (sortOrder === null) {
      newSortOrder = "asc";
    } else if (sortOrder === "asc") {
      newSortOrder = "desc";
    } else {
      newSortOrder = "asc";
    }
    setSortOrder(newSortOrder);

    const sorted = [...revenus].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setRevenus(sorted);
  };

  // Filtrage
  const filteredRevenus = revenus.filter((revenu) => {
    const revenuDate = new Date(revenu.date);
    
    if (dateRange.from && revenuDate < dateRange.from) return false;
    if (dateRange.to && revenuDate > dateRange.to) return false;
    if (typeFilter !== "tous" && revenu.type !== typeFilter) return false;
    
    return true;
  });

  // Grouper par mois
  const groupedByMonth = filteredRevenus.reduce((acc, revenu) => {
    const monthKey = format(new Date(revenu.date), "MMMM yyyy", { locale: fr });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(revenu);
    return acc;
  }, {} as Record<string, typeof revenuMockData>);

  // Calculs
  const totals = filteredRevenus.reduce(
    (acc, revenu) => ({
      totalRevenus: acc.totalRevenus + 1,
      totalMontant: acc.totalMontant + revenu.montant,
      totalCachets: revenu.type === "Cachet" ? acc.totalCachets + revenu.montant : acc.totalCachets,
      totalAre: revenu.type === "ARE" ? acc.totalAre + revenu.montant : acc.totalAre,
    }),
    { totalRevenus: 0, totalMontant: 0, totalCachets: 0, totalAre: 0 }
  );

  // Données pour le graphique
  const chartData = Object.entries(groupedByMonth).map(([month, monthRevenus]) => {
    const monthTotals = monthRevenus.reduce((acc, r) => ({
      cachet: r.type === "Cachet" ? acc.cachet + r.montant : acc.cachet,
      are: r.type === "ARE" ? acc.are + r.montant : acc.are,
      total: acc.total + r.montant
    }), { cachet: 0, are: 0, total: 0 });

    return {
      mois: month,
      ...monthTotals
    };
  }).reverse();

  const handleDeleteRevenu = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce revenu ?")) {
      setRevenus(revenus.filter(r => r.id !== id));
      toast.success("Revenu supprimé");
    }
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setTypeFilter("tous");
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
  };

  const formatMonth = (dateStr: string) => {
    return format(new Date(dateStr), "MMMM yyyy", { locale: fr });
  };

  const moyenneMensuelle = totals.totalMontant / (chartData.length || 1);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Cachet":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "ARE":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const hasActiveFilters = dateRange.from || typeFilter !== "tous";

  return (
    <div className="h-full flex flex-col gap-4">
      {/* En-tête avec identité visuelle */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl">Mes Revenus</h1>
              <p className="text-sm text-muted-foreground">
                {filteredRevenus.length} revenu{filteredRevenus.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        
        <Button
          className="bg-gradient-to-br from-blue-500 to-indigo-600 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un revenu
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total revenus</p>
              <p className="text-lg">{totals.totalRevenus}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cachets</p>
              <p className="text-lg">{totals.totalCachets.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 border-indigo-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ARE</p>
              <p className="text-lg">{totals.totalAre.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Moyenne/mois</p>
              <p className="text-lg">{moyenneMensuelle.toFixed(0)} €</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Période */}
          <div className="space-y-2">
            <Label className="text-xs">Période</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd MMM", { locale: fr })} - {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                      </>
                    ) : (
                      format(dateRange.from, "dd MMM yyyy", { locale: fr })
                    )
                  ) : (
                    <span className="text-muted-foreground">Toutes les dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-xs">Type</Label>
            <div className="flex gap-1">
              <Button
                variant={typeFilter === "tous" ? "default" : "outline"}
                size="sm"
                className="h-9"
                onClick={() => setTypeFilter("tous")}
              >
                Tous
              </Button>
              <Button
                variant={typeFilter === "Cachet" ? "default" : "outline"}
                size="sm"
                className="h-9"
                onClick={() => setTypeFilter("Cachet")}
              >
                Cachets
              </Button>
              <Button
                variant={typeFilter === "ARE" ? "default" : "outline"}
                size="sm"
                className="h-9"
                onClick={() => setTypeFilter("ARE")}
              >
                ARE
              </Button>
            </div>
          </div>

          {/* Tri */}
          <div className="space-y-2">
            <Label className="text-xs">Tri par date</Label>
            <Button variant="outline" size="sm" className="h-9" onClick={handleSort}>
              {sortOrder === "asc" ? <ArrowUp className="w-4 h-4 mr-2" /> : <ArrowDown className="w-4 h-4 mr-2" />}
              {sortOrder === "asc" ? "Plus ancien" : "Plus récent"}
            </Button>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-9" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          )}
        </div>
      </Card>

      {/* Contenu avec tabs */}
      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit">
          <TabsTrigger value="timeline" className="gap-2">
            <Timeline className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="graph" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Graphique
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-2">
            <LayoutList className="w-4 h-4" />
            Tableau
          </TabsTrigger>
        </TabsList>

        {/* Vue Timeline */}
        <TabsContent value="timeline" className="flex-1 min-h-0 mt-4">
          <div className="h-full overflow-y-auto pr-2">
            <div className="relative">
              {/* Ligne verticale centrale */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/20 via-indigo-500/20 to-transparent" />
              
              <AnimatePresence mode="popLayout">
                {Object.entries(groupedByMonth).map(([month, monthRevenus], monthIndex) => {
                  const monthTotals = monthRevenus.reduce((acc, r) => ({
                    total: acc.total + r.montant,
                    cachet: r.type === "Cachet" ? acc.cachet + r.montant : acc.cachet,
                    are: r.type === "ARE" ? acc.are + r.montant : acc.are,
                  }), { total: 0, cachet: 0, are: 0 });

                  return (
                    <motion.div
                      key={month}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: monthIndex * 0.05 }}
                      className="relative mb-8"
                    >
                      {/* Rond sur la ligne */}
                      <div className="absolute left-4 top-0 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-background shadow-lg z-10" />
                      
                      <div className="ml-14">
                        {/* En-tête du mois */}
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-full">
                            <h3 className="capitalize text-blue-700">{month}</h3>
                            <div className="w-px h-4 bg-blue-500/20" />
                            <span className="text-xs text-muted-foreground">
                              {monthRevenus.length} revenu{monthRevenus.length > 1 ? 's' : ''} • {monthTotals.total.toFixed(2)} €
                            </span>
                          </div>
                        </div>

                        {/* Cartes des revenus */}
                        <div className="space-y-3">
                          {monthRevenus.map((revenu, index) => (
                            <motion.div
                              key={revenu.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <Card className="group relative overflow-hidden hover:shadow-md transition-all border-border/50">
                                {/* Bordure gauche */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />

                                <div className="p-4 pl-5">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className={getTypeColor(revenu.type)}>
                                          {revenu.type === "Cachet" ? <Briefcase className="w-3 h-3 mr-1" /> : <PiggyBank className="w-3 h-3 mr-1" />}
                                          {revenu.type}
                                        </Badge>
                                      </div>
                                      <p className="font-medium mb-1">{revenu.employeur}</p>
                                      <p className="text-xs text-muted-foreground">{revenu.description}</p>
                                    </div>
                                    
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                      >
                                        <Pencil className="w-3.5 h-3.5" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => handleDeleteRevenu(revenu.id)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-3 p-3 bg-muted/20 rounded-lg mb-2">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Net à payer</p>
                                      <p className="text-sm font-medium text-blue-600">{revenu.netAPayer.toFixed(2)} €</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Net imposable</p>
                                      <p className="text-sm">{revenu.netImposable.toFixed(2)} €</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Prélèvement source</p>
                                      <p className="text-sm">{revenu.prelevementSource.toFixed(2)} €</p>
                                    </div>
                                  </div>

                                  <div className="text-xs text-muted-foreground text-right">
                                    Payé le {formatDate(revenu.date)}
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredRevenus.length === 0 && (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Aucun revenu trouvé</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Vue Graphique */}
        <TabsContent value="graph" className="flex-1 min-h-0 mt-4">
          <div className="h-full grid grid-rows-2 gap-4">
            {/* Graphique en aires - Évolution totale */}
            <Card className="p-6 border border-border/50 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm mb-1">Évolution des revenus totaux</h3>
                <p className="text-xs text-muted-foreground">Revenus cumulés par mois</p>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="mois" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.split(' ')[0].substring(0, 3)}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`${value.toFixed(2)} €`, 'Total']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Graphique en barres - Cachets vs ARE */}
            <Card className="p-6 border border-border/50 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm mb-1">Répartition Cachets / ARE</h3>
                <p className="text-xs text-muted-foreground">Comparaison par mois</p>
              </div>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="mois" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.split(' ')[0].substring(0, 3)}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => `${value.toFixed(2)} €`}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="cachet" fill="#3b82f6" name="Cachets" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="are" fill="#a855f7" name="ARE" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Vue Tableau */}
        <TabsContent value="table" className="flex-1 min-h-0 mt-4">
          <Card className="h-full border border-border/50 shadow-sm overflow-hidden p-6 flex flex-col">
            <div className="flex-1 overflow-auto rounded-lg border border-border/50 relative">
              <table className="w-full caption-bottom text-sm">
                <thead className="sticky top-0 z-10 bg-background [&_tr]:border-b">
                  <tr className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Date</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Employeur</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Description</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Type</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Net à payer</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Net imposable</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Prélèvement</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRevenus.map((revenu) => (
                    <tr key={revenu.id} className="group hover:bg-muted/20 border-b transition-colors">
                      <td className="p-3 align-middle">{formatDate(revenu.date)}</td>
                      <td className="p-3 align-middle">{revenu.employeur}</td>
                      <td className="p-3 align-middle text-xs text-muted-foreground">{revenu.description}</td>
                      <td className="p-3 align-middle text-center">
                        <Badge variant="outline" className={getTypeColor(revenu.type)}>
                          {revenu.type}
                        </Badge>
                      </td>
                      <td className="p-3 align-middle text-right font-medium text-blue-600">{revenu.netAPayer.toFixed(2)} €</td>
                      <td className="p-3 align-middle text-right">{revenu.netImposable.toFixed(2)} €</td>
                      <td className="p-3 align-middle text-right text-xs text-muted-foreground">{revenu.prelevementSource.toFixed(2)} €</td>
                      <td className="p-3 align-middle">
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteRevenu(revenu.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}