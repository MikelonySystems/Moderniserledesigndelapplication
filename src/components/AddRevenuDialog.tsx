import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AddRevenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRevenuDialog({ open, onOpenChange }: AddRevenuDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Ajouter un revenu</DialogTitle>
          <DialogDescription>
            Enregistrez un versement de revenu
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {/* Type de revenu et Verseur */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de revenu</Label>
              <Select>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaire">Salaire</SelectItem>
                  <SelectItem value="allocation">Allocation chômage</SelectItem>
                  <SelectItem value="prime">Prime</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="verseur">Verseur</Label>
              <Input id="verseur" placeholder="Nom du verseur" />
            </div>
          </div>

          {/* Date de versement et Pour le mois de */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date de versement</Label>
              <Input id="date" type="date" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mois">Pour le mois de</Label>
              <Input id="mois" type="month" />
            </div>
          </div>

          {/* Brut, Net à payer, Net imposable */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brut">Brut (€)</Label>
              <Input id="brut" type="number" step="0.01" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="netpayer">Net à payer (€)</Label>
              <Input id="netpayer" type="number" step="0.01" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="netimposable">Net imposable (€)</Label>
              <Input id="netimposable" type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>

          {/* Heures supplémentaires exonérées */}
          <div className="space-y-2">
            <Label htmlFor="heuresexo">Heures supplémentaires exonérées (€)</Label>
            <Input id="heuresexo" type="number" step="0.01" placeholder="0.00" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90"
            onClick={() => {
              // TODO: Logique de sauvegarde
              onOpenChange(false);
            }}
          >
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
