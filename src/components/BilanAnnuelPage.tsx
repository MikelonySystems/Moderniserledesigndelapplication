import { useState } from "react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { 
  Euro, 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Calculator,
  FileText,
  AlertCircle
} from "lucide-react";

// Données mock pour l'exemple
const mockRevenusData = {
  "2025": {
    salaires: 28500,
    indemnites: 3200,
    kmParcourus: 2400,
  },
  "2024": {
    salaires: 26800,
    indemnites: 2950,
    kmParcourus: 2100,
  },
  "2023": {
    salaires: 24300,
    indemnites: 2600,
    kmParcourus: 1850,
  },
};

const mockDepensesData = {
  "2025": {
    materiel: 1200,
    formation: 800,
    abonnements: 450,
    autres: 320,
  },
  "2024": {
    materiel: 980,
    formation: 650,
    abonnements: 420,
    autres: 280,
  },
  "2023": {
    materiel: 750,
    formation: 500,
    abonnements: 380,
    autres: 190,
  },
};

// Barème kilométrique 2025 (pour véhicule essence/diesel, < 5CV)
const BAREME_KM = {
  "0-5000": 0.529,
  "5001-20000": 0.316,
  "20001+": 0.370,
};

// Barème de l'impôt sur le revenu 2025 (pour 1 part fiscale)
const BAREME_IMPOT = [
  { max: 11294, taux: 0 },
  { max: 28797, taux: 0.11 },
  { max: 82341, taux: 0.30 },
  { max: 177106, taux: 0.41 },
  { max: Infinity, taux: 0.45 },
];

// Fonction de calcul de l'impôt sur le revenu
const calculerImpot = (revenuImposable: number, nbParts: number = 1): number => {
  const quotientFamilial = revenuImposable / nbParts;
  let impotParPart = 0;
  let revenusRestants = quotientFamilial;
  let seuilPrecedent = 0;

  for (const tranche of BAREME_IMPOT) {
    const plafondTranche = tranche.max;
    const montantTranche = Math.min(revenusRestants, plafondTranche - seuilPrecedent);
    
    if (montantTranche <= 0) break;
    
    impotParPart += montantTranche * tranche.taux;
    revenusRestants -= montantTranche;
    seuilPrecedent = plafondTranche;
    
    if (revenusRestants <= 0) break;
  }

  return impotParPart * nbParts;
};

