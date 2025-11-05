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
  Save
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
  const [numeroSecu, setNumeroSecu] = useState("1 85 03 75 116 012 45");
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
  const [numeroFiscal, setNumeroFiscal] = useState("2508751160124");
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
      nom, prenom, numeroSecu, annexeDefaut, jourAnniversaire, moisAnniversaire,
      adresse, codePostal, ville,
      typeVehicule, puissanceFiscale,
      numeroFiscal, tauxPrelevement,
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
            <Label htmlFor="numeroSecu">Numéro de sécurité sociale</Label>
            <Input
              id="numeroSecu"
              value={numeroSecu}
              onChange={(e) => setNumeroSecu(e.target.value)}
              placeholder="X XX XX XX XXX XXX XX"
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

          <div className="space-y-2 col-span-2">
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
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center">
            <Euro className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg">Informations fiscales</h2>
            <p className="text-sm text-muted-foreground">Pour vos déclarations et calculs</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numeroFiscal">Numéro fiscal</Label>
            <Input
              id="numeroFiscal"
              value={numeroFiscal}
              onChange={(e) => setNumeroFiscal(e.target.value)}
              placeholder="13 chiffres"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="FR76 1234 5678 9012 3456 7890 123"
            />
          </div>
        </div>
      </Card>

      {/* Revenus de référence */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg">Revenus de référence</h2>
              <p className="text-sm text-muted-foreground">Historique de vos revenus annuels</p>
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

        <div className="space-y-3">
          {revenusReference.map((revenu, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Année</Label>
                  <Input
                    type="number"
                    value={revenu.annee}
                    onChange={(e) => handleUpdateRevenuReference(index, 'annee', e.target.value)}
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Revenu annuel (€)</Label>
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
                className="mt-8"
                onClick={() => handleRemoveRevenuReference(index)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
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
