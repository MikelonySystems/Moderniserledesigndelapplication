import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar as CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";
import { EditCachetDialog } from "./EditCachetDialog";

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
  {
    id: 13,
    dateEvenement: "2025-09-05",
    employeur: "Accor Arena",
    nombreCachet: 2,
    montant: 500,
    totalBrut: 1000,
    heureCachet: 10,
    totalHeures: 20,
    competence: "Régisseur son",
    heureDebut: "11:00",
    heureFin: "01:00",
    tempsPause: 2,
    transport: "Véhicule personnel",
    lieu: "Accor Arena",
    adresse: "8 Boulevard de Bercy, 75012 Paris",
    superviseur: "Sophie Durand",
  },
  {
    id: 14,
    dateEvenement: "2025-09-01",
    employeur: "Le Trianon",
    nombreCachet: 1,
    montant: 390,
    totalBrut: 390,
    heureCachet: 7,
    totalHeures: 7,
    competence: "Technicien plateau",
    heureDebut: "18:00",
    heureFin: "01:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Le Trianon",
    adresse: "80 Boulevard de Rochechouart, 75018 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 15,
    dateEvenement: "2025-08-28",
    employeur: "Théâtre National",
    nombreCachet: 1,
    montant: 470,
    totalBrut: 470,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien son",
    heureDebut: "15:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Théâtre National",
    adresse: "2 Rue de la Colline, 75001 Paris",
    superviseur: "Marie Martin",
  },
  {
    id: 16,
    dateEvenement: "2025-08-25",
    employeur: "Grand Rex",
    nombreCachet: 1,
    montant: 490,
    totalBrut: 490,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien vidéo",
    heureDebut: "16:00",
    heureFin: "00:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Grand Rex",
    adresse: "1 Boulevard Poissonnière, 75002 Paris",
    superviseur: "Pierre Blanc",
  },
  {
    id: 17,
    dateEvenement: "2025-08-22",
    employeur: "Opéra de Paris",
    nombreCachet: 1,
    montant: 600,
    totalBrut: 600,
    heureCachet: 10,
    totalHeures: 10,
    competence: "Régisseur lumière",
    heureDebut: "13:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Opéra Garnier",
    adresse: "Place de l'Opéra, 75009 Paris",
    superviseur: "Sophie Durand",
  },
  {
    id: 18,
    dateEvenement: "2025-08-18",
    employeur: "Zénith Paris",
    nombreCachet: 2,
    montant: 430,
    totalBrut: 860,
    heureCachet: 8,
    totalHeures: 16,
    competence: "Technicien son",
    heureDebut: "14:00",
    heureFin: "00:00",
    tempsPause: 2,
    transport: "Véhicule personnel",
    lieu: "Zénith Paris",
    adresse: "211 Avenue Jean Jaurès, 75019 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 19,
    dateEvenement: "2025-08-15",
    employeur: "Festival d'été",
    nombreCachet: 1,
    montant: 380,
    totalBrut: 380,
    heureCachet: 6,
    totalHeures: 6,
    competence: "Technicien plateau",
    heureDebut: "17:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Parc de la Villette",
    adresse: "211 Avenue Jean Jaurès, 75019 Paris",
    superviseur: "Marie Martin",
  },
  {
    id: 20,
    dateEvenement: "2025-08-12",
    employeur: "Salle Pleyel",
    nombreCachet: 1,
    montant: 410,
    totalBrut: 410,
    heureCachet: 7,
    totalHeures: 7,
    competence: "Technicien lumière",
    heureDebut: "16:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Salle Pleyel",
    adresse: "252 Rue du Faubourg Saint-Honoré, 75008 Paris",
    superviseur: "Pierre Blanc",
  },
  {
    id: 21,
    dateEvenement: "2025-08-08",
    employeur: "Stade de France",
    nombreCachet: 1,
    montant: 550,
    totalBrut: 550,
    heureCachet: 10,
    totalHeures: 10,
    competence: "Régisseur vidéo",
    heureDebut: "12:00",
    heureFin: "22:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Stade de France",
    adresse: "93200 Saint-Denis",
    superviseur: "Sophie Durand",
  },
  {
    id: 22,
    dateEvenement: "2025-08-05",
    employeur: "Olympia",
    nombreCachet: 1,
    montant: 450,
    totalBrut: 450,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien son",
    heureDebut: "17:00",
    heureFin: "01:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Olympia",
    adresse: "28 Boulevard des Capucines, 75009 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 23,
    dateEvenement: "2025-08-01",
    employeur: "Philharmonie de Paris",
    nombreCachet: 1,
    montant: 570,
    totalBrut: 570,
    heureCachet: 9,
    totalHeures: 9,
    competence: "Régisseur plateau",
    heureDebut: "14:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Philharmonie",
    adresse: "221 Avenue Jean Jaurès, 75019 Paris",
    superviseur: "Marie Martin",
  },
  {
    id: 24,
    dateEvenement: "2025-07-28",
    employeur: "Bataclan",
    nombreCachet: 1,
    montant: 395,
    totalBrut: 395,
    heureCachet: 7,
    totalHeures: 7,
    competence: "Technicien lumière",
    heureDebut: "18:00",
    heureFin: "01:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Bataclan",
    adresse: "50 Boulevard Voltaire, 75011 Paris",
    superviseur: "Pierre Blanc",
  },
  {
    id: 25,
    dateEvenement: "2025-07-25",
    employeur: "Casino de Paris",
    nombreCachet: 2,
    montant: 440,
    totalBrut: 880,
    heureCachet: 8,
    totalHeures: 16,
    competence: "Technicien plateau",
    heureDebut: "15:00",
    heureFin: "01:00",
    tempsPause: 2,
    transport: "Véhicule personnel",
    lieu: "Casino de Paris",
    adresse: "16 Rue de Clichy, 75009 Paris",
    superviseur: "Sophie Durand",
  },
  {
    id: 26,
    dateEvenement: "2025-07-22",
    employeur: "La Cigale",
    nombreCachet: 1,
    montant: 370,
    totalBrut: 370,
    heureCachet: 6,
    totalHeures: 6,
    competence: "Technicien vidéo",
    heureDebut: "19:00",
    heureFin: "01:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "La Cigale",
    adresse: "120 Boulevard de Rochechouart, 75018 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 27,
    dateEvenement: "2025-07-18",
    employeur: "Accor Arena",
    nombreCachet: 1,
    montant: 530,
    totalBrut: 530,
    heureCachet: 10,
    totalHeures: 10,
    competence: "Technicien son",
    heureDebut: "12:00",
    heureFin: "22:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Accor Arena",
    adresse: "8 Boulevard de Bercy, 75012 Paris",
    superviseur: "Marie Martin",
  },
  {
    id: 28,
    dateEvenement: "2025-07-15",
    employeur: "Le Trianon",
    nombreCachet: 1,
    montant: 385,
    totalBrut: 385,
    heureCachet: 7,
    totalHeures: 7,
    competence: "Technicien lumière",
    heureDebut: "18:00",
    heureFin: "01:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Le Trianon",
    adresse: "80 Boulevard de Rochechouart, 75018 Paris",
    superviseur: "Pierre Blanc",
  },
  {
    id: 29,
    dateEvenement: "2025-07-12",
    employeur: "Théâtre National",
    nombreCachet: 1,
    montant: 460,
    totalBrut: 460,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Régisseur général",
    heureDebut: "14:00",
    heureFin: "22:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Théâtre National",
    adresse: "2 Rue de la Colline, 75001 Paris",
    superviseur: "Sophie Durand",
  },
  {
    id: 30,
    dateEvenement: "2025-07-08",
    employeur: "Grand Rex",
    nombreCachet: 1,
    montant: 475,
    totalBrut: 475,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien vidéo",
    heureDebut: "16:00",
    heureFin: "00:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Grand Rex",
    adresse: "1 Boulevard Poissonnière, 75002 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 31,
    dateEvenement: "2025-07-05",
    employeur: "Opéra de Paris",
    nombreCachet: 1,
    montant: 590,
    totalBrut: 590,
    heureCachet: 10,
    totalHeures: 10,
    competence: "Technicien son",
    heureDebut: "13:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Opéra Garnier",
    adresse: "Place de l'Opéra, 75009 Paris",
    superviseur: "Marie Martin",
  },
  {
    id: 32,
    dateEvenement: "2025-07-01",
    employeur: "Zénith Paris",
    nombreCachet: 1,
    montant: 445,
    totalBrut: 445,
    heureCachet: 8,
    totalHeures: 8,
    competence: "Technicien plateau",
    heureDebut: "15:00",
    heureFin: "23:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Zénith Paris",
    adresse: "211 Avenue Jean Jaurès, 75019 Paris",
    superviseur: "Pierre Blanc",
  },
  {
    id: 33,
    dateEvenement: "2025-06-28",
    employeur: "Festival d'été",
    nombreCachet: 2,
    montant: 365,
    totalBrut: 730,
    heureCachet: 6,
    totalHeures: 12,
    competence: "Technicien lumière",
    heureDebut: "16:00",
    heureFin: "00:00",
    tempsPause: 2,
    transport: "Véhicule personnel",
    lieu: "Parc de la Villette",
    adresse: "211 Avenue Jean Jaurès, 75019 Paris",
    superviseur: "Sophie Durand",
  },
  {
    id: 34,
    dateEvenement: "2025-06-25",
    employeur: "Salle Pleyel",
    nombreCachet: 1,
    montant: 405,
    totalBrut: 405,
    heureCachet: 7,
    totalHeures: 7,
    competence: "Technicien vidéo",
    heureDebut: "17:00",
    heureFin: "00:00",
    tempsPause: 0,
    transport: "Métro",
    lieu: "Salle Pleyel",
    adresse: "252 Rue du Faubourg Saint-Honoré, 75008 Paris",
    superviseur: "Jean Dupont",
  },
  {
    id: 35,
    dateEvenement: "2025-06-22",
    employeur: "Stade de France",
    nombreCachet: 1,
    montant: 560,
    totalBrut: 560,
    heureCachet: 10,
    totalHeures: 10,
    competence: "Régisseur son",
    heureDebut: "11:00",
    heureFin: "21:00",
    tempsPause: 0,
    transport: "Véhicule personnel",
    lieu: "Stade de France",
    adresse: "93200 Saint-Denis",
    superviseur: "Marie Martin",
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCachet, setSelectedCachet] = useState<typeof cachetsMockData[0] | null>(null);

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

  // Gérer la modification d'un cachet
  const handleEditCachet = (cachet: typeof cachetsMockData[0]) => {
    setSelectedCachet(cachet);
    setEditDialogOpen(true);
  };

  // Gérer la sauvegarde d'un cachet modifié
  const handleSaveCachet = (updatedCachet: typeof cachetsMockData[0]) => {
    setCachets(cachets.map(c => c.id === updatedCachet.id ? updatedCachet : c));
  };

  return (
    <div className="h-full flex flex-col gap-4 p-6">
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

      {/* Tableau avec en-tête et pied fixes */}
      <Card className="flex-1 border border-border/50 shadow-sm overflow-hidden p-6 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto rounded-lg border border-border/50 relative min-h-0">
          <table className="w-full caption-bottom text-sm relative">
            <thead className="sticky top-0 z-10 bg-background [&_tr]:border-b">
              <tr className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={handleSort}
                    className="flex items-center gap-2 hover:bg-muted/50 mx-auto whitespace-nowrap"
                  >
                    Date
                    {getSortIcon()}
                  </Button>
                </th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle w-[110px]">Employeur</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Nb</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Montant</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Total</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">H/C</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Total H</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle w-[110px]">Compétence</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Début</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Fin</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Pause</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Transport</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle w-[100px]">Lieu</th>
                <th className="bg-muted/30 h-10 px-2 text-left align-middle w-[160px]">Adresse</th>
                <th className="bg-muted/30 h-10 px-2 text-center align-middle whitespace-nowrap">Superviseur</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredCachets.length === 0 ? (
                <tr>
                  <td colSpan={15} className="p-2 align-middle text-center text-muted-foreground py-8">
                    Aucun cachet trouvé
                  </td>
                </tr>
              ) : (
                filteredCachets.map((cachet) => (
                  <tr key={cachet.id} className="group hover:bg-muted/20 border-b transition-colors">
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{formatDate(cachet.dateEvenement)}</td>
                    <td className="p-2 align-middle text-center w-[110px] py-4">{cachet.employeur}</td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{cachet.nombreCachet}</td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{cachet.montant.toFixed(2)} €</td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{cachet.totalBrut.toFixed(2)} €</td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{cachet.heureCachet}h</td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{cachet.totalHeures}h</td>
                    <td className="p-2 align-middle text-center w-[110px] py-4">
                      <span className="text-muted-foreground text-sm">{cachet.competence}</span>
                    </td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{cachet.heureDebut}</td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{cachet.heureFin}</td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">{cachet.tempsPause}h</td>
                    <td className="p-2 align-middle text-center whitespace-nowrap py-4">
                      <span className="text-muted-foreground text-sm">{cachet.transport}</span>
                    </td>
                    <td className="p-2 align-middle text-center w-[100px] py-4">{cachet.lieu}</td>
                    <td className="p-2 align-middle text-left w-[160px] py-4 leading-snug">
                      <span className="text-muted-foreground text-sm block">{cachet.adresse}</span>
                    </td>
                    <td className="p-2 align-middle text-center relative whitespace-nowrap py-4">
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
                          onClick={() => handleEditCachet(cachet)}
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="sticky bottom-0 z-10 bg-background border-t font-medium [&>tr]:last:border-b-0">
              <tr className="bg-muted/50 hover:bg-muted/50 border-b transition-colors">
                <td colSpan={15} className="p-2 align-middle py-4">
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
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Dialog de modification */}
      <EditCachetDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        cachet={selectedCachet}
        onSave={handleSaveCachet}
      />
    </div>
  );
}
