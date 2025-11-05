import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Calendar as CalendarIcon, 
  Pencil, 
  Trash2,
  LayoutGrid,
  LayoutList,
  Clock,
  Euro,
  MapPin,
  User,
  Briefcase,
  X
} from "lucide-react";
import { format } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";
import { EditCachetDialog } from "./EditCachetDialog";
import { motion, AnimatePresence } from "motion/react";

// Données d'exemple (identiques à l'original)
const cachetsMockData = [
  {
    id: 1,
    dateEvenement: "2025-10-15",
    employeur: "Théâtre National",
    nombreCachet: 1,
    montant: 450,
    totalBrut: 450,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien son",
    heureDebut: "14:00",
    heureFin: "22:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Théâtre National",
    adresse: "2 Rue de la Colline, 75001 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 2,
    dateEvenement: "2025-10-12",
    employeur: "Opéra de Paris",
    nombreCachet: 1,
    montant: 580,
    totalBrut: 580,
    heureCachet: 10,
    totalHeures: 10,
    competence: "Technicien lumière",
    heureDebut: "13:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Opéra Garnier",
    adresse: "Place de l'Opéra, 75009 Paris",
    superviseur: "Marie Martin",
  },
  {
    id: 3,
    dateEvenement: "2025-10-08",
    employeur: "Festival d'été",
    nombreCachet: 2,
    montant: 360,
    totalBrut: 720,
    heureCachet: 6,
    totalHeures: 12,
    competence: "Régisseur plateau",
    heureDebut: "10:00",
    heureFin: "22:00",
    tempsPause: 1,
    transport: "Véhicule personnel",
    lieu: "Parc de la Villette",
    adresse: "211 Avenue Jean Jaurès, 75019 Paris",
    superviseur: "Pierre Blanc",
  },
  {
    id: 4,
    dateEvenement: "2025-10-05",
    employeur: "Salle Pleyel",
    nombreCachet: 1,
    montant: 380,
    totalBrut: 380,
    heureCachet: 6,
    totalHeures: 6,
    competence: "Technicien son",
    heureDebut: "18:00",
    heureFin: "00:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Salle Pleyel",
    adresse: "252 Rue du Faubourg Saint-Honoré, 75008 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 5,
    dateEvenement: "2025-10-01",
    employeur: "Zénith Paris",
    nombreCachet: 1,
    montant: 450,
    totalBrut: 450,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien vidéo",
    heureDebut: "16:00",
    heureFin: "00:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Zénith Paris",
    adresse: "211 Avenue Jean Jaurès, 75019 Paris",
    superviseur: "Sophie Durand",
  },
  {
    id: 6,
    dateEvenement: "2025-09-28",
    employeur: "Théâtre de la Ville",
    nombreCachet: 1,
    montant: 420,
    totalBrut: 420,
    heureCachet: 7,
    totalHeures: 7,
    competence: "Technicien son",
    heureDebut: "15:00",
    heureFin: "22:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Théâtre de la Ville",
    adresse: "2 Place du Châtelet, 75004 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 7,
    dateEvenement: "2025-09-25",
    employeur: "Stade de France",
    nombreCachet: 2,
    montant: 520,
    totalBrut: 1040,
    heureCachet: 10,
    totalHeures: 20,
    competence: "Régisseur général",
    heureDebut: "12:00",
    heureFin: "02:00",
    tempsPause: 2,
    transport: "Véhicule personnel",
    lieu: "Stade de France",
    adresse: "93200 Saint-Denis",
    superviseur: "Pierre Blanc",
  },
  {
    id: 8,
    dateEvenement: "2025-09-22",
    employeur: "Olympia",
    nombreCachet: 1,
    montant: 480,
    totalBrut: 480,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien lumière",
    heureDebut: "17:00",
    heureFin: "01:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Olympia",
    adresse: "28 Boulevard des Capucines, 75009 Paris",
    superviseur: "Marie Martin",
  },
  {
    id: 9,
    dateEvenement: "2025-09-18",
    employeur: "Philharmonie de Paris",
    nombreCachet: 1,
    montant: 550,
    totalBrut: 550,
    heureCachet: 9,
    totalHeures: 9,
    competence: "Technicien son",
    heureDebut: "14:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Philharmonie",
    adresse: "221 Avenue Jean Jaurès, 75019 Paris",
    superviseur: "Sophie Durand",
  },
  {
    id: 10,
    dateEvenement: "2025-09-15",
    employeur: "Bataclan",
    nombreCachet: 1,
    montant: 400,
    totalBrut: 400,
    heureCachet: 7,
    totalHeures: 7,
    competence: "Technicien plateau",
    heureDebut: "18:00",
    heureFin: "01:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Bataclan",
    adresse: "50 Boulevard Voltaire, 75011 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 11,
    dateEvenement: "2025-09-12",
    employeur: "Casino de Paris",
    nombreCachet: 1,
    montant: 460,
    totalBrut: 460,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien vidéo",
    heureDebut: "16:00",
    heureFin: "00:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Casino de Paris",
    adresse: "16 Rue de Clichy, 75009 Paris",
    superviseur: "Marie Martin",
  },
  {
    id: 12,
    dateEvenement: "2025-09-08",
    employeur: "La Cigale",
    nombreCachet: 1,
    montant: 380,
    totalBrut: 380,
    heureCachet: 6,
    totalHeures: 6,
    competence: "Technicien lumière",
    heureDebut: "19:00",
    heureFin: "01:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "La Cigale",
    adresse: "120 Boulevard de Rochechouart, 75018 Paris",
    superviseur: "Pierre Blanc",
  },
];

