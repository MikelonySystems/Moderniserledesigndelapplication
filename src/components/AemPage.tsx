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
  Clock,
  FileText,
  X,
  Plus,
  Activity,
  Building2,
  Eye,
  FileCheck,
  FileX
} from "lucide-react";
import { format } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { AddAemDialog } from "./AddAemDialog";
import { AemViewDialog } from "./AemViewDialog";
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
  AreaChart
} from "recharts";

// Données d'exemple
const aemMockData = [
  {
    id: 1,
    dateDebut: "2025-09-01",
    dateFin: "2025-09-30",
    employeur: "Théâtre National de Paris",
    nombreJours: 12,
    nombreHeures: 96,
    salaireBrut: 1847.20,
    numeroAttestation: "AEM2025-091501",
    justificatif: true,
  },
  {
    id: 2,
    dateDebut: "2025-08-01",
    dateFin: "2025-08-31",
    employeur: "Opéra Bastille",
    nombreJours: 8,
    nombreHeures: 64,
    salaireBrut: 1231.50,
    numeroAttestation: "AEM2025-081001",
    justificatif: true,
  },
  {
    id: 3,
    dateDebut: "2025-07-01",
    dateFin: "2025-07-31",
    employeur: "Festival d'Avignon",
    nombreJours: 15,
    nombreHeures: 120,
    salaireBrut: 2309.80,
    numeroAttestation: "AEM2025-072201",
    justificatif: false,
  },
  {
    id: 4,
    dateDebut: "2025-06-01",
    dateFin: "2025-06-30",
    employeur: "Zénith Paris",
    nombreJours: 10,
    nombreHeures: 80,
    salaireBrut: 1539.00,
    numeroAttestation: "AEM2025-060501",
    justificatif: true,
  },
  {
    id: 5,
    dateDebut: "2025-05-01",
    dateFin: "2025-05-31",
    employeur: "Olympia",
    nombreJours: 6,
    nombreHeures: 48,
    salaireBrut: 923.40,
    numeroAttestation: "AEM2025-051801",
    justificatif: true,
  },
  {
    id: 6,
    dateDebut: "2025-11-01",
    dateFin: "2025-11-30",
    employeur: "Philharmonie de Paris",
    nombreJours: 14,
    nombreHeures: 112,
    salaireBrut: 2155.60,
    numeroAttestation: "AEM2025-110201",
    justificatif: false,
  },
  {
    id: 7,
    dateDebut: "2025-10-01",
    dateFin: "2025-10-31",
    employeur: "Bataclan",
    nombreJours: 9,
    nombreHeures: 72,
    salaireBrut: 1385.40,
    numeroAttestation: "AEM2025-101201",
    justificatif: true,
  },
  {
    id: 8,
    dateDebut: "2025-04-01",
    dateFin: "2025-04-30",
    employeur: "Comédie Française",
    nombreJours: 11,
    nombreHeures: 88,
    salaireBrut: 1693.30,
    numeroAttestation: "AEM2025-040801",
    justificatif: true,
  },
  {
    id: 9,
    dateDebut: "2025-03-01",
    dateFin: "2025-03-31",
    employeur: "Théâtre du Châtelet",
    nombreJours: 7,
    nombreHeures: 56,
    salaireBrut: 1077.90,
    numeroAttestation: "AEM2025-032001",
    justificatif: false,
  },
];

type SortOrder = "asc" | "desc" | null;

