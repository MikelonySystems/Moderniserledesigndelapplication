import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

interface AddCachetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Données simulées de la base de données
const mockEmployeurs = [
  "Théâtre National",
  "Opéra de Paris",
  "Festival d'été",
  "Salle Pleyel",
  "Zénith Paris",
  "Comédie Française",
  "Philharmonie de Paris",
];

const mockLieux = [
  "Théâtre National",
  "Opéra Garnier",
  "Parc de la Villette",
  "Salle Pleyel",
  "Zénith Paris",
  "Comédie Française",
  "Philharmonie de Paris",
  "Olympia",
  "Bataclan",
  "La Cigale",
  "Trianon",
  "Casino de Paris",
  "Élysée Montmartre",
  "Cirque d'Hiver",
  "Grand Rex",
  "Palais des Congrès",
  "Accor Arena",
  "Stade de France",
  "U Arena",
  "La Seine Musicale",
  "Théâtre du Châtelet",
  "Théâtre Mogador",
  "Bobino",
  "Le Trianon",
  "Salle Gaveau",
  "Café de la Danse",
  "La Maroquinerie",
];

const mockAdresses = [
  "2 Rue de la Colline, 75001 Paris",
  "Place de l'Opéra, 75009 Paris",
  "211 Avenue Jean Jaurès, 75019 Paris",
  "252 Rue du Faubourg Saint-Honoré, 75008 Paris",
  "1 Place du Colonel Fabien, 75019 Paris",
  "221 Rue Saint-Honoré, 75001 Paris",
];

const mockChefs = [
  "Jean Dupont",
  "Marie Martin",
  "Pierre Blanc",
  "Sophie Durand",
  "Luc Bernard",
  "Claire Moreau",
];

// Composant Combobox réutilisable
interface ComboboxProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  placeholder: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

function Combobox({ id, value, onValueChange, options, placeholder, searchPlaceholder = "Rechercher...", emptyMessage = "Aucun résultat trouvé." }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput 
            placeholder={searchPlaceholder} 
            value={inputValue}
            onValueChange={(val) => {
              setInputValue(val);
              onValueChange(val);
            }}
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-2 px-2">
                <p className="text-sm text-muted-foreground mb-2">{emptyMessage}</p>
                {inputValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      onValueChange(inputValue);
                      setOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Utiliser "{inputValue}"
                  </Button>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {options
                .filter((option) => 
                  option.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue);
                      setInputValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function AddCachetDialog({ open, onOpenChange }: AddCachetDialogProps) {
  const [employeur, setEmployeur] = useState("");
  const [lieu, setLieu] = useState("");
  const [adresse, setAdresse] = useState("");
  const [chef, setChef] = useState("");

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
            <Combobox
              id="employeur"
              value={employeur}
              onValueChange={setEmployeur}
              options={mockEmployeurs}
              placeholder="Sélectionner ou saisir un employeur"
              searchPlaceholder="Rechercher un employeur..."
            />
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
              <Combobox
                id="lieu"
                value={lieu}
                onValueChange={setLieu}
                options={mockLieux}
                placeholder="Sélectionner ou saisir un lieu"
                searchPlaceholder="Rechercher un lieu..."
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse</Label>
            <Combobox
              id="adresse"
              value={adresse}
              onValueChange={setAdresse}
              options={mockAdresses}
              placeholder="Sélectionner ou saisir une adresse"
              searchPlaceholder="Rechercher une adresse..."
            />
          </div>

          {/* Chef de chantier */}
          <div className="space-y-2">
            <Label htmlFor="chef">Chef de chantier</Label>
            <Combobox
              id="chef"
              value={chef}
              onValueChange={setChef}
              options={mockChefs}
              placeholder="Sélectionner ou saisir un chef de chantier"
              searchPlaceholder="Rechercher un chef de chantier..."
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
