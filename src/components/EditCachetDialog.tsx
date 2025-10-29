import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./ui/utils";
import { toast } from "sonner@2.0.3";

interface Cachet {
  id: number;
  dateEvenement: string;
  employeur: string;
  nombreCachet: number;
  montant: number;
  totalBrut: number;
  heureCachet: number;
  totalHeures: number;
  competence: string;
  heureDebut: string;
  heureFin: string;
  tempsPause: number;
  transport: string;
  lieu: string;
  adresse: string;
  superviseur: string;
}

interface EditCachetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cachet: Cachet | null;
  onSave: (updatedCachet: Cachet) => void;
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

  useEffect(() => {
    setInputValue(value);
  }, [value]);

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

export function EditCachetDialog({ open, onOpenChange, cachet, onSave }: EditCachetDialogProps) {
  const [employeur, setEmployeur] = useState("");
  const [lieu, setLieu] = useState("");
  const [adresse, setAdresse] = useState("");
  const [chef, setChef] = useState("");
  const [dateEvenement, setDateEvenement] = useState("");
  const [nombreCachet, setNombreCachet] = useState(1);
  const [montant, setMontant] = useState(0);
  const [heureCachet, setHeureCachet] = useState(0);
  const [competence, setCompetence] = useState("");
  const [heureDebut, setHeureDebut] = useState("");
  const [heureFin, setHeureFin] = useState("");
  const [tempsPause, setTempsPause] = useState(0);
  const [transport, setTransport] = useState("");

  // Initialiser les valeurs quand le cachet change
  useEffect(() => {
    if (cachet) {
      setEmployeur(cachet.employeur);
      setLieu(cachet.lieu);
      setAdresse(cachet.adresse);
      setChef(cachet.superviseur);
      setDateEvenement(cachet.dateEvenement);
      setNombreCachet(cachet.nombreCachet);
      setMontant(cachet.montant);
      setHeureCachet(cachet.heureCachet);
      setCompetence(cachet.competence);
      setHeureDebut(cachet.heureDebut);
      setHeureFin(cachet.heureFin);
      setTempsPause(cachet.tempsPause);
      setTransport(cachet.transport);
    }
  }, [cachet]);

  const handleSave = () => {
    if (!cachet) return;

    const updatedCachet: Cachet = {
      ...cachet,
      employeur,
      lieu,
      adresse,
      superviseur: chef,
      dateEvenement,
      nombreCachet,
      montant,
      totalBrut: montant * nombreCachet,
      heureCachet,
      totalHeures: heureCachet * nombreCachet,
      competence,
      heureDebut,
      heureFin,
      tempsPause,
      transport,
    };

    onSave(updatedCachet);
    toast.success('Cachet modifié avec succès !');
    onOpenChange(false);
  };

  if (!cachet) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le cachet #{cachet.id}</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre cachet
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
              placeholder="S��lectionner ou saisir un employeur"
              searchPlaceholder="Rechercher un employeur..."
            />
          </div>

          {/* Nombre de cachet et Montant */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de cachets</Label>
              <Input 
                id="nombre" 
                type="number" 
                step="1" 
                value={nombreCachet}
                onChange={(e) => setNombreCachet(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="montant">Montant du cachet (€)</Label>
              <Input 
                id="montant" 
                type="number" 
                step="0.01" 
                value={montant}
                onChange={(e) => setMontant(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Nombre d'heures et Compétence */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heures">Nombre d'heures</Label>
              <Input 
                id="heures" 
                type="number" 
                step="0.5" 
                value={heureCachet}
                onChange={(e) => setHeureCachet(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="competence">Compétence</Label>
              <Input 
                id="competence" 
                type="text"
                value={competence}
                onChange={(e) => setCompetence(e.target.value)}
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date de l'événement</Label>
            <Input 
              id="date" 
              type="date" 
              value={dateEvenement}
              onChange={(e) => setDateEvenement(e.target.value)}
            />
          </div>

          {/* Heure de début, Heure de fin, Pause */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="debut">Heure de début</Label>
              <Input 
                id="debut" 
                type="time" 
                value={heureDebut}
                onChange={(e) => setHeureDebut(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fin">Heure de fin</Label>
              <Input 
                id="fin" 
                type="time" 
                value={heureFin}
                onChange={(e) => setHeureFin(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pause">Pause (h)</Label>
              <Input 
                id="pause" 
                type="number" 
                step="0.25" 
                value={tempsPause}
                onChange={(e) => setTempsPause(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Transport et Lieu */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transport">Transport utilisé</Label>
              <Input 
                id="transport" 
                type="text"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
              />
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
            <Label htmlFor="chef">Superviseur</Label>
            <Combobox
              id="chef"
              value={chef}
              onValueChange={setChef}
              options={mockChefs}
              placeholder="Sélectionner ou saisir un superviseur"
              searchPlaceholder="Rechercher un superviseur..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-gradient-to-br from-primary to-purple-600 hover:opacity-90"
            onClick={handleSave}
          >
            Enregistrer les modifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