type SortOrder = "asc" | "desc" | null;

export function CachetsPage() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [cachets, setCachets] = useState(cachetsMockData);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [employeurFiltre, setEmployeurFiltre] = useState<string[]>([]);
  const [competenceFiltre, setCompetenceFiltre] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCachet, setSelectedCachet] = useState<typeof cachetsMockData[0] | null>(null);

  // Récupérer les valeurs uniques
  const employeurs = Array.from(new Set(cachetsMockData.map(c => c.employeur)));
  const competences = Array.from(new Set(cachetsMockData.map(c => c.competence)));

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

    const sorted = [...cachets].sort((a, b) => {
      const dateA = new Date(a.dateEvenement).getTime();
      const dateB = new Date(b.dateEvenement).getTime();
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setCachets(sorted);
  };

  // Filtrage
  const filteredCachets = cachets.filter((cachet) => {
    const cachetDate = new Date(cachet.dateEvenement);
    
    if (dateRange.from && cachetDate < dateRange.from) return false;
    if (dateRange.to && cachetDate > dateRange.to) return false;
    if (employeurFiltre.length > 0 && !employeurFiltre.includes(cachet.employeur)) return false;
    if (competenceFiltre.length > 0 && !competenceFiltre.includes(cachet.competence)) return false;
    
    return true;
  });

  // Grouper par mois
  const groupedByMonth = filteredCachets.reduce((acc, cachet) => {
    const monthKey = format(new Date(cachet.dateEvenement), "MMMM yyyy", { locale: fr });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(cachet);
    return acc;
  }, {} as Record<string, typeof cachetsMockData>);

  // Calculs
  const totals = filteredCachets.reduce(
    (acc, cachet) => ({
      totalHeures: acc.totalHeures + cachet.totalHeures,
      totalBrut: acc.totalBrut + cachet.totalBrut,
      totalCachets: acc.totalCachets + cachet.nombreCachet,
    }),
    { totalHeures: 0, totalBrut: 0, totalCachets: 0 }
  );

  const handleEditCachet = (cachet: typeof cachetsMockData[0]) => {
    setSelectedCachet(cachet);
    setEditDialogOpen(true);
  };

  const handleSaveCachet = (updatedCachet: typeof cachetsMockData[0]) => {
    setCachets(cachets.map(c => c.id === updatedCachet.id ? updatedCachet : c));
  };

  const handleDeleteCachet = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce cachet ?")) {
      setCachets(cachets.filter(c => c.id !== id));
      toast.success("Cachet supprimé");
    }
  };

  const toggleEmployeurFilter = (employeur: string) => {
    setEmployeurFiltre(prev =>
      prev.includes(employeur) ? prev.filter(e => e !== employeur) : [...prev, employeur]
    );
  };

  const toggleCompetenceFilter = (competence: string) => {
    setCompetenceFiltre(prev =>
      prev.includes(competence) ? prev.filter(c => c !== competence) : [...prev, competence]
    );
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setEmployeurFiltre([]);
    setCompetenceFiltre([]);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
  };

  const getCompetenceColor = (competence: string) => {
    const colors: Record<string, string> = {
      "Technicien son": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Technicien lumière": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      "Technicien vidéo": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "Technicien plateau": "bg-green-500/10 text-green-600 border-green-500/20",
      "Régisseur général": "bg-red-500/10 text-red-600 border-red-500/20",
      "Régisseur plateau": "bg-orange-500/10 text-orange-600 border-orange-500/20",
      "Régisseur son": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      "Régisseur lumière": "bg-pink-500/10 text-pink-600 border-pink-500/20",
      "Régisseur vidéo": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    };
    return colors[competence] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* En-tête avec stats */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl mb-1">Mes Cachets</h1>
          <p className="text-sm text-muted-foreground">
            {filteredCachets.length} cachet{filteredCachets.length > 1 ? 's' : ''} • {totals.totalHeures}h • {totals.totalBrut.toFixed(2)} €
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={view === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("cards")}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Cartes
          </Button>
          <Button
            variant={view === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("table")}
          >
            <LayoutList className="w-4 h-4 mr-2" />
            Tableau
          </Button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cachets</p>
              <p className="text-xl">{totals.totalCachets}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Heures</p>
              <p className="text-xl">{totals.totalHeures}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Euro className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenus bruts</p>
              <p className="text-xl">{totals.totalBrut.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jours travaillés</p>
              <p className="text-xl">{filteredCachets.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="space-y-4">
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
            {(dateRange.from || employeurFiltre.length > 0 || competenceFiltre.length > 0) && (
              <Button variant="ghost" size="sm" className="h-9" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Filtres par badges */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Employeurs</Label>
              <div className="flex flex-wrap gap-2">
                {employeurs.slice(0, 8).map(employeur => (
                  <Badge
                    key={employeur}
                    variant={employeurFiltre.includes(employeur) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => toggleEmployeurFilter(employeur)}
                  >
                    {employeur}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Compétences</Label>
              <div className="flex flex-wrap gap-2">
                {competences.map(competence => (
                  <Badge
                    key={competence}
                    variant="outline"
                    className={`cursor-pointer transition-all ${
                      competenceFiltre.includes(competence)
                        ? getCompetenceColor(competence) + " border-2"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => toggleCompetenceFilter(competence)}
                  >
                    {competence}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Contenu */}
      <div className="flex-1 overflow-hidden">
        {view === "cards" ? (
          <div className="h-full overflow-y-auto space-y-6 pr-2">
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedByMonth).map(([month, monthCachets]) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="capitalize">{month}</h3>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">
                      {monthCachets.length} cachet{monthCachets.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {monthCachets.map((cachet) => (
                      <motion.div
                        key={cachet.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="group relative overflow-hidden hover:shadow-md transition-all border-border/50">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-600" />
                          
                          <div className="p-4 pl-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm">{cachet.employeur}</h4>
                                  {cachet.nombreCachet > 1 && (
                                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                      x{cachet.nombreCachet}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{formatDate(cachet.dateEvenement)}</p>
                              </div>
                              
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleEditCachet(cachet)}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleDeleteCachet(cachet.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline" className={getCompetenceColor(cachet.competence)}>
                                {cachet.competence}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2 text-xs">
                                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">{cachet.heureDebut} - {cachet.heureFin}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground truncate">{cachet.lieu}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Heures</p>
                                  <p className="text-sm">{cachet.totalHeures}h</p>
                                </div>
                                <div className="w-px h-8 bg-border" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Brut</p>
                                  <p className="text-sm">{cachet.totalBrut.toFixed(2)} €</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{cachet.superviseur}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredCachets.length === 0 && (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Aucun cachet trouvé</p>
              </div>
            )}
          </div>
        ) : (
          <Card className="h-full border border-border/50 shadow-sm overflow-hidden p-6 flex flex-col">
            <div className="flex-1 overflow-auto rounded-lg border border-border/50 relative">
              <table className="w-full caption-bottom text-sm">
                <thead className="sticky top-0 z-10 bg-background [&_tr]:border-b">
                  <tr className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Date</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Employeur</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Compétence</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Nb</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Heures</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Brut</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Horaires</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Lieu</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Superviseur</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCachets.map((cachet) => (
                    <tr key={cachet.id} className="group hover:bg-muted/20 border-b transition-colors">
                      <td className="p-3 align-middle">{formatDate(cachet.dateEvenement)}</td>
                      <td className="p-3 align-middle">{cachet.employeur}</td>
                      <td className="p-3 align-middle">
                        <Badge variant="outline" className={getCompetenceColor(cachet.competence) + " text-xs"}>
                          {cachet.competence}
                        </Badge>
                      </td>
                      <td className="p-3 align-middle text-center">{cachet.nombreCachet}</td>
                      <td className="p-3 align-middle text-right">{cachet.totalHeures}h</td>
                      <td className="p-3 align-middle text-right">{cachet.totalBrut.toFixed(2)} €</td>
                      <td className="p-3 align-middle text-xs text-muted-foreground">
                        {cachet.heureDebut} - {cachet.heureFin}
                      </td>
                      <td className="p-3 align-middle">{cachet.lieu}</td>
                      <td className="p-3 align-middle text-xs text-muted-foreground">{cachet.superviseur}</td>
                      <td className="p-3 align-middle">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEditCachet(cachet)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteCachet(cachet.id)}
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
        )}
      </div>

      <EditCachetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        cachet={selectedCachet}
        onSave={handleSaveCachet}
      />
    </div>
  );
}
