import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface AddDepenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDepenseDialog({ open, onOpenChange }: AddDepenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle dépense professionnelle
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type de dépense</Label>
            <Select>
              <SelectTrigger id="type">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="materiel">Matériel</SelectItem>
                <SelectItem value="formation">Formation</SelectItem>
                <SelectItem value="repas">Repas</SelectItem>
                <SelectItem value="hebergement">Hébergement</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Prix TTC, HT, TVA */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ttc">Prix TTC (€)</Label>
              <Input id="ttc" type="number" step="0.01" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ht">Prix HT (€)</Label>
              <Input id="ht" type="number" step="0.01" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tva">TVA (%)</Label>
              <Input id="tva" type="number" step="0.01" placeholder="20.00" />
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-2">
            <Label htmlFor="details">Détails</Label>
            <Textarea
              id="details"
              placeholder="Description de la dépense..."
              className="resize-none"
              rows={3}
            />
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
