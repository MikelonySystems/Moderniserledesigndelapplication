import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";

interface AddTrajetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTrajetDialog({ open, onOpenChange }: AddTrajetDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Trajet ajouté avec succès !");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un trajet</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="depart">Départ</Label>
              <Input id="depart" placeholder="Ex: Paris" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="arrivee">Arrivée</Label>
              <Input id="arrivee" placeholder="Ex: Lyon" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input id="distance" type="number" placeholder="Ex: 465" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motif">Motif</Label>
            <Input id="motif" placeholder="Ex: Concert Auditorium" required />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="indemniteKm">Indemnité/km (€)</Label>
              <Input id="indemniteKm" type="number" step="0.001" placeholder="0.568" defaultValue="0.568" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peage">Péage (€)</Label>
              <Input id="peage" type="number" step="0.01" placeholder="45.80" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parking">Parking (€)</Label>
              <Input id="parking" type="number" step="0.01" placeholder="12.00" required />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-to-br from-blue-500 to-cyan-500 hover:opacity-90">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