export function BilanAnnuelPage() {
  const [annee, setAnnee] = useState("2025");
  const [utiliseFraisReels, setUtiliseFraisReels] = useState(false);
  const [kmPersonnalises, setKmPersonnalises] = useState<number | null>(null);
  const [nbPartsFiscales, setNbPartsFiscales] = useState(1);

  // Récupération des données pour l'année sélectionnée
  const revenus = mockRevenusData[annee as keyof typeof mockRevenusData] || mockRevenusData["2025"];
  const depenses = mockDepensesData[annee as keyof typeof mockDepensesData] || mockDepensesData["2025"];

  // Calcul des totaux
  const totalRevenusSalaires = revenus.salaires;
  const totalRevenusIndemnites = revenus.indemnites;
  const totalRevenus = totalRevenusSalaires + totalRevenusIndemnites;
  const totalDepenses = Object.values(depenses).reduce((sum, val) => sum + val, 0);

  // Calcul frais kilométriques
  const kmUtilises = kmPersonnalises ?? revenus.kmParcourus;
  const calculerFraisKm = (km: number): number => {
    if (km <= 5000) {
      return km * BAREME_KM["0-5000"];
    } else if (km <= 20000) {
      return 5000 * BAREME_KM["0-5000"] + (km - 5000) * BAREME_KM["5001-20000"];
    } else {
      return 5000 * BAREME_KM["0-5000"] + 15000 * BAREME_KM["5001-20000"] + (km - 20000) * BAREME_KM["20001+"];
    }
  };
  const fraisKilometriques = calculerFraisKm(kmUtilises);

  // Calcul fiscal
  const totalFraisReels = totalDepenses + fraisKilometriques;
  const abattement10Pourcent = totalRevenus * 0.10;
  const deductionFiscale = utiliseFraisReels ? totalFraisReels : abattement10Pourcent;
  const revenuNetImposable = totalRevenus - deductionFiscale;

  // Calcul cotisations sociales (estimation)
  const tauxCotisationsSociales = 0.22; // 22% en moyenne pour intermittent
  const cotisationsSociales = totalRevenusSalaires * tauxCotisationsSociales;

  // Calcul de l'impôt sur le revenu
  const impotSurLeRevenu = calculerImpot(revenuNetImposable, nbPartsFiscales);
  const prelevementMensuel = impotSurLeRevenu / 12;
  const montantSur4Mois = impotSurLeRevenu / 4;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary mb-1">Bilan Annuel</h1>
          <p className="text-muted-foreground">
            Récapitulatif pour votre déclaration d'impôts
          </p>
        </div>
        
        <div className="w-40">
          <Select value={annee} onValueChange={setAnnee}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cartes de synthèse des revenus */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-border/40 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Euro className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Revenus salariaux</p>
            <p className="text-2xl">{totalRevenusSalaires.toLocaleString('fr-FR')} €</p>
          </div>
        </Card>

        <Card className="p-5 border-border/40 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Indemnités</p>
            <p className="text-2xl">{totalRevenusIndemnites.toLocaleString('fr-FR')} €</p>
          </div>
        </Card>

        <Card className="p-5 border-border/40 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Dépenses</p>
            <p className="text-2xl">{totalDepenses.toLocaleString('fr-FR')} €</p>
          </div>
        </Card>

        <Card className="p-5 border-border/40 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Car className="h-5 w-5 text-warning" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Frais kilométriques</p>
            <p className="text-2xl">{fraisKilometriques.toFixed(2)} €</p>
            <p className="text-xs text-muted-foreground">{kmUtilises.toLocaleString('fr-FR')} km</p>
          </div>
        </Card>
      </div>

      {/* Section frais kilométriques détaillés */}
      <Card className="p-6 border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Car className="h-5 w-5 text-primary" />
          <h2 className="text-lg">Calcul des frais kilométriques</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <Label htmlFor="km-parcourus">Kilomètres parcourus en {annee}</Label>
              <Input
                id="km-parcourus"
                type="number"
                placeholder={revenus.kmParcourus.toString()}
                value={kmPersonnalises ?? ""}
                onChange={(e) => setKmPersonnalises(e.target.value ? parseInt(e.target.value) : null)}
                className="mt-1.5"
              />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
              <p>Barème 2025 (véhicule &lt; 5CV)</p>
              <div className="space-y-1 text-muted-foreground">
                <p>• 0 à 5 000 km : 0,529 € / km</p>
                <p>• 5 001 à 20 000 km : 0,316 € / km</p>
                <p>• Au-delà de 20 000 km : 0,370 € / km</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Montant déductible</p>
              <p className="text-3xl text-primary">{fraisKilometriques.toFixed(2)} €</p>
              <p className="text-xs text-muted-foreground mt-2">
                Basé sur {kmUtilises.toLocaleString('fr-FR')} km parcourus
              </p>
            </div>

            <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground">
              <div className="flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Le barème kilométrique inclut la dépréciation, l'assurance, 
                  l'entretien et le carburant. Ne déduisez pas ces frais en double.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section détail des dépenses */}
      <Card className="p-6 border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="h-5 w-5 text-primary" />
          <h2 className="text-lg">Détail des dépenses</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Matériel</p>
            <p className="text-xl">{depenses.materiel.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Formation</p>
            <p className="text-xl">{depenses.formation.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Abonnements</p>
            <p className="text-xl">{depenses.abonnements.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Autres</p>
            <p className="text-xl">{depenses.autres.toLocaleString('fr-FR')} €</p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <p>Total des dépenses</p>
          <p className="text-xl">{totalDepenses.toLocaleString('fr-FR')} €</p>
        </div>
      </Card>

      {/* Section calcul fiscal */}
      <Card className="p-6 border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="text-lg">Calcul pour la déclaration d'impôts</h2>
        </div>

        {/* Toggle abattement / frais réels */}
        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p>Mode de déduction</p>
              <p className="text-sm text-muted-foreground mt-1">
                {utiliseFraisReels ? "Frais réels" : "Abattement forfaitaire de 10%"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="mode-deduction" className="text-sm">
                {utiliseFraisReels ? "Frais réels" : "Abattement 10%"}
              </Label>
              <Switch
                id="mode-deduction"
                checked={utiliseFraisReels}
                onCheckedChange={setUtiliseFraisReels}
              />
            </div>
          </div>
        </div>

        {/* Tableau récapitulatif */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <p className="text-muted-foreground">Revenus salariaux</p>
            <p>{totalRevenusSalaires.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="flex justify-between items-center py-2">
            <p className="text-muted-foreground">Indemnités</p>
            <p>{totalRevenusIndemnites.toLocaleString('fr-FR')} €</p>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center py-2">
            <p>Total des revenus bruts</p>
            <p className="text-lg">{totalRevenus.toLocaleString('fr-FR')} €</p>
          </div>

          <Separator />

          {utiliseFraisReels ? (
            <>
              <div className="flex justify-between items-center py-2 text-destructive">
                <p>Dépenses professionnelles</p>
                <p>- {totalDepenses.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="flex justify-between items-center py-2 text-destructive">
                <p>Frais kilométriques</p>
                <p>- {fraisKilometriques.toFixed(2)} €</p>
              </div>
              <div className="flex justify-between items-center py-2 bg-destructive/5 px-3 rounded">
                <p>Total frais réels</p>
                <p className="text-destructive">- {totalFraisReels.toFixed(2)} €</p>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center py-2 bg-destructive/5 px-3 rounded">
              <p>Abattement forfaitaire 10%</p>
              <p className="text-destructive">- {abattement10Pourcent.toFixed(2)} €</p>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex justify-between items-center py-2">
            <p className="text-muted-foreground">Cotisations sociales (estimation)</p>
            <p className="text-destructive">- {cotisationsSociales.toFixed(2)} €</p>
          </div>
        </div>

        {/* Comparaison des deux méthodes */}
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-primary mb-2">Comparaison des méthodes</p>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-background/60 p-3 rounded">
                  <p className="text-muted-foreground mb-1">Abattement 10%</p>
                  <p>
                    Revenu net : {(totalRevenus - abattement10Pourcent).toFixed(2)} €
                  </p>
                </div>
                <div className="bg-background/60 p-3 rounded">
                  <p className="text-muted-foreground mb-1">Frais réels</p>
                  <p>
                    Revenu net : {(totalRevenus - totalFraisReels).toFixed(2)} €
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                💡 La méthode la plus avantageuse : <span>
                  {totalFraisReels > abattement10Pourcent ? "Frais réels" : "Abattement 10%"}
                </span>
                {" "}(différence de {Math.abs(totalFraisReels - abattement10Pourcent).toFixed(2)} €)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Section estimation de l'impôt sur le revenu */}
      <Card className="p-6 border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h2 className="text-lg">Estimation de l'impôt sur le revenu</h2>
        </div>

        {/* Sélecteur nombre de parts fiscales */}
        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="nb-parts">Nombre de parts fiscales</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {nbPartsFiscales === 1 && "Célibataire sans enfant"}
                {nbPartsFiscales === 1.5 && "Célibataire avec 1 enfant"}
                {nbPartsFiscales === 2 && "Couple sans enfant"}
                {nbPartsFiscales === 2.5 && "Couple avec 1 enfant"}
                {nbPartsFiscales === 3 && "Couple avec 2 enfants"}
              </p>
            </div>
            <div className="w-32">
              <Select value={nbPartsFiscales.toString()} onValueChange={(v) => setNbPartsFiscales(parseFloat(v))}>
                <SelectTrigger id="nb-parts">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 part</SelectItem>
                  <SelectItem value="1.5">1,5 parts</SelectItem>
                  <SelectItem value="2">2 parts</SelectItem>
                  <SelectItem value="2.5">2,5 parts</SelectItem>
                  <SelectItem value="3">3 parts</SelectItem>
                  <SelectItem value="3.5">3,5 parts</SelectItem>
                  <SelectItem value="4">4 parts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Calculs */}
        <div className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Revenu net imposable</p>
            <p className="text-2xl text-primary">{revenuNetImposable.toFixed(2)} €</p>
            <p className="text-xs text-muted-foreground mt-1">
              Quotient familial : {(revenuNetImposable / nbPartsFiscales).toFixed(2)} € / part
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Impôt total estimé</p>
              <p className="text-2xl text-destructive">{impotSurLeRevenu.toFixed(2)} €</p>
            </div>

            <div className="bg-warning/5 border border-warning/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Prélèvement mensuel</p>
              <p className="text-2xl text-warning">{prelevementMensuel.toFixed(2)} €</p>
              <p className="text-xs text-muted-foreground mt-1">Sur 12 mois</p>
            </div>

            <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Étalé sur 4 mois</p>
              <p className="text-2xl text-orange-600">{montantSur4Mois.toFixed(2)} €</p>
              <p className="text-xs text-muted-foreground mt-1">Par mois</p>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground">
            <div className="flex gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>
                Cette estimation est calculée selon le barème 2025 de l'impôt sur le revenu.
                Elle ne prend pas en compte les autres revenus éventuels, les crédits d'impôt,
                ou les réductions fiscales. Le montant réel peut varier.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Résultat final */}
      <Card className="p-6 border-primary/40 shadow-lg bg-gradient-to-br from-primary/5 to-purple-500/5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-lg">Résultat pour la déclaration</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <p className="text-muted-foreground">Revenu net imposable</p>
            <p className="text-4xl text-primary">
              {revenuNetImposable.toFixed(2)} €
            </p>
          </div>

          <Separator />

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Case 1AJ (Revenus)</p>
              <p className="text-lg">{totalRevenus.toLocaleString('fr-FR')} €</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Case 1AK (Déductions)</p>
              <p className="text-lg">{deductionFiscale.toFixed(2)} €</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Revenus imposables</p>
              <p className="text-lg text-primary">{revenuNetImposable.toFixed(2)} €</p>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground">
            <p>
              ℹ️ Ces montants sont des estimations. Consultez votre expert-comptable ou 
              les services fiscaux pour une déclaration précise.
            </p>
          </div>

          <Button className="w-full bg-gradient-to-br from-primary to-purple-600 hover:opacity-90">
            <FileText className="mr-2 h-4 w-4" />
            Exporter le récapitulatif PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}
