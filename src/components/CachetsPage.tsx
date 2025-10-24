import { useState } from "react";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "./ui/table";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar as CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";

// Données d'exemple
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
];

type SortOrder = "asc" | "desc" | null;

export function CachetsPage() {
  const [cachets, setCachets] = useState(cachetsMockData);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [employeurFiltre, setEmployeurFiltre] = useState("");
  const [superviseurFiltre, setSuperviseurFiltre] = useState("");

  // Récupérer les employeurs et superviseurs uniques
  const employeurs = Array.from(new Set(cachetsMockData.map(c => c.employeur)));
  const superviseurs = Array.from(new Set(cachetsMockData.map(c => c.superviseur)));

  // Fonction de tri
  const handleSort = () => {
    let newSortOrder: SortOrder;
    if (sortOrder === null) {
      newSortOrder = "asc";
    } else if (sortOrder === "asc") {
      newSortOrder = "desc";
    } else {
      newSortOrder = null;
    }
    setSortOrder(newSortOrder);

    if (newSortOrder === null) {
      setCachets([...cachetsMockData]);
    } else {
      const sorted = [...cachets].sort((a, b) => {
        const dateA = new Date(a.dateEvenement).getTime();
        const dateB = new Date(b.dateEvenement).getTime();
        return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
      setCachets(sorted);
    }
  };

  // Fonction de filtrage
  const filteredCachets = cachets.filter((cachet) => {
    const cachetDate = new Date(cachet.dateEvenement);
    
    // Filtre par date
    if (dateRange.from && cachetDate < dateRange.from) {
      return false;
    }
    if (dateRange.to && cachetDate > dateRange.to) {
      return false;
    }
    // Filtre par employeur
    if (employeurFiltre && employeurFiltre !== "tous" && cachet.employeur !== employeurFiltre) {
      return false;
    }
    // Filtre par superviseur
    if (superviseurFiltre && superviseurFiltre !== "tous" && cachet.superviseur !== superviseurFiltre) {
      return false;
    }
    return true;
  });

  // Calcul des totaux
  const totals = filteredCachets.reduce(
    (acc, cachet) => ({
      totalHeures: acc.totalHeures + cachet.totalHeures,
      totalBrut: acc.totalBrut + cachet.totalBrut,
    }),
    { totalHeures: 0, totalBrut: 0 }
  );

  // Icône de tri
  const getSortIcon = () => {
    if (sortOrder === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortOrder === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Filtres */}
      <Card className="p-6 border border-border/50 shadow-sm">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Range de dates */}
          <div className="space-y-2">
            <Label>Période</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[300px] justify-start text-left"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd MMM yyyy", { locale: fr })} -{" "}
                        {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                      </>
                    ) : (
                      format(dateRange.from, "dd MMM yyyy", { locale: fr })
                    )
                  ) : (
                    <span className="text-muted-foreground">Sélectionner une période</span>
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

          {/* Filtre employeur */}
          <div className="space-y-2">
            <Label htmlFor="employeur">Employeur</Label>
            <Select value={employeurFiltre} onValueChange={setEmployeurFiltre}>
              <SelectTrigger id="employeur" className="w-[200px]">
                <SelectValue placeholder="Tous les employeurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les employeurs</SelectItem>
                {employeurs.map((emp) => (
                  <SelectItem key={emp} value={emp}>
                    {emp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre superviseur */}
          <div className="space-y-2">
            <Label htmlFor="superviseur">Superviseur</Label>
            <Select value={superviseurFiltre} onValueChange={setSuperviseurFiltre}>
              <SelectTrigger id="superviseur" className="w-[200px]">
                <SelectValue placeholder="Tous les superviseurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les superviseurs</SelectItem>
                {superviseurs.map((sup) => (
                  <SelectItem key={sup} value={sup}>
                    {sup}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bouton réinitialiser */}
          <Button
            variant="outline"
            onClick={() => {
              setDateRange({ from: undefined, to: undefined });
              setEmployeurFiltre("");
              setSuperviseurFiltre("");
              setSortOrder(null);
              setCachets([...cachetsMockData]);
            }}
          >
            Réinitialiser
          </Button>
        </div>
      </Card>

      {/* Tableau */}
      <Card className="flex-1 p-6 border border-border/50 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-auto rounded-lg border border-border/50 relative">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">
                  <Button
                    variant="ghost"
                    onClick={handleSort}
                    className="flex items-center gap-2 hover:bg-muted/50 mx-auto whitespace-nowrap"
                  >
                    Date
                    {getSortIcon()}
                  </Button>
                </TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Employeur</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Nb</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Montant</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Total</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">H/C</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Total H</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Compétence</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Début</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Fin</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Pause</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Transport</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Lieu</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-left">Adresse</TableHead>
                <TableHead className="sticky top-0 bg-muted/30 z-10 text-center">Superviseur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCachets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center text-muted-foreground py-8">
                    Aucun cachet trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredCachets.map((cachet) => (
                  <TableRow key={cachet.id} className="group hover:bg-muted/20 h-14">
                    <TableCell className="text-center whitespace-nowrap">{formatDate(cachet.dateEvenement)}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.employeur}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.nombreCachet}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.montant.toFixed(2)} €</TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.totalBrut.toFixed(2)} €</TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.heureCachet}h</TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.totalHeures}h</TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <span className="text-muted-foreground text-sm">{cachet.competence}</span>
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.heureDebut}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.heureFin}</TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.tempsPause}h</TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <span className="text-muted-foreground text-sm">{cachet.transport}</span>
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">{cachet.lieu}</TableCell>
                    <TableCell className="text-left max-w-[200px]">
                      <span className="text-muted-foreground text-sm block">{cachet.adresse}</span>
                    </TableCell>
                    <TableCell className="text-center relative whitespace-nowrap">
                      {cachet.superviseur}
                      
                      {/* Boutons flottants au survol avec effet de flou en dégradé */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                        {/* Fond flou en dégradé avec masque CSS */}
                        <div 
                          className="absolute inset-0 -inset-x-6 -inset-y-2 bg-background/95 backdrop-blur-md rounded-lg -z-10" 
                          style={{
                            maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 100%)'
                          }}
                        />
                        
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 px-2.5 text-xs bg-primary/90 hover:bg-primary shadow-md relative z-10"
                          onClick={() => toast.info(`Modifier le cachet #${cachet.id}`)}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1.5" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-7 px-2.5 text-xs shadow-md relative z-10"
                          onClick={() => toast.error(`Supprimer le cachet #${cachet.id}`)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow className="sticky bottom-0 bg-muted/50 hover:bg-muted/50">
                <TableCell colSpan={15} className="py-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Total cachets</p>
                      <p className="text-lg">{filteredCachets.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Total heures</p>
                      <p className="text-lg">{totals.totalHeures}h</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Total brut</p>
                      <p className="text-lg">{totals.totalBrut.toFixed(2)} €</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>
    </div>
  );
}
