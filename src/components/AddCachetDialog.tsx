import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";

interface AddCachetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCachetDialog({ open, onOpenChange }: AddCachetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau cachet</DialogTitle>
          <DialogDescription>
            Remplissez les informations de votre cachet
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {/* Employeur */}
          <div className="space-y-2">
            <Label htmlFor="employeur">Employeur</Label>
            <Input id="employeur" placeholder="Nom de l'employeur" />
          </div>

          {/* Nombre de cachet et Montant */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de cachets</Label>
              <Input id="nombre" type="number" step="1" placeholder="1" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montant">Montant du cachet (€)</Label>
              <Input id="montant" type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>

          {/* Nombre d'heures et Compétence */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heures">Nombre d'heures</Label>
              <Input id="heures" type="number" step="0.5" placeholder="0.00" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="competence">Compétence</Label>
              <Select>
                <SelectTrigger id="competence">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technicien">Technicien</SelectItem>
                  <SelectItem value="regisseur">Régisseur</SelectItem>
                  <SelectItem value="eclairage">Éclairage</SelectItem>
                  <SelectItem value="son">Son</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date et Répétitions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date de début</Label>
              <Input id="date" type="date" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repetitions">Répéter sur (jours)</Label>
              <Input id="repetitions" type="number" min="1" step="1" defaultValue="1" placeholder="1" />
            </div>
          </div>

          {/* Heure de début, Heure de fin, Pause */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debut">Heure de début</Label>
              <Input id="debut" type="time" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fin">Heure de fin</Label>
              <Input id="fin" type="time" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pause">Pause (min)</Label>
              <Input id="pause" type="number" step="15" placeholder="0" />
            </div>
          </div>

          {/* Transport et Lieu */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transport">Transport utilisé</Label>
              <Select>
                <SelectTrigger id="transport">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="voiture">Voiture</SelectItem>
                  <SelectItem value="transport">Transport en commun</SelectItem>
                  <SelectItem value="velo">Vélo</SelectItem>
                  <SelectItem value="marche">À pied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lieu">Lieu</Label>
              <Input id="lieu" placeholder="Nom du lieu" />
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Input id="adresse" placeholder="Adresse complète" />
          </div>

          {/* Chef de chantier */}
          <div className="space-y-2">
            <Label htmlFor="chef">Chef de chantier</Label>
            <Input id="chef" placeholder="Nom du chef de chantier" />
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
              const repetitionsInput = document.getElementById('repetitions') as HTMLInputElement;
              const repetitions = parseInt(repetitionsInput?.value || '1');
              
              if (repetitions > 1) {
                toast.success(`${repetitions} cachets identiques ont été ajoutés avec succès !`);
              } else {
                toast.success('Cachet ajouté avec succès !');
              }
              
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
