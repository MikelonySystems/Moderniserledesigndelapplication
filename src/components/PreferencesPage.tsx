import { useState } from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  User, 
  MapPin, 
  Car, 
  Calendar, 
  Euro, 
  Target, 
  Bell, 
  Download,
  Plus,
  Trash2,
  Save,
  Palette,
  Receipt,
  Settings,
  BarChart3,
  Briefcase,
  Clock,
  Percent
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RevenuReference {
  annee: string;
  montant: string;
}

export function PreferencesPage() {
  // Informations personnelles
  const [nom, setNom] = useState("Dupont");
  const [prenom, setPrenom] = useState("Jean");
  const [annexeDefaut, setAnnexeDefaut] = useState("8");
  const [jourAnniversaire, setJourAnniversaire] = useState("15");
  const [moisAnniversaire, setMoisAnniversaire] = useState("3");

  // Adresse
  const [adresse, setAdresse] = useState("12 Rue de la République");
  const [codePostal, setCodePostal] = useState("75001");
  const [ville, setVille] = useState("Paris");

  // Véhicule
  const [typeVehicule, setTypeVehicule] = useState("thermique");
  const [puissanceFiscale, setPuissanceFiscale] = useState("5");

  // Informations fiscales
  const [tauxPrelevement, setTauxPrelevement] = useState("8.5");

  // Revenus de référence
  const [revenusReference, setRevenusReference] = useState<RevenuReference[]>([
    { annee: "2024", montant: "42500" },
    { annee: "2023", montant: "38200" },
  ]);

  // Objectifs annuels
  const [objectifHeures, setObjectifHeures] = useState("507");
  const [objectifJours, setObjectifJours] = useState("175");
  const [objectifRevenus, setObjectifRevenus] = useState("45000");

  // Informations bancaires
  const [iban, setIban] = useState("FR76 1234 5678 9012 3456 7890 123");

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifRappelDeclarations, setNotifRappelDeclarations] = useState(true);
  const [notifObjectifs, setNotifObjectifs] = useState(false);

  // Personnalisation Dashboard
  const dashboardMetrics = [
    { id: "brut-cachets", label: "Brut (Cachets)", icon: Briefcase },
    { id: "brut-aem", label: "Brut (AEM)", icon: Target },
    { id: "net-revenus", label: "Net (Revenus)", icon: Euro },
    { id: "heures-cachets", label: "Heures (Cachets)", icon: Clock },
    { id: "heures-aem", label: "Heures (AEM)", icon: Clock },
    { id: "depenses-ttc", label: "Dépenses TTC", icon: Receipt },
    { id: "jours-cachets", label: "Jours (Cachets)", icon: Calendar },
    { id: "jours-aem", label: "Jours (AEM)", icon: Calendar },
  ];
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["brut-cachets", "heures-cachets", "net-revenus"]);

  // Parts professionnelles par défaut pour les dépenses
  const categoriesDepenses = [
    "Transports",
    "Parking",
    "Repas",
    "Hébergement",
    "Matériel",
    "Formation",
    "Péage",
    "Outillage",
    "Vêtements et accessoire",
    "Abonnement logiciel",
    "Crédit véhicule",
    "Abonnement mobile et internet",
  ];
  const [partsPro, setPartsPro] = useState<Record<string, string>>({
    "Transports": "100",
    "Parking": "100",
    "Repas": "50",
    "Hébergement": "100",
    "Matériel": "100",
    "Formation": "100",
    "Péage": "100",
    "Outillage": "100",
    "Vêtements et accessoire": "80",
    "Abonnement logiciel": "100",
    "Crédit véhicule": "100",
    "Abonnement mobile et internet": "80",
  });

  // Valeurs par défaut pour les cachets
  const [competenceDefaut, setCompetenceDefaut] = useState("Technicien son");
  const [nombreCachetsDefaut, setNombreCachetsDefaut] = useState("1");
  const [montantDefaut, setMontantDefaut] = useState("150");
  const [heuresDefaut, setHeuresDefaut] = useState("8");
  const [modeTransportDefaut, setModeTransportDefaut] = useState("Voiture");

  const competencesDisponibles = [
    "Technicien son",
    "Technicien lumière",
    "Technicien plateau",
    "Régisseur général",
    "Chef machiniste",
    "Électricien",
    "Vidéaste",
  ];

  const modesTransport = [
    "Voiture",
    "Train",
    "Métro/Bus",
    "Vélo",
    "À pied",
    "Co-voiturage",
  ];

  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter(m => m !== metricId));
      } else {
        toast.error("Vous devez garder au moins une métrique");
      }
    } else {
      if (selectedMetrics.length < 3) {
        setSelectedMetrics([...selectedMetrics, metricId]);
      } else {
        toast.error("Vous ne pouvez sélectionner que 3 métriques maximum");
      }
    }
  };

  const handlePartProChange = (categorie: string, value: string) => {
    setPartsPro({ ...partsPro, [categorie]: value });
  };

  const handleAddRevenuReference = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = (currentYear - revenusReference.length).toString();
    setRevenusReference([...revenusReference, { annee: nextYear, montant: "" }]);
  };

  const handleRemoveRevenuReference = (index: number) => {
    setRevenusReference(revenusReference.filter((_, i) => i !== index));
  };

  const handleUpdateRevenuReference = (index: number, field: 'annee' | 'montant', value: string) => {
    const updated = [...revenusReference];
    updated[index][field] = value;
    setRevenusReference(updated);
  };

  const handleSave = () => {
    // TODO: Logique de sauvegarde
    console.log("Préférences sauvegardées:", {
      nom, prenom, annexeDefaut, jourAnniversaire, moisAnniversaire,
      adresse, codePostal, ville,
      typeVehicule, puissanceFiscale,
      tauxPrelevement,
      revenusReference,
      objectifHeures, objectifJours, objectifRevenus,
      iban,
      notifEmail, notifRappelDeclarations, notifObjectifs
    });
    toast.success("Préférences sauvegardées avec succès !");
  };

  const handleExportData = () => {
    toast.success("Export des données en cours...");
    // TODO: Logique d'export
  };

  return (
    <div className="space-y-6 pb-8">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl mb-1">Préférences</h1>
          <p className="text-sm text-muted-foreground">
            Gérez vos informations personnelles et vos paramètres
          </p>
        </div>
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90"
        >
          <Save className="w-4 h-4 mr-2" />
          Enregistrer les modifications
        </Button>
      </div>

      {/* Informations personnelles */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg">Informations personnelles</h2>
            <p className="text-sm text-muted-foreground">Vos données d'identification</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de famille"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenom">Prénom</Label>
            <Input
              id="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Prénom"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="annexeDefaut">Annexe par défaut</Label>
            <Select value={annexeDefaut} onValueChange={setAnnexeDefaut}>
              <SelectTrigger id="annexeDefaut">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">Annexe 8 - Techniciens</SelectItem>
                <SelectItem value="10">Annexe 10 - Artistes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Jour anniversaire du statut</Label>
            <div className="flex gap-3">
              <Select value={jourAnniversaire} onValueChange={setJourAnniversaire}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={moisAnniversaire} onValueChange={setMoisAnniversaire}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Janvier</SelectItem>
                  <SelectItem value="2">Février</SelectItem>
                  <SelectItem value="3">Mars</SelectItem>
                  <SelectItem value="4">Avril</SelectItem>
                  <SelectItem value="5">Mai</SelectItem>
                  <SelectItem value="6">Juin</SelectItem>
                  <SelectItem value="7">Juillet</SelectItem>
                  <SelectItem value="8">Août</SelectItem>
                  <SelectItem value="9">Septembre</SelectItem>
                  <SelectItem value="10">Octobre</SelectItem>
                  <SelectItem value="11">Novembre</SelectItem>
                  <SelectItem value="12">Décembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Date de référence pour le calcul de vos 507h/175j
            </p>
          </div>
        </div>
      </Card>

      {/* Adresse du domicile */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg">Adresse du domicile</h2>
            <p className="text-sm text-muted-foreground">Pour le calcul des indemnités kilométriques</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input
              id="adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Numéro et nom de rue"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codePostal">Code postal</Label>
            <Input
              id="codePostal"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              placeholder="75001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ville">Ville</Label>
            <Input
              id="ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              placeholder="Paris"
            />
          </div>
        </div>
      </Card>

      {/* Véhicule */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center">
            <Car className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg">Véhicule</h2>
            <p className="text-sm text-muted-foreground">Pour le calcul des frais kilométriques</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="typeVehicule">Type de véhicule</Label>
            <Select value={typeVehicule} onValueChange={setTypeVehicule}>
              <SelectTrigger id="typeVehicule">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thermique">Thermique (essence/diesel)</SelectItem>
                <SelectItem value="electrique">Électrique/hybride</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="puissanceFiscale">Puissance fiscale (CV)</Label>
            <Select value={puissanceFiscale} onValueChange={setPuissanceFiscale}>
              <SelectTrigger id="puissanceFiscale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 CV</SelectItem>
                <SelectItem value="4">4 CV</SelectItem>
                <SelectItem value="5">5 CV</SelectItem>
                <SelectItem value="6">6 CV</SelectItem>
                <SelectItem value="7">7 CV et plus</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {typeVehicule === "thermique" && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground">
              Barème fiscal {new Date().getFullYear()} : {puissanceFiscale} CV = 0,{parseInt(puissanceFiscale) >= 5 ? '665' : '606'} €/km
            </p>
          </div>
        )}
        {typeVehicule === "electrique" && (
          <div className="mt-3 p-3 bg-green-600/10 rounded-lg">
            <p className="text-xs text-green-600">
              Barème fiscal {new Date().getFullYear()} (véhicule électrique) : {puissanceFiscale} CV = 0,{parseInt(puissanceFiscale) >= 5 ? '733' : '672'} €/km
            </p>
          </div>
        )}
      </Card>

      {/* Informations fiscales */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
              <Euro className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg">Informations fiscales</h2>
              <p className="text-sm text-muted-foreground">Pour vos déclarations et calculs</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddRevenuReference}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une année
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tauxPrelevement">Taux de prélèvement à la source (%)</Label>
              <Input
                id="tauxPrelevement"
                type="number"
                step="0.1"
                value={tauxPrelevement}
                onChange={(e) => setTauxPrelevement(e.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <Label className="text-sm">Revenus de référence</Label>
            <p className="text-xs text-muted-foreground mb-3">Historique de vos revenus annuels</p>
            <div className="space-y-3">
              {revenusReference.map((revenu, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Année</Label>
                      <Input
                        type="number"
                        value={revenu.annee}
                        onChange={(e) => handleUpdateRevenuReference(index, 'annee', e.target.value)}
                        placeholder="2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Revenu annuel (€)</Label>
                      <Input
                        type="number"
                        value={revenu.montant}
                        onChange={(e) => handleUpdateRevenuReference(index, 'montant', e.target.value)}
                        placeholder="42500"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mt-6"
                    onClick={() => handleRemoveRevenuReference(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Objectifs annuels */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-600/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-pink-600" />
          </div>
          <div>
            <h2 className="text-lg">Objectifs annuels</h2>
            <p className="text-sm text-muted-foreground">Définissez vos objectifs de l'année</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="objectifHeures">Heures cibles</Label>
            <Input
              id="objectifHeures"
              type="number"
              value={objectifHeures}
              onChange={(e) => setObjectifHeures(e.target.value)}
              placeholder="507"
            />
            <p className="text-xs text-muted-foreground">
              Minimum requis : 507h
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectifJours">Jours cibles</Label>
            <Input
              id="objectifJours"
              type="number"
              value={objectifJours}
              onChange={(e) => setObjectifJours(e.target.value)}
              placeholder="175"
            />
            <p className="text-xs text-muted-foreground">
              Minimum requis : 175j
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectifRevenus">Revenus cibles (€)</Label>
            <Input
              id="objectifRevenus"
              type="number"
              value={objectifRevenus}
              onChange={(e) => setObjectifRevenus(e.target.value)}
              placeholder="45000"
            />
            <p className="text-xs text-muted-foreground">
              Votre objectif personnel
            </p>
          </div>
        </div>
      </Card>

      {/* Personnalisation du dashboard */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg">Personnalisation du dashboard</h2>
            <p className="text-sm text-muted-foreground">Choisissez jusqu&apos;à 3 métriques à afficher dans le graphique</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {dashboardMetrics.map((metric) => {
              const Icon = metric.icon;
              const isSelected = selectedMetrics.includes(metric.id);
              const selectionIndex = selectedMetrics.indexOf(metric.id);
              
              return (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    isSelected
                      ? "bg-indigo-500/10 border-indigo-500 shadow-md"
                      : "bg-muted/20 border-border hover:border-indigo-500/30"
                  }`}
                >
                  {isSelected && (
                    <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center p-0">
                      {selectionIndex + 1}
                    </Badge>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? "bg-indigo-500/20" : "bg-muted/30"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isSelected ? "text-indigo-600" : "text-muted-foreground"
                      }`} />
                    </div>
                    <span className={`text-xs text-center leading-tight ${
                      isSelected ? "text-indigo-600 font-medium" : "text-muted-foreground"
                    }`}>
                      {metric.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/20">
            <p className="text-xs text-indigo-600">
              <strong>Sélection actuelle :</strong> {selectedMetrics.length}/3 métriques •{" "}
              {selectedMetrics.map((id, index) => {
                const metric = dashboardMetrics.find(m => m.id === id);
                return (
                  <span key={id}>
                    {metric?.label}{index < selectedMetrics.length - 1 ? ", " : ""}
                  </span>
                );
              })}
            </p>
          </div>
        </div>
      </Card>

      {/* Parts professionnelles par défaut */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center">
            <Percent className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg">Parts professionnelles par défaut</h2>
            <p className="text-sm text-muted-foreground">Définissez le pourcentage pro par catégorie de dépenses</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {categoriesDepenses.map((categorie) => (
            <div key={categorie} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm">{categorie}</Label>
              </div>
              <div className="flex items-center gap-2 w-32">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={partsPro[categorie] || "100"}
                  onChange={(e) => handlePartProChange(categorie, e.target.value)}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
          <p className="text-xs text-amber-600">
            Ces pourcentages seront pré-remplis lors de l&apos;ajout d&apos;une nouvelle dépense. Vous pourrez toujours les modifier manuellement.
          </p>
        </div>
      </Card>

      {/* Valeurs par défaut pour les cachets */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg">Valeurs par défaut pour les cachets</h2>
            <p className="text-sm text-muted-foreground">Pré-remplissage automatique lors de l&apos;ajout d&apos;un cachet</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="competenceDefaut">Compétence par défaut</Label>
            <Select value={competenceDefaut} onValueChange={setCompetenceDefaut}>
              <SelectTrigger id="competenceDefaut">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {competencesDisponibles.map((competence) => (
                  <SelectItem key={competence} value={competence}>
                    {competence}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modeTransportDefaut">Mode de transport par défaut</Label>
            <Select value={modeTransportDefaut} onValueChange={setModeTransportDefaut}>
              <SelectTrigger id="modeTransportDefaut">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modesTransport.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombreCachetsDefaut">Nombre de cachets</Label>
            <Input
              id="nombreCachetsDefaut"
              type="number"
              min="1"
              step="1"
              value={nombreCachetsDefaut}
              onChange={(e) => setNombreCachetsDefaut(e.target.value)}
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="montantDefaut">Montant par cachet (€)</Label>
            <Input
              id="montantDefaut"
              type="number"
              min="0"
              step="0.01"
              value={montantDefaut}
              onChange={(e) => setMontantDefaut(e.target.value)}
              placeholder="150.00"
            />
          </div>

          <div className="space-y-2 col-span-2">
            <Label htmlFor="heuresDefaut">Nombre d&apos;heures</Label>
            <Input
              id="heuresDefaut"
              type="number"
              min="0"
              step="0.5"
              value={heuresDefaut}
              onChange={(e) => setHeuresDefaut(e.target.value)}
              placeholder="8"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
          <p className="text-xs text-purple-600">
            Ces valeurs seront pré-remplies lors de l&apos;ajout d&apos;un nouveau cachet pour gagner du temps. Vous pourrez les modifier à tout moment.
          </p>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-600/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-lg">Notifications</h2>
            <p className="text-sm text-muted-foreground">Gérez vos préférences de notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div>
              <p className="text-sm">Notifications par email</p>
              <p className="text-xs text-muted-foreground">Recevoir des emails de notification</p>
            </div>
            <Switch
              checked={notifEmail}
              onCheckedChange={setNotifEmail}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div>
              <p className="text-sm">Rappels de déclarations</p>
              <p className="text-xs text-muted-foreground">Rappels mensuels pour Pôle Emploi</p>
            </div>
            <Switch
              checked={notifRappelDeclarations}
              onCheckedChange={setNotifRappelDeclarations}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
            <div>
              <p className="text-sm">Suivi des objectifs</p>
              <p className="text-xs text-muted-foreground">Alertes quand vous atteignez vos objectifs</p>
            </div>
            <Switch
              checked={notifObjectifs}
              onCheckedChange={setNotifObjectifs}
            />
          </div>
        </div>
      </Card>

      {/* Export des données */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 flex items-center justify-center">
            <Download className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-lg">Export des données</h2>
            <p className="text-sm text-muted-foreground">Téléchargez vos données</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter en CSV
          </Button>
          <Button
            variant="outline"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter en PDF
          </Button>
        </div>
      </Card>

      {/* Zone dangereuse */}
      <Card className="p-6 bg-destructive/5 border-destructive/20 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h2 className="text-lg text-destructive">Zone dangereuse</h2>
            <p className="text-sm text-muted-foreground">Actions irréversibles</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Supprimer toutes les données</p>
              <p className="text-xs text-muted-foreground">Cette action est irréversible</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.")) {
                  toast.error("Fonctionnalité non implémentée");
                }
              }}
            >
              Supprimer mes données
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}