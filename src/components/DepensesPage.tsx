import { motion, AnimatePresence } from "motion/react";
import { AddDepenseDialog } from "./AddDepenseDialog";
import { EditDepenseDialog } from "./EditDepenseDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

// Données d'exemple
const depensesMockData = [
  {
    id: 1,
    date: "2025-11-08",
    categorie: "Transports",
    ttc: 45.80,
    ht: 38.17,
    tva: 20,
    details: "Essence - trajet Théâtre National",
    justificatif: true,
  },
  {
    id: 2,
    date: "2025-11-06",
    categorie: "Parking",
    ttc: 12.50,
    ht: 10.42,
    tva: 20,
    details: "Parking Opéra de Paris",
    justificatif: true,
  },
  {
    id: 3,
    date: "2025-11-05",
    categorie: "Repas",
    ttc: 24.00,
    ht: 21.82,
    tva: 10,
    details: "Déjeuner avec l'équipe technique",
    justificatif: false,
  },
  {
    id: 4,
    date: "2025-10-28",
    categorie: "Péage",
    ttc: 18.20,
    ht: 15.17,
    tva: 20,
    details: "Péage autoroutier Paris-Lille",
    justificatif: true,
  },
  {
    id: 5,
    date: "2025-10-28",
    categorie: "Matériel",
    ttc: 89.90,
    ht: 74.92,
    tva: 20,
    details: "Câbles audio XLR",
    justificatif: true,
  },
  {
    id: 6,
    date: "2025-10-25",
    categorie: "Hébergement",
    ttc: 95.00,
    ht: 86.36,
    tva: 10,
    details: "Hôtel Festival - nuit du 24/10",
    justificatif: true,
  },
  {
    id: 7,
    date: "2025-10-22",
    categorie: "Transports",
    ttc: 32.40,
    ht: 27.00,
    tva: 20,
    details: "Essence retour mission",
    justificatif: true,
  },
  {
    id: 8,
    date: "2025-10-18",
    categorie: "Repas",
    ttc: 18.50,
    ht: 16.82,
    tva: 10,
    details: "Dîner de travail",
    justificatif: false,
  },
  {
    id: 9,
    date: "2025-10-15",
    categorie: "Parking",
    ttc: 8.00,
    ht: 6.67,
    tva: 20,
    details: "Parking Bataclan",
    justificatif: true,
  },
  {
    id: 10,
    date: "2025-10-12",
    categorie: "Formation",
    ttc: 350.00,
    ht: 291.67,
    tva: 20,
    details: "Formation mixage numérique",
    justificatif: true,
  },
];

type SortOrder = "asc" | "desc" | null;

