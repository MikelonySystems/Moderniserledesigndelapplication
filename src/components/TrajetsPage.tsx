import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Map,
  List,
  Euro,
  Car,
  MapPin,
  Route,
  Plus,
  Navigation,
  Clock,
  ArrowRight
} from "lucide-react";
import { format, isSameDay } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";
import { AddTrajetDialog } from "./AddTrajetDialog";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";

// Données d'exemple
const trajetsMockData = [
  {
    id: 1,
    date: "2025-11-08",
    depart: "Paris",
    arrivee: "Lyon",
    distance: 465,
    motif: "Concert Auditorium",
    typeVehicule: "Voiture personnelle",
    indemniteKm: 0.568,
    peage: 45.80,
    parking: 12.00,
    departCoords: { lat: 48.8566, lng: 2.3522 },
    arriveeCoords: { lat: 45.7640, lng: 4.8357 }
  },
  {
    id: 2,
    date: "2025-11-06",
    depart: "Lyon",
    arrivee: "Marseille",
    distance: 315,
    motif: "Festival de musique",
    typeVehicule: "Voiture personnelle",
    indemniteKm: 0.568,
    peage: 28.50,
    parking: 15.00,
    departCoords: { lat: 45.7640, lng: 4.8357 },
    arriveeCoords: { lat: 43.2965, lng: 5.3698 }
  },
  {
    id: 3,
    date: "2025-11-04",
    depart: "Paris",
    arrivee: "Lille",
    distance: 225,
    motif: "Opéra de Lille",
    typeVehicule: "Voiture personnelle",
    indemniteKm: 0.568,
    peage: 18.20,
    parking: 8.00,
    departCoords: { lat: 48.8566, lng: 2.3522 },
    arriveeCoords: { lat: 50.6292, lng: 3.0573 }
  },
  {
    id: 4,
    date: "2025-10-28",
    depart: "Paris",
    arrivee: "Bordeaux",
    distance: 580,
    motif: "Théâtre National",
    typeVehicule: "Voiture personnelle",
    indemniteKm: 0.568,
    peage: 52.30,
    parking: 20.00,
    departCoords: { lat: 48.8566, lng: 2.3522 },
    arriveeCoords: { lat: 44.8378, lng: -0.5792 }
  },
  {
    id: 5,
    date: "2025-10-25",
    depart: "Bordeaux",
    arrivee: "Toulouse",
    distance: 245,
    motif: "Salle Zénith",
    typeVehicule: "Voiture personnelle",
    indemniteKm: 0.568,
    peage: 15.00,
    parking: 10.00,
    departCoords: { lat: 44.8378, lng: -0.5792 },
    arriveeCoords: { lat: 43.6047, lng: 1.4442 }
  },
];

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px'
};

const center = {
  lat: 46.603354,
  lng: 1.888334
};

