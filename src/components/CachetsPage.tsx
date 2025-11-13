import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { 
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
  X,
  Car,
  Train,
  Receipt,
  Building,
  Wrench,
  Check
} from "lucide-react";
import { format, isSameDay } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";
import { EditCachetDialog } from "./EditCachetDialog";
import { motion, AnimatePresence } from "motion/react";

// Données d'exemple
const cachetsMockData = [
  {
    id: 1,
    dateEvenement: "2025-11-08",
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
    dateEvenement: "2025-11-08",
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
    dateEvenement: "2025-11-06",
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
    dateEvenement: "2025-11-05",
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
    dateEvenement: "2025-10-28",
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
    dateEvenement: "2025-10-28",
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
    dateEvenement: "2025-10-25",
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
    dateEvenement: "2025-10-22",
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
    dateEvenement: "2025-10-18",
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
    dateEvenement: "2025-10-15",
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
];

type SortOrder = "asc" | "desc" | null;

export function CachetsPage() {
  const [view, setView] = useState<"calendar" | "cards" | "table">("calendar");
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

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

  // Dates avec des cachets (pour le calendrier)
  const datesWithCachets = cachets.map(c => new Date(c.dateEvenement));

  // Cachets pour la date sélectionnée
  const cachetsForSelectedDate = selectedDate 
    ? cachets.filter(c => isSameDay(new Date(c.dateEvenement), selectedDate))
    : [];

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

  const getTransportIcon = (transport: string) => {
    if (transport.toLowerCase().includes("véhicule") || transport.toLowerCase().includes("voiture")) {
      return <Car className="w-3.5 h-3.5 text-muted-foreground" />;
    }
    if (transport.toLowerCase().includes("métro") || transport.toLowerCase().includes("train")) {
      return <Train className="w-3.5 h-3.5 text-muted-foreground" />;
    }
    return <MapPin className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* En-tête avec identité visuelle */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl">Mes Cachets</h1>
              <p className="text-sm text-muted-foreground">
                {filteredCachets.length} cachet{filteredCachets.length > 1 ? 's' : ''} • {totals.totalHeures}h • {totals.totalBrut.toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rapides - version compacte */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 bg-gradient-to-br from-violet-500/5 to-violet-500/10 border-violet-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cachets</p>
              <p className="text-lg">{totals.totalCachets}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-fuchsia-500/5 to-fuchsia-500/10 border-fuchsia-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-fuchsia-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Heures</p>
              <p className="text-lg">{totals.totalHeures}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-pink-500/5 to-pink-500/10 border-pink-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
              <Euro className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenus bruts</p>
              <p className="text-lg">{totals.totalBrut.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jours</p>
              <p className="text-lg">{filteredCachets.length}</p>
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
                <CalendarComponent
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Employeurs */}
          <div className="space-y-2">
            <Label className="text-xs">Employeur</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Building className="mr-2 h-4 w-4" />
                  {employeurFiltre.length > 0 ? `${employeurFiltre.length} sélectionné${employeurFiltre.length > 1 ? 's' : ''}` : 'Tous'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="start">
                <div className="space-y-2">
                  <Label className="text-xs">Sélectionner des employeurs</Label>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {employeurs.map(employeur => (
                      <div
                        key={employeur}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted transition-colors ${
                          employeurFiltre.includes(employeur) ? 'bg-violet-500/10' : ''
                        }`}
                        onClick={() => toggleEmployeurFilter(employeur)}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          employeurFiltre.includes(employeur) ? 'bg-violet-500 border-violet-500' : 'border-muted-foreground'
                        }`}>
                          {employeurFiltre.includes(employeur) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm">{employeur}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Compétences */}
          <div className="space-y-2">
            <Label className="text-xs">Compétence</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Wrench className="mr-2 h-4 w-4" />
                  {competenceFiltre.length > 0 ? `${competenceFiltre.length} sélectionné${competenceFiltre.length > 1 ? 's' : ''}` : 'Toutes'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="start">
                <div className="space-y-2">
                  <Label className="text-xs">Sélectionner des compétences</Label>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {competences.map(competence => (
                      <div
                        key={competence}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted transition-colors ${
                          competenceFiltre.includes(competence) ? 'bg-violet-500/10' : ''
                        }`}
                        onClick={() => toggleCompetenceFilter(competence)}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          competenceFiltre.includes(competence) ? 'bg-violet-500 border-violet-500' : 'border-muted-foreground'
                        }`}>
                          {competenceFiltre.includes(competence) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm">{competence}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
      </Card>

      {/* Contenu avec tabs */}
      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-2">
            <LayoutGrid className="w-4 h-4" />
            Cartes
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-2">
            <LayoutList className="w-4 h-4" />
            Tableau
          </TabsTrigger>
        </TabsList>

        {/* Vue Calendrier */}
        <TabsContent value="calendar" className="flex-1 min-h-0 mt-4">
          <div className="h-full flex flex-col lg:flex-row gap-4">
            {/* Calendrier */}
            <Card className="lg:w-[35%] p-6 flex flex-col">
              <h3 className="mb-4">Sélectionner une date</h3>
              <div className="flex-1 flex items-center justify-center overflow-visible py-8">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={fr}
                  className="rounded-md border-0 calendar-large"
                  modifiers={{
                    booked: datesWithCachets
                  }}
                  modifiersStyles={{
                    booked: {
                      fontWeight: 'bold',
                      backgroundColor: 'rgb(139 92 246 / 0.15)',
                      color: 'rgb(124 58 237)'
                    }
                  }}
                />
              </div>
              <div className="mt-4 p-3 bg-violet-500/5 rounded-lg border border-violet-500/20">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500/30" />
                  Dates avec cachets
                </p>
              </div>
            </Card>

            {/* Détails des cachets du jour sélectionné */}
            <Card className="flex-1 p-6 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3>
                  {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Aucune date sélectionnée"}
                </h3>
                <Badge variant="outline" className="bg-violet-500/10 text-violet-600 border-violet-500/20">
                  {cachetsForSelectedDate.length} cachet{cachetsForSelectedDate.length > 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {cachetsForSelectedDate.length > 0 ? (
                  cachetsForSelectedDate.map((cachet) => (
                    <motion.div
                      key={cachet.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group"
                    >
                      <Card className="p-5 border-l-4 border-l-violet-500 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4>{cachet.employeur}</h4>
                              {cachet.nombreCachet > 1 && (
                                <Badge variant="secondary">x{cachet.nombreCachet}</Badge>
                              )}
                            </div>
                            <Badge variant="outline" className={getCompetenceColor(cachet.competence)}>
                              {cachet.competence}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">Montant brut</p>
                            <p className="text-xl">{cachet.totalBrut.toFixed(2)} €</p>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Horaires</p>
                                <p className="text-sm">{cachet.heureDebut} - {cachet.heureFin}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Lieu</p>
                                <p className="text-sm">{cachet.lieu}</p>
                                <p className="text-xs text-muted-foreground">{cachet.adresse}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Heures</p>
                                <p className="text-sm">{cachet.totalHeures}h</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getTransportIcon(cachet.transport)}
                              <div>
                                <p className="text-xs text-muted-foreground">Transport</p>
                                <p className="text-sm">{cachet.transport}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4 pt-3 border-t border-border/50">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Superviseur</p>
                            <p className="text-sm">{cachet.superviseur}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditCachet(cachet)}
                          >
                            <Pencil className="w-3.5 h-3.5 mr-2" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteCachet(cachet.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Aucun cachet pour cette date</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Vue Cartes */}
        <TabsContent value="cards" className="flex-1 min-h-0 mt-4">
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
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-600 to-fuchsia-600" />
                          
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
                                <span className="text-muted-foreground/40">•</span>
                                {getTransportIcon(cachet.transport)}
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
        </TabsContent>
      </Tabs>

      <EditCachetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        cachet={selectedCachet}
        onSave={handleSaveCachet}
      />
    </div>
  );
}