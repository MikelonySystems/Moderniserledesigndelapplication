import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { 
  ArrowUp, 
  ArrowDown, 
  Calendar as CalendarIcon, 
  Pencil, 
  Trash2,
  LayoutGrid,
  LayoutList,
  Euro,
  TrendingUp,
  Building2,
  Receipt,
  X,
  Plus,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { format } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";
import { motion, AnimatePresence } from "motion/react";
import { AddRevenuDialog } from "./AddRevenuDialog";

// Données d'exemple
const revenusMockData = [
  {
    id: 1,
    date: "2025-10-20",
    employeur: "Théâtre National de Paris",
    typeRevenu: "Cachet",
    montantBrut: 850.00,
    montantNet: 672.50,
    categorie: "Spectacle vivant",
    statut: "Reçu",
  },
  {
    id: 2,
    date: "2025-10-15",
    employeur: "Opéra Garnier",
    typeRevenu: "Cachet",
    montantBrut: 920.00,
    montantNet: 728.00,
    categorie: "Spectacle vivant",
    statut: "Reçu",
  },
  {
    id: 3,
    date: "2025-10-10",
    employeur: "Pôle Emploi Spectacle",
    typeRevenu: "AEM",
    montantBrut: 357.78,
    montantNet: 357.78,
    categorie: "Indemnités",
    statut: "Reçu",
  },
  {
    id: 4,
    date: "2025-10-05",
    employeur: "Festival d'Avignon",
    typeRevenu: "Cachet",
    montantBrut: 1250.00,
    montantNet: 988.75,
    categorie: "Spectacle vivant",
    statut: "En attente",
  },
  {
    id: 5,
    date: "2025-09-28",
    employeur: "Philharmonie de Paris",
    typeRevenu: "Cachet",
    montantBrut: 780.00,
    montantNet: 617.40,
    categorie: "Spectacle vivant",
    statut: "Reçu",
  },
  {
    id: 6,
    date: "2025-09-22",
    employeur: "Auditori BCN",
    typeRevenu: "Cachet",
    montantBrut: 1100.00,
    montantNet: 870.00,
    categorie: "Spectacle vivant",
    statut: "Reçu",
  },
  {
    id: 7,
    date: "2025-09-15",
    employeur: "Pôle Emploi Spectacle",
    typeRevenu: "ARE",
    montantBrut: 1197.32,
    montantNet: 1197.32,
    categorie: "Indemnités",
    statut: "Reçu",
  },
  {
    id: 8,
    date: "2025-09-10",
    employeur: "Zenith de Lille",
    typeRevenu: "Cachet",
    montantBrut: 680.00,
    montantNet: 538.00,
    categorie: "Spectacle vivant",
    statut: "Annulé",
  },
  {
    id: 9,
    date: "2025-09-05",
    employeur: "Théâtre des Champs-Élysées",
    typeRevenu: "Cachet",
    montantBrut: 950.00,
    montantNet: 751.50,
    categorie: "Spectacle vivant",
    statut: "Reçu",
  },
  {
    id: 10,
    date: "2025-08-28",
    employeur: "Festival de Cannes",
    typeRevenu: "Cachet",
    montantBrut: 1450.00,
    montantNet: 1147.25,
    categorie: "Spectacle vivant",
    statut: "Reçu",
  },
];

type SortOrder = "asc" | "desc" | null;

export function RevenusPage() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [revenus, setRevenus] = useState(revenusMockData);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [typeFiltre, setTypeFiltre] = useState<string[]>([]);
  const [categorieFiltre, setCategorieFiltre] = useState<string[]>([]);
  const [statutFiltre, setStatutFiltre] = useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Récupérer les valeurs uniques
  const types = Array.from(new Set(revenusMockData.map(r => r.typeRevenu)));
  const categories = Array.from(new Set(revenusMockData.map(r => r.categorie)));
  const statuts = Array.from(new Set(revenusMockData.map(r => r.statut)));

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
    if (typeFiltre.length > 0 && !typeFiltre.includes(revenu.typeRevenu)) return false;
    if (categorieFiltre.length > 0 && !categorieFiltre.includes(revenu.categorie)) return false;
    if (statutFiltre.length > 0 && !statutFiltre.includes(revenu.statut)) return false;
    
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
  }, {} as Record<string, typeof revenusMockData>);

  // Calculs (exclure les revenus annulés)
  const totals = filteredRevenus
    .filter(r => r.statut !== "Annulé")
    .reduce(
      (acc, revenu) => ({
        totalRevenus: acc.totalRevenus + 1,
        totalBrut: acc.totalBrut + revenu.montantBrut,
        totalNet: acc.totalNet + revenu.montantNet,
        enAttente: acc.enAttente + (revenu.statut === "En attente" ? 1 : 0),
      }),
      { totalRevenus: 0, totalBrut: 0, totalNet: 0, enAttente: 0 }
    );

  const handleDeleteRevenu = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce revenu ?")) {
      setRevenus(revenus.filter(r => r.id !== id));
      toast.success("Revenu supprimé");
    }
  };

  const toggleTypeFilter = (type: string) => {
    setTypeFiltre(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleCategorieFilter = (categorie: string) => {
    setCategorieFiltre(prev =>
      prev.includes(categorie) ? prev.filter(c => c !== categorie) : [...prev, categorie]
    );
  };

  const toggleStatutFilter = (statut: string) => {
    setStatutFiltre(prev =>
      prev.includes(statut) ? prev.filter(s => s !== statut) : [...prev, statut]
    );
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setTypeFiltre([]);
    setCategorieFiltre([]);
    setStatutFiltre([]);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
  };

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      "Reçu": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      "En attente": "bg-amber-500/10 text-amber-600 border-amber-500/20",
      "Annulé": "bg-red-500/10 text-red-600 border-red-500/20",
    };
    return colors[statut] || "bg-muted text-muted-foreground border-border";
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "Reçu":
        return <CheckCircle className="w-4 h-4" />;
      case "En attente":
        return <Clock className="w-4 h-4" />;
      case "Annulé":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Cachet": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "ARE": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "AEM": "bg-orange-500/10 text-orange-600 border-orange-500/20",
      "Prime": "bg-pink-500/10 text-pink-600 border-pink-500/20",
    };
    return colors[type] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* En-tête avec stats */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl mb-1">Mes Revenus</h1>
          <p className="text-sm text-muted-foreground">
            {filteredRevenus.length} revenu{filteredRevenus.length > 1 ? 's' : ''} • {totals.totalNet.toFixed(2)} € net
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90"
            onClick={() => setAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un revenu
          </Button>
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
        <Card className="p-4 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenus</p>
              <p className="text-xl">{totals.totalRevenus}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Euro className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total brut</p>
              <p className="text-xl">{totals.totalBrut.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total net</p>
              <p className="text-xl">{totals.totalNet.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">En attente</p>
              <p className="text-xl">{totals.enAttente}</p>
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
            {(dateRange.from || typeFiltre.length > 0 || categorieFiltre.length > 0 || statutFiltre.length > 0) && (
              <Button variant="ghost" size="sm" className="h-9" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Filtres par type */}
          <div className="space-y-2">
            <Label className="text-xs">Types de revenu</Label>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <Badge
                  key={type}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    typeFiltre.includes(type)
                      ? getTypeColor(type) + " border-2"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => toggleTypeFilter(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filtres par catégorie */}
          <div className="space-y-2">
            <Label className="text-xs">Catégories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map(categorie => (
                <Badge
                  key={categorie}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    categorieFiltre.includes(categorie)
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20 border-2"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => toggleCategorieFilter(categorie)}
                >
                  {categorie}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filtres par statut */}
          <div className="space-y-2">
            <Label className="text-xs">Statuts</Label>
            <div className="flex flex-wrap gap-2">
              {statuts.map(statut => (
                <Badge
                  key={statut}
                  variant="outline"
                  className={`cursor-pointer transition-all ${
                    statutFiltre.includes(statut)
                      ? getStatutColor(statut) + " border-2"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => toggleStatutFilter(statut)}
                >
                  {statut}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Contenu */}
      <div className="flex-1 overflow-hidden">
        {view === "cards" ? (
          <div className="h-full overflow-y-auto space-y-6 pr-2">
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedByMonth).map(([month, monthRevenus]) => {
                const monthTotals = monthRevenus
                  .filter(r => r.statut !== "Annulé")
                  .reduce((acc, r) => ({
                    brut: acc.brut + r.montantBrut,
                    net: acc.net + r.montantNet
                  }), { brut: 0, net: 0 });

                return (
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
                        {monthRevenus.length} revenu{monthRevenus.length > 1 ? 's' : ''} • {monthTotals.net.toFixed(2)} € net
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {monthRevenus.map((revenu) => (
                        <motion.div
                          key={revenu.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          whileHover={{ y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="group relative overflow-hidden hover:shadow-md transition-all border-border/50">
                            <div className={`absolute top-0 left-0 w-1 h-full ${
                              revenu.statut === "Reçu" 
                                ? "bg-gradient-to-b from-emerald-600 to-emerald-400" 
                                : revenu.statut === "En attente"
                                ? "bg-gradient-to-b from-amber-600 to-amber-400"
                                : "bg-gradient-to-b from-red-600 to-red-400"
                            }`} />
                            
                            <div className="p-4 pl-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className={getTypeColor(revenu.typeRevenu)}>
                                      {revenu.typeRevenu}
                                    </Badge>
                                    <Badge variant="outline" className={getStatutColor(revenu.statut)}>
                                      <span className="mr-1">{getStatutIcon(revenu.statut)}</span>
                                      {revenu.statut}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{formatDate(revenu.date)}</p>
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

                              <div className="flex items-center gap-2 mb-3">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm truncate">{revenu.employeur}</p>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Brut</p>
                                    <p className="text-sm">{revenu.montantBrut.toFixed(2)} €</p>
                                  </div>
                                  <div className="w-px h-8 bg-border" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Net</p>
                                    <p className="text-sm">{revenu.montantNet.toFixed(2)} €</p>
                                  </div>
                                </div>
                                
                                <div className="text-xs text-muted-foreground">
                                  {revenu.categorie}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
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
        ) : (
          <Card className="h-full border border-border/50 shadow-sm overflow-hidden p-6 flex flex-col">
            <div className="flex-1 overflow-auto rounded-lg border border-border/50 relative">
              <table className="w-full caption-bottom text-sm">
                <thead className="sticky top-0 z-10 bg-background [&_tr]:border-b">
                  <tr className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Date</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Type</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Employeur</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Catégorie</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Brut</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Net</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Statut</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRevenus.map((revenu) => (
                    <tr key={revenu.id} className="group hover:bg-muted/20 border-b transition-colors">
                      <td className="p-3 align-middle">{formatDate(revenu.date)}</td>
                      <td className="p-3 align-middle">
                        <Badge variant="outline" className={getTypeColor(revenu.typeRevenu) + " text-xs"}>
                          {revenu.typeRevenu}
                        </Badge>
                      </td>
                      <td className="p-3 align-middle max-w-xs truncate">{revenu.employeur}</td>
                      <td className="p-3 align-middle">{revenu.categorie}</td>
                      <td className="p-3 align-middle text-right">{revenu.montantBrut.toFixed(2)} €</td>
                      <td className="p-3 align-middle text-right">{revenu.montantNet.toFixed(2)} €</td>
                      <td className="p-3 align-middle text-center">
                        <Badge variant="outline" className={getStatutColor(revenu.statut) + " text-xs"}>
                          {revenu.statut}
                        </Badge>
                      </td>
                      <td className="p-3 align-middle text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        )}
      </div>

      <AddRevenuDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
}