export function AemPage() {
  const [view, setView] = useState<"timeline" | "graph" | "table">("timeline");
  const [aems, setAems] = useState(aemMockData);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedAem, setSelectedAem] = useState<typeof aemMockData[0] | null>(null);

  // Récupérer les employeurs uniques
  const employeurs = Array.from(new Set(aemMockData.map(a => a.employeur)));

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

    const sorted = [...aems].sort((a, b) => {
      const dateA = new Date(a.dateDebut).getTime();
      const dateB = new Date(b.dateDebut).getTime();
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setAems(sorted);
  };

  // Filtrage
  const filteredAems = aems.filter((aem) => {
    const aemDate = new Date(aem.dateDebut);
    
    if (dateRange.from && aemDate < dateRange.from) return false;
    if (dateRange.to && aemDate > dateRange.to) return false;
    
    return true;
  });

  // Grouper par mois
  const groupedByMonth = filteredAems.reduce((acc, aem) => {
    const monthKey = format(new Date(aem.dateDebut), "MMMM yyyy", { locale: fr });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(aem);
    return acc;
  }, {} as Record<string, typeof aemMockData>);

  // Calculs
  const totals = filteredAems.reduce(
    (acc, aem) => ({
      totalAttestations: acc.totalAttestations + 1,
      totalJours: acc.totalJours + aem.nombreJours,
      totalHeures: acc.totalHeures + aem.nombreHeures,
      totalSalaire: acc.totalSalaire + aem.salaireBrut,
    }),
    { totalAttestations: 0, totalJours: 0, totalHeures: 0, totalSalaire: 0 }
  );

  // Données pour le graphique
  const chartData = Object.entries(groupedByMonth).map(([month, monthAems]) => {
    const monthTotals = monthAems.reduce((acc, a) => ({
      jours: acc.jours + a.nombreJours,
      salaire: acc.salaire + a.salaireBrut,
      attestations: acc.attestations + 1
    }), { jours: 0, salaire: 0, attestations: 0 });

    return {
      mois: month,
      salaire: monthTotals.salaire,
      jours: monthTotals.jours,
      attestations: monthTotals.attestations
    };
  }).reverse();

  const handleDeleteAem = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette attestation AEM ?")) {
      setAems(aems.filter(a => a.id !== id));
      toast.success("Attestation AEM supprimée");
    }
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
  };

  const formatMonth = (dateStr: string) => {
    return format(new Date(dateStr), "MMMM yyyy", { locale: fr });
  };

  const moyenneMensuelle = totals.totalSalaire / (chartData.length || 1);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* En-tête avec identité visuelle */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl">Mes AEM</h1>
              <p className="text-sm text-muted-foreground">
                {filteredAems.length} attestation{filteredAems.length > 1 ? 's' : ''} • {totals.totalHeures} heure{totals.totalHeures > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        
        <Button
          className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:opacity-90"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une attestation
        </Button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Attestations</p>
              <p className="text-lg">{totals.totalAttestations}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-teal-500/5 to-teal-500/10 border-teal-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total heures</p>
              <p className="text-lg">{totals.totalHeures}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Euro className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total salaire</p>
              <p className="text-lg">{totals.totalSalaire.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-lime-500/5 to-lime-500/10 border-lime-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-lime-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-lime-600" />
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

          {/* Tri */}
          <div className="space-y-2">
            <Label className="text-xs">Tri par date</Label>
            <Button variant="outline" size="sm" className="h-9" onClick={handleSort}>
              {sortOrder === "asc" ? <ArrowUp className="w-4 h-4 mr-2" /> : <ArrowDown className="w-4 h-4 mr-2" />}
              {sortOrder === "asc" ? "Plus ancien" : "Plus récent"}
            </Button>
          </div>

          {/* Clear filters */}
          {dateRange.from && (
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
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/20 via-teal-500/20 to-transparent" />
              
              <AnimatePresence mode="popLayout">
                {Object.entries(groupedByMonth).map(([month, monthAems], monthIndex) => {
                  const monthTotals = monthAems.reduce((acc, a) => ({
                    jours: acc.jours + a.nombreJours,
                    heures: acc.heures + a.nombreHeures,
                    salaire: acc.salaire + a.salaireBrut
                  }), { jours: 0, heures: 0, salaire: 0 });

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
                      <div className="absolute left-4 top-0 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border-4 border-background shadow-lg z-10" />
                      
                      <div className="ml-14">
                        {/* En-tête du mois */}
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full">
                            <h3 className="capitalize text-emerald-700">{month}</h3>
                            <div className="w-px h-4 bg-emerald-500/20" />
                            <span className="text-xs text-muted-foreground">
                              {monthAems.length} attestation{monthAems.length > 1 ? 's' : ''} • {monthTotals.heures}h • {monthTotals.salaire.toFixed(2)} €
                            </span>
                          </div>
                        </div>

                        {/* Cartes des attestations */}
                        <div className="space-y-3">
                          {monthAems.map((aem, index) => (
                            <motion.div
                              key={aem.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <Card className="group relative overflow-hidden hover:shadow-md transition-all border-border/50">
                                {/* Bordure gauche */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-600" />

                                <div className="p-4 pl-5">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="bg-teal-500/10 text-teal-600 border-teal-500/20">
                                          <Building2 className="w-3 h-3 mr-1" />
                                          {aem.employeur}
                                        </Badge>
                                        {aem.justificatif ? (
                                          <FileCheck className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                          <FileX className="w-4 h-4 text-orange-600" />
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">{aem.numeroAttestation}</p>
                                    </div>
                                    
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {aem.justificatif && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7"
                                          onClick={() => {
                                            setSelectedAem(aem);
                                            setViewDialogOpen(true);
                                          }}
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                        </Button>
                                      )}
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
                                        onClick={() => handleDeleteAem(aem.id)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-4 gap-3 p-3 bg-muted/20 rounded-lg mb-3">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Période</p>
                                      <p className="text-sm">{formatMonth(aem.dateDebut)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Jours</p>
                                      <p className="text-sm">{aem.nombreJours}j</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Heures</p>
                                      <p className="text-sm">{aem.nombreHeures}h</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Salaire brut</p>
                                      <p className="text-sm font-medium text-emerald-600">{aem.salaireBrut.toFixed(2)} €</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Du {formatDate(aem.dateDebut)} au {formatDate(aem.dateFin)}</span>
                                    <span>Taux horaire : {(aem.salaireBrut / aem.nombreHeures).toFixed(2)} €/h</span>
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

              {filteredAems.length === 0 && (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Aucune attestation AEM trouvée</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Vue Graphique */}
        <TabsContent value="graph" className="flex-1 min-h-0 mt-4">
          <div className="h-full grid grid-rows-2 gap-4">
            {/* Graphique en aires - Évolution des salaires */}
            <Card className="p-6 border border-border/50 shadow-sm h-full min-h-0 flex flex-col">
              <div className="mb-4">
                <h3 className="text-sm mb-1">Évolution des salaires bruts</h3>
                <p className="text-xs text-muted-foreground">Salaires perçus par mois</p>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSalaire" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                    />
                    <Area 
                      type="monotone" 
                      dataKey="salaire" 
                      stroke="#10b981" 
                      fill="url(#colorSalaire)" 
                      strokeWidth={2}
                      name="Salaire brut"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Graphique en barres - Jours par mois */}
            <Card className="p-6 border border-border/50 shadow-sm h-full min-h-0 flex flex-col">
              <div className="mb-4">
                <h3 className="text-sm mb-1">Nombre de jours travaillés</h3>
                <p className="text-xs text-muted-foreground">Jours et attestations par mois</p>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="jours" fill="#14b8a6" name="Jours" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attestations" fill="#84cc16" name="Attestations" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">N° Attestation</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Employeur</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Période</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Heures</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Salaire brut</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Taux horaire</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Justif.</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAems.map((aem) => (
                    <tr key={aem.id} className="group hover:bg-muted/20 border-b transition-colors">
                      <td className="p-3 align-middle text-xs">{aem.numeroAttestation}</td>
                      <td className="p-3 align-middle">{aem.employeur}</td>
                      <td className="p-3 align-middle capitalize">{formatMonth(aem.dateDebut)}</td>
                      <td className="p-3 align-middle text-right">{aem.nombreHeures}</td>
                      <td className="p-3 align-middle text-right font-medium text-emerald-600">{aem.salaireBrut.toFixed(2)} €</td>
                      <td className="p-3 align-middle text-right text-xs text-muted-foreground">{(aem.salaireBrut / aem.nombreHeures).toFixed(2)} €/h</td>
                      <td className="p-3 align-middle text-center">
                        {aem.justificatif ? (
                          <FileCheck className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <FileX className="w-4 h-4 text-orange-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 align-middle">
                        <div className="flex justify-center gap-1">
                          {aem.justificatif && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={() => {
                                setSelectedAem(aem);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteAem(aem.id)}
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

      <AddAemDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <AemViewDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen} aem={selectedAem} />
    </div>
  );
}