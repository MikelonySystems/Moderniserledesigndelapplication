import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns@4.1.0";
import { fr } from "date-fns@4.1.0/locale";
import { toast } from "sonner@2.0.3";

interface AddAemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAemDialog({ open, onOpenChange }: AddAemDialogProps) {
  const [dateDebut, setDateDebut] = useState<Date>();
  const [dateFin, setDateFin] = useState<Date>();
  const [type, setType] = useState("Maladie");
  const [montantJournalier, setMontantJournalier] = useState("59.63");
  const [statut, setStatut] = useState("En attente");
  const [numeroAttestation, setNumeroAttestation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateDebut || !dateFin || !numeroAttestation) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (dateFin < dateDebut) {
      toast.error("La date de fin doit être postérieure à la date de début");
      return;
    }

    // TODO: Sauvegarder la période AEM
    toast.success("Période AEM ajoutée avec succès");
    
    // Reset form
    setDateDebut(undefined);
    setDateFin(undefined);
    setType("Maladie");
    setMontantJournalier("59.63");
    setStatut("En attente");
    setNumeroAttestation("");
    
    onOpenChange(false);
  };

  const calculateDaysAndTotal = () => {
    if (!dateDebut || !dateFin) return { jours: 0, total: "0.00" };
    
    const debut = dateDebut.getTime();
    const fin = dateFin.getTime();
    const jours = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24)) + 1;
    const montant = parseFloat(montantJournalier) || 0;
    const total = (jours * montant).toFixed(2);
    
    return { jours, total };
  };

  const { jours, total } = calculateDaysAndTotal();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une période AEM</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle période d'arrêt maladie
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maladie">Maladie</SelectItem>
                <SelectItem value="Accident du travail">Accident du travail</SelectItem>
                <SelectItem value="Maladie professionnelle">Maladie professionnelle</SelectItem>
                <SelectItem value="Maternité">Maternité</SelectItem>
                <SelectItem value="Paternité">Paternité</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut">Date de début *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateDebut ? format(dateDebut, "dd MMMM yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateDebut}
                    onSelect={setDateDebut}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFin">Date de fin *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFin ? format(dateFin, "dd MMMM yyyy", { locale: fr }) : "Sélectionner"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFin}
                    onSelect={setDateFin}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Numéro d'attestation */}
          <div className="space-y-2">
            <Label htmlFor="numeroAttestation">Numéro d'attestation *</Label>
            <Input
              id="numeroAttestation"
              value={numeroAttestation}
              onChange={(e) => setNumeroAttestation(e.target.value)}
              placeholder="AEM2025-110201"
            />
          </div>

          {/* Montant journalier */}
          <div className="space-y-2">
            <Label htmlFor="montantJournalier">Indemnité journalière (€) *</Label>
            <Input
              id="montantJournalier"
              type="number"
              step="0.01"
              value={montantJournalier}
              onChange={(e) => setMontantJournalier(e.target.value)}
              placeholder="59.63"
            />
          </div>

          {/* Statut */}
          <div className="space-y-2">
            <Label htmlFor="statut">Statut</Label>
            <Select value={statut} onValueChange={setStatut}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Validé">Validé</SelectItem>
                <SelectItem value="Payé">Payé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Récapitulatif */}
          {dateDebut && dateFin && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Durée</span>
                <span>{jours} jour{jours > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Indemnité journalière</span>
                <span>{montantJournalier} €</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total estimé</span>
                <span className="text-xl">{total} €</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-br from-primary to-purple-600"
            >
              Ajouter la période
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