export function TrajetsPage() {
  const [trajets] = useState(trajetsMockData);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTrajet, setSelectedTrajet] = useState<typeof trajetsMockData[0] | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  // Calculs
  const totals = trajets.reduce(
    (acc, trajet) => {
      const totalIndemnites = trajet.distance * trajet.indemniteKm;
      const totalFrais = trajet.peage + trajet.parking;
      const total = totalIndemnites + totalFrais;
      
      return {
        totalTrajets: acc.totalTrajets + 1,
        totalDistance: acc.totalDistance + trajet.distance,
        totalIndemnites: acc.totalIndemnites + totalIndemnites,
        totalGeneral: acc.totalGeneral + total,
      };
    },
    { totalTrajets: 0, totalDistance: 0, totalIndemnites: 0, totalGeneral: 0 }
  );

  // Trajets pour la date sélectionnée
  const trajetsForSelectedDate = trajets.filter(trajet => 
    selectedDate && isSameDay(new Date(trajet.date), selectedDate)
  );

  // Dates avec des trajets (pour le calendrier)
  const datesWithTrajets = trajets.map(t => new Date(t.date));

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: fr });
  };

  // Calculer l'itinéraire pour un trajet
  const handleTrajetClick = (trajet: typeof trajetsMockData[0]) => {
    setSelectedTrajet(trajet);
    
    // Simuler un itinéraire (en production, utiliser le DirectionsService de Google)
    // Pour l'instant, on ne fait rien car on a besoin d'une vraie clé API
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl">Mes Trajets</h1>
              <p className="text-sm text-muted-foreground">
                {totals.totalTrajets} trajet{totals.totalTrajets > 1 ? 's' : ''} • {totals.totalDistance.toFixed(0)} km
              </p>
            </div>
          </div>
        </div>
        
        <Button
          className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:opacity-90"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un trajet
        </Button>
      </div>

      {/* Stats rapides - version compacte */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Car className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trajets</p>
              <p className="text-lg">{totals.totalTrajets}</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 border-cyan-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Route className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="text-lg">{totals.totalDistance.toFixed(0)} km</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Euro className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Indemnités</p>
              <p className="text-lg">{totals.totalIndemnites.toFixed(0)} €</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg">{totals.totalGeneral.toFixed(0)} €</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contenu principal avec tabs */}
      <Tabs defaultValue="calendar" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-fit">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarIcon className="w-4 h-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <Map className="w-4 h-4" />
            Carte
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="w-4 h-4" />
            Liste
          </TabsTrigger>
        </TabsList>

        {/* Vue Calendrier */}
        <TabsContent value="calendar" className="flex-1 min-h-0 mt-4">
          <div className="h-full flex flex-col lg:flex-row gap-4">
            {/* Calendrier */}
            <Card className="lg:w-[35%] p-6 flex flex-col">
              <h3 className="mb-4">Sélectionner une date</h3>
              <div className="flex-1 flex items-center justify-center overflow-visible py-8">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={fr}
                  className="rounded-md border-0 calendar-large"
                  modifiers={{
                    booked: datesWithTrajets
                  }}
                  modifiersStyles={{
                    booked: {
                      fontWeight: 'bold',
                      backgroundColor: 'rgb(59 130 246 / 0.1)',
                      color: 'rgb(37 99 235)'
                    }
                  }}
                />
              </div>
              <div className="mt-4 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500/30" />
                  Dates avec trajets
                </p>
              </div>
            </Card>

            {/* Trajets du jour sélectionné */}
            <Card className="flex-1 p-6 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h3>
                  {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : "Aucune date sélectionnée"}
                </h3>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  {trajetsForSelectedDate.length} trajet{trajetsForSelectedDate.length > 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {trajetsForSelectedDate.length > 0 ? (
                  trajetsForSelectedDate.map((trajet) => {
                    const totalIndemnites = trajet.distance * trajet.indemniteKm;
                    const totalFrais = trajet.peage + trajet.parking;
                    const total = totalIndemnites + totalFrais;

                    return (
                      <motion.div
                        key={trajet.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group"
                      >
                        <Card 
                          className="p-4 border-l-4 border-l-blue-500 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => handleTrajetClick(trajet)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">{trajet.depart}</span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{trajet.arrivee}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{trajet.motif}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{total.toFixed(2)} €</p>
                              <p className="text-xs text-muted-foreground">{trajet.distance} km</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm pt-3 border-t border-border/50">
                            <div className="flex items-center gap-1">
                              <Euro className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs">{totalIndemnites.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs">Péage: {trajet.peage.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Car className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-xs">Parking: {trajet.parking.toFixed(2)} €</span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>Aucun trajet pour cette date</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Vue Carte */}
        <TabsContent value="map" className="flex-1 min-h-0 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
            {/* Liste des trajets (sidebar) */}
            <Card className="lg:col-span-1 p-4 flex flex-col overflow-hidden">
              <h3 className="mb-4">Trajets récents</h3>
              <div className="flex-1 overflow-y-auto space-y-2">
                {trajets.map((trajet) => (
                  <motion.div
                    key={trajet.id}
                    whileHover={{ x: 4 }}
                    className="cursor-pointer"
                    onClick={() => handleTrajetClick(trajet)}
                  >
                    <Card 
                      className={`p-3 border-l-4 transition-all ${
                        selectedTrajet?.id === trajet.id 
                          ? 'border-l-blue-500 bg-blue-500/5' 
                          : 'border-l-transparent hover:border-l-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">{trajet.depart}</span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium truncate">{trajet.arrivee}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{formatDate(trajet.date)}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{trajet.distance} km</span>
                        <span className="font-medium">{(trajet.distance * trajet.indemniteKm + trajet.peage + trajet.parking).toFixed(2)} €</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Carte Google Maps */}
            <Card className="lg:col-span-3 p-4 overflow-hidden">
              <div className="w-full h-full min-h-[500px] bg-muted/10 rounded-lg border border-border/50 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <Map className="w-16 h-16 mx-auto text-blue-500/30" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Carte interactive Google Maps
                    </p>
                    <p className="text-xs text-muted-foreground max-w-md">
                      La carte s'affichera ici avec vos trajets visualisés.<br />
                      Pour activer cette fonctionnalité, ajoutez votre clé API Google Maps.
                    </p>
                    <div className="mt-4 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20 max-w-md mx-auto">
                      <p className="text-xs text-blue-600">
                        💡 Astuce : Configurez VITE_GOOGLE_MAPS_API_KEY dans vos variables d'environnement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Vue Liste */}
        <TabsContent value="list" className="flex-1 min-h-0 mt-4">
          <Card className="h-full p-6 flex flex-col overflow-hidden">
            <h3 className="mb-4">Tous les trajets</h3>
            <div className="flex-1 overflow-auto rounded-lg border border-border/50">
              <table className="w-full caption-bottom text-sm">
                <thead className="sticky top-0 z-10 bg-background [&_tr]:border-b">
                  <tr className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Date</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Départ</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Arrivée</th>
                    <th className="bg-muted/30 h-10 px-3 text-left align-middle">Motif</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Distance</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Indemnités</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Frais</th>
                    <th className="bg-muted/30 h-10 px-3 text-right align-middle">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {trajets.map((trajet) => {
                    const totalIndemnites = trajet.distance * trajet.indemniteKm;
                    const totalFrais = trajet.peage + trajet.parking;
                    const total = totalIndemnites + totalFrais;

                    return (
                      <tr key={trajet.id} className="group hover:bg-muted/20 border-b transition-colors">
                        <td className="p-3 align-middle">{formatDate(trajet.date)}</td>
                        <td className="p-3 align-middle">{trajet.depart}</td>
                        <td className="p-3 align-middle">{trajet.arrivee}</td>
                        <td className="p-3 align-middle max-w-xs truncate">{trajet.motif}</td>
                        <td className="p-3 align-middle text-right">{trajet.distance} km</td>
                        <td className="p-3 align-middle text-right">{totalIndemnites.toFixed(2)} €</td>
                        <td className="p-3 align-middle text-right">{totalFrais.toFixed(2)} €</td>
                        <td className="p-3 align-middle text-right font-medium">{total.toFixed(2)} €</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AddTrajetDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
}