export function DepensesPage() {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [depenses, setDepenses] = useState(depensesMockData);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [categorieFiltre, setCategorieFiltre] = useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDepense, setSelectedDepense] = useState<typeof depensesMockData[0] | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Récupérer les catégories uniques
  const categories = Array.from(new Set(depensesMockData.map(d => d.categorie)));

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

    const sorted = [...depenses].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setDepenses(sorted);
  };

  // Filtrage
  const filteredDepenses = depenses.filter((depense) => {
    const depenseDate = new Date(depense.date);
    
    if (dateRange.from && depenseDate < dateRange.from) return false;
    if (dateRange.to && depenseDate > dateRange.to) return false;
    if (categorieFiltre.length > 0 && !categorieFiltre.includes(depense.categorie)) return false;
    
    return true;
  });

  // Grouper par mois
  const groupedByMonth = filteredDepenses.reduce((acc, depense) => {
    const monthKey = format(new Date(depense.date), "MMMM yyyy", { locale: fr });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(depense);
    return acc;
  }, {} as Record<string, typeof depensesMockData>);

  // Calculs
  const totals = filteredDepenses.reduce(
    (acc, depense) => ({
      totalTTC: acc.totalTTC + depense.ttc,
      totalHT: acc.totalHT + depense.ht,
      totalTVA: acc.totalTVA + (depense.ttc - depense.ht),
      totalDepenses: acc.totalDepenses + 1,
      totalAvecJustificatif: acc.totalAvecJustificatif + (depense.justificatif ? 1 : 0),
    }),
    { totalTTC: 0, totalHT: 0, totalTVA: 0, totalDepenses: 0, totalAvecJustificatif: 0 }
  );

  const handleDeleteDepense = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette dépense ?")) {
      setDepenses(depenses.filter(d => d.id !== id));
      toast.success("Dépense supprimée");
    }
  };

  const handleViewDetails = (depense: typeof depensesMockData[0]) => {
    setSelectedDepense(depense);
    setDetailsDialogOpen(true);
  };

  const toggleCategorieFilter = (categorie: string) => {
    setCategorieFiltre(prev =>
      prev.includes(categorie) ? prev.filter(c => c !== categorie) : [...prev, categorie]
    );
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setCategorieFiltre([]);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
  };

  const getCategorieColor = (categorie: string) => {
    const colors: Record<string, string> = {
      "Transports": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Parking": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      "Repas": "bg-green-500/10 text-green-600 border-green-500/20",
      "Hébergement": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "Matériel": "bg-orange-500/10 text-orange-600 border-orange-500/20",
      "Formation": "bg-pink-500/10 text-pink-600 border-pink-500/20",
      "Péage": "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    };
    return colors[categorie] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* En-tête avec identité visuelle */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl">Mes Dépenses</h1>
              <p className="text-sm text-muted-foreground">
                {filteredDepenses.length} dépense{filteredDepenses.length > 1 ? 's' : ''} • {totals.totalTTC.toFixed(2)} € TTC
              </p>
            </div>
          </div>
        </div>
        
        <Button
          className="bg-gradient-to-br from-amber-500 to-orange-600 hover:opacity-90"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une dépense
        </Button>
      </div>

      {/* Stats rapides - version compacte */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Receipt className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dépenses</p>
              <p className="text-lg">{totals.totalDepenses}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Euro className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total TTC</p>
              <p className="text-lg">{totals.totalTTC.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-rose-500/5 to-rose-500/10 border-rose-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total HT</p>
              <p className="text-lg">{totals.totalHT.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Justificatifs</p>
              <p className="text-lg">{totals.totalAvecJustificatif}/{totals.totalDepenses}</p>
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

          {/* Catégories */}
          <div className="space-y-2">
            <Label className="text-xs">Catégorie</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Tag className="mr-2 h-4 w-4" />
                  {categorieFiltre.length > 0 ? `${categorieFiltre.length} sélectionné${categorieFiltre.length > 1 ? 's' : ''}` : 'Toutes'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="start">
                <div className="space-y-2">
                  <Label className="text-xs">Sélectionner des catégories</Label>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {categories.map(categorie => (
                      <div
                        key={categorie}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted transition-colors ${
                          categorieFiltre.includes(categorie) ? 'bg-amber-500/10' : ''
                        }`}
                        onClick={() => toggleCategorieFilter(categorie)}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          categorieFiltre.includes(categorie) ? 'bg-amber-500 border-amber-500' : 'border-muted-foreground'
                        }`}>
                          {categorieFiltre.includes(categorie) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm">{categorie}</span>
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
          {(dateRange.from || categorieFiltre.length > 0) && (
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
          <TabsTrigger value="cards" className="gap-2">
            <LayoutGrid className="w-4 h-4" />
            Cartes
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-2">
            <LayoutList className="w-4 h-4" />
            Tableau
          </TabsTrigger>
        </TabsList>

        {/* Vue Cartes */}
        <TabsContent value="cards" className="flex-1 min-h-0 mt-4">
          <div className="h-full overflow-y-auto space-y-6 pr-2">
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedByMonth).map(([month, monthDepenses]) => (
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
                      {monthDepenses.length} dépense{monthDepenses.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {monthDepenses.map((depense) => (
                      <motion.div
                        key={depense.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="group relative overflow-hidden hover:shadow-md transition-all border-border/50">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-600" />
                          
                          <div className="p-4 pl-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className={getCategorieColor(depense.categorie)}>
                                    {depense.categorie}
                                  </Badge>
                                  {depense.justificatif ? (
                                    <FileCheck className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <FileX className="w-4 h-4 text-orange-600" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{formatDate(depense.date)}</p>
                              </div>
                              
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => handleViewDetails(depense)}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setSelectedDepense(depense);
                                    setEditDialogOpen(true);
                                  }}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleDeleteDepense(depense.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-sm mb-3">{depense.details}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-border/50">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">HT</p>
                                  <p className="text-sm">{depense.ht.toFixed(2)} €</p>
                                </div>
                                <div className="w-px h-8 bg-border" />
                                <div>
                                  <p className="text-xs text-muted-foreground">TVA ({depense.tva}%)</p>
                                  <p className="text-sm">{(depense.ttc - depense.ht).toFixed(2)} €</p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">TTC</p>
                                <p className="text-lg font-medium">{depense.ttc.toFixed(2)} €</p>
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

            {filteredDepenses.length === 0 && (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Aucune dépense trouvée</p>
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
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Catégorie</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Détails</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">HT</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">TVA</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">TTC</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Justif.</th>
                    <th className="bg-muted/30 h-10 px-3 text-center align-middle">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepenses.map((depense) => (
                    <tr key={depense.id} className="group hover:bg-muted/20 border-b transition-colors">
                      <td className="p-3 align-middle">{formatDate(depense.date)}</td>
                      <td className="p-3 align-middle">
                        <Badge variant="outline" className={getCategorieColor(depense.categorie) + " text-xs"}>
                          {depense.categorie}
                        </Badge>
                      </td>
                      <td className="p-3 align-middle max-w-xs truncate">{depense.details}</td>
                      <td className="p-3 align-middle text-right">{depense.ht.toFixed(2)} €</td>
                      <td className="p-3 align-middle text-center">{depense.tva}%</td>
                      <td className="p-3 align-middle text-right font-medium">{depense.ttc.toFixed(2)} €</td>
                      <td className="p-3 align-middle text-center">
                        {depense.justificatif ? (
                          <FileCheck className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <FileX className="w-4 h-4 text-orange-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 align-middle">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleViewDetails(depense)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setSelectedDepense(depense);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteDepense(depense.id)}
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

      {/* Dialog de détails */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails de la dépense</DialogTitle>
          </DialogHeader>

          {selectedDepense && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getCategorieColor(selectedDepense.categorie)}>
                  {selectedDepense.categorie}
                </Badge>
                <span className="text-sm text-muted-foreground">{formatDate(selectedDepense.date)}</span>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Détails</Label>
                <p className="text-sm">{selectedDepense.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Montant HT</p>
                  <p className="text-lg">{selectedDepense.ht.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">TVA ({selectedDepense.tva}%)</p>
                  <p className="text-lg">{(selectedDepense.ttc - selectedDepense.ht).toFixed(2)} €</p>
                </div>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                <p className="text-xs text-muted-foreground mb-1">Montant TTC</p>
                <p className="text-2xl font-medium">{selectedDepense.ttc.toFixed(2)} €</p>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg">
                {selectedDepense.justificatif ? (
                  <>
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm text-emerald-600">Justificatif disponible</span>
                  </>
                ) : (
                  <>
                    <FileX className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-orange-600">Justificatif manquant</span>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddDepenseDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
      <EditDepenseDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} depense={selectedDepense} />
    </div>
  );
}