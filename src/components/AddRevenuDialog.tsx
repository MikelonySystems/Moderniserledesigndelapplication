import { useState } from "react";
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

interface AddRevenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Données simulées de la base de données
const mockVerseurs = [
  "Pôle Emploi",
  "Afdas",
  "Théâtre National",
  "Opéra de Paris",
  "Festival d'été",
  "Salle Pleyel",
  "Zénith Paris",
  "Comédie Française",
  "Philharmonie de Paris",
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

export function AddRevenuDialog({ open, onOpenChange }: AddRevenuDialogProps) {
  const [verseur, setVerseur] = useState("");

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
              <Combobox
                id="verseur"
                value={verseur}
                onValueChange={setVerseur}
                options={mockVerseurs}
                placeholder="Sélectionner ou saisir un verseur"
                searchPlaceholder="Rechercher un verseur..."
              />
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
              toast.success('Revenu ajouté avec succès !');
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
